import React from "react";
import {
  FarmerUser,
  FarmerField,
  WeatherData,
  DailyFarmRecommendation,
  LanguageCode,
} from "../types";
import { englishTranslations } from "../data/translations";
import { TodayFarmRecommendations } from "./TodayFarmRecommendations";
import { FarmJournalTimeline } from "./FarmJournalTimeline";
import {
  Droplets,
  Leaf,
  CloudSun,
  Mic,
  ArrowRight,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  MapPin,
  Layers,
  Plus,
  Compass,
  Edit3,
  Calendar,
  Activity,
  Wind,
  Thermometer,
} from "lucide-react";

interface FarmOverviewProps {
  farmer: FarmerUser;
  weatherData: WeatherData;
  dailyRecommendations: DailyFarmRecommendation[];
  aiLanguage: LanguageCode;
  onNavigateTab: (tab: "overview" | "irrigation" | "disease" | "weather" | "advisor") => void;
  onSpeak: (text: string, lang?: LanguageCode) => void;
  onOpenAddField: () => void;
  onEditField: (field: FarmerField) => void;
  onOpenIrrigateModal: (fieldId: string) => void;
  onOpenAddJournalModal: () => void;
  onOpenFarmSetup: () => void;
  onRefreshRecommendations?: () => void;
}

