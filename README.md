# FlowForge AI 🚀

**Tu consultor digital inteligente** - Análisis personalizados y recomendaciones estratégicas impulsadas por IA.

[![Powered by Bolt](https://img.shields.io/badge/Powered%20by-Bolt-blue?style=for-the-badge)](https://bolt.new/)
[![Built with React](https://img.shields.io/badge/Built%20with-React-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

## 🌟 Características

- **Consultoría Modular**: Múltiples módulos especializados para diferentes aspectos empresariales
- **IA Avanzada**: Integración con Google Gemini para análisis inteligentes
- **Interfaz Líquida**: Diseño moderno con efectos visuales fluidos
- **Temas Adaptativos**: Modo claro y oscuro con transiciones suaves
- **Reportes Avanzados**: Generación y exportación de reportes en PDF
- **Base de Datos**: Persistencia con Supabase
- **Responsive**: Optimizado para todos los dispositivos

## 🚀 Despliegue en Netlify

### 1. Preparación
```bash
# Clona el repositorio
git clone <tu-repo>
cd FlowForgeAI

# Instala dependencias
npm install
```

### 2. Variables de Entorno
Configura las siguientes variables en tu dashboard de Netlify:

```
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
VITE_GEMINI_API_KEY=tu_clave_api_de_gemini
```

### 3. Configuración de Build
- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Node version**: `18`

### 4. Deploy
```bash
# Build local para verificar
npm run build

# Deploy automático con git push
git add .
git commit -m "Deploy to production"
git push origin main
```

## 🛠️ Desarrollo Local

```bash
# Instalar dependencias
npm install

# Crear archivo .env basado en env.example
cp env.example .env
# Edita .env con tus credenciales

# Ejecutar en modo desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview
```

## 📋 Requisitos

- Node.js 18+
- NPM o Yarn
- Cuenta de Supabase
- API Key de Google Gemini

## 🏗️ Tecnologías

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS con diseño personalizado
- **Build**: Vite
- **Base de Datos**: Supabase
- **IA**: Google Gemini API
- **Iconos**: Lucide React
- **Charts**: Chart.js
- **PDF**: jsPDF + html2canvas
- **Deploy**: Netlify

## 📁 Estructura del Proyecto

```
FlowForgeAI/
├── public/                 # Assets estáticos
│   ├── favicon.svg
│   ├── white_circle_360x360.png  # Logo Bolt (tema claro)
│   ├── black_circle_360x360.png  # Logo Bolt (tema oscuro)
│   └── _redirects         # Configuración SPA
├── src/
│   ├── components/        # Componentes React
│   ├── config/           # Configuraciones (Supabase, Gemini)
│   ├── data/            # Datos y módulos
│   ├── types/           # Tipos TypeScript
│   └── main.tsx         # Punto de entrada
├── netlify.toml         # Configuración Netlify
├── env.example          # Plantilla variables de entorno
└── package.json
```

## 🎯 Módulos Disponibles

1. **Análisis Financiero** - Evaluación de salud financiera
2. **Optimización de Procesos** - Mejora de eficiencia operativa
3. **Estrategia de Marketing** - Planes de marketing personalizados
4. **Gestión de Recursos Humanos** - Optimización de talento
5. **Transformación Digital** - Modernización tecnológica
6. **Análisis de Mercado** - Estudios competitivos
7. **Gestión de Riesgos** - Identificación y mitigación
8. **Innovación y Desarrollo** - Estrategias de crecimiento

## 🏆 Hackathon Bolt.new

Este proyecto participa en el hackathon de Bolt.new y cumple con múltiples challenge requirements:

### 🎯 Challenges Cumplidos

#### ✅ **Deploy Challenge** - Usando Netlify
- **Requisito**: Use Netlify to deploy your full-stack Bolt.new application
- **Implementación**: 
  - Configuración completa con `netlify.toml` optimizado
  - Headers de seguridad y performance configurados
  - Despliegue automático con CI/CD
  - SPA routing configurado para React
  - Variables de entorno securizadas

#### ✅ **Startup Challenge** - Usando Supabase  
- **Requisito**: Use Supabase to prep your Bolt.new project to scale to millions
- **Implementación**:
  - **Autenticación robusta**: Sistema completo de auth con JWT
  - **Base de datos escalable**: PostgreSQL con Row Level Security (RLS)
  - **Real-time capabilities**: Subscripciones en tiempo real
  - **Schema optimizado**: Índices y triggers para performance
  - **Migraciones versionadas**: Control de cambios de BD
  - **Caché inteligente**: Sistema de caché para optimizar consultas
  - **Políticas de seguridad**: RLS configurado para protección de datos

### 🚀 Challenges Implementables (Extensiones Futuras)

#### 🎤 **Voice AI Challenge** - ElevenLabs Integration
- **Potencial**: Convertir reportes a audio narrado
- **Implementación sugerida**: 
  - Narración automática de análisis generados
  - Interfaz de voz para input de consultas
  - Resúmenes ejecutivos en audio

#### 🌐 **Custom Domain Challenge** - Entri/IONOS Domain
- **Potencial**: Domain personalizado para marca profesional
- **Sugerencias**: 
  - `flowforge-ai.com` o similar
  - SSL automático con Netlify
  - Redirects y subdominios configurados

#### 🎥 **Conversational AI Video Challenge** - Tavus Integration
- **Potencial**: Agentes de video AI para consultoría
- **Implementación sugerida**:
  - Avatar AI personalizable para presentar reportes
  - Sesiones de consultoría interactivas en video
  - Onboarding con guía de video personalizada

### 📋 Requisitos Base Cumplidos
- ✅ Badge "Powered by Bolt" visible en todas las pantallas
- ✅ Enlace funcional a https://bolt.new/
- ✅ Responsive design para todos los dispositivos
- ✅ Deploy público funcional en Netlify
- ✅ Código fuente accesible

### 💡 Arquitectura Preparada para Escala
**FlowForge AI** está diseñado desde el inicio para escalar a millones de usuarios:

- **Database Sharding Ready**: Schema optimizado con índices estratégicos
- **Serverless Architecture**: Integración con Supabase Edge Functions
- **CDN Integration**: Assets optimizados con caché global
- **API Rate Limiting**: Protección contra abuse con throttling
- **Real-time Analytics**: Tracking de métricas para optimización
- **Horizontal Scaling**: Arquitectura stateless preparada para load balancing

## 📄 Licencia

MIT License - ver [LICENSE](LICENSE) para más detalles.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

---

**Desarrollado con ❤️ usando [Bolt.new](https://bolt.new/)**