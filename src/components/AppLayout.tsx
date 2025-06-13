import React, { useState, useEffect, useRef } from 'react';
import { User } from '@supabase/supabase-js';
import { Moon, Sun, Menu, X, Brain, Cpu, Sparkles, LogOut, History, UserCircle, MoreVertical, Settings } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { businessModules } from '../data/modules';
import { UserProfileData } from '../types';
import { UserProfile } from '../types/database';
import UserProfileForm from './UserProfileForm';
import ModuleInputForm from './ModuleInputForm';
import ReportDisplay from './ReportDisplay';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import UserProfileView from './UserProfileView';

interface AppLayoutProps {
  user: User | null;
  userProfile: UserProfileData | null;
  dbProfile: UserProfile | null;
  activeModuleId: string;
  isLoading: boolean;
  reportContent: string | null;
  errorMessage: string | null;
  isProfileComplete: boolean;
  isDarkMode: boolean;
  isSidebarOpen: boolean;
  dynamicPlaceholder: string;
  moduleIntro: string;
  currentModuleTitle?: string;
  onProfileSubmit: (data: UserProfileData) => void;
  onProfileUpdate: (profile: UserProfile) => void;
  onModuleSelect: (moduleId: string) => void;
  onModuleSubmit: (input: string) => void;
  onToggleDarkMode: () => void;
  onToggleSidebar: () => void;
  onRetry: () => void;
  onShowAuth: () => void;
  onShowHistory: () => void;
  onSignOut: () => void;
}

