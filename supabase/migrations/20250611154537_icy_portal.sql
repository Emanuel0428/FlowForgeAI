/*
  # Agregar campos extendidos al perfil de usuario

  1. Nuevas Columnas
    - Información adicional del negocio para análisis más personalizados
    - Campos opcionales para detalles específicos del contexto empresarial
    
  2. Seguridad
    - Mantener RLS existente
    - Los nuevos campos son opcionales
*/

-- Agregar campos extendidos a la tabla user_profiles
DO $$ 
BEGIN
  -- Información básica del negocio
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' AND column_name = 'business_name'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN business_name text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' AND column_name = 'business_description'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN business_description text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' AND column_name = 'industry'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN industry text;
  END IF;

  -- Mercado y clientes
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' AND column_name = 'target_market'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN target_market text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' AND column_name = 'main_customers'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN main_customers text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' AND column_name = 'geographic_scope'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN geographic_scope text;
  END IF;

  -- Estrategia y objetivos
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' AND column_name = 'business_goals'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN business_goals text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' AND column_name = 'yearly_growth_target'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN yearly_growth_target text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' AND column_name = 'competitive_advantage'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN competitive_advantage text;
  END IF;

  -- Operaciones y procesos
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' AND column_name = 'key_products'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN key_products text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' AND column_name = 'sales_process'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN sales_process text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' AND column_name = 'marketing_channels'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN marketing_channels text;
  END IF;

  -- Recursos y estructura
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' AND column_name = 'team_structure'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN team_structure text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' AND column_name = 'technology_stack'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN technology_stack text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' AND column_name = 'budget_range'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN budget_range text;
  END IF;

  -- Desafíos y métricas
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' AND column_name = 'current_challenges'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN current_challenges text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' AND column_name = 'success_metrics'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN success_metrics text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' AND column_name = 'timeframe'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN timeframe text;
  END IF;

  -- Información financiera
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' AND column_name = 'monthly_revenue'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN monthly_revenue text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' AND column_name = 'business_model'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN business_model text;
  END IF;
END $$;