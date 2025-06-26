# FlowForge AI 🚀

**Tu consultor digital inteligente** - Análisis empresariales personalizados y recomendaciones estratégicas impulsadas por IA.

[![Powered by Bolt](https://img.shields.io/badge/Powered%20by-Bolt-blue?style=for-the-badge)](https://bolt.new/)
[![Built with React](https://img.shields.io/badge/Built%20with-React-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

## 🌟 Características

- **Consultoría Empresarial Modular**: Accede a 9 módulos especializados que cubren todos los aspectos críticos de tu negocio
- **IA Avanzada**: Integración con Google Gemini para análisis estratégicos de nivel consultoría
- **Interfaz Líquida**: Diseño moderno con efectos visuales fluidos y experiencia de usuario premium
- **Multilingüe**: Soporte completo para español e inglés en toda la aplicación
- **Asistente por Voz**: Interactúa con la aplicación mediante comandos de voz en ambos idiomas
- **Reportes Profesionales**: Generación y exportación de reportes detallados en PDF
- **Perfil Empresarial**: Análisis adaptados a tu tipo de negocio, etapa y objetivos específicos
- **Base de Datos Segura**: Persistencia con Supabase y políticas de seguridad avanzadas
- **Diseño Responsivo**: Experiencia optimizada en dispositivos móviles, tablets y escritorio

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
VITE_ELEVENLABS_API_KEY=tu_clave_api_de_elevenlabs (opcional para asistente de voz)
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
git commit -m "Deploy a producción"
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
- API Key de ElevenLabs (opcional para funcionalidades de voz)

## 🏗️ Tecnologías

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS con diseño personalizado
- **Build**: Vite
- **Base de Datos**: Supabase
- **IA**: Google Gemini API
- **Voz**: ElevenLabs API
- **Iconos**: Lucide React
- **Gráficos**: Chart.js
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
│   ├── config/           # Configuraciones (Supabase, Gemini, Idiomas)
│   ├── containers/       # Contenedores de estado
│   ├── data/            # Datos y módulos
│   ├── pages/           # Páginas principales
│   ├── services/        # Servicios (auth, perfiles, reportes)
│   ├── types/           # Tipos TypeScript
│   ├── utils/           # Utilidades y helpers
│   └── main.tsx         # Punto de entrada
├── netlify.toml         # Configuración Netlify
├── env.example          # Plantilla variables de entorno
└── package.json
```

## 🎯 Módulos de Consultoría Disponibles

1. **Transformación Digital Integral** - Estrategia holística de digitalización y optimización organizacional
2. **Growth Marketing & Automatización** - Estrategias data-driven para crecimiento y conversión
3. **Automatización ventas & CRM** - Optimización de pipeline y automatización comercial
4. **FinTech & Control de Gestión** - Automatización financiera y business intelligence
5. **Analítica de personal & HR Tech** - Gestión inteligente de talento y cultura organizacional
6. **Experiencia & soporte al cliente** - Automatización de soporte y optimización de CX
7. **Estrategia de contenidos & SEO** - Ecosistemas de contenido y marketing de autoridad
8. **Administración de producto & Crecimiento** - Desarrollo ágil y product-led growth strategies
9. **Innovación & Desarrollo Tecnológico** - Metodologías de innovación y desarrollo tecnológico

## 🌍 Soporte Multilingüe

FlowForge AI ofrece una experiencia completamente bilingüe:

- **Español e Inglés** soportados en toda la aplicación
- Selector de idioma integrado en el menú de usuario (tres puntos en esquina superior derecha)
- El asistente de voz soporta ambos idiomas con múltiples opciones de voces
- Todos los elementos de la interfaz se traducen automáticamente
- La preferencia de idioma se guarda en el almacenamiento local del navegador

El sistema de idiomas está construido con React Context API que proporciona:
- Una función de traducción `t(section, key)` para obtener texto en el idioma actual
- Un setter de idioma para cambiar el idioma de la aplicación
- Sincronización automática entre el idioma de la interfaz y el asistente de voz

Las interacciones por voz también son compatibles con el idioma seleccionado, con el sistema de reconocimiento de voz utilizando automáticamente la configuración de idioma correcta.

## 🏆 Hackathon Bolt.new

Este proyecto participa en el hackathon de Bolt.new y cumple con múltiples requisitos del desafío:

### 🎯 Desafíos Implementados

#### ✅ **Deploy Challenge** - Usando Netlify
- **Requisito**: Usar Netlify para desplegar tu aplicación Bolt.new full-stack
- **Implementación**: 
  - Configuración completa con `netlify.toml` optimizado
  - Headers de seguridad y rendimiento configurados
  - Despliegue automático con CI/CD
  - Routing SPA configurado para React
  - Variables de entorno securizadas

#### ✅ **Startup Challenge** - Usando Supabase  
- **Requisito**: Usar Supabase para preparar tu proyecto Bolt.new para escalar a millones
- **Implementación**:
  - **Autenticación robusta**: Sistema completo de auth con JWT
  - **Base de datos escalable**: PostgreSQL con Row Level Security (RLS)
  - **Capacidades en tiempo real**: Subscripciones en tiempo real
  - **Schema optimizado**: Índices y triggers para rendimiento
  - **Migraciones versionadas**: Control de cambios de BD
  - **Caché inteligente**: Sistema de caché para optimizar consultas
  - **Políticas de seguridad**: RLS configurado para protección de datos

### 📋 Requisitos Base Cumplidos
- ✅ Badge "Powered by Bolt" visible en todas las pantallas
- ✅ Enlace funcional a https://bolt.new/
- ✅ Diseño responsivo para todos los dispositivos
- ✅ Deploy público funcional en Netlify
- ✅ Código fuente accesible

### 💡 Arquitectura Preparada para Escala
**FlowForge AI** está diseñado desde el inicio para escalar a millones de usuarios:

- **Database Sharding Ready**: Schema optimizado con índices estratégicos
- **Arquitectura Serverless**: Integración con Supabase Edge Functions
- **Integración CDN**: Assets optimizados con caché global
- **API Rate Limiting**: Protección contra abusos con throttling
- **Analíticas en tiempo real**: Seguimiento de métricas para optimización
- **Escalado Horizontal**: Arquitectura stateless preparada para balanceo de carga

## 📄 Licencia

MIT License - ver [LICENSE](LICENSE) para más detalles.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Haz fork del proyecto
2. Crea una rama para tu funcionalidad
3. Haz commit de tus cambios
4. Push a la rama
5. Abre un Pull Request

---

**Desarrollado con ❤️ usando [Bolt.new](https://bolt.new/)**