const AppLayout: React.FC<AppLayoutProps> = ({
  user,
  userProfile,
  dbProfile,
  activeModuleId,
  isLoading,
  reportContent,
  errorMessage,
  isProfileComplete,
  isDarkMode,
  isSidebarOpen,
  dynamicPlaceholder,
  moduleIntro,
  currentModuleTitle,
  onProfileSubmit,
  onProfileUpdate,
  onModuleSelect,
  onModuleSubmit,
  onToggleDarkMode,
  onToggleSidebar,
  onRetry,
  onShowAuth,
  onShowHistory,
  onSignOut,
}) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [showProfileView, setShowProfileView] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const activeModule = businessModules.find(module => module.id === activeModuleId);

  // Cerrar menú cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isUserMenuOpen && 
          menuRef.current && 
          buttonRef.current &&
          !menuRef.current.contains(event.target as Node) &&
          !buttonRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isUserMenuOpen]);

  // Cerrar menú con ESC
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isUserMenuOpen) {
        setIsUserMenuOpen(false);
      }
    };

    if (isUserMenuOpen) {
      document.addEventListener('keydown', handleEscKey);
      return () => document.removeEventListener('keydown', handleEscKey);
    }
  }, [isUserMenuOpen]);

  // Handlers para las acciones del menú
  const handleShowHistory = () => {
    setIsUserMenuOpen(false);
    onShowHistory();
  };

  const handleToggleDarkMode = () => {
    setIsUserMenuOpen(false);
    onToggleDarkMode();
  };

  const handleSignOut = () => {
    setIsUserMenuOpen(false);
    onSignOut();
  };

  const handleShowProfile = () => {
    setShowProfileView(true);
  };

  const handleCloseProfile = () => {
    setShowProfileView(false);
  };

  // Show auth prompt if not authenticated
  if (!user) {
    return (
      <div className={`h-screen flex items-center justify-center ${isDarkMode ? 'dark' : 'light'} relative`} style={{ background: 'var(--bg-gradient)' }}>
        <div className="max-w-md mx-auto text-center p-8">
          <div className="p-6 rounded-3xl bg-gradient-to-br from-iridescent-blue to-iridescent-violet liquid-glow-hover organic-shape mb-8 mx-auto w-fit">
            <Brain className="h-16 w-16 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4 iridescent-text">
            FlowForge AI
          </h1>
          <p className="text-xl mb-8 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Tu consultor digital inteligente te está esperando. Inicia sesión para acceder a análisis personalizados y recomendaciones estratégicas.
          </p>
          <button
            onClick={onShowAuth}
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-iridescent-blue to-iridescent-violet hover:from-iridescent-cyan hover:to-iridescent-blue text-white font-bold rounded-2xl transition-all duration-500 transform hover:scale-105 shadow-lg liquid-glow-hover relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-iridescent-violet to-iridescent-cyan opacity-0 hover:opacity-20 transition-opacity duration-300"></div>
            <UserCircle className="w-6 h-6 mr-3" />
            Iniciar Sesión / Registrarse
          </button>
        </div>

        {/* Bolt.new Badge - Required for Hackathon */}
        <a
          href="https://bolt.new/"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-50 group transition-all duration-300 hover:scale-105"
          aria-label="Powered by Bolt.new"
        >
          <div 
            className="flex items-center space-x-3 backdrop-blur-xl rounded-2xl p-3 pr-4 shadow-lg border liquid-card transition-all duration-300 hover:shadow-xl liquid-glow-hover"
            style={{ 
              background: isDarkMode ? 'rgba(15, 20, 25, 0.95)' : 'rgba(248, 250, 252, 0.98)',
              borderColor: isDarkMode ? 'rgba(42, 45, 71, 0.6)' : 'rgba(148, 163, 184, 0.3)'
            }}
          >
            <img
              src={isDarkMode ? "/white_circle_360x360.png" : "/black_circle_360x360.png"}
              alt="Bolt.new"
              className="w-8 h-8 transition-transform duration-300 group-hover:rotate-12"
            />
            <div className="text-sm">
              <div 
                className="font-semibold leading-tight"
                style={{ color: 'var(--text-primary)' }}
              >
                Built with
              </div>
              <div 
                className="font-bold text-xs leading-tight group-hover:text-iridescent-blue transition-colors"
                style={{ color: 'var(--text-secondary)' }}
              >
                Bolt.new
              </div>
            </div>
          </div>
        </a>
      </div>
    );
  }

  // Show profile form if profile is not complete
  if (!isProfileComplete) {
    return (
      <div className={isDarkMode ? 'dark' : 'light'} style={{ position: 'relative' }}>
        <UserProfileForm onSubmit={onProfileSubmit} isLoading={isLoading} />
        
        {/* Bolt.new Badge - Required for Hackathon */}
        <a
          href="https://bolt.new/"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-50 group transition-all duration-300 hover:scale-105"
          aria-label="Powered by Bolt.new"
        >
          <div 
            className="flex items-center space-x-3 backdrop-blur-xl rounded-2xl p-3 pr-4 shadow-lg border liquid-card transition-all duration-300 hover:shadow-xl liquid-glow-hover"
            style={{ 
              background: isDarkMode ? 'rgba(15, 20, 25, 0.95)' : 'rgba(248, 250, 252, 0.98)',
              borderColor: isDarkMode ? 'rgba(42, 45, 71, 0.6)' : 'rgba(148, 163, 184, 0.3)'
            }}
          >
            <img
              src={isDarkMode ? "/white_circle_360x360.png" : "/black_circle_360x360.png"}
              alt="Bolt.new"
              className="w-8 h-8 transition-transform duration-300 group-hover:rotate-12"
            />
            <div className="text-sm">
              <div 
                className="font-semibold leading-tight"
                style={{ color: 'var(--text-primary)' }}
              >
                Built with
              </div>
              <div 
                className="font-bold text-xs leading-tight group-hover:text-iridescent-blue transition-colors"
                style={{ color: 'var(--text-secondary)' }}
              >
                Bolt.new
              </div>
            </div>
          </div>
        </a>
      </div>
    );
  }

  // Show profile view if requested
  if (showProfileView) {
    return (
      <div className={isDarkMode ? 'dark' : 'light'}>
        <div className="h-screen overflow-y-auto relative" style={{ background: 'var(--bg-gradient)' }}>
          <div className="p-6">
            <UserProfileView
              userProfile={dbProfile}
              onClose={handleCloseProfile}
              onProfileUpdate={onProfileUpdate}
            />
          </div>
        </div>
      </div>
    );
  }

  const getIcon = (iconName: string) => {
    const Icon = (LucideIcons as any)[iconName] || LucideIcons.Circle;
    return Icon;
  };

  return (
    <div className={isDarkMode ? 'dark' : 'light'}>
      <div className="h-screen flex overflow-hidden relative" style={{ background: 'var(--bg-gradient)' }}>
        {/* Ambient Background Effects */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-iridescent-blue/5 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-iridescent-violet/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-iridescent-cyan/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
        </div>

        {/* OVERLAY DE BLUR SEPARADO - SOLO PARA EL FONDO */}
        {isUserMenuOpen && (
          <div 
            className={`fixed inset-0 ${isDarkMode ? 'bg-black/30' : 'bg-white/30'} backdrop-blur-sm`}
            style={{ zIndex: 9997 }}
            onClick={() => setIsUserMenuOpen(false)}
          />
        )}

        {/* MENÚ FLOTANTE SUPERIOR DERECHO - FUERA DEL SIDEBAR */}
        <div className="fixed top-3 right-6" style={{ zIndex: 9999 }}>
          <div className="relative">
            <button
              ref={buttonRef}
              onClick={(e) => {
                e.stopPropagation();
                setIsUserMenuOpen(!isUserMenuOpen);
              }}
              className="p-4 rounded-2xl backdrop-blur-xl border border-iridescent-blue/30 transition-all duration-300 shadow-2xl liquid-glow-hover liquid-card"
              style={{ 
                background: 'var(--card-bg)',
                color: 'var(--text-secondary)',
                borderColor: isDarkMode ? 'rgba(0, 212, 255, 0.3)' : 'rgba(148, 163, 184, 0.4)'
              }}
              aria-label="Menú de usuario"
              aria-expanded={isUserMenuOpen}
              aria-haspopup="true"
            >
              <MoreVertical className="h-6 w-6" />
            </button>
            
            {/* Dropdown menu - SIN OVERLAY INTERNO */}
            {isUserMenuOpen && (
              <div 
                ref={menuRef}
                className="absolute top-full right-0 mt-3 w-72 backdrop-blur-xl border shadow-2xl rounded-2xl overflow-hidden liquid-card"
                style={{ 
                  zIndex: 9999,
                  background: isDarkMode ? 'rgba(30, 33, 57, 0.98)' : 'rgba(255, 255, 255, 0.98)',
                  borderColor: isDarkMode ? 'rgba(0, 212, 255, 0.4)' : 'rgba(148, 163, 184, 0.4)',
                  boxShadow: isDarkMode 
                    ? '0 25px 50px rgba(0, 0, 0, 0.6), 0 0 40px rgba(0, 212, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                    : '0 25px 50px rgba(0, 0, 0, 0.1), 0 0 40px rgba(0, 212, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
                }}
                role="menu"
                aria-orientation="vertical"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-iridescent-blue to-iridescent-violet"></div>
                
                {/* Header del menú */}
                <div className="px-6 py-4 border-b bg-gradient-to-r from-iridescent-blue/10 to-iridescent-violet/10" 
                     style={{ borderColor: isDarkMode ? 'rgba(42, 45, 71, 0.6)' : 'rgba(148, 163, 184, 0.3)' }}>
                  <div className="flex items-center">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-iridescent-blue/30 to-iridescent-violet/30 mr-3">
                      <UserCircle className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>Menú de Usuario</p>
                      <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>{user?.email}</p>
                    </div>
                  </div>
                </div>
                
                <div className="py-2">
                  <button
                    onClick={handleShowHistory}
                    className="w-full flex items-center px-6 py-4 transition-all duration-300 text-left group"
                    style={{ 
                      color: 'var(--text-secondary)',
                      background: 'transparent'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = isDarkMode 
                        ? 'linear-gradient(135deg, rgba(0, 212, 255, 0.15), rgba(139, 92, 246, 0.15))'
                        : 'linear-gradient(135deg, rgba(0, 212, 255, 0.08), rgba(139, 92, 246, 0.08))';
                      e.currentTarget.style.color = 'var(--text-primary)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = 'var(--text-secondary)';
                    }}
                    role="menuitem"
                  >
                    <History className="h-5 w-5 mr-4 text-iridescent-blue group-hover:text-iridescent-cyan transition-colors" />
                    <div>
                      <span className="text-sm font-medium block">Historial de Reportes</span>
                      <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Ver reportes anteriores</span>
                    </div>
                  </button>
                  
                  <button
                    onClick={handleToggleDarkMode}
                    className="w-full flex items-center justify-between px-6 py-4 transition-all duration-300 text-left group"
                    style={{ 
                      color: 'var(--text-secondary)',
                      background: 'transparent'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = isDarkMode 
                        ? 'linear-gradient(135deg, rgba(0, 212, 255, 0.15), rgba(139, 92, 246, 0.15))'
                        : 'linear-gradient(135deg, rgba(0, 212, 255, 0.08), rgba(139, 92, 246, 0.08))';
                      e.currentTarget.style.color = 'var(--text-primary)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = 'var(--text-secondary)';
                    }}
                    role="menuitem"
                  >
                    <div className="flex items-center">
                      <Settings className="h-5 w-5 mr-4 text-iridescent-violet group-hover:text-iridescent-cyan transition-colors" />
                      <div>
                        <span className="text-sm font-medium block">Tema de Interfaz</span>
                        <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                          {isDarkMode ? 'Modo líquido oscuro' : 'Modo líquido claro'}
                        </span>
                      </div>
                    </div>
                    <div className={`flex items-center p-2 rounded-lg transition-all duration-300 ${
                      isDarkMode ? 'bg-gradient-to-r from-iridescent-blue to-iridescent-violet liquid-glow' : 'bg-gradient-to-r from-iridescent-cyan to-iridescent-blue liquid-glow'
                    }`}>
                      {isDarkMode ? (
                        <Moon className="h-4 w-4 text-white" />
                      ) : (
                        <Sun className="h-4 w-4 text-white" />
                      )}
                    </div>
                  </button>
                  
                  <div className="border-t my-2" style={{ borderColor: isDarkMode ? 'rgba(42, 45, 71, 0.6)' : 'rgba(148, 163, 184, 0.3)' }}></div>
                  
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center px-6 py-4 hover:bg-red-500/20 hover:text-red-400 transition-all duration-300 text-left group"
                    style={{ 
                      color: 'var(--text-secondary)',
                      background: 'transparent'
                    }}
                    role="menuitem"
                  >
                    <LogOut className="h-5 w-5 mr-4 group-hover:text-red-400 transition-colors" />
                    <div>
                      <span className="text-sm font-medium block">Cerrar Sesión</span>
                      <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Salir de la aplicación</span>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <aside className={`${
          isSidebarOpen ? 'translate-x-0' : 'hidden lg:block'
        } fixed inset-y-0 left-0 z-50 w-80 backdrop-blur-xl border-r transform transition-transform duration-500 ease-out lg:static lg:inset-0 shadow-2xl flex flex-col liquid-card`}
        style={{ 
          background: isDarkMode ? 'rgba(15, 20, 25, 0.95)' : 'rgba(248, 250, 252, 0.98)',
          borderColor: isDarkMode ? 'rgba(42, 45, 71, 0.6)' : 'rgba(148, 163, 184, 0.3)',
          color: 'var(--text-primary)'
        }}>
          
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-iridescent-blue/10 to-iridescent-violet/10 flex-shrink-0 relative overflow-hidden" 
               style={{ borderColor: isDarkMode ? 'rgba(42, 45, 71, 0.6)' : 'rgba(148, 163, 184, 0.3)' }}>
            <div className="absolute inset-0 bg-glow-gradient opacity-30"></div>
            <div className="flex items-center relative z-10">
              <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-iridescent-blue to-iridescent-violet rounded-2xl mr-4 shadow-lg liquid-glow-hover organic-shape">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold iridescent-text">
                  FlowForge AI
                </h1>
                <p className="text-xs font-medium flex items-center" style={{ color: 'var(--text-tertiary)' }}>
                  <Sparkles className="w-3 h-3 mr-1" />
                  Liquid Intelligence
                </p>
              </div>
            </div>
            
            {/* Solo botón de cerrar en móvil */}
            <div className="flex items-center space-x-2 relative z-10">
              <button
                onClick={onToggleSidebar}
                className="lg:hidden p-2 rounded-xl transition-all duration-300 liquid-button"
                style={{ 
                  color: 'var(--text-tertiary)',
                  background: 'var(--hover-bg)'
                }}
                aria-label="Cerrar sidebar"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* User Profile Summary */}
          {userProfile && (
            <div className="p-6 border-b flex-shrink-0" style={{ borderColor: isDarkMode ? 'rgba(42, 45, 71, 0.6)' : 'rgba(148, 163, 184, 0.3)' }}>
              <button
                onClick={handleShowProfile}
                className="w-full liquid-card p-5 relative overflow-hidden transition-all duration-300 hover:shadow-lg liquid-button group"
                style={{ background: 'var(--card-bg)' }}
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-iridescent-blue via-iridescent-violet to-iridescent-cyan"></div>
                <h3 className="text-sm font-semibold mb-4 flex items-center" style={{ color: 'var(--text-secondary)' }}>
                  <div className="w-2 h-2 bg-iridescent-cyan rounded-full mr-2 animate-pulse"></div>
                  Perfil Activo
                  <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                    <UserCircle className="w-4 h-4 text-iridescent-blue" />
                  </div>
                </h3>
                <div className="space-y-3 text-sm text-left">
                  <div className="flex justify-between items-center">
                    <span style={{ color: 'var(--text-tertiary)' }}>Tipo:</span> 
                    <span className="font-medium" style={{ color: 'var(--text-secondary)' }}>{userProfile.businessType}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span style={{ color: 'var(--text-tertiary)' }}>Etapa:</span> 
                    <span className="font-medium" style={{ color: 'var(--text-secondary)' }}>{userProfile.businessStage}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span style={{ color: 'var(--text-tertiary)' }}>Empleados:</span> 
                    <span className="font-medium" style={{ color: 'var(--text-secondary)' }}>{userProfile.employeeCount}</span>
                  </div>
                </div>
                <div className="mt-3 text-xs text-center" style={{ color: 'var(--text-tertiary)' }}>
                  <span className="group-hover:text-iridescent-blue transition-colors">
                    Clic para ver/editar perfil completo
                  </span>
                </div>
              </button>
            </div>
          )}

          {/* Module Navigation */}
          <div className="flex-1 overflow-y-auto p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider mb-6 flex items-center" style={{ color: 'var(--text-tertiary)' }}>
              <div className="w-6 h-0.5 bg-gradient-to-r from-iridescent-blue to-iridescent-violet mr-3 rounded-full"></div>
              Módulos Inteligentes
            </h2>
            <nav className="space-y-3">
              {businessModules.map((module) => {
                const Icon = getIcon(module.icon);
                const isActive = module.id === activeModuleId;
                
                return (
                  <button
                    key={module.id}
                    onClick={() => onModuleSelect(module.id)}
                    className={`w-full flex items-center px-5 py-4 text-left rounded-2xl transition-all duration-500 hover:shadow-lg liquid-button group relative overflow-hidden ${
                      isActive
                        ? 'bg-gradient-to-r from-iridescent-blue/20 to-iridescent-violet/20 shadow-lg border border-iridescent-blue/30 transform scale-[1.02] liquid-glow'
                        : 'hover:transform hover:scale-[1.01]'
                    }`}
                    style={{ 
                      color: isActive ? 'white' : 'var(--text-secondary)',
                      background: isActive ? undefined : 'transparent',
                      borderColor: isActive ? 'rgba(0, 212, 255, 0.3)' : 'transparent'
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = isDarkMode 
                          ? 'rgba(30, 33, 57, 0.6)' 
                          : 'rgba(241, 245, 249, 0.8)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'transparent';
                      }
                    }}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-iridescent-blue to-iridescent-violet rounded-r-full"></div>
                    )}
                    <Icon className={`h-6 w-6 mr-4 transition-all duration-300 ${
                      isActive ? 'text-iridescent-cyan animate-pulse' : 'text-gray-400 group-hover:text-iridescent-blue'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold truncate transition-colors ${
                        isActive ? 'text-white' : 'group-hover:text-white'
                      }`}>
                        {module.name}
                      </p>
                      <p className={`text-xs truncate mt-1 transition-colors ${
                        isActive ? 'text-iridescent-blue/80' : 'text-gray-500 group-hover:text-gray-400'
                      }`}>
                        {module.description}
                      </p>
                    </div>
                    {isActive && (
                      <div className="w-2 h-2 bg-iridescent-cyan rounded-full ml-2 animate-pulse shadow-lg"></div>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-w-0 h-full relative">
          {/* Mobile Header */}
          <div className="lg:hidden backdrop-blur-xl shadow-lg border-b p-4 flex-shrink-0 liquid-card" 
               style={{ 
                 background: isDarkMode ? 'rgba(15, 20, 25, 0.95)' : 'rgba(248, 250, 252, 0.98)',
                 borderColor: isDarkMode ? 'rgba(42, 45, 71, 0.6)' : 'rgba(148, 163, 184, 0.3)'
               }}>
            <div className="flex items-center justify-between">
              <button
                onClick={onToggleSidebar}
                className="p-3 rounded-xl transition-all duration-300 liquid-button"
                style={{ 
                  color: 'var(--text-tertiary)',
                  background: 'var(--hover-bg)'
                }}
                aria-label="Abrir menú"
              >
                <Menu className="h-6 w-6" />
              </button>
              <div className="flex items-center mr-20">
                <Cpu className="h-6 w-6 text-iridescent-blue mr-2" />
                <h1 className="text-lg font-bold iridescent-text">
                  FlowForge AI
                </h1>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto relative" style={{ background: 'var(--bg-gradient)' }}>
            <div className="p-4 sm:p-6 lg:p-8 relative z-10">
              {/* Page Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
                {activeModule && (
                  <>
                    {(() => {
                      const Icon = getIcon(activeModule.icon);
                      return (
                        <div className="p-3 rounded-2xl bg-gradient-to-br from-iridescent-blue/20 to-iridescent-violet/20 mr-4 liquid-glow-hover organic-shape">
                          <Icon className="h-8 w-8 text-iridescent-cyan" />
                        </div>
                      );
                    })()}
                  </>
                )}
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                    {activeModule ? activeModule.name : 'Selecciona un Módulo'}
                  </h1>
                  {activeModule && (
                    <p className="text-lg" style={{ color: 'var(--text-tertiary)' }}>
                      {activeModule.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Dynamic Content */}
              <div className="pb-8">
                {errorMessage ? (
                  <ErrorMessage message={errorMessage} onRetry={onRetry} />
                ) : isLoading ? (
                  <LoadingSpinner />
                ) : reportContent ? (
                  <ReportDisplay 
                    reportContent={reportContent} 
                    moduleTitle={currentModuleTitle}
                    userProfile={userProfile}
                  />
                ) : (
                  <ModuleInputForm
                    onSubmit={onModuleSubmit}
                    isLoading={isLoading}
                    dynamicPlaceholder={dynamicPlaceholder}
                    moduleIntro={moduleIntro}
                    activeModuleId={activeModuleId}
                  />
                )}
              </div>
            </div>
          </div>
        </main>

        {/* Sidebar Overlay for Mobile */}
        {isSidebarOpen && (
          <div
            className={`fixed inset-0 ${isDarkMode ? 'bg-liquid-dark/80' : 'bg-white/80'} backdrop-blur-sm z-40 lg:hidden`}
            onClick={onToggleSidebar}
          ></div>
        )}

        {/* Bolt.new Badge */}
        <a
          href="https://bolt.new/"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-50 group transition-all duration-300 hover:scale-105"
          aria-label="Powered by Bolt.new"
        >
          <div 
            className="flex items-center space-x-3 backdrop-blur-xl rounded-2xl p-3 pr-4 shadow-lg border liquid-card transition-all duration-300 hover:shadow-xl liquid-glow-hover"
            style={{ 
              background: isDarkMode ? 'rgba(15, 20, 25, 0.95)' : 'rgba(248, 250, 252, 0.98)',
              borderColor: isDarkMode ? 'rgba(42, 45, 71, 0.6)' : 'rgba(148, 163, 184, 0.3)'
            }}
          >
            <img
              src={isDarkMode ? "/white_circle_360x360.png" : "/black_circle_360x360.png"}
              alt="Bolt.new"
              className="w-8 h-8 transition-transform duration-300 group-hover:rotate-12"
            />
            <div className="text-sm">
              <div 
                className="font-semibold leading-tight"
                style={{ color: 'var(--text-primary)' }}
              >
                Built with
              </div>
              <div 
                className="font-bold text-xs leading-tight group-hover:text-iridescent-blue transition-colors"
                style={{ color: 'var(--text-secondary)' }}
              >
                Bolt.new
              </div>
            </div>
          </div>
        </a>

      </div>
    </div>
  );
};

export default AppLayout;