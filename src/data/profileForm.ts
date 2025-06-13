import { FormStep } from '../types';

export const profileFormSteps: FormStep[] = [
  {
    id: 'business-basics',
    title: 'Información Básica del Negocio',
    fields: [
      {
        id: 'businessType',
        label: '¿Cuál es el tipo principal de tu negocio?',
        type: 'radio',
        required: true,
        options: [
          { value: 'producto-fisico', label: 'Producto Físico' },
          { value: 'servicio-digital', label: 'Servicio Digital (SaaS/Plataforma)' },
          { value: 'contenido-media', label: 'Contenido/Media (Blog, Podcast, YouTube)' },
          { value: 'consultoria-freelance', label: 'Consultoría/Freelance' },
          { value: 'ecommerce-puro', label: 'E-commerce Puro' },
          { value: 'organizacion-no-lucro', label: 'Organización sin fines de lucro' },
          { value: 'otro', label: 'Otro' },
        ],
      },
      {
        id: 'revenueModel',
        label: '¿Cuál es tu modelo de ingresos principal?',
        type: 'radio',
        required: true,
        options: [
          { value: 'b2b', label: 'B2B (Business to Business)' },
          { value: 'b2c', label: 'B2C (Business to Consumer)' },
          { value: 'd2c', label: 'D2C (Direct to Consumer)' },
          { value: 'suscripcion', label: 'Suscripción (Recurring Revenue)' },
          { value: 'transaccional', label: 'Transaccional (One-time purchase)' },
          { value: 'publicidad-afiliacion', label: 'Publicidad/Afiliación' },
          { value: 'hibrido', label: 'Híbrido' },
        ],
      },
    ],
  },
  {
    id: 'business-stage',
    title: 'Etapa y Objetivos',
    fields: [
      {
        id: 'businessStage',
        label: '¿En qué etapa se encuentra tu negocio?',
        type: 'radio',
        required: true,
        options: [
          { value: 'idea-prelanzamiento', label: 'Idea/Pre-lanzamiento' },
          { value: 'startup-temprano', label: 'Startup (crecimiento temprano < 1 año)' },
          { value: 'pyme-crecimiento', label: 'Pyme en Crecimiento (1-5 años)' },
          { value: 'pyme-establecida', label: 'Pyme Establecida (> 5 años)' },
          { value: 'gran-empresa', label: 'Gran Empresa/Corporación' },
        ],
      },
      {
        id: 'mainObjective',
        label: '¿Cuál es tu principal objetivo estratégico?',
        type: 'radio',
        required: true,
        options: [
          { value: 'aumentar-ventas', label: 'Aumentar Ventas e Ingresos' },
          { value: 'optimizar-operaciones', label: 'Optimizar Operaciones y Eficiencia' },
          { value: 'mejorar-experiencia-cliente', label: 'Mejorar Experiencia del Cliente' },
          { value: 'reducir-costos', label: 'Reducir Costos Operativos' },
          { value: 'expansion-mercados', label: 'Expansión a Nuevos Mercados' },
          { value: 'innovacion-producto', label: 'Innovación de Producto/Servicio' },
          { value: 'construccion-marca', label: 'Construcción de Marca/Comunidad' },
        ],
      },
    ],
  },
  {
    id: 'digital-maturity',
    title: 'Madurez Digital y Recursos',
    fields: [
      {
        id: 'digitalizationLevel',
        label: '¿Cuál es tu nivel actual de digitalización?',
        type: 'radio',
        required: true,
        options: [
          { value: 'bajo-manual', label: 'Bajo (mayormente manual)' },
          { value: 'medio-herramientas', label: 'Medio (algunas herramientas)' },
          { value: 'alto-automatizado', label: 'Alto (procesos automatizados, datos)' },
          { value: 'muy-alto-ai', label: 'Muy Alto (AI integrada)' },
        ],
      },
      {
        id: 'employeeCount',
        label: '¿Cuántos empleados tiene tu organización?',
        type: 'select',
        required: true,
        options: [
          { value: '1-5', label: '1-5 empleados' },
          { value: '6-20', label: '6-20 empleados' },
          { value: '21-50', label: '21-50 empleados' },
          { value: '51-200', label: '51-200 empleados' },
          { value: '201-500', label: '201-500 empleados' },
          { value: 'mas-500', label: 'Más de 500 empleados' },
        ],
      },
    ],
  },
];