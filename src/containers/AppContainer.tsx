import React, { useState, useCallback, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { UserProfileData, AppState } from '../types';
import { UserProfile, AIReport } from '../types/database';
import { generateReport } from '../utils/geminiApi';
import { generateDynamicPlaceholder, generateModuleIntro } from '../utils/dynamicContent';
import { AuthService } from '../services/authService';
import { UserProfileService } from '../services/userProfileService';
import { AIReportService } from '../services/aiReportService';
import { businessModules } from '../data/modules';
import AppLayout from '../components/AppLayout';
import AuthModal from '../components/AuthModal';
import ReportHistory from '../components/ReportHistory';

// Estados de la aplicación
enum AppStatus {
  INITIALIZING = 'initializing',
  READY = 'ready',
  ERROR = 'error'
}

const AppContainer: React.FC = () => {
  const [state, setState] = useState<AppState>({
    userProfile: null,
    activeModuleId: 'empresa-general',
    moduleSpecificInput: '',
    isLoading: false,
    reportContent: null,
    errorMessage: null,
    isProfileComplete: false,
    isDarkMode: true,
  });
  const [user, setUser] = useState<User | null>(null);
  const [dbProfile, setDbProfile] = useState<UserProfile | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showReportHistory, setShowReportHistory] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [appStatus, setAppStatus] = useState<AppStatus>(AppStatus.INITIALIZING);
  const [initializationError, setInitializationError] = useState<string | null>(null);

  // Inicialización robusta de la aplicación
  useEffect(() => {
    initializeApp();
  }, []);

  // Configurar modo oscuro/claro
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('flowforge-dark-mode');
    const isDark = savedDarkMode ? savedDarkMode === 'true' : true;
    setState(prev => ({ ...prev, isDarkMode: isDark }));
    
    applyTheme(isDark);
  }, []);

  // Aplicar tema cuando cambia
  useEffect(() => {
    localStorage.setItem('flowforge-dark-mode', state.isDarkMode.toString());
    applyTheme(state.isDarkMode);
  }, [state.isDarkMode]);

  // Inicializar aplicación de forma robusta
  const initializeApp = async () => {
    try {
      setAppStatus(AppStatus.INITIALIZING);
      setInitializationError(null);

      // Inicializar AuthService
      await AuthService.initialize();

      // Configurar listener de cambios de autenticación
      const { unsubscribe } = AuthService.onAuthStateChange(async (newUser) => {
        
        if (newUser) {
          setUser(newUser);
          await loadUserProfile(newUser.id);
        } else {
          setUser(null);
          setDbProfile(null);
          UserProfileService.clearCache();
          setState(prev => ({
            ...prev,
            userProfile: null,
            isProfileComplete: false,
            reportContent: null,
            errorMessage: null
          }));
        }
      });

      // Verificar usuario actual
      const currentUser = await AuthService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        await loadUserProfile(currentUser.id);
      } else {
        console.log('ℹ️ No hay usuario autenticado');
      }

      setAppStatus(AppStatus.READY);

      // Cleanup function
      return () => {
        unsubscribe();
      };
    } catch (error: any) {
      console.error('❌ Error inicializando aplicación:', error);
      setInitializationError(error.message || 'Error de inicialización');
      setAppStatus(AppStatus.ERROR);
    }
  };

  // Cargar perfil de usuario con manejo de errores
  const loadUserProfile = async (userId: string) => {
    try {
      
      const profile = await UserProfileService.getUserProfile();
      
      if (profile) {
        setDbProfile(profile);
        const appProfile = UserProfileService.dbProfileToAppProfile(profile);
        setState(prev => ({
          ...prev,
          userProfile: appProfile,
          isProfileComplete: true,
        }));
      } else {
        console.log('ℹ️ No se encontró perfil para el usuario');
        setState(prev => ({
          ...prev,
          isProfileComplete: false,
        }));
      }
    } catch (error: any) {
      console.error('❌ Error cargando perfil:', error);
      // No mostrar error al usuario, solo log
      setState(prev => ({
        ...prev,
        isProfileComplete: false,
      }));
    }
  };

  // Aplicar tema al documento
  const applyTheme = (isDark: boolean) => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  };

  // Manejar envío de perfil
  const handleProfileSubmit = useCallback(async (profile: UserProfileData) => {
    if (!user) {
      console.error('❌ No hay usuario para guardar perfil');
      setShowAuthModal(true);
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, errorMessage: null }));

    try {
      const savedProfile = await UserProfileService.saveUserProfile(profile);

      setDbProfile(savedProfile);
      setState(prev => ({
        ...prev,
        userProfile: profile,
        isProfileComplete: true,
        isLoading: false,
      }));
    } catch (error: any) {
      console.error('❌ Error guardando perfil:', error);
      setState(prev => ({
        ...prev,
        errorMessage: `Error al guardar el perfil: ${error.message}`,
        isLoading: false,
      }));
    }
  }, [user]);

  // Manejar actualización de perfil
  const handleProfileUpdate = useCallback((updatedProfile: UserProfile) => {

    setDbProfile(updatedProfile);
    const appProfile = UserProfileService.dbProfileToAppProfile(updatedProfile);
    setState(prev => ({
      ...prev,
      userProfile: appProfile,
    }));
  }, []);
  // Manejar selección de módulo
  const handleModuleSelect = useCallback((moduleId: string) => {
    setState(prev => ({
      ...prev,
      activeModuleId: moduleId,
      reportContent: null,
      errorMessage: null,
      moduleSpecificInput: '',
    }));
    setIsSidebarOpen(false);
    setShowWelcome(false); // Salir de la vista de bienvenida al seleccionar un módulo
  }, []);

  // Manejar envío de módulo - MEJORADO CON PERFIL EXTENDIDO
  const handleModuleSubmit = useCallback(async (input: string) => {
    if (!state.userProfile || !user || !dbProfile) {
      console.error('❌ Datos faltantes para generar reporte');
      setShowAuthModal(true);
      return;
    }

    setState(prev => ({
      ...prev,
      moduleSpecificInput: input,
      isLoading: true,
      errorMessage: null,
      reportContent: null,
    }));

    try {
      
      // Generar reporte con Gemini incluyendo perfil extendido
      const report = await generateReport(
        state.userProfile,
        state.activeModuleId,
        input,
        dbProfile // Pasar el perfil completo de la base de datos
      );

      // Guardar reporte en base de datos
      const savedReport = await AIReportService.saveAIReport(
        dbProfile.id,
        state.activeModuleId,
        input,
        report
      );

      setState(prev => ({
        ...prev,
        reportContent: report,
        isLoading: false,
      }));
    } catch (error: any) {
      console.error('❌ Error generando/guardando reporte:', error);
      setState(prev => ({
        ...prev,
        errorMessage: `Error al generar el reporte: ${error.message}`,
        isLoading: false,
      }));
    }
  }, [state.userProfile, state.activeModuleId, user, dbProfile]);

  // Manejar toggle de modo oscuro
  const handleToggleDarkMode = useCallback(() => {
    setState(prev => ({ ...prev, isDarkMode: !prev.isDarkMode }));
  }, []);

  // Manejar toggle de sidebar
  const handleToggleSidebar = useCallback(() => {
    setIsSidebarOpen(prev => !prev);
  }, []);

  // Manejar reintentos
  const handleRetry = useCallback(() => {
    if (state.moduleSpecificInput && state.userProfile) {
      handleModuleSubmit(state.moduleSpecificInput);
    } else {
      setState(prev => ({ ...prev, errorMessage: null }));
    }
  }, [state.moduleSpecificInput, state.userProfile, handleModuleSubmit]);
  // Manejar éxito de autenticación
  const handleAuthSuccess = useCallback(() => {
    setShowAuthModal(false);
  }, []);
  // Manejar click en "Comenzar" desde la vista de bienvenida
  const handleGetStarted = useCallback(() => {
    setShowWelcome(false);
  }, []);

  // Manejar mostrar vista de bienvenida
  const handleShowWelcome = useCallback(() => {
    setShowWelcome(true);
  }, []);

  // Manejar selección de reporte del historial
  const handleSelectReport = useCallback((report: AIReport) => {

    setState(prev => ({
      ...prev,
      activeModuleId: report.module_id,
      moduleSpecificInput: report.user_input,
      reportContent: report.report_content,
      errorMessage: null,
    }));
    setShowReportHistory(false);
  }, []);

  // Manejar cierre de sesión
  const handleSignOut = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      await AuthService.signOut();
      
      // Limpiar estado local
      setState(prev => ({
        ...prev,
        userProfile: null,
        isProfileComplete: false,
        reportContent: null,
        errorMessage: null,
        isLoading: false,
      }));
      
      setUser(null);
      setDbProfile(null);
      
      console.log('✅ Sesión cerrada exitosamente');
    } catch (error: any) {
      console.error('❌ Error cerrando sesión:', error);
      setState(prev => ({
        ...prev,
        errorMessage: `Error al cerrar sesión: ${error.message}`,
        isLoading: false,
      }));
    }
  }, []);

  // Generar contenido dinámico
  const dynamicPlaceholder = generateDynamicPlaceholder(
    state.userProfile,
    state.activeModuleId,
    dbProfile
  );

  const moduleIntro = generateModuleIntro(
    state.userProfile,
    state.activeModuleId,
    dbProfile
  );

  // Obtener título del módulo actual
  const currentModuleTitle = businessModules.find(m => m.id === state.activeModuleId)?.name || 'Reporte FlowForge AI';

  // Pantalla de inicialización
  if (appStatus === AppStatus.INITIALIZING) {
    return (
      <div className={`h-screen flex items-center justify-center ${state.isDarkMode ? 'dark' : 'light'}`} style={{ background: 'var(--bg-gradient)' }}>
        <div className="text-center">
          <div className="liquid-loader w-16 h-16 mx-auto mb-4"></div>
          <p className="text-lg mb-2" style={{ color: 'var(--text-secondary)' }}>
            Inicializando FlowForge AI...
          </p>
          <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
            Configurando servicios y verificando sesión
          </p>
        </div>
      </div>
    );
  }

  // Pantalla de error de inicialización
  if (appStatus === AppStatus.ERROR) {
    return (
      <div className={`h-screen flex items-center justify-center ${state.isDarkMode ? 'dark' : 'light'}`} style={{ background: 'var(--bg-gradient)' }}>
        <div className="text-center max-w-md mx-auto p-8">
          <div className="p-6 rounded-3xl bg-gradient-to-br from-red-500 to-red-600 mb-8 mx-auto w-fit">
            <svg className="h-16 w-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            Error de Inicialización
          </h1>
          <p className="text-lg mb-6" style={{ color: 'var(--text-secondary)' }}>
            {initializationError || 'No se pudo inicializar la aplicación'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-iridescent-blue to-iridescent-violet hover:from-iridescent-cyan hover:to-iridescent-blue text-white font-bold rounded-2xl transition-all duration-500 transform hover:scale-105 shadow-lg"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  // Pantalla de historial de reportes
  if (showReportHistory) {
    return (
      <div className={`h-screen overflow-y-auto ${state.isDarkMode ? 'dark' : 'light'}`} style={{ background: 'var(--bg-gradient)' }}>
        <div className="p-6">
          <ReportHistory
            onSelectReport={handleSelectReport}
            onClose={() => setShowReportHistory(false)}
          />
        </div>
      </div>
    );
  }

  // Aplicación principal
  if (!user || showAuthModal) {
    return (
      <AuthModal
        isOpen={true}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />
    );
  }
  return (
    <AppLayout
      user={user}
      userProfile={state.userProfile}
      dbProfile={dbProfile}
      activeModuleId={state.activeModuleId}
      isLoading={state.isLoading}
      reportContent={state.reportContent}
      errorMessage={state.errorMessage}
      isProfileComplete={state.isProfileComplete}
      isDarkMode={state.isDarkMode}
      isSidebarOpen={isSidebarOpen}
      dynamicPlaceholder={dynamicPlaceholder}
      moduleIntro={moduleIntro}
      currentModuleTitle={currentModuleTitle}
      showWelcome={showWelcome}
      onProfileSubmit={handleProfileSubmit}
      onProfileUpdate={handleProfileUpdate}
      onModuleSelect={handleModuleSelect}
      onModuleSubmit={handleModuleSubmit}
      onToggleDarkMode={handleToggleDarkMode}
      onToggleSidebar={handleToggleSidebar}
      onRetry={handleRetry}
      onShowAuth={() => setShowAuthModal(true)}      onShowHistory={() => setShowReportHistory(true)}
      onSignOut={handleSignOut}
      onGetStarted={handleGetStarted}
      onShowWelcome={handleShowWelcome}
    />
  );
};

export default AppContainer;