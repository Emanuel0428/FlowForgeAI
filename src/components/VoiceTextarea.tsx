import React, { useRef } from 'react';
import VoiceToTextButton from './VoiceToTextButton';

interface VoiceTextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange' | 'value'> {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  minRows?: number;
  maxRows?: number;
}

const VoiceTextarea: React.FC<VoiceTextareaProps> = ({
  value,
  onChange,
  label,
  placeholder,
  disabled = false,
  minRows = 4,
  maxRows = 10,
  ...props
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isVoiceActive, setIsVoiceActive] = React.useState(false);

  // Función para manejar el dictado y disparar el onChange estándar
  const handleVoiceResult = (text: string) => {
    if (text && text.trim()) {
      const newValue = value ? `${value} ${text}` : text;
      // Crear un evento sintético para React
      const event = {
        ...({} as React.ChangeEvent<HTMLTextAreaElement>),
        target: {
          ...({} as HTMLTextAreaElement),
          value: newValue,
        },
      };
      onChange(event);
      if (textareaRef.current) textareaRef.current.focus();
    }
  };

  return (
    <div className="relative w-full">
      {label && (
        <label htmlFor={props.id} className="block text-lg font-semibold text-gray-200 mb-2">
          {label}
        </label>
      )}
      <textarea
        ref={textareaRef}
        id={props.id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={minRows}
        disabled={disabled}
        style={{ paddingRight: '3.5rem', ...props.style }} // padding extra para el botón
        className={`block w-full px-6 py-4 border rounded-2xl shadow-lg focus:outline-none transition-all duration-500 resize-none backdrop-blur-sm text-gray-100 placeholder-gray-500 text-lg liquid-button ${disabled ? 'opacity-50' : ''}`}
        {...props}
      />
      <div className="absolute right-2 bottom-2 z-20">
        <VoiceToTextButton
          onTranscriptionResult={handleVoiceResult}
          onRecordingStateChange={setIsVoiceActive}
          disabled={disabled}
          className="shadow-lg"
          stopAfterInactivity={3000}
        />
      </div>
      {isVoiceActive && (
        <div className="absolute left-6 bottom-4 flex items-center bg-liquid-surface/80 py-2 px-4 rounded-full border border-iridescent-cyan/30 shadow-lg z-10">
          <div className="mr-2 w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
          <span className="text-sm font-medium text-iridescent-cyan">Escuchando tu voz...</span>
        </div>
      )}
    </div>
  );
};

export default VoiceTextarea;
