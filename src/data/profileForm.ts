import { FormStep } from '../types';

export const profileFormSteps: FormStep[] = [
  {
    id: 'business-basics',
    title: {
      en: 'Business Basic Information',
      es: 'Información Básica del Negocio'
    },
    fields: [
      {
        id: 'businessType',
        label: {
          en: 'What is the main type of your business?',
          es: '¿Cuál es el tipo principal de tu negocio?'
        },
        type: 'radio',
        required: true,
        options: [
          { 
            value: 'producto-fisico', 
            label: {
              en: 'Physical Product',
              es: 'Producto Físico'
            }
          },
          { 
            value: 'servicio-digital', 
            label: {
              en: 'Digital Service (SaaS/Platform)',
              es: 'Servicio Digital (SaaS/Plataforma)'
            }
          },
          { 
            value: 'contenido-media', 
            label: {
              en: 'Content/Media (Blog, Podcast, YouTube)',
              es: 'Contenido/Media (Blog, Podcast, YouTube)'
            }
          },
          { 
            value: 'consultoria-freelance', 
            label: {
              en: 'Consulting/Freelance',
              es: 'Consultoría/Freelance'
            }
          },
          { 
            value: 'ecommerce-puro', 
            label: {
              en: 'Pure E-commerce',
              es: 'E-commerce Puro'
            }
          },
          { 
            value: 'organizacion-no-lucro', 
            label: {
              en: 'Non-profit Organization',
              es: 'Organización sin fines de lucro'
            }
          },
          { 
            value: 'otro', 
            label: {
              en: 'Other',
              es: 'Otro'
            }
          },
        ],
      },
      {
        id: 'revenueModel',
        label: {
          en: 'What is your main revenue model?',
          es: '¿Cuál es tu modelo de ingresos principal?'
        },
        type: 'radio',
        required: true,
        options: [
          { 
            value: 'b2b', 
            label: {
              en: 'B2B (Business to Business)',
              es: 'B2B (Business to Business)'
            }
          },
          { 
            value: 'b2c', 
            label: {
              en: 'B2C (Business to Consumer)',
              es: 'B2C (Business to Consumer)'
            }
          },
          { 
            value: 'd2c', 
            label: {
              en: 'D2C (Direct to Consumer)',
              es: 'D2C (Direct to Consumer)'
            }
          },
          { 
            value: 'suscripcion', 
            label: {
              en: 'Subscription (Recurring Revenue)',
              es: 'Suscripción (Recurring Revenue)'
            }
          },
          { 
            value: 'transaccional', 
            label: {
              en: 'Transactional (One-time purchase)',
              es: 'Transaccional (One-time purchase)'
            }
          },
          { 
            value: 'publicidad-afiliacion', 
            label: {
              en: 'Advertising/Affiliation',
              es: 'Publicidad/Afiliación'
            }
          },
          { 
            value: 'hibrido', 
            label: {
              en: 'Hybrid',
              es: 'Híbrido'
            }
          },
        ],
      },
    ],
  },
  {
    id: 'business-stage',
    title: {
      en: 'Stage and Objectives',
      es: 'Etapa y Objetivos'
    },
    fields: [
      {
        id: 'businessStage',
        label: {
          en: 'What stage is your business in?',
          es: '¿En qué etapa se encuentra tu negocio?'
        },
        type: 'radio',
        required: true,
        options: [
          { 
            value: 'idea-prelanzamiento', 
            label: {
              en: 'Idea/Pre-launch',
              es: 'Idea/Pre-lanzamiento'
            }
          },
          { 
            value: 'startup-temprano', 
            label: {
              en: 'Startup (early growth < 1 year)',
              es: 'Startup (crecimiento temprano < 1 año)'
            }
          },
          { 
            value: 'pyme-crecimiento', 
            label: {
              en: 'Growing SME (1-5 years)',
              es: 'Pyme en Crecimiento (1-5 años)'
            }
          },
          { 
            value: 'pyme-establecida', 
            label: {
              en: 'Established SME (> 5 years)',
              es: 'Pyme Establecida (> 5 años)'
            }
          },
          { 
            value: 'gran-empresa', 
            label: {
              en: 'Large Enterprise/Corporation',
              es: 'Gran Empresa/Corporación'
            }
          },
        ],
      },
      {
        id: 'mainObjective',
        label: {
          en: 'What is your main strategic objective?',
          es: '¿Cuál es tu principal objetivo estratégico?'
        },
        type: 'radio',
        required: true,
        options: [
          { 
            value: 'aumentar-ventas', 
            label: {
              en: 'Increase Sales and Revenue',
              es: 'Aumentar Ventas e Ingresos'
            }
          },
          { 
            value: 'optimizar-operaciones', 
            label: {
              en: 'Optimize Operations and Efficiency',
              es: 'Optimizar Operaciones y Eficiencia'
            }
          },
          { 
            value: 'mejorar-experiencia-cliente', 
            label: {
              en: 'Improve Customer Experience',
              es: 'Mejorar Experiencia del Cliente'
            }
          },
          { 
            value: 'reducir-costos', 
            label: {
              en: 'Reduce Operational Costs',
              es: 'Reducir Costos Operativos'
            }
          },
          { 
            value: 'expansion-mercados', 
            label: {
              en: 'Expansion to New Markets',
              es: 'Expansión a Nuevos Mercados'
            }
          },
          { 
            value: 'innovacion-producto', 
            label: {
              en: 'Product/Service Innovation',
              es: 'Innovación de Producto/Servicio'
            }
          },
          { 
            value: 'construccion-marca', 
            label: {
              en: 'Brand/Community Building',
              es: 'Construcción de Marca/Comunidad'
            }
          },
        ],
      },
    ],
  },
  {
    id: 'digital-maturity',
    title: {
      en: 'Digital Maturity and Resources',
      es: 'Madurez Digital y Recursos'
    },
    fields: [
      {
        id: 'digitalizationLevel',
        label: {
          en: 'What is your current level of digitalization?',
          es: '¿Cuál es tu nivel actual de digitalización?'
        },
        type: 'radio',
        required: true,
        options: [
          { 
            value: 'bajo-manual', 
            label: {
              en: 'Low (mostly manual)',
              es: 'Bajo (mayormente manual)'
            }
          },
          { 
            value: 'medio-herramientas', 
            label: {
              en: 'Medium (some tools)',
              es: 'Medio (algunas herramientas)'
            }
          },
          { 
            value: 'alto-automatizado', 
            label: {
              en: 'High (automated processes, data)',
              es: 'Alto (procesos automatizados, datos)'
            }
          },
          { 
            value: 'muy-alto-ai', 
            label: {
              en: 'Very High (AI integrated)',
              es: 'Muy Alto (AI integrada)'
            }
          },
        ],
      },
      {
        id: 'employeeCount',
        label: {
          en: 'How many employees does your organization have?',
          es: '¿Cuántos empleados tiene tu organización?'
        },
        type: 'select',
        required: true,
        options: [
          { 
            value: '1-5', 
            label: {
              en: '1-5 employees',
              es: '1-5 empleados'
            }
          },
          { 
            value: '6-20', 
            label: {
              en: '6-20 employees',
              es: '6-20 empleados'
            }
          },
          { 
            value: '21-50', 
            label: {
              en: '21-50 employees',
              es: '21-50 empleados'
            }
          },
          { 
            value: '51-200', 
            label: {
              en: '51-200 employees',
              es: '51-200 empleados'
            }
          },
          { 
            value: '201-500', 
            label: {
              en: '201-500 employees',
              es: '201-500 empleados'
            }
          },
          { 
            value: 'mas-500', 
            label: {
              en: 'More than 500 employees',
              es: 'Más de 500 empleados'
            }
          },
        ],
      },
    ],
  },
];