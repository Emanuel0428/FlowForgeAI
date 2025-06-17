import { supabase } from '../config/supabase';
import { User, Session } from '@supabase/supabase-js';

// Tipos para mejor tipado
interface AuthResult {
  user: User | null;
  error: string | null;
}

interface SessionResult {
  session: Session | null;
  error: string | null;
}

// Cache de sesión para evitar llamadas innecesarias
class SessionCache {
  private static instance: SessionCache;
  private cachedSession: Session | null = null;
  private lastCheck: number = 0;
  private readonly CACHE_DURATION = 30000; // 30 segundos

  static getInstance(): SessionCache {
    if (!SessionCache.instance) {
      SessionCache.instance = new SessionCache();
    }
    return SessionCache.instance;
  }

  isValid(): boolean {
    return Date.now() - this.lastCheck < this.CACHE_DURATION;
  }

  get(): Session | null {
    return this.isValid() ? this.cachedSession : null;
  }

  set(session: Session | null): void {
    this.cachedSession = session;
    this.lastCheck = Date.now();
  }

  clear(): void {
    this.cachedSession = null;
    this.lastCheck = 0;
  }
}

export class AuthService {
  private static sessionCache = SessionCache.getInstance();
  private static authStateListeners: Array<(user: User | null) => void> = [];
  private static isInitialized = false;

