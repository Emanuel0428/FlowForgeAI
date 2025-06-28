import React, { useState, useEffect, useCallback } from 'react';
import { X, Mail, Lock, Eye, EyeOff, Sparkles, Brain, AlertCircle, CheckCircle, Globe } from 'lucide-react';
import { AuthService } from '../services/authService';
import { useLanguage } from '../config/language';
import { SupportedLanguage } from '../config/elevenlabs';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [mode, setMode] = useState<'signin' | 'signup' | 'reset'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { language, setLanguage, t } = useLanguage();

  // Wrap resetForm in useCallback to make it stable
  const resetForm = useCallback(() => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError('');
    setSuccess('');
    setShowPassword(false);
    setIsLoading(false);
  }, []);

  // Wrap handleClose in useCallback to make it stable
  const handleClose = useCallback(() => {
    if (!isLoading) {
      resetForm();
      onClose();
    }
  }, [isLoading, resetForm, onClose]);

  // Limpiar formulario cuando se abre/cierra el modal
  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen, resetForm]);

  // Limpiar mensajes después de un tiempo
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  // Fix: Always return cleanup function, make conditional logic internal
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLoading) {
        handleClose();
      }
    };

    // Always add and remove event listener, but condition is checked inside handler
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
    }

    // Always return cleanup function
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, isLoading, handleClose]);

  if (!isOpen) return null;

  const validateForm = (): boolean => {
    if (!email.trim()) {
      setError(t('auth', 'emailRequired'));
      return false;
    }

    if (!email.includes('@') || !email.includes('.')) {
      setError(t('auth', 'validEmail'));
      return false;
    }

    if (mode !== 'reset') {
      if (!password) {
        setError(t('auth', 'passwordRequired'));
        return false;
      }

      if (password.length < 6) {
        setError(t('auth', 'passwordLength'));
        return false;
      }

      if (mode === 'signup' && password !== confirmPassword) {
        setError(t('auth', 'passwordsDontMatch'));
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      if (mode === 'reset') {
        const { error } = await AuthService.resetPassword(email);
        if (error) {
          setError(error);
        } else {
          setSuccess(t('auth', 'resetEmailSent'));
          setTimeout(() => {
            setMode('signin');
            setSuccess('');
          }, 3000);
        }
      } else if (mode === 'signup') {
        const { user, error } = await AuthService.signUp(email, password);
        if (error) {
          setError(error);
        } else if (user) {
          setSuccess(t('auth', 'accountCreated'));
          setTimeout(() => {
            onSuccess();
            onClose();
          }, 1500);
        }
      } else {
        const { user, error } = await AuthService.signIn(email, password);
        if (error) {
          setError(error);
        } else if (user) {
          setSuccess(t('auth', 'signedInSuccessfully'));
          setTimeout(() => {
            onSuccess();
            onClose();
          }, 1000);
        }
      }
    } catch (err: any) {
      console.error('Error en autenticación:', err);
      setError(t('auth', 'unexpectedError'));
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = (newMode: 'signin' | 'signup' | 'reset') => {
    setMode(newMode);
    resetForm();
  };

  const getTitle = () => {
    switch (mode) {
      case 'signup': return t('auth', 'signUp');
      case 'reset': return t('auth', 'resetPassword');
      default: return t('auth', 'signIn');
    }
  };

  const getSubtitle = () => {
    switch (mode) {
      case 'signup': return t('auth', 'joinFlowForgeAI');
      case 'reset': return t('auth', 'recoverAccess');
      default: return t('auth', 'accessYourAIConsultant');
    }
  };

  return (
    <div className="fixed inset-0 bg-liquid-dark/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      {/* Ambient Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-iridescent-blue/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-iridescent-violet/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="liquid-card bg-liquid-surface/90 backdrop-blur-xl max-w-md w-full p-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-iridescent-blue via-iridescent-violet to-iridescent-cyan"></div>
        
        {/* Language Selector */}
        <div className="absolute top-4 right-40 flex items-center space-x-2">
          <button
            onClick={() => setLanguage('es')}
            className={`p-1 rounded-md transition-all duration-200 ${
              language === 'es' ? 'bg-iridescent-blue/20 text-white' : 'text-gray-400 hover:text-white'
            }`}
            title="Español"
          >
            🇪🇸
          </button>
          <button
            onClick={() => setLanguage('en')}
            className={`p-1 rounded-md transition-all duration-200 ${
              language === 'en' ? 'bg-iridescent-blue/20 text-white' : 'text-gray-400 hover:text-white'
            }`}
            title="English"
          >
            🇺🇸
          </button>
        </div>
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-iridescent-blue/20 to-iridescent-violet/20 mr-4 liquid-glow-hover organic-shape">
              <Brain className="h-6 w-6 text-iridescent-cyan" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                {getTitle()}
              </h2>
              <p className="text-gray-400 text-sm flex items-center">
                <Sparkles className="w-3 h-3 mr-1" />
                {getSubtitle()}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="p-2 rounded-xl hover:bg-liquid-surface/50 transition-all duration-300 liquid-button text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              {t('auth', 'email')}
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-liquid-surface/30 border border-liquid-border rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-iridescent-blue/50 transition-all duration-300 liquid-button disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="tu@email.com"
                required
                disabled={isLoading}
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password */}
          {mode !== 'reset' && (
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                {t('auth', 'password')}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 bg-liquid-surface/30 border border-liquid-border rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-iridescent-blue/50 transition-all duration-300 liquid-button disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                  autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-lg text-gray-400 hover:text-white focus:outline-none"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {mode === 'signup' && t('auth', 'passwordRequirements')}
              </p>
            </div>
          )}

          {/* Confirm Password */}
          {mode === 'signup' && (
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                {t('auth', 'confirmPassword')}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-liquid-surface/30 border border-liquid-border rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-iridescent-blue/50 transition-all duration-300 liquid-button disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                  autoComplete="new-password"
                />
              </div>
            </div>
          )}

          {/* Error & Success Messages */}
          {error && (
            <div className="liquid-card bg-red-900/20 border border-red-500/30 p-4 rounded-2xl flex items-start">
              <AlertCircle className="h-5 w-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" />
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="liquid-card bg-green-900/20 border border-green-500/30 p-4 rounded-2xl flex items-start">
              <CheckCircle className="h-5 w-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
              <p className="text-green-300 text-sm">{success}</p>
            </div>
          )}

          {/* Form Actions */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-iridescent-blue to-iridescent-violet hover:from-iridescent-cyan hover:to-iridescent-blue text-white font-bold rounded-2xl transition-all duration-500 transform hover:scale-105 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg liquid-glow-hover relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-iridescent-violet to-iridescent-cyan opacity-0 hover:opacity-20 transition-opacity duration-300"></div>
              {isLoading ? (
                <div className="liquid-loader w-6 h-6 mx-auto"></div>
              ) : (
                <>
                  {mode === 'signin' && t('auth', 'signInButton')}
                  {mode === 'signup' && t('auth', 'signUpButton')}
                  {mode === 'reset' && t('auth', 'resetPasswordButton')}
                </>
              )}
            </button>
          </div>

          {/* Form Footer */}
          <div className="mt-6 text-center">
            {mode === 'signin' && (
              <>
                <button
                  type="button"
                  onClick={() => switchMode('reset')}
                  className="text-iridescent-blue hover:text-iridescent-cyan text-sm transition-colors"
                  disabled={isLoading}
                >
                  {t('auth', 'forgotPassword')}
                </button>
                <div className="mt-4 text-gray-400 text-sm">
                  {t('auth', 'dontHaveAccount')}{' '}
                  <button
                    type="button"
                    onClick={() => switchMode('signup')}
                    className="text-iridescent-blue hover:text-iridescent-cyan transition-colors font-medium"
                    disabled={isLoading}
                  >
                    {t('auth', 'createOne')}
                  </button>
                </div>
              </>
            )}

            {mode === 'signup' && (
              <div className="text-gray-400 text-sm">
                {t('auth', 'alreadyHaveAccount')}{' '}
                <button
                  type="button"
                  onClick={() => switchMode('signin')}
                  className="text-iridescent-blue hover:text-iridescent-cyan transition-colors font-medium"
                  disabled={isLoading}
                >
                  {t('auth', 'signInHere')}
                </button>
              </div>
            )}

            {mode === 'reset' && (
              <button
                type="button"
                onClick={() => switchMode('signin')}
                className="text-iridescent-blue hover:text-iridescent-cyan text-sm transition-colors"
                disabled={isLoading}
              >
                {t('auth', 'backToSignIn')}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;