import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('❌ Error capturado por ErrorBoundary:', error);
    console.error('📍 Información del error:', errorInfo);
    
    this.setState({
      error,
      errorInfo
    });

    // Reportar error a servicio de monitoreo si está configurado
    const isProduction = process.env.NODE_ENV === 'production';
    if (isProduction) {
      this.reportError(error, errorInfo);
    }
  }

  private reportError(error: Error, errorInfo: ErrorInfo) {
    // Aquí se podría integrar con servicios como Sentry, LogRocket, etc.
    console.log('📊 Reportando error a servicio de monitoreo...');
    
    // Ejemplo de estructura para reporte
    const errorReport = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };
    
    // Enviar a servicio de monitoreo
    // monitoringService.reportError(errorReport);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    if (this.state.hasError) {
      const isDevelopment = process.env.NODE_ENV === 'development';
      
      return (
        <div className="min-h-screen bg-gradient-to-br from-liquid-dark via-liquid-navy to-liquid-charcoal flex items-center justify-center p-4">
          {/* Ambient Background Effects */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
          </div>

          <div className="liquid-card bg-liquid-surface/90 backdrop-blur-xl max-w-2xl w-full p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-500"></div>
            
            {/* Error Icon */}
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-3xl bg-gradient-to-br from-red-500/20 to-orange-500/20 liquid-glow-hover organic-shape">
                <AlertTriangle className="h-12 w-12 text-red-400" />
              </div>
            </div>

            {/* Error Content */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-4">
                ¡Oops! Algo salió mal
              </h1>
              <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                Se ha producido un error inesperado en la aplicación. Nuestro equipo ha sido notificado automáticamente.
              </p>
              
              {/* Error Details (only in development) */}
              {isDevelopment && this.state.error && (
                <details className="text-left mb-6 liquid-card bg-red-900/20 border border-red-500/30 p-4 rounded-2xl">
                  <summary className="cursor-pointer text-red-300 font-medium mb-2">
                    Detalles técnicos (desarrollo)
                  </summary>
                  <div className="text-sm text-red-200 space-y-2">
                    <div>
                      <strong>Error:</strong> {this.state.error.message}
                    </div>
                    {this.state.error.stack && (
                      <div>
                        <strong>Stack:</strong>
                        <pre className="mt-1 text-xs bg-red-950/50 p-2 rounded overflow-x-auto">
                          {this.state.error.stack}
                        </pre>
                      </div>
                    )}
                    {this.state.errorInfo?.componentStack && (
                      <div>
                        <strong>Component Stack:</strong>
                        <pre className="mt-1 text-xs bg-red-950/50 p-2 rounded overflow-x-auto">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </div>
                    )}
                  </div>
                </details>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={this.handleRetry}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-iridescent-blue to-iridescent-violet hover:from-iridescent-cyan hover:to-iridescent-blue text-white font-bold rounded-2xl transition-all duration-500 transform hover:scale-105 shadow-lg liquid-glow-hover relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-iridescent-violet to-iridescent-cyan opacity-0 hover:opacity-20 transition-opacity duration-300"></div>
                <RefreshCw className="w-5 h-5 mr-2" />
                Reintentar
              </button>
              
              <button
                onClick={this.handleReload}
                className="inline-flex items-center px-6 py-3 bg-liquid-surface/30 hover:bg-liquid-surface/50 border border-liquid-border hover:border-iridescent-blue/30 text-white font-medium rounded-2xl transition-all duration-300 liquid-button"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                Recargar Página
              </button>
              
              <button
                onClick={this.handleGoHome}
                className="inline-flex items-center px-6 py-3 bg-liquid-surface/30 hover:bg-liquid-surface/50 border border-liquid-border hover:border-iridescent-blue/30 text-white font-medium rounded-2xl transition-all duration-300 liquid-button"
              >
                <Home className="w-5 h-5 mr-2" />
                Ir al Inicio
              </button>
            </div>

            {/* Support Info */}
            <div className="mt-8 text-center">
              <p className="text-gray-400 text-sm">
                Si el problema persiste, contacta a nuestro equipo de soporte.
              </p>
              <p className="text-gray-500 text-xs mt-2">
                Error ID: {Date.now().toString(36)}
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;