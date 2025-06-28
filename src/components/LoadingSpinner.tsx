import React from 'react';
import { Brain, Zap, Sparkles, Cpu } from 'lucide-react';
import { useLanguage } from '../config/language';

const LoadingSpinner: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <div className="flex flex-col items-center justify-center py-20 px-8 relative">
      {/* Ambient Background */}
      <div className="absolute inset-0 bg-glow-gradient opacity-20 rounded-3xl"></div>
      
      {/* Main Loading Animation */}
      <div className="relative w-32 h-32 mb-8">
        {/* Outer Ring */}
        <div className="absolute inset-0 rounded-full border-2 border-iridescent-blue/30 animate-spin"></div>
        
        {/* Middle Ring */}
        <div className="absolute inset-3 rounded-full border-2 border-iridescent-violet/50 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '2s' }}></div>
        
        {/* Inner Ring */}
        <div className="absolute inset-6 rounded-full border-2 border-iridescent-cyan/70 animate-spin" style={{ animationDuration: '1.5s' }}></div>
        
        {/* Center Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="p-4 rounded-full bg-gradient-to-br from-iridescent-blue to-iridescent-violet liquid-glow animate-breathe organic-shape">
            <Brain className="h-8 w-8 text-white" />
          </div>
        </div>
        
        {/* Floating Particles */}
        <div className="absolute -top-3 -left-3 w-3 h-3 bg-iridescent-cyan rounded-full animate-float organic-shape"></div>
        <div className="absolute -top-3 -right-3 w-3 h-3 bg-iridescent-violet rounded-full animate-float organic-shape" style={{ animationDelay: '1s' }}></div>
        <div className="absolute -bottom-3 -left-3 w-3 h-3 bg-iridescent-blue rounded-full animate-float organic-shape" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -bottom-3 -right-3 w-3 h-3 bg-iridescent-emerald rounded-full animate-float organic-shape" style={{ animationDelay: '3s' }}></div>
        
        {/* Orbital Elements */}
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: '8s' }}>
          <div className="absolute top-0 left-1/2 w-2 h-2 bg-iridescent-blue rounded-full transform -translate-x-1/2 -translate-y-1 organic-shape"></div>
        </div>
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: '6s', animationDirection: 'reverse' }}>
          <div className="absolute bottom-0 left-1/2 w-2 h-2 bg-iridescent-violet rounded-full transform -translate-x-1/2 translate-y-1 organic-shape"></div>
        </div>
      </div>
      
      {/* Content */}
      <div className="text-center relative z-10">
        <h3 className="text-4xl font-bold text-white mb-4 flex items-center justify-center">
          <Cpu className="w-10 h-10 text-iridescent-cyan mr-4 animate-pulse" />
          {t('loading', 'processing')}
          <Sparkles className="w-8 h-8 text-iridescent-violet ml-4 animate-pulse" />
        </h3>
        <p className="text-gray-300 max-w-lg mx-auto text-xl leading-relaxed mb-6">
          {t('loading', 'analyzing')}
        </p>
        
        {/* Status Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center px-6 py-3 bg-liquid-surface/40 rounded-2xl border border-iridescent-blue/30 backdrop-blur-sm">
            <Zap className="w-5 h-5 text-iridescent-cyan mr-3 animate-pulse" />
            <span className="text-iridescent-blue font-medium">{t('loading', 'aiWorking')}</span>
            <div className="ml-3 flex space-x-1">
              <div className="w-2 h-2 bg-iridescent-blue rounded-full animate-bounce organic-shape"></div>
              <div className="w-2 h-2 bg-iridescent-violet rounded-full animate-bounce organic-shape" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-iridescent-cyan rounded-full animate-bounce organic-shape" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        </div>
        
        {/* Progress Dots */}
        <div className="flex justify-center space-x-3">
          <div className="w-4 h-4 bg-iridescent-blue rounded-full animate-bounce organic-shape"></div>
          <div className="w-4 h-4 bg-iridescent-violet rounded-full animate-bounce organic-shape" style={{ animationDelay: '0.3s' }}></div>
          <div className="w-4 h-4 bg-iridescent-cyan rounded-full animate-bounce organic-shape" style={{ animationDelay: '0.6s' }}></div>
          <div className="w-4 h-4 bg-iridescent-emerald rounded-full animate-bounce organic-shape" style={{ animationDelay: '0.9s' }}></div>
        </div>
      </div>
      
      {/* Liquid Waves */}
      <div className="absolute bottom-0 left-0 right-0 h-24 overflow-hidden">
        <div className="absolute bottom-0 left-0 w-full h-10 bg-gradient-to-r from-iridescent-blue/10 via-iridescent-violet/10 to-iridescent-cyan/10 rounded-t-full animate-liquid-flow"></div>
        <div className="absolute bottom-3 left-0 w-full h-8 bg-gradient-to-r from-iridescent-violet/10 via-iridescent-cyan/10 to-iridescent-blue/10 rounded-t-full animate-liquid-flow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-6 left-0 w-full h-6 bg-gradient-to-r from-iridescent-cyan/10 via-iridescent-emerald/10 to-iridescent-violet/10 rounded-t-full animate-liquid-flow" style={{ animationDelay: '2s' }}></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;