export const FarmOverview: React.FC<FarmOverviewProps> = ({
  farmer,
  weatherData,
  dailyRecommendations,
  aiLanguage,
  onNavigateTab,
  onSpeak,
  onOpenAddField,
  onEditField,
  onOpenIrrigateModal,
  onOpenAddJournalModal,
  onOpenFarmSetup,
  onRefreshRecommendations,
}) => {
  const t = englishTranslations;

  // Identify dry fields needing immediate irrigation
  const dryFields = farmer.fields.filter((f) => f.soilMoisturePercent < 35);
  const lowFields = farmer.fields.filter((f) => f.soilMoisturePercent >= 35 && f.soilMoisturePercent < 45);

  // Calculate total water conserved across irrigation records or fallback
  const waterSavedFromRecords = (farmer.irrigationRecords || []).reduce(
    (acc, r) => acc + (r.savedEstimateLiters || 0),
    0
  );
  const waterSavedThisMonth =
    farmer.farm.waterSavedThisMonthLiters ??
    (waterSavedFromRecords > 0 ? waterSavedFromRecords : 12450);

  return (
    <div className="space-y-6" id="personalized-farm-overview">
      {/* 1. Farmer Identity & Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Smart Farmer Platform • Private Dashboard
            </span>
            <span className="inline-flex items-center gap-1 bg-emerald-700/60 text-emerald-100 text-xs font-medium px-3 py-1 rounded-full border border-emerald-500/30">
              <MapPin className="w-3 h-3 text-amber-300" />
              {farmer.farm.village ? `${farmer.farm.village}, ` : ""}
              {farmer.farm.district}, {farmer.farm.state}
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Welcome back, {farmer.profile.name}
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed mt-1">
                {farmer.farm.farmName || "Primary Agriculture Farm"} •{" "}
                <strong className="text-white">{farmer.farm.farmSizeAcres} Acres</strong> •{" "}
                {farmer.farm.soilType} • {farmer.farm.irrigationMethod}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={onOpenFarmSetup}
                className="bg-emerald-950/70 hover:bg-emerald-950 text-emerald-200 hover:text-white border border-emerald-700/60 text-xs font-bold px-3.5 py-2 rounded-xl transition flex items-center gap-1.5"
              >
                <Compass className="w-3.5 h-3.5" />
                Edit Farm Details
              </button>
              <button
                onClick={onOpenAddField}
                className="bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-bold px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-4 h-4" />
                Add Field / Crop Zone
              </button>
            </div>
          </div>

          {/* Quick Action Navigation Buttons */}
          <div className="pt-2 flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => onNavigateTab("disease")}
              className="bg-emerald-700/80 hover:bg-emerald-700 text-white font-bold px-3.5 py-2 rounded-xl text-xs border border-emerald-500/40 flex items-center gap-2 transition"
            >
              <Leaf className="w-3.5 h-3.5 text-amber-300" />
              Scan Crop Disease
            </button>
            <button
              onClick={() => onNavigateTab("irrigation")}
              className="bg-emerald-700/80 hover:bg-emerald-700 text-white font-bold px-3.5 py-2 rounded-xl text-xs border border-emerald-500/40 flex items-center gap-2 transition"
            >
              <Droplets className="w-3.5 h-3.5 text-sky-300" />
              Smart Irrigation Schedules
            </button>
            <button
              onClick={() => onNavigateTab("weather")}
              className="bg-emerald-700/80 hover:bg-emerald-700 text-white font-bold px-3.5 py-2 rounded-xl text-xs border border-emerald-500/40 flex items-center gap-2 transition"
            >
              <CloudSun className="w-3.5 h-3.5 text-amber-200" />
              {farmer.farm.district} Weather
            </button>
            <button
              onClick={() => onNavigateTab("advisor")}
              className="bg-emerald-950/90 hover:bg-emerald-950 text-amber-300 font-bold px-3.5 py-2 rounded-xl text-xs border border-emerald-700 flex items-center gap-2 transition"
            >
              <Mic className="w-3.5 h-3.5 text-amber-400" />
              Ask Kisan Mitra AI
            </button>
          </div>
        </div>

        {/* Decorative Watermark */}
        <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 opacity-10 pointer-events-none">
          <Leaf className="w-80 h-80 text-emerald-100" />
        </div>
      </div>

      {/* 2. Urgent Attention Banner if dry fields exist */}
      {dryFields.length > 0 && (
        <div className="bg-rose-50 border-l-4 border-rose-600 p-4 rounded-r-2xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-rose-900">
                Moisture Alert: {dryFields.map((f) => `${f.name} (${f.cropDisplayName || f.crop} at ${f.soilMoisturePercent}%)`).join(", ")}
              </h4>
              <p className="text-xs text-rose-800 mt-0.5">
                Soil moisture is below optimal threshold. Schedule early-morning drip irrigation to avoid crop stress.
              </p>
            </div>
          </div>
          <button
            onClick={() => onOpenIrrigateModal(dryFields[0].id)}
            className="shrink-0 px-3.5 py-1.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold self-start sm:self-center transition shadow-xs flex items-center gap-1.5"
          >
            <Droplets className="w-3.5 h-3.5" />
            Irrigate Now
          </button>
        </div>
      )}

      {/* 3. Section 6: TODAY'S AI FARM RECOMMENDATIONS (Prominent on Dashboard) */}
      <TodayFarmRecommendations
        farmer={farmer}
        weather={weatherData}
        recommendations={dailyRecommendations}
        onAskAi={(prompt) => {
          onNavigateTab("advisor");
          onSpeak(prompt, aiLanguage);
        }}
        onRefresh={onRefreshRecommendations}
        onIrrigateField={(fieldId) => onOpenIrrigateModal(fieldId)}
      />

      {/* 4. Farmer's Fields / Crop Zones & Live Water Metrics */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-800" />
              My Farm Fields & Crop Zones ({farmer.fields.length})
            </h3>
            <p className="text-xs text-stone-500">
              Live soil moisture levels, growth stages, health indicators, and irrigation records
            </p>
          </div>

          <button
            onClick={onOpenAddField}
            className="flex items-center gap-1 text-xs font-bold bg-emerald-800 text-white px-3 py-1.5 rounded-xl hover:bg-emerald-900 transition self-start sm:self-auto shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            Add New Field
          </button>
        </div>

        {/* Fields Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {farmer.fields.map((field) => {
            const isDry = field.soilMoisturePercent < 35;
            const isLow = field.soilMoisturePercent >= 35 && field.soilMoisturePercent < 50;

            return (
              <div
                key={field.id}
                className={`rounded-2xl border p-4.5 bg-white transition hover:shadow-md flex flex-col justify-between ${
                  isDry
                    ? "border-rose-300 ring-1 ring-rose-200"
                    : isLow
                    ? "border-amber-300"
                    : "border-stone-200"
                }`}
              >
                <div>
                  {/* Field Header */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h4 className="text-sm font-bold text-stone-900 leading-tight">
                        {field.name}
                      </h4>
                      <span className="text-xs font-medium text-emerald-800">
                        {field.cropDisplayName || field.crop}
                      </span>
                    </div>

                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                        field.cropHealthStatus === "Good"
                          ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                          : field.cropHealthStatus === "Moderate"
                          ? "bg-amber-100 text-amber-900 border-amber-300"
                          : "bg-rose-100 text-rose-800 border-rose-300"
                      }`}
                    >
                      {field.cropHealthStatus}
                    </span>
                  </div>

                  {/* Attributes badge list */}
                  <div className="flex flex-wrap gap-1.5 text-[11px] text-stone-600 mb-3">
                    <span className="bg-stone-100 px-2 py-0.5 rounded-md font-semibold text-stone-700">
                      {field.areaAcres} Acres
                    </span>
                    <span className="bg-stone-100 px-2 py-0.5 rounded-md">
                      {field.growthStage}
                    </span>
                    <span className="bg-stone-100 px-2 py-0.5 rounded-md">
                      {field.irrigationMethod}
                    </span>
                  </div>

                  {/* Soil Moisture Bar */}
                  <div className="bg-stone-50 rounded-xl p-3 border border-stone-200/80 mb-3 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-stone-600">Soil Moisture:</span>
                      <span
                        className={`font-black ${
                          isDry
                            ? "text-rose-700"
                            : isLow
                            ? "text-amber-700"
                            : "text-emerald-700"
                        }`}
                      >
                        {field.soilMoisturePercent}% ({isDry ? "Low" : isLow ? "Moderate" : "Optimal"})
                      </span>
                    </div>

                    <div className="w-full bg-stone-200 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isDry
                            ? "bg-rose-500"
                            : isLow
                            ? "bg-amber-500"
                            : "bg-emerald-600"
                        }`}
                        style={{ width: `${Math.min(100, field.soilMoisturePercent)}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-stone-500 pt-0.5">
                      <span>Last Irrigated: {field.lastIrrigated}</span>
                      {field.waterUsedTodayLiters ? (
                        <span className="text-sky-700 font-semibold">{field.waterUsedTodayLiters}L today</span>
                      ) : null}
                    </div>
                  </div>

                  {field.notes && (
                    <p className="text-[11px] text-stone-500 italic mb-3">
                      Note: "{field.notes}"
                    </p>
                  )}
                </div>

                {/* Field Action Buttons */}
                <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onOpenIrrigateModal(field.id)}
                    className="flex-1 py-1.5 px-2.5 rounded-lg bg-sky-800 hover:bg-sky-900 text-white font-bold text-xs flex items-center justify-center gap-1 transition shadow-2xs"
                  >
                    <Droplets className="w-3.5 h-3.5" />
                    Log Irrigation
                  </button>

                  <button
                    onClick={() => onEditField(field)}
                    className="py-1.5 px-2.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs flex items-center gap-1 transition"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    Edit
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Water Conservation Metric & District Weather Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card 1: Water Conservation Metric */}
        <div className="bg-gradient-to-br from-emerald-800 to-teal-900 text-white rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-200 block">
              Water Conserved This Month
            </span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-4xl font-black tracking-tight text-amber-300">
                {waterSavedThisMonth.toLocaleString()}
              </span>
              <span className="text-base text-emerald-100 font-medium">Liters</span>
            </div>
            <p className="text-xs text-emerald-100/80 mt-3 leading-relaxed">
              Conserved on {farmer.profile.name}'s farm by synchronizing irrigation with district rainfall probability and precision soil moisture cutoffs.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-emerald-700/60 flex items-center justify-between text-xs text-emerald-200">
            <span className="flex items-center gap-1">
              <TrendingDown className="w-4 h-4 text-amber-300" />
              35% reduction vs traditional flood
            </span>
            <span className="font-bold text-white">Target: 15,000 L</span>
          </div>
        </div>

        {/* Card 2: District Weather Snapshot */}
        <div className="lg:col-span-2 bg-white border border-stone-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <CloudSun className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-bold text-stone-900">
                  {weatherData.district}
                </h3>
              </div>
              <p className="text-xs text-stone-500">
                Agro-climatic weather conditions and rainfall probability for {farmer.farm.state}
              </p>
            </div>
            <button
              onClick={() => onNavigateTab("weather")}
              className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
            >
              Full Forecast →
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 text-center">
              <span className="text-[11px] text-stone-500 font-semibold block">Condition</span>
              <span className="text-xs font-bold text-stone-900 mt-1 block truncate">
                {weatherData.condition}
              </span>
            </div>

            <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 text-center">
              <span className="text-[11px] text-stone-500 font-semibold block">Temperature</span>
              <span className="text-lg font-black text-amber-600 mt-0.5 block">
                {weatherData.tempC}°C
              </span>
            </div>

            <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 text-center">
              <span className="text-[11px] text-stone-500 font-semibold block">Rain Probability</span>
              <span className="text-lg font-black text-sky-600 mt-0.5 block">
                {weatherData.rainfallChancePercent}%
              </span>
            </div>

            <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 text-center">
              <span className="text-[11px] text-stone-500 font-semibold block">Humidity</span>
              <span className="text-lg font-black text-emerald-700 mt-0.5 block">
                {weatherData.humidityPercent}%
              </span>
            </div>
          </div>

          {weatherData.alerts && weatherData.alerts.length > 0 && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold">{weatherData.alerts[0].title}: </strong>
                <span>{weatherData.alerts[0].message}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 6. Section 10: FARM ACTIVITY & JOURNAL TIMELINE */}
      <FarmJournalTimeline
        updates={farmer.farmUpdates}
        onOpenAddModal={onOpenAddJournalModal}
      />
    </div>
  );
};