  // Inicializar el servicio de autenticación
  static async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {      
      // Configurar listener de cambios de autenticación
      supabase.auth.onAuthStateChange(async (event, session) => {        
        // Actualizar cache
        this.sessionCache.set(session);
        
        // Notificar a listeners
        this.authStateListeners.forEach(listener => {
          listener(session?.user || null);
        });
        
        // Limpiar datos locales en logout
        if (event === 'SIGNED_OUT') {
          await this.clearLocalData();
        }
      });

      this.isInitialized = true;
    } catch (error) {
      console.error('❌ Error inicializando AuthService:', error);
      throw error;
    }
  }

  // Registrar nuevo usuario con validación mejorada
  static async signUp(email: string, password: string): Promise<AuthResult> {
    try {      
      // Validaciones del lado cliente
      if (!this.isValidEmail(email)) {
        return { user: null, error: 'Email inválido' };
      }
      
      if (!this.isValidPassword(password)) {
        return { user: null, error: 'La contraseña debe tener al menos 6 caracteres' };
      }

      const { data, error } = await supabase.auth.signUp({
        email: email.toLowerCase().trim(),
        password,
        options: {
          emailRedirectTo: window.location.origin,
          data: {
            created_at: new Date().toISOString(),
            source: 'flowforge-ai'
          }
        }
      });

      if (error) {
        console.error('❌ Error en registro:', error);
        return { user: null, error: this.translateAuthError(error.message) };
      }

      if (data.user) {
        console.log('✅ Usuario registrado exitosamente');
        this.sessionCache.set(data.session);
      }

      return { user: data.user, error: null };
    } catch (error: any) {
      console.error('❌ Error inesperado en signUp:', error);
      return { user: null, error: 'Error inesperado durante el registro' };
    }
  }

  // Iniciar sesión con reintentos automáticos
  static async signIn(email: string, password: string, retries = 2): Promise<AuthResult> {
    try {      
      // Validaciones del lado cliente
      if (!this.isValidEmail(email)) {
        return { user: null, error: 'Email inválido' };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password
      });

      if (error) {
        console.error('❌ Error en login:', error);
        
        // Reintentar en caso de errores de red
        if (retries > 0 && this.isRetryableError(error.message)) {
          console.log('🔄 Reintentando login...');
          await this.delay(1000);
          return this.signIn(email, password, retries - 1);
        }
        
        return { user: null, error: this.translateAuthError(error.message) };
      }

      if (data.user && data.session) {
        console.log('✅ Sesión iniciada exitosamente:');
        this.sessionCache.set(data.session);
      }

      return { user: data.user, error: null };
    } catch (error: any) {
      console.error('❌ Error inesperado en signIn:', error);
      
      // Reintentar en caso de errores de red
      if (retries > 0) {
        console.log('🔄 Reintentando login por error de red...');
        await this.delay(1000);
        return this.signIn(email, password, retries - 1);
      }
      
      return { user: null, error: 'Error de conexión. Inténtalo de nuevo.' };
    }
  }

  // Cerrar sesión de forma segura
  static async signOut(): Promise<{ error: string | null }> {
    try {
      console.log('🚪 Cerrando sesión...');
      
      // Limpiar cache primero
      this.sessionCache.clear();
      
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('❌ Error cerrando sesión:', error);
        // Aún así limpiar datos locales
        await this.clearLocalData();
        return { error: this.translateAuthError(error.message) };
      }

      await this.clearLocalData();
      console.log('✅ Sesión cerrada exitosamente');
      return { error: null };
    } catch (error: any) {
      console.error('❌ Error inesperado en signOut:', error);
      // Limpiar datos locales de todas formas
      await this.clearLocalData();
      return { error: 'Error al cerrar sesión, pero se limpiaron los datos locales' };
    }
  }

  // Obtener usuario actual con cache optimizado
  static async getCurrentUser(): Promise<User | null> {
    try {
      // Verificar cache primero
      const cachedSession = this.sessionCache.get();
      if (cachedSession?.user) {
        return cachedSession.user;
      }

      // Si no hay cache válido, obtener de Supabase
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        if (this.isSessionError(error.message)) {
          console.log('ℹ️ No hay sesión activa, limpiando datos locales...');
          await this.clearLocalData();
          return null;
        }
        console.error('❌ Error obteniendo usuario:', error);
        return null;
      }

      // Actualizar cache si tenemos usuario
      if (user) {
        const session = await this.getCurrentSession();
        this.sessionCache.set(session);
      }

      return user;
    } catch (error: any) {
      if (error.message === 'User fetch timeout') {
        console.warn('⚠️ Timeout obteniendo usuario');
        return null;
      }
      console.error('❌ Error inesperado obteniendo usuario:', error);
      return null;
    }
  }

  // Obtener sesión actual con cache optimizado
  static async getCurrentSession(): Promise<Session | null> {
    try {
      // Verificar cache primero
      const cachedSession = this.sessionCache.get();
      if (cachedSession) {
        return cachedSession;
      }

      // Si no hay cache válido, obtener de Supabase
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        if (this.isSessionError(error.message)) {
          console.log('ℹ️ No hay sesión activa, limpiando datos locales...');
          await this.clearLocalData();
          return null;
        }
        console.error('❌ Error obteniendo sesión:', error);
        return null;
      }

      // Actualizar cache
      this.sessionCache.set(session);
      return session;
    } catch (error: any) {
      if (error.message === 'Session fetch timeout') {
        console.warn('⚠️ Timeout obteniendo sesión');
        return null;
      }
      console.error('❌ Error inesperado obteniendo sesión:', error);
      return null;
    }
  }

  // Verificar si hay una sesión válida
  static async hasValidSession(): Promise<boolean> {
    try {
      const session = await this.getCurrentSession();
      
      if (!session) return false;
      
      // Verificar si la sesión no ha expirado
      if (session.expires_at) {
        const expirationTime = new Date(session.expires_at * 1000);
        const now = new Date();
        const timeUntilExpiry = expirationTime.getTime() - now.getTime();
        
        // Si expira en menos de 5 minutos, considerarla inválida
        if (timeUntilExpiry < 5 * 60 * 1000) {
          console.log('⚠️ Sesión próxima a expirar');
          return false;
        }
      }
      
      return true;
    } catch (error) {
      console.error('❌ Error verificando sesión válida:', error);
      return false;
    }
  }

  // Refrescar sesión automáticamente
  static async refreshSession(): Promise<SessionResult> {
    try {      
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error('❌ Error refrescando sesión:', error);
        return { session: null, error: this.translateAuthError(error.message) };
      }
      
      if (data.session) {
        this.sessionCache.set(data.session);
        console.log('✅ Sesión refrescada exitosamente');
      }
      
      return { session: data.session, error: null };
    } catch (error: any) {
      console.error('❌ Error inesperado refrescando sesión:', error);
      return { session: null, error: 'Error refrescando sesión' };
    }
  }

  // Escuchar cambios de autenticación
  static onAuthStateChange(callback: (user: User | null) => void): { unsubscribe: () => void } {
    this.authStateListeners.push(callback);
    
    return {
      unsubscribe: () => {
        const index = this.authStateListeners.indexOf(callback);
        if (index > -1) {
          this.authStateListeners.splice(index, 1);
        }
      }
    };
  }

  // Resetear contraseña
  static async resetPassword(email: string): Promise<{ error: string | null }> {
    try {
      if (!this.isValidEmail(email)) {
        return { error: 'Email inválido' };
      }

      const { error } = await supabase.auth.resetPasswordForEmail(
        email.toLowerCase().trim(),
        {
          redirectTo: `${window.location.origin}/reset-password`
        }
      );

      if (error) {
        console.error('❌ Error enviando reset de contraseña:', error);
        return { error: this.translateAuthError(error.message) };
      }

      return { error: null };
    } catch (error: any) {
      console.error('❌ Error inesperado en resetPassword:', error);
      return { error: 'Error enviando email de recuperación' };
    }
  }

  // Actualizar contraseña
  static async updatePassword(newPassword: string): Promise<{ error: string | null }> {
    try {
      if (!this.isValidPassword(newPassword)) {
        return { error: 'La contraseña debe tener al menos 6 caracteres' };
      }

      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        console.error('❌ Error actualizando contraseña:', error);
        return { error: this.translateAuthError(error.message) };
      }

      return { error: null };
    } catch (error: any) {
      console.error('❌ Error inesperado actualizando contraseña:', error);
      return { error: 'Error actualizando contraseña' };
    }
  }

  // Limpiar datos locales de forma segura
  static async clearLocalData(): Promise<void> {
    try {      
      // Limpiar cache de sesión
      this.sessionCache.clear();
      
      // Limpiar localStorage de Supabase y aplicación
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('sb-') || key.includes('supabase') || key.startsWith('flowforge-'))) {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach(key => {
        localStorage.removeItem(key);
      });
      
      // Limpiar sessionStorage
      const sessionKeysToRemove = [];
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key && (key.startsWith('sb-') || key.includes('supabase') || key.startsWith('flowforge-'))) {
          sessionKeysToRemove.push(key);
        }
      }
      
      sessionKeysToRemove.forEach(key => {
        sessionStorage.removeItem(key);
      });
    } catch (error) {
      console.error('❌ Error limpiando datos locales:', error);
    }
  }

  // Utilidades privadas
  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  }

  private static isValidPassword(password: string): boolean {
    return password.length >= 6;
  }

  private static isSessionError(message: string): boolean {
    const sessionErrors = [
      'Auth session missing',
      'session_not_found',
      'Invalid Refresh Token',
      'refresh_token_not_found',
      'invalid_grant'
    ];
    return sessionErrors.some(error => message.includes(error));
  }

  private static isRetryableError(message: string): boolean {
    const retryableErrors = [
      'network',
      'timeout',
      'connection',
      'fetch'
    ];
    return retryableErrors.some(error => message.toLowerCase().includes(error));
  }

  private static translateAuthError(message: string): string {
    const errorTranslations: Record<string, string> = {
      'Invalid login credentials': 'Credenciales inválidas',
      'Email not confirmed': 'Email no confirmado',
      'User not found': 'Usuario no encontrado',
      'Invalid email': 'Email inválido',
      'Password should be at least 6 characters': 'La contraseña debe tener al menos 6 caracteres',
      'User already registered': 'El usuario ya está registrado',
      'Email already registered': 'El email ya está registrado',
      'Too many requests': 'Demasiados intentos, inténtalo más tarde',
      'Network error': 'Error de conexión',
      'Auth session missing': 'Sesión no encontrada',
      'Invalid refresh token': 'Sesión expirada'
    };

    for (const [key, value] of Object.entries(errorTranslations)) {
      if (message.includes(key)) {
        return value;
      }
    }

    return 'Error de autenticación';
  }

  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private static createTimeoutPromise<T>(ms: number, message: string): Promise<T> {
    return new Promise((_, reject) => {
      setTimeout(() => reject(new Error(message)), ms);
    });
  }
}