/*
  # Crear sistema de perfiles de usuario y reportes

  1. Nuevas Tablas
    - `user_profiles`
      - `id` (uuid, primary key)
      - `user_id` (uuid, referencia a auth.users)
      - `business_type` (text)
      - `revenue_model` (text)
      - `business_stage` (text)
      - `main_objective` (text)
      - `digitalization_level` (text)
      - `employee_count` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `ai_reports`
      - `id` (uuid, primary key)
      - `user_id` (uuid, referencia a auth.users)
      - `profile_id` (uuid, referencia a user_profiles)
      - `module_id` (text)
      - `module_name` (text)
      - `user_input` (text)
      - `report_content` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Seguridad
    - Habilitar RLS en ambas tablas
    - Políticas para que usuarios solo accedan a sus propios datos
*/

-- Crear tabla de perfiles de usuario
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  business_type text NOT NULL,
  revenue_model text NOT NULL,
  business_stage text NOT NULL,
  main_objective text NOT NULL,
  digitalization_level text NOT NULL,
  employee_count text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Crear tabla de reportes de IA
CREATE TABLE IF NOT EXISTS ai_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  profile_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  module_id text NOT NULL,
  module_name text NOT NULL,
  user_input text NOT NULL,
  report_content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Habilitar Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_reports ENABLE ROW LEVEL SECURITY;

-- Políticas para user_profiles
CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Políticas para ai_reports
CREATE POLICY "Users can read own reports"
  ON ai_reports
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own reports"
  ON ai_reports
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reports"
  ON ai_reports
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own reports"
  ON ai_reports
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar updated_at
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_reports_updated_at
  BEFORE UPDATE ON ai_reports
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Índices para mejorar performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_reports_user_id ON ai_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_reports_profile_id ON ai_reports(profile_id);
CREATE INDEX IF NOT EXISTS idx_ai_reports_module_id ON ai_reports(module_id);
CREATE INDEX IF NOT EXISTS idx_ai_reports_created_at ON ai_reports(created_at DESC);