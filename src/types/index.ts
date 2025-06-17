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

export interface ModuleDefinition {
  id: string;
  name: string;
  icon: string;
  description: string;
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
  title: string;
  fields: FormField[];
}

export interface FormField {
  id: keyof UserProfileData;
  label: string;
  type: 'radio' | 'select' | 'text' | 'textarea';
  options?: { value: string; label: string }[];
  required: boolean;
  placeholder?: string;
}