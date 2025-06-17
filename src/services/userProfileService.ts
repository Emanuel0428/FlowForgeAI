import { supabase } from '../config/supabase';
import { UserProfileData, ExtendedUserProfileData } from '../types';
import { UserProfile, UserProfileInsert, UserProfileUpdate } from '../types/database';

// Cache para perfiles de usuario
class ProfileCache {
  private static instance: ProfileCache;
  private cachedProfile: UserProfile | null = null;
  private lastCheck: number = 0;
  private readonly CACHE_DURATION = 60000;

  static getInstance(): ProfileCache {
    if (!ProfileCache.instance) {
      ProfileCache.instance = new ProfileCache();
    }
    return ProfileCache.instance;
  }

  isValid(): boolean {
    return Date.now() - this.lastCheck < this.CACHE_DURATION;
  }

  get(): UserProfile | null {
    return this.isValid() ? this.cachedProfile : null;
  }

  set(profile: UserProfile | null): void {
    this.cachedProfile = profile;
    this.lastCheck = Date.now();
  }

  clear(): void {
    this.cachedProfile = null;
    this.lastCheck = 0;
  }
}

export class UserProfileService {
  private static profileCache = ProfileCache.getInstance();

  // Crear o actualizar perfil de usuario con validación robusta
  static async saveUserProfile(profileData: UserProfileData): Promise<UserProfile> {
    try {      
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        console.error('❌ Usuario no autenticado:', authError);
        throw new Error('Usuario no autenticado');
      }

      // Validar datos del perfil
      this.validateProfileData(profileData);

      const profileInsert: UserProfileInsert = {
        user_id: user.id,
        business_type: profileData.businessType,
        revenue_model: profileData.revenueModel,
        business_stage: profileData.businessStage,
        main_objective: profileData.mainObjective,
        digitalization_level: profileData.digitalizationLevel,
        employee_count: profileData.employeeCount,
      };

      const { data, error } = await supabase
        .from('user_profiles')
        .upsert(profileInsert, { 
          onConflict: 'user_id',
          ignoreDuplicates: false 
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Error guardando perfil:', error);
        throw new Error(`Error al guardar el perfil: ${error.message}`);
      }

      if (!data) {
        console.error('❌ No se recibieron datos al guardar el perfil');
        throw new Error('No se recibieron datos al guardar el perfil');
      }

      // Actualizar cache
      this.profileCache.set(data);

      return data;
    } catch (error: any) {
      console.error('❌ Error inesperado guardando perfil:', error);
      throw error;
    }
  }

  // Obtener perfil de usuario actual con cache optimizado
  static async getUserProfile(): Promise<UserProfile | null> {
    try {
      // Verificar cache primero
      const cachedProfile = this.profileCache.get();
      if (cachedProfile) {
        console.log('📋 Perfil obtenido del cache');
        return cachedProfile;
      }
      
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        console.log('ℹ️ No hay usuario autenticado para obtener perfil');
        return null;
      }

      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('❌ Error obteniendo perfil:', error);
        throw new Error(`Error al obtener el perfil: ${error.message}`);
      }

      // Actualizar cache
      this.profileCache.set(data);
      
      if (data) {
        console.log('✅ Perfil obtenido exitosamente:', {
          profileId: data.id,
          businessType: data.business_type
        });
      } else {
        console.log('ℹ️ No se encontró perfil para el usuario');
      }

