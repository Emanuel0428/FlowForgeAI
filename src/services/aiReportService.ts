import { supabase } from '../config/supabase';
import { AIReport, AIReportInsert } from '../types/database';
import { businessModules } from '../data/modules';

export class AIReportService {
  // Guardar un nuevo reporte de IA
  static async saveAIReport(
    profileId: string,
    moduleId: string,
    userInput: string,
    reportContent: string
  ): Promise<AIReport> {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        console.error('❌ User not authenticated for saving report:', authError);
        throw new Error('Usuario no autenticado');
      }

      console.log('📝 Preparing to save report:', {
        userId: user.id,
        profileId,
        moduleId,
        inputLength: userInput.length,
        contentLength: reportContent.length
      });

      const moduleName = businessModules.find(m => m.id === moduleId)?.name || 'Módulo Desconocido';

      const reportInsert: AIReportInsert = {
        user_id: user.id,
        profile_id: profileId,
        module_id: moduleId,
        module_name: moduleName,
        user_input: userInput,
        report_content: reportContent,
      };

      console.log('💾 Inserting report into database...');
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
        throw new Error(`Error al guardar el reporte: ${error.message}`);
      }

      if (!data) {
        console.error('❌ No data returned from insert operation');
        throw new Error('No se recibieron datos al guardar el reporte');
      }

      console.log('✅ Report saved successfully:', {
        reportId: data.id,
        moduleId: data.module_id,
        moduleName: data.module_name,
        createdAt: data.created_at
      });

      return data;
    } catch (error) {
      console.error('❌ Unexpected error in saveAIReport:', error);
      throw error;
    }
  }

  // Obtener todos los reportes del usuario actual
  static async getUserReports(): Promise<AIReport[]> {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        console.log('ℹ️ No authenticated user for getting reports');
        return [];
      }

      console.log('📚 Fetching reports for user:', user.id);

      const { data, error } = await supabase
        .from('ai_reports')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching user reports:', error);
        throw new Error(`Error al obtener los reportes: ${error.message}`);
      }

      console.log('✅ Reports fetched successfully:', {
        count: data?.length || 0,
        reports: data?.map(r => ({ id: r.id, module: r.module_name, date: r.created_at }))
      });

      return data || [];
    } catch (error) {
      console.error('❌ Unexpected error in getUserReports:', error);
      throw error;
    }
  }

  // Obtener reportes por módulo
  static async getReportsByModule(moduleId: string): Promise<AIReport[]> {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        console.log('ℹ️ No authenticated user for getting reports by module');
        return [];
      }

      console.log('📚 Fetching reports by module:', { userId: user.id, moduleId });

      const { data, error } = await supabase
        .from('ai_reports')
        .select('*')
        .eq('user_id', user.id)
        .eq('module_id', moduleId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching reports by module:', error);
        throw new Error(`Error al obtener los reportes del módulo: ${error.message}`);
      }

      console.log('✅ Module reports fetched successfully:', {
        moduleId,
        count: data?.length || 0
      });

      return data || [];
    } catch (error) {
      console.error('❌ Unexpected error in getReportsByModule:', error);
      throw error;
    }
  }

  // Obtener un reporte específico
  static async getReport(reportId: string): Promise<AIReport | null> {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        console.log('ℹ️ No authenticated user for getting specific report');
        return null;
      }

      console.log('📖 Fetching specific report:', { userId: user.id, reportId });

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
        throw new Error(`Error al obtener el reporte: ${error.message}`);
      }

      console.log('✅ Report fetched successfully:', {
        reportId: data.id,
        moduleId: data.module_id
      });

      return data;
    } catch (error) {
      console.error('❌ Unexpected error in getReport:', error);
      throw error;
    }
  }

  // Eliminar un reporte
  static async deleteReport(reportId: string): Promise<void> {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        console.error('❌ User not authenticated for deleting report');
        throw new Error('Usuario no autenticado');
      }

      console.log('🗑️ Deleting report:', { userId: user.id, reportId });

      const { error } = await supabase
        .from('ai_reports')
        .delete()
        .eq('id', reportId)
        .eq('user_id', user.id);

      if (error) {
        console.error('❌ Error deleting report:', error);
        throw new Error(`Error al eliminar el reporte: ${error.message}`);
      }

      console.log('✅ Report deleted successfully:', reportId);
    } catch (error) {
      console.error('❌ Unexpected error in deleteReport:', error);
      throw error;
    }
  }

  // Obtener estadísticas de reportes del usuario
  static async getReportStats(): Promise<{
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

      console.log('📊 Fetching report statistics for user:', user.id);

      // Obtener todos los reportes
      const { data: allReports, error: allError } = await supabase
        .from('ai_reports')
        .select('*')
        .eq('user_id', user.id);

      if (allError) {
        console.error('❌ Error fetching all reports for stats:', allError);
        throw new Error(`Error al obtener estadísticas de reportes: ${allError.message}`);
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
        throw new Error(`Error al obtener reportes recientes: ${recentError.message}`);
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

      console.log('✅ Report statistics calculated:', {
        totalReports: stats.totalReports,
        moduleCount: Object.keys(stats.reportsByModule).length,
        recentCount: stats.recentReports.length
      });

      return stats;
    } catch (error) {
      console.error('❌ Unexpected error in getReportStats:', error);
      throw error;
    }
  }
}