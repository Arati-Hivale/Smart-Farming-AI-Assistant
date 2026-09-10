export type LanguageCode =
  | "en"
  | "hi"
  | "mr"
  | "ml"
  | "ta"
  | "te"
  | "kn"
  | "gu"
  | "bn"
  | "pa";

export type AILanguageCode = LanguageCode;

export type SupportedCrop =
  | "coconut"
  | "pepper"
  | "cardamom"
  | "onion"
  | "cotton"
  | "soybean"
  | "sugarcane"
  | "tomato"
  | "wheat"
  | "rice"
  | "general";

export interface SensorZone {
  id: string;
  name: string;
  crop: SupportedCrop;
  moisturePercent: number;
  soilTempC: number;
  ecValue: number;
  phLevel: number;
  lastIrrigated: string;
  pumpStatus: "ON" | "OFF";
  recommendedWaterLiters: number;
  status: "critical_dry" | "low" | "optimal" | "saturated";
}

export interface SensorDataResponse {
  zones: SensorZone[];
  waterSavedThisMonthLiters: number;
  lastUpdated: string;
}

export interface WeatherForecastDay {
  day: string;
  temp: string;
  rain: string;
  icon: string;
  advisory: string;
}

export interface WeatherAlert {
  severity: "warning" | "danger" | "info";
  title: string;
  message: string;
}

export interface WeatherData {
  district: string;
  state: string;
  crops: string[];
  tempC: number;
  condition: string;
  humidityPercent: number;
  rainfallChancePercent: number;
  windSpeedKmh: number;
  evapotranspirationMm: number;
  uvIndex: number;
  forecast: WeatherForecastDay[];
  alerts: WeatherAlert[];
}

export interface DiseaseDiagnosis {
  detectedCrop: string;
  diseaseName: string;
  scientificName: string;
  confidenceScore: number;
  confidenceLevel?: "High" | "Moderate" | "Uncertain / Needs Verification";
  uncertaintyNote?: string;
  severity: "Low" | "Moderate" | "Critical";
  symptoms: string[];
  possibleCauses: string[];
  immediateActions: string[];
  organicRemedies: string[];
  chemicalRemedies: string[];
  preventiveMeasures: string[];
  summaryForFarmer: string;
}

export interface IrrigationPlan {
  irrigateNow: boolean;
  urgency: "Low" | "Medium" | "High" | "Skip";
  recommendedAmountLiters: number;
  recommendedDurationMinutes: number;
  optimalTimeOfDay: string;
  waterSavedEstimateLiters: number;
  actionSteps: string[];
  farmerNote: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
  language?: LanguageCode;
}

export interface SampleDiseaseCase {
  id: string;
  crop: SupportedCrop;
  name: string;
  vernacularName: Partial<Record<LanguageCode, string>> & { en: string };
  sampleImage: string;
  description: string;
}

// -------------------------------------------------------------
// Multi-Farmer Account, Profile, Field, and Record Interfaces
// -------------------------------------------------------------

export interface FarmerProfile {
  id: string; // User ID
  name: string;
  mobile: string;
  preferredLanguage: LanguageCode;
  createdAt: string;
}

export interface FarmDetails {
  state: string;
  district: string;
  village: string;
  farmLocation: string;
  farmSizeAcres: number;
  soilType: string;
  irrigationMethod: string;
  waterSource: string;
  isConfigured: boolean;
  waterSavedThisMonthLiters?: number;
}

export type CropGrowthStage =
  | "Germination / Nursery"
  | "Vegetative"
  | "Flowering"
  | "Fruiting / Pod Formation"
  | "Maturity"
  | "Harvesting";

export interface FarmerField {
  id: string;
  name: string;
  crop: SupportedCrop;
  cropDisplayName?: string;
  areaAcres: number;
  soilType: string;
  growthStage: CropGrowthStage;
  plantingDate: string;
  irrigationMethod: "Drip" | "Sprinkler" | "Flood / Furrow" | "Basin Flooding";
  soilMoisturePercent: number; // 0-100%
  cropHealthStatus: "Good" | "Moderate" | "Stressed" | "Diseased";
  waterUsedTodayLiters: number;
  waterUsedThisWeekLiters: number;
  lastIrrigated: string;
  pumpStatus?: "ON" | "OFF";
  diseaseObservations?: string;
  notes?: string;
  imageUrl?: string;
}

export interface IrrigationRecord {
  id: string;
  fieldId: string;
  fieldName: string;
  crop: string;
  date: string;
  time: string;
  durationMinutes: number;
  amountLiters: number;
  method: string;
  savedEstimateLiters: number;
  notes?: string;
}

export type FarmUpdateType =
  | "irrigation"
  | "fertilizer"
  | "pest"
  | "disease"
  | "crop_growth"
  | "growth"
  | "harvest"
  | "general";

export interface FarmUpdate {
  id: string;
  type: FarmUpdateType;
  title: string;
  description: string;
  fieldId?: string;
  fieldName?: string;
  crop?: string;
  date: string;
  timestamp: string;
}

export interface DailyFarmRecommendation {
  id?: string;
  category: "irrigation" | "weather" | "growth" | "health" | "productivity" | "disease" | "water_saving";
  iconType?: "water" | "cloud" | "sprout" | "bug" | "trending";
  title: string;
  message: string;
  description?: string;
  actionText?: string;
  optimalTime?: string;
  waterSavedEstimateLiters?: number;
  priority?: "high" | "medium" | "info";
  urgency?: "urgent" | "high" | "medium" | "low" | "optimal";
  type?: string;
  actionableStep?: string;
  fieldId?: string;
  fieldName?: string;
}

export interface FarmerUser {
  id: string;
  username: string;
  profile: FarmerProfile;
  farm: FarmDetails;
  fields: FarmerField[];
  irrigationRecords: IrrigationRecord[];
  farmUpdates: FarmUpdate[];
  diagnosesHistory?: DiseaseDiagnosis[];
  isDemo?: boolean;
}

export type AppNavigationTab =
  | "overview"
  | "myfarm"
  | "fields"
  | "irrigation"
  | "disease"
  | "weather"
  | "advisor"
  | "updates"
  | "water"
  | "profile";

