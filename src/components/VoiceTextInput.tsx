import React, { useRef } from 'react';
import VoiceToTextButton from './VoiceToTextButton';

interface VoiceTextInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
}

const VoiceTextInput: React.FC<VoiceTextInputProps> = ({
  value,
  onChange,
  label,
  placeholder,
  disabled = false,
  ...props
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isVoiceActive, setIsVoiceActive] = React.useState(false);

  const handleVoiceResult = (text: string) => {
    if (text && text.trim()) {
      const newValue = value ? `${value} ${text}` : text;
      const event = {
        ...({} as React.ChangeEvent<HTMLInputElement>),
        target: {
          ...({} as HTMLInputElement),
          value: newValue,
        },
      };
      onChange(event);
      if (inputRef.current) inputRef.current.focus();
    }
  };

  return (
    <div className="relative w-full">
      {label && (
        <label htmlFor={props.id} className="block text-lg font-semibold text-gray-200 mb-2">
          {label}
        </label>
      )}
      <input
        ref={inputRef}
        id={props.id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`block w-full px-6 py-4 border rounded-2xl shadow-lg focus:outline-none transition-all duration-500 backdrop-blur-sm text-gray-100 placeholder-gray-500 text-lg liquid-button ${disabled ? 'opacity-50' : ''}`}
        {...props}
      />
      <div className="absolute right-4 bottom-4">
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

export default VoiceTextInput;
