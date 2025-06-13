import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Check, Sparkles, Brain } from 'lucide-react';
import { UserProfileData } from '../types';
import { profileFormSteps } from '../data/profileForm';

interface UserProfileFormProps {
  onSubmit: (data: UserProfileData) => void;
  isLoading: boolean;
}

const UserProfileForm: React.FC<UserProfileFormProps> = ({ onSubmit, isLoading }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<UserProfileData>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleFieldChange = (fieldId: keyof UserProfileData, value: string) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
    if (errors[fieldId]) {
      setErrors(prev => ({ ...prev, [fieldId]: '' }));
    }
  };

  const validateCurrentStep = (): boolean => {
    const currentStepData = profileFormSteps[currentStep];
    const newErrors: Record<string, string> = {};
    
    currentStepData.fields.forEach(field => {
      if (field.required && !formData[field.id]) {
        newErrors[field.id] = `${field.label} es requerido`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      if (currentStep < profileFormSteps.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  };

  const handleSubmit = () => {
    if (validateCurrentStep()) {
      onSubmit(formData as UserProfileData);
    }
  };

  const progress = ((currentStep + 1) / profileFormSteps.length) * 100;
  const currentStepData = profileFormSteps[currentStep];

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-liquid-dark via-liquid-navy to-liquid-charcoal overflow-y-auto dark">
      {/* Ambient Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-iridescent-blue/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-iridescent-violet/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-iridescent-cyan/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="min-h-full py-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="p-4 rounded-3xl bg-gradient-to-br from-iridescent-blue to-iridescent-violet liquid-glow-hover organic-shape">
                <Brain className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-5xl font-bold text-white mb-4 iridescent-text">
              Perfila tu Negocio
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Ayúdanos a entender tu negocio para ofrecerte recomendaciones personalizadas con inteligencia líquida
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-12">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-medium text-gray-300 flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-iridescent-cyan" />
                Paso {currentStep + 1} de {profileFormSteps.length}
              </span>
              <span className="text-lg font-medium text-iridescent-blue">
                {Math.round(progress)}% completado
              </span>
            </div>
            <div className="w-full bg-liquid-surface/30 rounded-full h-3 backdrop-blur-sm">
              <div 
                className="bg-gradient-to-r from-iridescent-blue via-iridescent-violet to-iridescent-cyan h-3 rounded-full transition-all duration-1000 liquid-glow animate-pulse"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Form Card */}
          <div className="liquid-card bg-liquid-surface/40 backdrop-blur-xl p-8 lg:p-12 mb-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-iridescent-blue via-iridescent-violet to-iridescent-cyan"></div>
            
            <div className="mb-10">
              <h2 className="text-3xl font-bold text-white mb-4">
                {currentStepData.title}
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-iridescent-blue to-iridescent-violet rounded-full"></div>
            </div>

            <div className="space-y-8">
              {currentStepData.fields.map((field) => (
                <div key={field.id} className="space-y-6">
                  <label className="block text-xl font-semibold text-white">
                    {field.label}
                    {field.required && <span className="text-iridescent-violet ml-2">*</span>}
                  </label>

                  {field.type === 'radio' ? (
                    <div className="grid gap-4 sm:grid-cols-2">
                      {field.options.map((option) => (
                        <label
                          key={option.value}
                          className={`relative flex items-center p-6 rounded-2xl border-2 cursor-pointer transition-all duration-500 hover:shadow-lg liquid-button group ${
                            formData[field.id] === option.value
                              ? 'border-iridescent-blue/50 bg-gradient-to-r from-iridescent-blue/10 to-iridescent-violet/10 liquid-glow'
                              : 'border-liquid-border hover:border-iridescent-blue/30 bg-liquid-surface/20 hover:bg-liquid-surface/40'
                          }`}
                        >
                          <input
                            type="radio"
                            name={field.id}
                            value={option.value}
                            checked={formData[field.id] === option.value}
                            onChange={(e) => handleFieldChange(field.id, e.target.value)}
                            className="sr-only"
                          />
                          <div className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center transition-all duration-300 ${
                            formData[field.id] === option.value
                              ? 'border-iridescent-blue bg-gradient-to-br from-iridescent-blue to-iridescent-violet liquid-glow'
                              : 'border-gray-500 group-hover:border-iridescent-blue/50'
                          }`}>
                            {formData[field.id] === option.value && (
                              <Check className="w-4 h-4 text-white" />
                            )}
                          </div>
                          <span className="text-gray-200 font-medium text-lg">
                            {option.label}
                          </span>
                          {formData[field.id] === option.value && (
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-iridescent-blue to-iridescent-violet"></div>
                          )}
                        </label>
                      ))}
                    </div>
                  ) : (
                    <div className="relative">
                      <select
                        value={formData[field.id] || ''}
                        onChange={(e) => handleFieldChange(field.id, e.target.value)}
                        className={`block w-full px-6 py-4 border rounded-2xl shadow-lg focus:outline-none transition-all duration-500 backdrop-blur-sm ${
                          errors[field.id] 
                            ? 'border-red-400 bg-red-900/20' 
                            : 'border-liquid-border bg-liquid-surface/30 focus:border-iridescent-blue/50 focus:bg-liquid-surface/50'
                        } text-gray-100 text-lg liquid-button`}
                      >
                        <option value="">Selecciona una opción</option>
                        {field.options.map((option) => (
                          <option key={option.value} value={option.value} className="bg-liquid-surface text-gray-100">
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-0 rounded-2xl bg-glow-gradient opacity-0 hover:opacity-10 transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                  )}

                  {errors[field.id] && (
                    <div className="liquid-card bg-red-900/20 border border-red-500/30 p-4 rounded-2xl">
                      <p className="text-red-300 font-medium">
                        {errors[field.id]}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-16 pt-8 border-t border-liquid-border/30">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className={`inline-flex items-center px-8 py-4 rounded-2xl font-medium transition-all duration-500 liquid-button ${
                  currentStep === 0
                    ? 'text-gray-600 cursor-not-allowed'
                    : 'text-gray-300 hover:text-white hover:bg-liquid-surface/30 border border-liquid-border hover:border-iridescent-blue/30'
                }`}
              >
                <ChevronLeft className="w-5 h-5 mr-2" />
                Anterior
              </button>

              <button
                type="button"
                onClick={handleNext}
                disabled={isLoading}
                className="inline-flex items-center px-10 py-4 bg-gradient-to-r from-iridescent-blue to-iridescent-violet hover:from-iridescent-cyan hover:to-iridescent-blue text-white font-bold rounded-2xl transition-all duration-500 transform hover:scale-105 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg liquid-glow-hover relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-iridescent-violet to-iridescent-cyan opacity-0 hover:opacity-20 transition-opacity duration-300"></div>
                {currentStep === profileFormSteps.length - 1 ? (
                  <>
                    Comenzar Análisis Líquido
                    <Check className="w-5 h-5 ml-2" />
                  </>
                ) : (
                  <>
                    Siguiente
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileForm;