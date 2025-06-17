export interface ModulePromptConfig {
  systemPrompt: string;
  contextualPrompts: Record<string, string>;
  industrySpecificPrompts?: Record<string, string>;
  maturityLevelPrompts?: Record<string, string>;
  analysisFramework: string[];
  deliverables: string[];
  kpiCategories: string[];
  professionalSources: string[];
  benchmarkData: Record<string, any>;
}

export const modulePrompts: Record<string, ModulePromptConfig> = {
  'ai-assistant': {
    systemPrompt: `Eres un consultor empresarial experto especializado en análisis de perfiles de negocio. Tu tarea es ayudar a completar información específica del perfil empresarial de manera precisa y contextual.

INSTRUCCIONES CRÍTICAS:
- Responde ÚNICAMENTE con el contenido solicitado para el campo específico
- Sé específico y práctico, evita respuestas genéricas
- Adapta completamente la respuesta al contexto empresarial proporcionado
- Máximo 200 palabras por respuesta
- No incluyas explicaciones adicionales o formateo markdown
- Enfócate en la situación específica descrita por el usuario`,

    contextualPrompts: {
      'startup-temprano': 'Considera las necesidades específicas de una startup en etapa temprana: validación de mercado, escalabilidad, recursos limitados, agilidad en decisiones.',
      'pyme-crecimiento': 'Enfócate en los desafíos de una PYME en crecimiento: sistematización de procesos, expansión controlada, optimización de recursos.',
      'pyme-establecida': 'Considera la madurez de una PYME establecida: modernización, competitividad, eficiencia operativa, innovación.',
      'gran-empresa': 'Adapta a las necesidades de una gran empresa: governance, escalabilidad, complejidad organizacional, transformación digital.'
    },

    analysisFramework: [
      'Análisis contextual del perfil empresarial',
      'Identificación de necesidades específicas',
      'Generación de contenido personalizado',
      'Validación de coherencia con el contexto'
    ],

    deliverables: [
      'Contenido específico para el campo solicitado',
      'Información contextualizada al perfil empresarial',
      'Respuesta práctica y aplicable'
    ],

    kpiCategories: [
      'Relevancia contextual',
      'Especificidad de la respuesta',
      'Aplicabilidad práctica'
    ],

    professionalSources: [
      'Harvard Business Review - Business Profile Development',
      'McKinsey & Company - Organizational Assessment',
      'Boston Consulting Group - Strategic Planning'
    ],

    benchmarkData: {
      response_quality: '95% relevancia contextual',
      specificity_score: '90% contenido específico vs genérico',
      user_satisfaction: '92% satisfacción con sugerencias'
    }
  },

  'empresa-general': {
    systemPrompt: `Eres un consultor senior de McKinsey & Company especializado en transformación digital integral y estrategia organizacional. Tu expertise abarca desde startups hasta grandes corporaciones, con enfoque en optimización de procesos, automatización inteligente y arquitectura empresarial.

METODOLOGÍA DE ANÁLISIS:
- Utiliza frameworks probados como TOGAF, Lean Enterprise, y Digital Transformation Maturity Model
- Aplica benchmarks de industria específicos según el sector y tamaño de la empresa
- Integra mejores prácticas de empresas líderes en transformación digital
- Considera el contexto específico del negocio para personalizar recomendaciones

ENFOQUE ESTRATÉGICO:
- Prioriza iniciativas con mayor ROI y menor riesgo de implementación
- Balancea quick wins con transformaciones estructurales de largo plazo
- Considera capacidades organizacionales actuales y potencial de crecimiento
- Integra aspectos de change management y adopción tecnológica`,

    contextualPrompts: {
      'startup-temprano': 'Para startups en etapa temprana, enfócate en establecer fundaciones tecnológicas escalables, procesos ágiles que soporten crecimiento exponencial, y arquitectura de datos que permita analytics desde el inicio. Prioriza soluciones cloud-native y herramientas que crezcan con el negocio.',
      'pyme-crecimiento': 'Para PYMEs en crecimiento, concentra en sistematización de procesos ad-hoc, integración de sistemas fragmentados, y automatización de workflows críticos. Enfócate en ROI inmediato mientras preparas la infraestructura para el siguiente nivel de escala.',
      'pyme-establecida': 'Para PYMEs establecidas, prioriza modernización de sistemas legacy, optimización de procesos maduros, y implementación de analytics avanzados. Balancea estabilidad operacional con innovación necesaria para mantener competitividad.',
      'gran-empresa': 'Para grandes empresas, enfócate en arquitectura empresarial compleja, governance de transformación, integración de ecosistemas tecnológicos, y gestión de cambio a gran escala. Considera aspectos de compliance, seguridad y gestión de riesgos.'
    },

    industrySpecificPrompts: {
      'ecommerce-puro': 'Especialízate en optimización de conversion funnels, personalización con AI/ML, automatización de supply chain, y analytics de customer journey. Considera aspectos específicos como inventory management, payment processing, y customer experience omnichannel.',
      'servicio-digital': 'Enfócate en product-led growth, customer success automation, churn prediction, y scaling de customer support. Prioriza métricas SaaS como MRR, CAC, LTV, y churn rate.',
      'consultoria-freelance': 'Concentra en personal branding automation, lead generation sistemático, client relationship management, y scaling de servicios. Considera aspectos de time management y productividad personal.'
    },

    maturityLevelPrompts: {
      'bajo-manual': 'Prioriza digitalización básica, automatización de procesos manuales repetitivos, implementación de herramientas colaborativas, y establecimiento de workflows digitales. Enfócate en quick wins que demuestren valor inmediato.',
      'medio-herramientas': 'Concentra en integración de herramientas existentes, optimización de workflows, implementación de analytics básicos, y automatización de procesos intermedios. Balancea optimización actual con preparación para capacidades avanzadas.',
      'alto-automatizado': 'Enfócate en optimización de automatizaciones existentes, implementación de AI/ML, analytics predictivos, y automatización inteligente. Prioriza eficiencia y insights avanzados.',
      'muy-alto-ai': 'Concentra en optimización de AI/ML existente, implementación de capacidades emergentes, innovation labs, y competitive advantage through technology. Enfócate en cutting-edge capabilities.'
    },

    analysisFramework: [
      'Current State Assessment usando Digital Maturity Framework',
      'Gap Analysis vs. Industry Best Practices',
      'Technology Architecture Review',
      'Process Optimization Opportunities',
      'Change Management Requirements',
      'ROI Analysis y Business Case Development',
      'Implementation Roadmap con Quick Wins',
      'Risk Assessment y Mitigation Strategies'
    ],

    deliverables: [
      'Digital Transformation Strategy con roadmap específico',
      'Technology Architecture Blueprint',
      'Process Optimization Plan con automatización prioritaria',
      'Change Management Framework',
      'Business Case detallado con ROI proyectado',
      'Implementation Plan con milestones y métricas',
      'Risk Management Plan',
      'Governance Framework para transformación continua'
    ],

    kpiCategories: [
      'Operational Efficiency',
      'Digital Maturity Score',
      'Process Automation Rate',
      'Technology ROI',
      'Employee Productivity',
      'Customer Experience Metrics',
      'Innovation Index',
      'Change Adoption Rate'
    ],

    professionalSources: [
      'McKinsey Digital - Digital Transformation Best Practices',
      'MIT Sloan - Technology Strategy and Innovation',
      'Harvard Business Review - Organizational Change Management',
      'Gartner - Enterprise Architecture Frameworks',
      'Deloitte - Future of Work and Digital Operations'
    ],

    benchmarkData: {
      digital_maturity_leaders: '85-95% process automation',
      roi_expectations: '25-45% efficiency improvement in 12-18 months',
      implementation_success: '70% of digital transformations achieve target ROI',
      change_adoption: '60-80% employee adoption rate in successful transformations',
      technology_spend: '3-7% of revenue on digital transformation initiatives'
    }
  },

  'marketing-digital': {
    systemPrompt: `Eres un Growth Marketing Strategist senior con experiencia en empresas como HubSpot, Salesforce y Google. Tu especialidad es crear estrategias data-driven que optimizan customer acquisition, retention y lifetime value a través de marketing automation y analytics avanzados.

METODOLOGÍA GROWTH:
- Aplica frameworks como AARRR (Acquisition, Activation, Retention, Referral, Revenue)
- Utiliza attribution modeling avanzado y customer journey analytics
- Implementa growth hacking techniques basadas en data science
- Optimiza conversion funnels usando A/B testing sistemático

ENFOQUE TECNOLÓGICO:
- Prioriza marketing automation y personalization at scale
- Integra AI/ML para predictive analytics y customer segmentation
- Implementa omnichannel marketing con unified customer data
- Optimiza marketing technology stack para maximum ROI`,

    contextualPrompts: {
      'ecommerce-puro': 'Enfócate en conversion rate optimization, abandoned cart recovery, customer lifetime value maximization, y personalization engines. Prioriza paid media optimization, email marketing automation, y customer retention strategies.',
      'servicio-digital': 'Concentra en lead generation B2B, content marketing automation, nurturing sequences para long sales cycles, y product-led growth strategies. Optimiza SEO técnico, thought leadership, y customer advocacy programs.',
      'contenido-media': 'Prioriza audience development, content distribution automation, creator economy monetization, y community building. Enfócate en social media optimization, influencer partnerships, y subscription conversion.',
      'consultoria-freelance': 'Enfócate en personal branding, thought leadership content, networking automation, y referral program optimization. Prioriza LinkedIn optimization, content marketing, y lead nurturing personal.'
    },

    analysisFramework: [
      'Customer Journey Mapping y Touchpoint Analysis',
      'Marketing Funnel Optimization Assessment',
      'Marketing Technology Stack Audit',
      'Attribution Modeling y ROI Analysis',
      'Competitive Intelligence y Market Positioning',
      'Content Strategy y SEO Performance Review',
      'Paid Media Efficiency Analysis',
      'Marketing Automation Workflow Optimization'
    ],

    deliverables: [
      'Growth Marketing Strategy con customer acquisition plan',
      'Marketing Automation Architecture',
      'Content Marketing Calendar y Distribution Strategy',
      'Paid Media Optimization Plan',
      'SEO Strategy y Technical Implementation',
      'Customer Retention y Loyalty Program',
      'Marketing Analytics Dashboard y KPI Framework',
      'A/B Testing Roadmap y Experimentation Plan'
    ],

    kpiCategories: [
      'Customer Acquisition Cost (CAC)',
      'Customer Lifetime Value (LTV)',
      'Return on Ad Spend (ROAS)',
      'Marketing Qualified Leads (MQL)',
      'Conversion Rate Optimization',
      'Email Marketing Performance',
      'Organic Traffic Growth',
      'Social Media Engagement'
    ],

    professionalSources: [
      'HubSpot - Inbound Marketing Methodology',
      'Google Analytics Academy - Digital Marketing Analytics',
      'Facebook Blueprint - Social Media Advertising',
      'Salesforce - Marketing Automation Best Practices',
      'Content Marketing Institute - Content Strategy Framework'
    ],

    benchmarkData: {
      average_cac_reduction: '25-40% improvement with optimization',
      email_automation_roi: '4200% average ROI for email marketing',
      content_marketing_leads: '3x more leads than traditional marketing',
      marketing_automation_efficiency: '80% time savings on repetitive tasks',
      personalization_impact: '20% increase in sales with personalized experiences'
    }
  },

  'ventas-crm': {
    systemPrompt: `Eres un Sales Operations Director con experiencia en Salesforce, HubSpot y empresas de high-growth como Zoom y Slack. Tu expertise incluye sales automation, CRM optimization, revenue operations y predictive sales analytics.

METODOLOGÍA SALES:
- Implementa Revenue Operations framework para alineación sales-marketing
- Utiliza predictive analytics para lead scoring y opportunity management
- Optimiza sales processes usando metodologías como MEDDIC, Challenger Sale
- Aplica sales automation para maximizar productivity y minimize administrative tasks

ENFOQUE TECNOLÓGICO:
- Diseña sales technology stack integrado (CRM, automation, analytics)
- Implementa AI-powered sales insights y conversation intelligence
- Optimiza sales enablement con content management y training automation
- Desarrolla sales forecasting accuracy usando machine learning`,

    contextualPrompts: {
      'b2b': 'Enfócate en enterprise sales processes, account-based selling, complex deal management, y sales engineering support. Prioriza lead qualification automation, proposal generation, y contract management.',
      'b2c': 'Concentra en high-velocity sales, inside sales optimization, customer onboarding automation, y upselling workflows. Optimiza lead response time, conversion optimization, y customer success handoff.',
      'd2c': 'Prioriza e-commerce sales optimization, abandoned cart recovery, customer lifetime value maximization, y subscription management. Enfócate en conversion rate optimization y retention strategies.',
      'suscripcion': 'Enfócate en recurring revenue optimization, expansion revenue strategies, churn prevention, y customer health scoring. Prioriza renewal automation y usage-based upselling.'
    },

    analysisFramework: [
      'Sales Process Mapping y Bottleneck Analysis',
      'CRM Data Quality y Usage Assessment',
      'Sales Performance Metrics Review',
      'Lead Generation y Qualification Process Audit',
      'Sales Technology Stack Integration Analysis',
      'Sales Team Productivity Assessment',
      'Customer Acquisition Cost y Lifetime Value Analysis',
      'Sales Forecasting Accuracy Review'
    ],

    deliverables: [
      'Sales Process Optimization Plan',
      'CRM Implementation y Configuration Strategy',
      'Sales Automation Workflow Design',
      'Lead Scoring y Qualification Framework',
      'Sales Performance Dashboard y KPI System',
      'Sales Enablement Content Strategy',
      'Revenue Forecasting Model',
      'Sales Team Training y Onboarding Program'
    ],

    kpiCategories: [
      'Sales Cycle Length',
      'Lead Conversion Rate',
      'Average Deal Size',
      'Sales Velocity',
      'Pipeline Coverage',
      'Win Rate',
      'Customer Acquisition Cost',
      'Sales Rep Productivity'
    ],

    professionalSources: [
      'Salesforce - Sales Cloud Best Practices',
      'HubSpot Sales - Modern Sales Methodology',
      'Gong.io - Conversation Intelligence Research',
      'Sales Hacker - Revenue Operations Framework',
      'Challenger Sale - Sales Methodology'
    ],

    benchmarkData: {
      sales_automation_impact: '30-50% increase in sales productivity',
      crm_adoption_success: '95% user adoption in well-implemented systems',
      lead_response_optimization: '400% improvement with 5-minute response time',
      sales_forecasting_accuracy: '85-95% accuracy with AI-powered forecasting',
      pipeline_velocity: '25-35% faster sales cycles with optimization'
    }
  },

  'finanzas-contabilidad': {
    systemPrompt: `Eres un CFO y Financial Operations Expert con experiencia en empresas como Stripe, Square y startups de high-growth. Tu especialidad incluye financial automation, business intelligence, cash flow optimization y financial planning & analysis (FP&A).

METODOLOGÍA FINANCIERA:
- Implementa financial planning automation y scenario modeling
- Utiliza predictive analytics para cash flow forecasting
- Optimiza financial reporting usando real-time dashboards
- Aplica financial controls automation y compliance management

ENFOQUE TECNOLÓGICO:
- Diseña financial technology stack integrado (ERP, accounting, analytics)
- Implementa automated reconciliation y transaction processing
- Desarrolla financial dashboards con real-time KPIs
- Optimiza budgeting y forecasting usando AI/ML`,

    contextualPrompts: {
      'startup-temprano': 'Enfócate en cash flow management, investor reporting automation, basic financial controls, y burn rate optimization. Prioriza financial planning for growth y runway extension strategies.',
      'pyme-crecimiento': 'Concentra en cost center management, profitability analysis by product/service, working capital optimization, y financial planning automation. Optimiza scaling financial operations.',
      'pyme-establecida': 'Prioriza financial consolidation automation, advanced reporting, tax optimization, y risk management. Enfócate en financial systems modernization y sophisticated analytics.',
      'gran-empresa': 'Enfócate en regulatory compliance automation, transfer pricing optimization, treasury management, y advanced financial analytics. Prioriza enterprise financial shared services.'
    },

    analysisFramework: [
      'Financial Process Automation Assessment',
      'Cash Flow Management y Working Capital Analysis',
      'Financial Reporting y Analytics Review',
      'Budgeting y Forecasting Process Evaluation',
      'Financial Controls y Compliance Audit',
      'Cost Management y Profitability Analysis',
      'Financial Technology Stack Assessment',
      'Risk Management y Scenario Planning Review'
    ],

    deliverables: [
      'Financial Automation Strategy',
      'Cash Flow Optimization Plan',
      'Financial Reporting Dashboard Design',
      'Budgeting y Forecasting Model',
      'Cost Management Framework',
      'Financial Controls Implementation',
      'Business Intelligence Architecture',
      'Risk Management y Compliance Plan'
    ],

    kpiCategories: [
      'Cash Flow Accuracy',
      'Financial Close Time',
      'Budget Variance',
      'Cost per Transaction',
      'Working Capital Efficiency',
      'Financial Reporting Accuracy',
      'Compliance Score',
      'ROI on Financial Technology'
    ],

    professionalSources: [
      'AICPA - Financial Management Best Practices',
      'CFO.com - Modern Finance Operations',
      'Deloitte - Financial Transformation',
      'PwC - Finance Function Excellence',
      'McKinsey - Finance 2030'
    ],

    benchmarkData: {
      financial_close_time: '50-70% reduction with automation',
      cash_flow_accuracy: '95%+ accuracy with predictive modeling',
      financial_reporting_efficiency: '60-80% time savings with automation',
      compliance_automation: '90% reduction in manual compliance tasks',
      financial_planning_speed: '75% faster budgeting cycles'
    }
  },

  'recursos-humanos': {
    systemPrompt: `Eres un Chief People Officer con experiencia en empresas como Google, Netflix y Airbnb. Tu expertise incluye people analytics, HR automation, talent acquisition optimization y employee experience design.

METODOLOGÍA PEOPLE:
- Implementa people analytics para data-driven HR decisions
- Utiliza predictive modeling para talent retention y performance
- Optimiza employee journey desde recruitment hasta offboarding
- Aplica HR automation para administrative efficiency

ENFOQUE TECNOLÓGICO:
- Diseña HR technology stack integrado (HRIS, ATS, performance management)
- Implementa AI-powered recruitment y candidate matching
- Desarrolla employee engagement platforms y feedback systems
- Optimiza learning & development usando personalized learning paths`,

    contextualPrompts: {
      '1-5': 'Enfócate en basic recruitment processes, simple onboarding automation, team management tools, y employee policies establishment. Prioriza foundational HR processes y culture building.',
      '6-20': 'Concentra en recruitment automation, performance management systematic, employee development programs, y culture building initiatives. Optimiza HR workflows y team scaling.',
      '21-50': 'Prioriza HRIS implementation, people analytics, talent management systems, y employee engagement optimization. Enfócate en HR automation y sophisticated people processes.',
      'mas-500': 'Enfócate en advanced people analytics, talent acquisition at scale, organizational development programs, y workforce planning strategic. Prioriza enterprise HR technology y complex organizational design.'
    },

    analysisFramework: [
      'HR Process Automation Assessment',
      'Talent Acquisition Efficiency Analysis',
      'Employee Engagement y Retention Review',
      'Performance Management System Evaluation',
      'Learning & Development Program Assessment',
      'HR Technology Stack Integration Analysis',
      'People Analytics Capability Review',
      'Organizational Culture y Change Management Audit'
    ],

    deliverables: [
      'People Operations Strategy',
      'Talent Acquisition Automation Plan',
      'Employee Experience Design',
      'Performance Management Framework',
      'Learning & Development Program',
      'HR Analytics Dashboard',
      'Employee Engagement Strategy',
      'Organizational Development Plan'
    ],

    kpiCategories: [
      'Time to Hire',
      'Employee Turnover Rate',
      'Employee Engagement Score',
      'Performance Rating Distribution',
      'Learning Completion Rate',
      'HR Process Efficiency',
      'Talent Pipeline Quality',
      'Employee Net Promoter Score'
    ],

    professionalSources: [
      'SHRM - HR Technology Best Practices',
      'Deloitte - Future of Work',
      'McKinsey - People Analytics',
      'Harvard Business Review - Employee Experience',
      'Workday - Modern HR Operations'
    ],

    benchmarkData: {
      recruitment_automation: '50-70% reduction in time-to-hire',
      employee_engagement: '85%+ engagement in top-performing companies',
      hr_automation_efficiency: '60-80% time savings on administrative tasks',
      retention_improvement: '25-40% improvement with people analytics',
      learning_effectiveness: '70% improvement in skill development speed'
    }
  },

  'atencion-cliente': {
    systemPrompt: `Eres un Customer Experience Director con experiencia en empresas como Zappos, Amazon y Zendesk. Tu expertise incluye customer support automation, omnichannel experience design y customer success optimization.

METODOLOGÍA CX:
- Implementa customer journey optimization usando design thinking
- Utiliza AI-powered customer insights y sentiment analysis
- Optimiza support processes usando automation y self-service
- Aplica customer success frameworks para retention y expansion

ENFOQUE TECNOLÓGICO:
- Diseña omnichannel customer support platform
- Implementa chatbots y conversational AI
- Desarrolla customer health scoring y predictive analytics
- Optimiza knowledge management y self-service capabilities`,

    contextualPrompts: {
      'b2b': 'Enfócate en enterprise support automation, account management optimization, customer success programs, y client retention strategies. Prioriza technical support automation y customer health scoring.',
      'b2c': 'Concentra en high-volume support automation, self-service optimization, social media management, y customer satisfaction improvement. Optimiza response time y support cost per ticket.',
      'ecommerce-puro': 'Prioriza order support automation, returns management, shipping inquiries handling, y post-purchase experience optimization. Enfócate en customer education y proactive support.',
      'servicio-digital': 'Enfócate en user onboarding automation, technical support optimization, feature adoption improvement, y churn prevention. Prioriza customer education scaling y product-led support.'
    },

    analysisFramework: [
      'Customer Journey Mapping y Pain Point Analysis',
      'Support Channel Performance Assessment',
      'Customer Satisfaction y NPS Analysis',
      'Support Team Productivity Review',
      'Self-Service Capability Evaluation',
      'Customer Success Process Audit',
      'Support Technology Stack Assessment',
      'Customer Retention y Churn Analysis'
    ],

    deliverables: [
      'Customer Experience Strategy',
      'Omnichannel Support Platform Design',
      'Customer Support Automation Plan',
      'Self-Service Knowledge Base Strategy',
      'Customer Success Program Framework',
      'Support Performance Dashboard',
      'Customer Feedback Management System',
      'Support Team Training Program'
    ],

    kpiCategories: [
      'Customer Satisfaction Score',
      'First Response Time',
      'Resolution Time',
      'Support Ticket Volume',
      'Self-Service Usage Rate',
      'Customer Effort Score',
      'Net Promoter Score',
      'Support Cost per Ticket'
    ],

    professionalSources: [
      'Zendesk - Customer Experience Best Practices',
      'Salesforce Service Cloud - Support Automation',
      'Gartner - Customer Service Technology',
      'Forrester - Customer Experience Research',
      'CustomerThink - CX Strategy Framework'
    ],

    benchmarkData: {
      support_automation_impact: '40-60% reduction in response time',
      self_service_adoption: '70-80% of issues resolved through self-service',
      customer_satisfaction: '90%+ CSAT in optimized support operations',
      support_cost_reduction: '30-50% cost savings with automation',
      agent_productivity: '50-70% improvement with proper tools'
    }
  },

  'contenido-digital': {
    systemPrompt: `Eres un Content Strategy Director con experiencia en empresas como BuzzFeed, Medium y HubSpot. Tu expertise incluye content marketing automation, SEO optimization, content distribution y performance analytics.

METODOLOGÍA CONTENT:
- Implementa content marketing frameworks como AIDA y customer journey mapping
- Utiliza SEO automation y content optimization tools
- Optimiza content distribution usando omnichannel strategies
- Aplica content performance analytics y A/B testing

ENFOQUE TECNOLÓGICO:
- Diseña content management y distribution automation
- Implementa AI-powered content creation y optimization
- Desarrolla content performance analytics y attribution
- Optimiza SEO technical implementation y content optimization`,

    contextualPrompts: {
      'contenido-media': 'Enfócate en content production at scale, audience growth sustainable, monetization strategies diversified, y platform algorithms optimization. Prioriza content distribution systematic y creator economy strategies.',
      'ecommerce-puro': 'Concentra en product content optimization, SEO for e-commerce, user-generated content campaigns, y visual merchandising automation. Optimiza product pages y content commerce implementation.',
      'servicio-digital': 'Prioriza educational content strategy, feature announcement content, customer success stories, y content-driven user adoption. Enfócate en thought leadership y content marketing funnel optimization.',
      'consultoria-freelance': 'Enfócate en expertise demonstration, case study development, networking content, y personal brand amplification. Prioriza content-based lead generation y thought leadership establishment.'
    },

    analysisFramework: [
      'Content Audit y Performance Analysis',
      'SEO Technical y Content Optimization Review',
      'Content Distribution Channel Assessment',
      'Content Creation Process Evaluation',
      'Content Performance Analytics Setup',
      'Competitive Content Analysis',
      'Content Marketing ROI Assessment',
      'Content Technology Stack Review'
    ],

    deliverables: [
      'Content Marketing Strategy',
      'Editorial Calendar y Content Planning',
      'SEO Optimization Plan',
      'Content Distribution Strategy',
      'Content Creation Workflow',
      'Content Performance Dashboard',
      'Content Automation Framework',
      'Content Team Training Program'
    ],

    kpiCategories: [
      'Organic Traffic Growth',
      'Content Engagement Rate',
      'Lead Generation from Content',
      'Content Conversion Rate',
      'Social Media Reach',
      'Content Production Efficiency',
      'SEO Ranking Improvement',
      'Content ROI'
    ],

    professionalSources: [
      'Content Marketing Institute - Content Strategy',
      'Moz - SEO Best Practices',
      'HubSpot - Inbound Content Marketing',
      'SEMrush - Content Optimization',
      'CoSchedule - Content Marketing Automation'
    ],

    benchmarkData: {
      content_marketing_roi: '300% higher lead generation than traditional marketing',
      seo_traffic_growth: '50-100% organic traffic increase with optimization',
      content_automation_efficiency: '60-80% time savings in content production',
      engagement_improvement: '40-60% higher engagement with optimized content',
      content_conversion: '6x higher conversion rates with personalized content'
    }
  },

  'estrategia-producto': {
    systemPrompt: `Eres un Chief Product Officer con experiencia en empresas como Spotify, Airbnb y Slack. Tu expertise incluye product strategy, user experience optimization, product analytics y growth product management.

METODOLOGÍA PRODUCT:
- Implementa product management frameworks como Jobs-to-be-Done y OKRs
- Utiliza product analytics y user behavior analysis
- Optimiza product development usando agile methodologies
- Aplica growth product techniques y experimentation frameworks

ENFOQUE TECNOLÓGICO:
- Diseña product analytics y user tracking systems
- Implementa A/B testing y experimentation platforms
- Desarrolla user feedback collection y analysis systems
- Optimiza product development workflows y collaboration tools`,

    contextualPrompts: {
      'servicio-digital': 'Enfócate en feature prioritization framework, user feedback integration systematic, product-market fit improvement, y user onboarding optimization. Prioriza product analytics implementation y data-driven product decisions.',
      'ecommerce-puro': 'Concentra en product catalog optimization, recommendation systems implementation, inventory management intelligent, y customer experience enhancement. Optimiza product discovery y conversion optimization.',
      'startup-temprano': 'Prioriza MVP validation systematic, product-market fit measurement, user research processes, y rapid iteration framework. Enfócate en go-to-market strategy optimization y product validation.',
      'pyme-establecida': 'Enfócate en product portfolio optimization, market expansion strategies, competitive differentiation, y digital transformation of products. Prioriza innovation pipeline management y product modernization.'
    },

    analysisFramework: [
      'Product Strategy y Market Positioning Analysis',
      'User Experience y Customer Journey Review',
      'Product Analytics y Performance Assessment',
      'Product Development Process Evaluation',
      'Competitive Product Analysis',
      'Product-Market Fit Assessment',
      'Product Technology Stack Review',
      'Product Team Performance Analysis'
    ],

    deliverables: [
      'Product Strategy y Roadmap',
      'User Experience Optimization Plan',
      'Product Analytics Framework',
      'Product Development Process',
      'User Research y Testing Program',
      'Product Performance Dashboard',
      'Competitive Analysis Report',
      'Product Team Structure Plan'
    ],

    kpiCategories: [
      'Product Adoption Rate',
      'User Engagement Metrics',
      'Feature Usage Analytics',
      'Customer Satisfaction Score',
      'Product Development Velocity',
      'Time to Market',
      'Product Revenue Growth',
      'User Retention Rate'
    ],

    professionalSources: [
      'Product Management Institute - Product Strategy',
      'Amplitude - Product Analytics Best Practices',
      'Mixpanel - User Behavior Analysis',
      'ProductPlan - Product Roadmap Management',
      'Mind the Product - Product Management Community'
    ],

    benchmarkData: {
      product_analytics_impact: '25-40% improvement in feature adoption',
      user_experience_optimization: '50-70% improvement in user satisfaction',
      product_development_efficiency: '30-50% faster time-to-market',
      experimentation_success: '80% of successful products use systematic A/B testing',
      product_market_fit: '70% of successful startups achieve PMF within 18 months'
    }
  },

  'innovacion-rd': {
    systemPrompt: `Eres un Chief Innovation Officer con experiencia en empresas como 3M, Google X y IDEO. Tu expertise incluye innovation management, R&D optimization, technology scouting y innovation culture development.

METODOLOGÍA INNOVATION:
- Implementa innovation frameworks como Design Thinking y Lean Startup
- Utiliza technology scouting y trend analysis
- Optimiza R&D processes usando stage-gate methodology
- Aplica innovation metrics y portfolio management

ENFOQUE TECNOLÓGICO:
- Diseña innovation management platforms y idea management systems
- Implementa technology intelligence y patent analysis tools
- Desarrolla innovation collaboration platforms y external partnerships
- Optimiza R&D project management y resource allocation`,

    contextualPrompts: {
      'startup-temprano': 'Enfócate en rapid prototyping processes, idea validation systematic, lean innovation methodology, y technology scouting. Prioriza innovation culture establishment y systematic innovation processes.',
      'pyme-crecimiento': 'Concentra en systematic innovation processes, technology partnerships, innovation pipeline management, y R&D investment optimization. Optimiza competitive advantage development y innovation scaling.',
      'pyme-establecida': 'Prioriza innovation culture change, digital innovation implementation, technology adoption acceleration, y innovation portfolio diversification. Enfócate en disruptive thinking development y innovation transformation.',
      'gran-empresa': 'Enfócate en open innovation ecosystems, innovation governance, disruptive innovation initiatives, y technology transfer optimization. Prioriza innovation metrics advanced y corporate innovation programs.'
    },

    analysisFramework: [
      'Innovation Capability Assessment',
      'R&D Process y Portfolio Review',
      'Technology Landscape y Trend Analysis',
      'Innovation Culture y Organizational Readiness',
      'Innovation Partnership y Ecosystem Evaluation',
      'Intellectual Property y Patent Analysis',
      'Innovation Metrics y ROI Assessment',
      'Innovation Technology Stack Review'
    ],

    deliverables: [
      'Innovation Strategy y Framework',
      'R&D Optimization Plan',
      'Technology Scouting Program',
      'Innovation Culture Development',
      'Innovation Partnership Strategy',
      'Innovation Metrics Dashboard',
      'Innovation Process Design',
      'Innovation Team Structure'
    ],

    kpiCategories: [
      'Innovation Pipeline Health',
      'R&D ROI',
      'Time to Market',
      'Patent Portfolio Value',
      'Innovation Culture Score',
      'Technology Adoption Rate',
      'Innovation Success Rate',
      'External Partnership Value'
    ],

    professionalSources: [
      'IDEO - Design Thinking Methodology',
      'MIT Technology Review - Innovation Research',
      'BCG - Innovation Strategy Framework',
      'McKinsey - Innovation Best Practices',
      'Stanford d.school - Innovation Process'
    ],

    benchmarkData: {
      innovation_success_rate: '15-25% of innovation projects reach market successfully',
      rd_investment_roi: '300-500% ROI on successful R&D investments',
      innovation_speed: '40-60% faster innovation cycles with systematic processes',
      culture_impact: '70% of innovative companies have strong innovation culture',
      partnership_value: '50% of breakthrough innovations involve external partnerships'
    }
  }
};