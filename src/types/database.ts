export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          user_id: string;
          business_type: string;
          revenue_model: string;
          business_stage: string;
          main_objective: string;
          digitalization_level: string;
          employee_count: string;
          // Campos adicionales del negocio
          business_name?: string;
          business_description?: string;
          industry?: string;
          target_market?: string;
          business_goals?: string;
          current_challenges?: string;
          competitive_advantage?: string;
          monthly_revenue?: string;
          yearly_growth_target?: string;
          key_products?: string;
          main_customers?: string;
          geographic_scope?: string;
          business_model?: string;
          technology_stack?: string;
          marketing_channels?: string;
          sales_process?: string;
          team_structure?: string;
          budget_range?: string;
          timeframe?: string;
          success_metrics?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          business_type: string;
          revenue_model: string;
          business_stage: string;
          main_objective: string;
          digitalization_level: string;
          employee_count: string;
          // Campos adicionales del negocio
          business_name?: string;
          business_description?: string;
          industry?: string;
          target_market?: string;
          business_goals?: string;
          current_challenges?: string;
          competitive_advantage?: string;
          monthly_revenue?: string;
          yearly_growth_target?: string;
          key_products?: string;
          main_customers?: string;
          geographic_scope?: string;
          business_model?: string;
          technology_stack?: string;
          marketing_channels?: string;
          sales_process?: string;
          team_structure?: string;
          budget_range?: string;
          timeframe?: string;
          success_metrics?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          business_type?: string;
          revenue_model?: string;
          business_stage?: string;
          main_objective?: string;
          digitalization_level?: string;
          employee_count?: string;
          // Campos adicionales del negocio
          business_name?: string;
          business_description?: string;
          industry?: string;
          target_market?: string;
          business_goals?: string;
          current_challenges?: string;
          competitive_advantage?: string;
          monthly_revenue?: string;
          yearly_growth_target?: string;
          key_products?: string;
          main_customers?: string;
          geographic_scope?: string;
          business_model?: string;
          technology_stack?: string;
          marketing_channels?: string;
          sales_process?: string;
          team_structure?: string;
          budget_range?: string;
          timeframe?: string;
          success_metrics?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      ai_reports: {
        Row: {
          id: string;
          user_id: string;
          profile_id: string;
          module_id: string;
          module_name: string;
          user_input: string;
          report_content: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          profile_id: string;
          module_id: string;
          module_name: string;
          user_input: string;
          report_content: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          profile_id?: string;
          module_id?: string;
          module_name?: string;
          user_input?: string;
          report_content?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

export type UserProfile = Database['public']['Tables']['user_profiles']['Row'];
export type UserProfileInsert = Database['public']['Tables']['user_profiles']['Insert'];
export type UserProfileUpdate = Database['public']['Tables']['user_profiles']['Update'];

export type AIReport = Database['public']['Tables']['ai_reports']['Row'];
export type AIReportInsert = Database['public']['Tables']['ai_reports']['Insert'];
export type AIReportUpdate = Database['public']['Tables']['ai_reports']['Update'];