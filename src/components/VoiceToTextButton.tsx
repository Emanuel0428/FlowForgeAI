import React, { useState, useRef } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import '../types/speechRecognition';

interface VoiceToTextButtonProps {
  onTranscriptionResult: (text: string) => void;
  onRecordingStateChange?: (isRecording: boolean) => void;
  disabled?: boolean;
  className?: string;
  stopAfterInactivity?: number; // tiempo en ms para detener la grabación después de inactividad
}

const VoiceToTextButton: React.FC<VoiceToTextButtonProps> = ({
  onTranscriptionResult,
  onRecordingStateChange,
  disabled = false,
  className = '',
  stopAfterInactivity = 2000 // 2 segundos por defecto
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null); // null = no se ha comprobado, true/false = permiso concedido/denegado
  const [error, setError] = useState<string | null>(null);
  const inactivityTimer = useRef<NodeJS.Timeout | null>(null);
  const transcriptRef = useRef('');
  const recognitionRef = useRef<any>(null);

  // Verificar soporte al montar
  React.useEffect(() => {
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) setIsSupported(false);
  }, []);

  // Limpieza de timers al desmontar
  React.useEffect(() => {
    return () => {
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch {}
      }
    };
  }, []);

  const startRecognition = () => {
    setError(null);
    transcriptRef.current = '';
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
      setError('Reconocimiento de voz no soportado');
      return;
    }
    // Si ya hay una instancia y está grabando, no reinicializar
    if (recognitionRef.current && isRecording) return;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'es-ES';
    recognition.onstart = () => {
      setIsLoading(false);
      setIsRecording(true);
      if (onRecordingStateChange) onRecordingStateChange(true);
    };
    recognition.onerror = (event: any) => {
      setIsLoading(false);
      setIsRecording(false);
      setError('Error: ' + event.error);
      if (onRecordingStateChange) onRecordingStateChange(false);
    };
    recognition.onresult = (event: any) => {
      let currentTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          currentTranscript += event.results[i][0].transcript;
        }
      }
      if (currentTranscript) {
        transcriptRef.current += ' ' + currentTranscript;
        if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
        inactivityTimer.current = setTimeout(() => {
          stopRecognition();
        }, stopAfterInactivity);
      }
    };
    recognition.onend = () => {
      setIsRecording(false);
      setIsLoading(false);
      if (onRecordingStateChange) onRecordingStateChange(false);
      if (transcriptRef.current.trim()) {
        onTranscriptionResult(transcriptRef.current.trim());
        transcriptRef.current = '';
      }
      recognitionRef.current = null;
    };
    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch (err) {
      setIsLoading(false);
      setIsRecording(false);
      setError('No se pudo iniciar el reconocimiento de voz');
    }
  };

  const stopRecognition = () => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
      recognitionRef.current = null;
    }
    setIsRecording(false);
    setIsLoading(false);
    if (onRecordingStateChange) onRecordingStateChange(false);
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
  };

  const handleClick = async () => {
    if (disabled || !isSupported) return;
    if (isRecording) {
      stopRecognition();
      return;
    }
    setIsLoading(true);
    setError(null);
    // Solicitar permisos antes de iniciar
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setHasPermission(true);
      stream.getTracks().forEach(track => track.stop());
      startRecognition();
    } catch (err) {
      setHasPermission(false);
      setIsLoading(false);
      setError('No se pudo acceder al micrófono');
    }
  };

  // Determinar el tooltip adecuado según el estado
  const getTooltip = () => {
    if (error) return `Error: ${error}`;
    if (!isSupported) return 'Tu navegador no soporta el reconocimiento de voz';
    if (hasPermission === false) return 'No tienes permisos para usar el micrófono.';
    if (isRecording) return 'Detener dictado';
    if (isLoading) return 'Inicializando...';
    return 'Haz clic para dictar texto';
  };

  return (
    <div className="relative">
      {error && (
        <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-red-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-50">
          {error}
        </div>
      )}
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled || !isSupported || hasPermission === false}
        className={`p-3 rounded-full transition-all duration-300 ${
          isRecording
            ? 'bg-red-600 hover:bg-red-700 text-white liquid-glow'
            : error
              ? 'bg-red-700/50 text-white'
              : hasPermission === false
                ? 'bg-amber-700/50 text-amber-300/70'
                : isSupported
                  ? 'bg-liquid-surface/50 hover:bg-liquid-surface/70 text-gray-400 hover:text-white'
                  : 'bg-gray-700 text-gray-500'
        } ${(disabled || !isSupported || hasPermission === false) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
        title={getTooltip()}
        aria-label={getTooltip()}
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : isRecording ? (
          <MicOff className="w-5 h-5" />
        ) : error ? (
          <Mic className="w-5 h-5 text-red-300" />
        ) : hasPermission === false ? (
          <Mic className="w-5 h-5 text-amber-300/70" />
        ) : (
          <Mic className={`w-5 h-5 ${!isSupported ? 'opacity-50' : ''}`} />
        )}
      </button>
    </div>
  );
};

export default VoiceToTextButton;