      return data;
    } catch (error: any) {
      console.error('❌ Error inesperado obteniendo perfil:', error);
      throw error;
    }
  }

  // Actualizar perfil existente con campos extendidos - VERSIÓN MEJORADA
  static async updateUserProfile(updates: Partial<ExtendedUserProfileData>): Promise<UserProfile> {
    try {      
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        console.error('❌ Usuario no autenticado para actualización');
        throw new Error('Usuario no autenticado');
      }

      // Validar actualizaciones solo para campos básicos
      this.validatePartialProfileData(updates);

      // Construir objeto de actualización de forma más segura
      const profileUpdate: Record<string, any> = {};
      
      // Campos básicos (solo si están presentes)
      if (updates.businessType !== undefined) profileUpdate.business_type = updates.businessType;
      if (updates.revenueModel !== undefined) profileUpdate.revenue_model = updates.revenueModel;
      if (updates.businessStage !== undefined) profileUpdate.business_stage = updates.businessStage;
      if (updates.mainObjective !== undefined) profileUpdate.main_objective = updates.mainObjective;
      if (updates.digitalizationLevel !== undefined) profileUpdate.digitalization_level = updates.digitalizationLevel;
      if (updates.employeeCount !== undefined) profileUpdate.employee_count = updates.employeeCount;

      // Campos extendidos - solo actualizar si están definidos en el objeto updates
      const extendedFieldMappings = {
        businessName: 'business_name',
        businessDescription: 'business_description',
        industry: 'industry',
        targetMarket: 'target_market',
        businessGoals: 'business_goals',
        currentChallenges: 'current_challenges',
        competitiveAdvantage: 'competitive_advantage',
        monthlyRevenue: 'monthly_revenue',
        yearlyGrowthTarget: 'yearly_growth_target',
        keyProducts: 'key_products',
        mainCustomers: 'main_customers',
        geographicScope: 'geographic_scope',
        businessModel: 'business_model',
        technologyStack: 'technology_stack',
        marketingChannels: 'marketing_channels',
        salesProcess: 'sales_process',
        teamStructure: 'team_structure',
        budgetRange: 'budget_range',
        timeframe: 'timeframe',
        successMetrics: 'success_metrics'
      };

      // Solo agregar campos extendidos que están presentes en updates
      Object.entries(extendedFieldMappings).forEach(([jsKey, dbKey]) => {
        if (updates.hasOwnProperty(jsKey as keyof ExtendedUserProfileData)) {
          const value = updates[jsKey as keyof ExtendedUserProfileData];
          profileUpdate[dbKey] = value || null; // Permitir valores vacíos como null
        }
      });

      // Verificar que hay algo que actualizar
      if (Object.keys(profileUpdate).length === 0) {
        console.log('ℹ️ No hay cambios para actualizar');
        const currentProfile = await this.getUserProfile();
        if (!currentProfile) {
          throw new Error('No se encontró el perfil actual');
        }
        return currentProfile;
      }

      // Realizar la actualización con manejo de errores mejorado
      const { data, error } = await supabase
        .from('user_profiles')
        .update(profileUpdate)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('❌ Error actualizando perfil:', error);
        console.error('Detalles del error:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint,
          updateData: profileUpdate
        });

        // Manejar errores específicos
        if (error.code === '42703') {
          // Column does not exist
          console.error('❌ Columna no existe en la base de datos');
          throw new Error('Error de estructura de base de datos. Algunos campos no están disponibles.');
        } else if (error.code === '23505') {
          // Unique violation
          throw new Error('Ya existe un perfil para este usuario');
        } else {
          throw new Error(`Error al actualizar el perfil: ${error.message}`);
        }
      }

      if (!data) {
        console.error('❌ No se recibieron datos al actualizar el perfil');
        throw new Error('No se recibieron datos al actualizar el perfil');
      }

      // Actualizar cache
      this.profileCache.set(data);
      
      return data;
    } catch (error: any) {
      console.error('❌ Error inesperado actualizando perfil:', error);
      throw error;
    }
  }

  // Eliminar perfil de usuario
  static async deleteUserProfile(): Promise<void> {
    try {
      console.log('🗑️ Eliminando perfil de usuario...');
      
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        console.error('❌ Usuario no autenticado para eliminación');
        throw new Error('Usuario no autenticado');
      }

      const { error } = await supabase
        .from('user_profiles')
        .delete()
        .eq('user_id', user.id);

      if (error) {
        console.error('❌ Error eliminando perfil:', error);
        throw new Error(`Error al eliminar el perfil: ${error.message}`);
      }

      // Limpiar cache
      this.profileCache.clear();
      
      console.log('✅ Perfil eliminado exitosamente');
    } catch (error: any) {
      console.error('❌ Error inesperado eliminando perfil:', error);
      throw error;
    }
  }

  // Convertir UserProfile de DB a UserProfileData de la app
  static dbProfileToAppProfile(dbProfile: UserProfile): UserProfileData {
    return {
      businessType: dbProfile.business_type,
      revenueModel: dbProfile.revenue_model,
      businessStage: dbProfile.business_stage,
      mainObjective: dbProfile.main_objective,
      digitalizationLevel: dbProfile.digitalization_level,
      employeeCount: dbProfile.employee_count,
    };
  }

  // Convertir UserProfile de DB a ExtendedUserProfileData
  static dbProfileToExtendedProfile(dbProfile: UserProfile): ExtendedUserProfileData {
    return {
      businessType: dbProfile.business_type,
      revenueModel: dbProfile.revenue_model,
      businessStage: dbProfile.business_stage,
      mainObjective: dbProfile.main_objective,
      digitalizationLevel: dbProfile.digitalization_level,
      employeeCount: dbProfile.employee_count,
      businessName: dbProfile.business_name || '',
      businessDescription: dbProfile.business_description || '',
      industry: dbProfile.industry || '',
      targetMarket: dbProfile.target_market || '',
      businessGoals: dbProfile.business_goals || '',
      currentChallenges: dbProfile.current_challenges || '',
      competitiveAdvantage: dbProfile.competitive_advantage || '',
      monthlyRevenue: dbProfile.monthly_revenue || '',
      yearlyGrowthTarget: dbProfile.yearly_growth_target || '',
      keyProducts: dbProfile.key_products || '',
      mainCustomers: dbProfile.main_customers || '',
      geographicScope: dbProfile.geographic_scope || '',
      businessModel: dbProfile.business_model || '',
      technologyStack: dbProfile.technology_stack || '',
      marketingChannels: dbProfile.marketing_channels || '',
      salesProcess: dbProfile.sales_process || '',
      teamStructure: dbProfile.team_structure || '',
      budgetRange: dbProfile.budget_range || '',
      timeframe: dbProfile.timeframe || '',
      successMetrics: dbProfile.success_metrics || '',
    };
  }

  // Limpiar cache del perfil
  static clearCache(): void {
    this.profileCache.clear();
    console.log('🧹 Cache de perfil limpiado');
  }

  // Verificar qué campos están disponibles en la base de datos
  static async checkAvailableFields(): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .limit(1);

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found, que está bien
        console.error('Error checking available fields:', error);
        return [];
      }

      // Si hay datos, obtener las columnas
      if (data && data.length > 0) {
        return Object.keys(data[0]);
      }

      // Si no hay datos, hacer una consulta de estructura
      const { data: structureData, error: structureError } = await supabase
        .rpc('get_table_columns', { table_name: 'user_profiles' })
        .single();

      if (structureError) {
        console.log('No se pudo obtener estructura de tabla, usando campos básicos');
        return ['id', 'user_id', 'business_type', 'revenue_model', 'business_stage', 'main_objective', 'digitalization_level', 'employee_count', 'created_at', 'updated_at'];
      }

      return (structureData as any)?.columns || [];
    } catch (error) {
      console.error('Error checking available fields:', error);
      return ['id', 'user_id', 'business_type', 'revenue_model', 'business_stage', 'main_objective', 'digitalization_level', 'employee_count', 'created_at', 'updated_at'];
    }
  }

  // Validar datos completos del perfil
  private static validateProfileData(profileData: UserProfileData): void {
    const requiredFields: (keyof UserProfileData)[] = [
      'businessType',
      'revenueModel', 
      'businessStage',
      'mainObjective',
      'digitalizationLevel',
      'employeeCount'
    ];

    const missingFields = requiredFields.filter(field => !profileData[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Campos requeridos faltantes: ${missingFields.join(', ')}`);
    }

    // Validar valores específicos
    this.validateBusinessType(profileData.businessType);
    this.validateRevenueModel(profileData.revenueModel);
    this.validateBusinessStage(profileData.businessStage);
    this.validateMainObjective(profileData.mainObjective);
    this.validateDigitalizationLevel(profileData.digitalizationLevel);
    this.validateEmployeeCount(profileData.employeeCount);
  }

  // Validar datos parciales del perfil
  private static validatePartialProfileData(updates: Partial<ExtendedUserProfileData>): void {
    if (updates.businessType) this.validateBusinessType(updates.businessType);
    if (updates.revenueModel) this.validateRevenueModel(updates.revenueModel);
    if (updates.businessStage) this.validateBusinessStage(updates.businessStage);
    if (updates.mainObjective) this.validateMainObjective(updates.mainObjective);
    if (updates.digitalizationLevel) this.validateDigitalizationLevel(updates.digitalizationLevel);
    if (updates.employeeCount) this.validateEmployeeCount(updates.employeeCount);
  }

  // Validaciones específicas
  private static validateBusinessType(value: string): void {
    const validTypes = [
      'producto-fisico',
      'servicio-digital',
      'contenido-media',
      'consultoria-freelance',
      'ecommerce-puro',
      'organizacion-no-lucro',
      'otro'
    ];
    
    if (!validTypes.includes(value)) {
      throw new Error(`Tipo de negocio inválido: ${value}`);
    }
  }

  private static validateRevenueModel(value: string): void {
    const validModels = [
      'b2b',
      'b2c',
      'd2c',
      'suscripcion',
      'transaccional',
      'publicidad-afiliacion',
      'hibrido'
    ];
    
    if (!validModels.includes(value)) {
      throw new Error(`Modelo de ingresos inválido: ${value}`);
    }
  }

  private static validateBusinessStage(value: string): void {
    const validStages = [
      'idea-prelanzamiento',
      'startup-temprano',
      'pyme-crecimiento',
      'pyme-establecida',
      'gran-empresa'
    ];
    
    if (!validStages.includes(value)) {
      throw new Error(`Etapa de negocio inválida: ${value}`);
    }
  }

  private static validateMainObjective(value: string): void {
    const validObjectives = [
      'aumentar-ventas',
      'optimizar-operaciones',
      'mejorar-experiencia-cliente',
      'reducir-costos',
      'expansion-mercados',
      'innovacion-producto',
      'construccion-marca'
    ];
    
    if (!validObjectives.includes(value)) {
      throw new Error(`Objetivo principal inválido: ${value}`);
    }
  }

  private static validateDigitalizationLevel(value: string): void {
    const validLevels = [
      'bajo-manual',
      'medio-herramientas',
      'alto-automatizado',
      'muy-alto-ai'
    ];
    
    if (!validLevels.includes(value)) {
      throw new Error(`Nivel de digitalización inválido: ${value}`);
    }
  }

  private static validateEmployeeCount(value: string): void {
    const validCounts = [
      '1-5',
      '6-20',
      '21-50',
      '51-200',
      '201-500',
      'mas-500'
    ];
    
    if (!validCounts.includes(value)) {
      throw new Error(`Número de empleados inválido: ${value}`);
    }
  }
}