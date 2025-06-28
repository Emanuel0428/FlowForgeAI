import { supabase } from '../config/supabase';
import { AIReport, AIReportInsert } from '../types/database';
import { businessModules } from '../data/modules';
import { useLanguage } from '../config/language';

// Error message translations
const errorMessages = {
  en: {
    userNotAuthenticated: 'User not authenticated',
    unknownModule: 'Unknown Module',
    errorSavingReport: 'Error saving the report',
    noDataReturned: 'No data returned when saving the report',
    errorFetchingReports: 'Error fetching reports',
    errorFetchingReportsByModule: 'Error fetching reports by module',
    errorFetchingReport: 'Error fetching the report',
    errorDeletingReport: 'Error deleting the report',
    errorFetchingStats: 'Error fetching report statistics',
    errorFetchingRecentReports: 'Error fetching recent reports'
  },
  es: {
    userNotAuthenticated: 'Usuario no autenticado',
    unknownModule: 'Módulo Desconocido',
    errorSavingReport: 'Error al guardar el reporte',
    noDataReturned: 'No se recibieron datos al guardar el reporte',
    errorFetchingReports: 'Error al obtener los reportes',
    errorFetchingReportsByModule: 'Error al obtener los reportes del módulo',
    errorFetchingReport: 'Error al obtener el reporte',
    errorDeletingReport: 'Error al eliminar el reporte',
    errorFetchingStats: 'Error al obtener estadísticas de reportes',
    errorFetchingRecentReports: 'Error al obtener reportes recientes'
  }
};

// Helper function to get error message based on current language
const getErrorMessage = (key: keyof typeof errorMessages.en, language: 'en' | 'es' = 'es'): string => {
  return errorMessages[language][key];
};

export class AIReportService {
  static async saveAIReport(
    profileId: string,
    moduleId: string,
    userInput: string,
    reportContent: string,
    language: 'en' | 'es' = 'es'
  ): Promise<AIReport> {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        console.error('❌ User not authenticated for saving report:', authError);
        throw new Error(getErrorMessage('userNotAuthenticated', language));
      }

      const module = businessModules.find(m => m.id === moduleId);
      const moduleName = module ? module.name[language] : getErrorMessage('unknownModule', language);

      const reportInsert: AIReportInsert = {
        user_id: user.id,
        profile_id: profileId,
        module_id: moduleId,
        module_name: moduleName,
        user_input: userInput,
        report_content: reportContent,
      };

      const { data, error } = await supabase
        .from('ai_reports')
        .insert(reportInsert)
        .select()
        .single();

      if (error) {
        console.error('❌ Database error saving AI report:', error);
        console.error('Error details:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        throw new Error(`${getErrorMessage('errorSavingReport', language)}: ${error.message}`);
      }

      if (!data) {
        console.error('❌ No data returned from insert operation');
        throw new Error(getErrorMessage('noDataReturned', language));
      }
      return data;
    } catch (error) {
      console.error('❌ Unexpected error in saveAIReport:', error);
      throw error;
    }
  }

  // Obtener todos los reportes del usuario actual
  static async getUserReports(language: 'en' | 'es' = 'es'): Promise<AIReport[]> {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        console.log('ℹ️ No authenticated user for getting reports');
        return [];
      }

      const { data, error } = await supabase
        .from('ai_reports')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching user reports:', error);
        throw new Error(`${getErrorMessage('errorFetchingReports', language)}: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('❌ Unexpected error in getUserReports:', error);
      throw error;
    }
  }

  // Obtener reportes por módulo
  static async getReportsByModule(moduleId: string, language: 'en' | 'es' = 'es'): Promise<AIReport[]> {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        console.log('ℹ️ No authenticated user for getting reports by module');
        return [];
      }

      const { data, error } = await supabase
        .from('ai_reports')
        .select('*')
        .eq('user_id', user.id)
        .eq('module_id', moduleId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching reports by module:', error);
        throw new Error(`${getErrorMessage('errorFetchingReportsByModule', language)}: ${error.message}`);
      }
      return data || [];
    } catch (error) {
      console.error('❌ Unexpected error in getReportsByModule:', error);
      throw error;
    }
  }

  // Obtener un reporte específico
  static async getReport(reportId: string, language: 'en' | 'es' = 'es'): Promise<AIReport | null> {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        console.log('ℹ️ No authenticated user for getting specific report');
        return null;
      }

      const { data, error } = await supabase
        .from('ai_reports')
        .select('*')
        .eq('id', reportId)
        .eq('user_id', user.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          console.log('ℹ️ Report not found:', reportId);
          return null;
        }
        console.error('❌ Error fetching report:', error);
        throw new Error(`${getErrorMessage('errorFetchingReport', language)}: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('❌ Unexpected error in getReport:', error);
      throw error;
    }
  }

  // Eliminar un reporte
  static async deleteReport(reportId: string, language: 'en' | 'es' = 'es'): Promise<void> {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        console.error('❌ User not authenticated for deleting report');
        throw new Error(getErrorMessage('userNotAuthenticated', language));
      }

      const { error } = await supabase
        .from('ai_reports')
        .delete()
        .eq('id', reportId)
        .eq('user_id', user.id);

      if (error) {
        console.error('❌ Error deleting report:', error);
        throw new Error(`${getErrorMessage('errorDeletingReport', language)}: ${error.message}`);
      }

    } catch (error) {
      console.error('❌ Unexpected error in deleteReport:', error);
      throw error;
    }
  }

  // Obtener estadísticas de reportes del usuario
  static async getReportStats(language: 'en' | 'es' = 'es'): Promise<{
    totalReports: number;
    reportsByModule: Record<string, number>;
    recentReports: AIReport[];
  }> {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        console.log('ℹ️ No authenticated user for getting report stats');
        return {
          totalReports: 0,
          reportsByModule: {},
          recentReports: []
        };
      }
      // Obtener todos los reportes
      const { data: allReports, error: allError } = await supabase
        .from('ai_reports')
        .select('*')
        .eq('user_id', user.id);

      if (allError) {
        console.error('❌ Error fetching all reports for stats:', allError);
        throw new Error(`${getErrorMessage('errorFetchingStats', language)}: ${allError.message}`);
      }

      // Obtener reportes recientes (últimos 5)
      const { data: recentReports, error: recentError } = await supabase
        .from('ai_reports')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (recentError) {
        console.error('❌ Error fetching recent reports:', recentError);
        throw new Error(`${getErrorMessage('errorFetchingRecentReports', language)}: ${recentError.message}`);
      }

      // Calcular estadísticas
      const reportsByModule: Record<string, number> = {};
      (allReports || []).forEach(report => {
        reportsByModule[report.module_id] = (reportsByModule[report.module_id] || 0) + 1;
      });

      const stats = {
        totalReports: (allReports || []).length,
        reportsByModule,
        recentReports: recentReports || []
      };

      return stats;
    } catch (error) {
      console.error('❌ Unexpected error in getReportStats:', error);
      throw error;
    }
  }
}