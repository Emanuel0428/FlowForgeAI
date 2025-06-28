export interface UserProfileData {
  businessType: string;
  revenueModel: string;
  businessStage: string;
  mainObjective: string;
  digitalizationLevel: string;
  employeeCount: string;
}

export interface ExtendedUserProfileData extends UserProfileData {
  // Información adicional del negocio
  businessName?: string;
  businessDescription?: string;
  industry?: string;
  targetMarket?: string;
  businessGoals?: string;
  currentChallenges?: string;
  competitiveAdvantage?: string;
  monthlyRevenue?: string;
  yearlyGrowthTarget?: string;
  keyProducts?: string;
  mainCustomers?: string;
  geographicScope?: string;
  businessModel?: string;
  technologyStack?: string;
  marketingChannels?: string;
  salesProcess?: string;
  teamStructure?: string;
  budgetRange?: string;
  timeframe?: string;
  successMetrics?: string;
}

export interface LocalizedText {
  en: string;
  es: string;
}

export interface ModuleDefinition {
  id: string;
  name: LocalizedText;
  icon: string;
  description: LocalizedText;
}

export interface AppState {
  userProfile: UserProfileData | null;
  activeModuleId: string;
  moduleSpecificInput: string;
  isLoading: boolean;
  reportContent: string | null;
  errorMessage: string | null;
  isProfileComplete: boolean;
  isDarkMode: boolean;
}

export interface FormStep {
  id: string;
  title: LocalizedText;
  fields: FormField[];
}

export interface FormField {
  id: keyof UserProfileData;
  label: LocalizedText;
  type: 'radio' | 'select' | 'text' | 'textarea';
  options?: { value: string; label: LocalizedText }[];
  required: boolean;
  placeholder?: string;
}