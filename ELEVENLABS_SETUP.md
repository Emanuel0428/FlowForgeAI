# ElevenLabs Voice Integration - FlowForge AI

## 🎙️ Configuración del Asistente de Voz Multiidioma

FlowForge AI incluye una integración completa con ElevenLabs para ofrecer capacidades de voz avanzadas en **español e inglés**.

### 📋 Prerequisitos

1. **Cuenta de ElevenLabs**: Regístrate en [elevenlabs.io](https://elevenlabs.io)
2. **API Key**: Obtén tu API key desde el dashboard de ElevenLabs

### 🚀 Configuración Rápida

1. **Configura tu .env**:
   ```bash
   VITE_ELEVENLABS_API_KEY=tu_api_key_aqui
   ```

2. **Reinicia el servidor de desarrollo**:
   ```bash
   npm run dev
   ```

3. **¡Listo!** El asistente de voz estará disponible en el dashboard de bienvenida con soporte multiidioma.

### � Características Multiidioma

- ✅ **Soporte completo para Español e Inglés**
- ✅ **3 voces diferentes por idioma** 
- ✅ **Modelos optimizados por idioma**:
  - **Español**: Eleven Turbo v2.5
  - **Inglés**: Eleven Turbo v2
- ✅ **Cambio de idioma en tiempo real**
- ✅ **Mensajes de bienvenida localizados**

### �🎯 Características Implementadas

- ✅ **Síntesis de voz en tiempo real** con ElevenLabs
- ✅ **Selector de idioma** (🇪🇸 Español / 🇺🇸 English)
- ✅ **Selector de voz** (3 opciones por idioma)
- ✅ **Mensaje de bienvenida personalizado** basado en la hora del día
- ✅ **Controles de reproducción** (play/pause)
- ✅ **Indicadores de estado** visual con info de idioma y modelo
- ✅ **Gestión de errores** robusta
- ✅ **Limpieza automática** de recursos de audio
- ✅ **Configuración flexible** de voces y parámetros

### 🎛️ Configuración de Voces

**Voces en Español** (Eleven Turbo v2.5):
- Voz 1: `J2Jb9yZNvpXUNAL3a2bw`
- Voz 2: `57D8YIbQSuE3REDPO6Vm`
- Voz 3: `UgBBYS2sOqTuMpoF3BR0`

**Voces en Inglés** (Eleven Turbo v2):
- Voz 1: `sfJopaWaOtauCD3HKX6Q`
- Voz 2: `QCOsaFukRxK1IUh7WVlM`
- Voz 3: `UGTtbzgh3HObxRjWaSpr`

### 🔧 Personalización

Puedes personalizar la integración editando `src/config/elevenlabs.ts`:

```typescript
// Cambiar idioma por defecto
ELEVENLABS_CONFIG.defaultLanguage = 'en'; // o 'es'

// Cambiar voz por defecto (0, 1, o 2)
ELEVENLABS_CONFIG.defaultVoiceIndex = 1;

// Ajustar configuraciones de voz
const customSettings = {
  stability: 0.7,
  similarity_boost: 0.8,
  style: 0.2
};
```

### 🌐 Uso del Asistente

1. **Selecciona tu idioma preferido** usando los botones 🇪🇸/🇺🇸
2. **Elige una de las 3 voces disponibles** para ese idioma
3. **Haz clic en "Escuchar"** para generar y reproducir el mensaje
4. **Controla la reproducción** con los botones play/pause

### 🛠️ API de ElevenLabs

El sistema utiliza:
- **Endpoint**: `https://api.elevenlabs.io/v1/text-to-speech/{voice_id}`
- **Modelos**: 
  - `eleven_turbo_v2_5` para español
  - `eleven_turbo_v2` para inglés
- **Formato**: Audio MP3

### 🔍 Troubleshooting

**El asistente no funciona:**
1. Verifica que `VITE_ELEVENLABS_API_KEY` esté configurado
2. Asegúrate de que la API key sea válida
3. Revisa la consola del navegador para errores

**Audio no se reproduce:**
1. Verifica que el navegador permita autoplay
2. Comprueba que el volumen no esté silenciado
3. Intenta hacer clic en el botón manualmente

**Errores de API:**
1. Verifica que tengas créditos suficientes en ElevenLabs
2. Comprueba que la API key tenga los permisos necesarios
3. Revisa los límites de rate limiting

**Problemas con idiomas:**
1. Asegúrate de que las voice IDs sean correctas
2. Verifica que tengas acceso a los modelos Turbo v2 y v2.5
3. Comprueba que las voces estén disponibles en tu plan

### 💡 Extensiones Futuras

La arquitectura está preparada para:
- **Más idiomas** (fácil agregar nuevas configuraciones)
- **Reconocimiento de voz** (Speech-to-Text)
- **Conversaciones interactivas** bidireccionales
- **Voces personalizadas** específicas para tu marca
- **Integración con chatbots** conversacionales
- **Detección automática de idioma** del usuario

### 📚 Documentación Adicional

- [ElevenLabs API Docs](https://docs.elevenlabs.io/)
- [Voice Settings Guide](https://docs.elevenlabs.io/speech-synthesis/voice-settings)
- [Turbo Models Documentation](https://docs.elevenlabs.io/speech-synthesis/models)
- [Pricing & Limits](https://elevenlabs.io/pricing)
