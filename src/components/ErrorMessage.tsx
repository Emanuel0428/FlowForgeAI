import React from 'react';
import { AlertCircle, RefreshCw, Zap } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <div className="max-w-2xl mx-auto relative">
      {/* Ambient Background */}
      <div className="absolute inset-0 bg-red-500/5 rounded-3xl blur-xl"></div>
      
      <div className="liquid-card bg-red-900/20 border border-red-500/30 p-8 my-8 rounded-2xl backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-red-400"></div>
        
        <div className="flex items-start relative z-10">
          <div className="p-3 rounded-2xl bg-red-500/20 mr-4 liquid-glow-hover organic-shape">
            <AlertCircle className="h-6 w-6 text-red-400 animate-pulse" />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-semibold text-red-200 mb-3 flex items-center">
              <Zap className="w-6 h-6 mr-2" />
              ¡Oops! Algo salió mal
            </h3>
            <p className="text-red-300 mb-6 text-lg leading-relaxed">
              {message}
            </p>
            {onRetry && (
              <button
                onClick={onRetry}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-medium rounded-2xl transition-all duration-300 transform hover:scale-105 liquid-glow-hover relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-red-300 opacity-0 hover:opacity-20 transition-opacity duration-300"></div>
                <RefreshCw className="h-5 w-5 mr-2" />
                Reintentar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;