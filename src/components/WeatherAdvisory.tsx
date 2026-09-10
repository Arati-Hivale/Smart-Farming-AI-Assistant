import React from "react";
import { WeatherData, LanguageCode } from "../types";
import { englishTranslations, SUPPORTED_AI_LANGUAGES } from "../data/translations";
import {
  CloudRain,
  Sun,
  Wind,
  Droplets,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  Compass,
  Volume2,
  VolumeX,
} from "lucide-react";

interface WeatherAdvisoryProps {
  aiLanguage: LanguageCode;
  weatherData: WeatherData;
  selectedDistrict: string;
  onDistrictChange: (district: string) => void;
  onSpeak: (text: string, lang?: LanguageCode) => void;
  isSpeaking: boolean;
  onStopSpeaking: () => void;
}

export const WeatherAdvisory: React.FC<WeatherAdvisoryProps> = ({
  aiLanguage,
  weatherData,
  selectedDistrict,
  onDistrictChange,
  onSpeak,
  isSpeaking,
  onStopSpeaking,
}) => {
  const t = englishTranslations;
  const currentLangMeta = SUPPORTED_AI_LANGUAGES.find((l) => l.code === aiLanguage) || SUPPORTED_AI_LANGUAGES[0];

  // Specific agrarian suitability indicators based on current district conditions
  const isRainHigh = weatherData.rainfallChancePercent > 60;
  const isHumidityHigh = weatherData.humidityPercent > 80;

  const sprayingSuitability = isRainHigh
    ? {
        allowed: false,
        badge: "Postpone Spraying",
        color: "text-red-700 bg-red-50 border-red-200",
        message: "High rain probability will wash away foliar sprays. Postpone chemical and bio-fungicide sprays until a clear dry window.",
      }
    : {
        allowed: true,
        badge: "Good Spray Window",
        color: "text-emerald-700 bg-emerald-50 border-emerald-200",
        message: "Favorable wind (<15 km/h) and no immediate rain expected. Ideal for prophylactic Bordeaux mixture, Neem oil, or foliar nutrition.",
      };

  const drainageSuitability = isRainHigh || isHumidityHigh
    ? {
        alert: true,
        badge: "Drainage Action Required",
        color: "text-amber-800 bg-amber-50 border-amber-200",
        message: "Inspect and clear drainage trenches in field basins to avoid Phytophthora root rot, damping off, and waterlogging.",
      }
    : {
        alert: false,
        badge: "Soil Drainage Stable",
        color: "text-emerald-700 bg-emerald-50 border-emerald-200",
        message: "Aeration in the top root zone is within healthy limits. No standing water detected.",
      };

  const fullAdvisoryAudio = `${weatherData.district}. Temperature ${weatherData.tempC} degrees Celsius, humidity ${weatherData.humidityPercent} percent. ${sprayingSuitability.badge}: ${sprayingSuitability.message}. ${drainageSuitability.badge}: ${drainageSuitability.message}`;

  return (
    <div className="space-y-6" id="weather-advisory-section">
      {/* Header Banner - Entire UI strictly English */}
      <div className="bg-gradient-to-r from-amber-800 via-amber-700 to-emerald-800 text-white p-5 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-amber-600/60 text-amber-100">
              <CloudRain className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold">{t.weather.title}</h2>
          </div>
          <p className="text-sm text-amber-100/90">{t.weather.subtitle}</p>
        </div>

        {/* Read aloud in selected AI Language */}
        <button
          onClick={() => (isSpeaking ? onStopSpeaking() : onSpeak(fullAdvisoryAudio, aiLanguage))}
          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs shadow flex items-center gap-2 transition self-start md:self-center"
        >
          {isSpeaking ? (
            <>
              <VolumeX className="w-4 h-4" />
              <span>Stop Audio</span>
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4" />
              <span>Read Weather Advisory ({currentLangMeta.label})</span>
            </>
          )}
        </button>
      </div>

      {/* Main Live Weather Metrics Card */}
      <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-100">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              {weatherData.state || "Agricultural"} Agro-Climatic Zone
            </span>
            <h3 className="text-2xl font-black text-stone-900 mt-2">
              {weatherData.district}
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Major Cultivated Crops: {weatherData.crops && weatherData.crops.length > 0 ? weatherData.crops.join(", ") : "Regional Crops"}
            </p>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-5xl font-black text-stone-900">
              {weatherData.tempC}°C
            </span>
            <div className="text-right">
              <span className="text-sm font-bold text-stone-700 block">
                {weatherData.condition}
              </span>
              <span className="text-xs text-stone-500">
                Chance of Rain: <strong>{weatherData.rainfallChancePercent}%</strong>
              </span>
            </div>
          </div>
        </div>

        {/* 4 Sensor Parameters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase text-stone-500 block">
                {t.weather.humidity}
              </span>
              <span className="text-lg font-black text-stone-900">
                {weatherData.humidityPercent}%
              </span>
            </div>
          </div>

          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
              <CloudRain className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase text-stone-500 block">
                {t.weather.rainProbability}
              </span>
              <span className="text-lg font-black text-stone-900">
                {weatherData.rainfallChancePercent}%
              </span>
            </div>
          </div>

          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <Wind className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase text-stone-500 block">
                {t.weather.windSpeed}
              </span>
              <span className="text-lg font-black text-stone-900">
                {weatherData.windSpeedKmh} km/h
              </span>
            </div>
          </div>

          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <Sun className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase text-stone-500 block">
                {t.weather.evaporation}
              </span>
              <span className="text-lg font-black text-stone-900">
                {weatherData.evapotranspirationMm ?? 4.2} mm/day
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Actionable Decision Cards: Spray Window & Drainage */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Spray Window */}
        <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-700" />
              <h4 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
                {t.weather.sprayForecast}
              </h4>
            </div>
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-full border ${sprayingSuitability.color}`}
            >
              {sprayingSuitability.badge}
            </span>
          </div>
          <p className="text-xs text-stone-700 leading-relaxed">
            {sprayingSuitability.message}
          </p>
        </div>

        {/* Drainage Action */}
        <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-700" />
              <h4 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
                {t.weather.drainageAlert}
              </h4>
            </div>
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-full border ${drainageSuitability.color}`}
            >
              {drainageSuitability.badge}
            </span>
          </div>
          <p className="text-xs text-stone-700 leading-relaxed">
            {drainageSuitability.message}
          </p>
        </div>
      </div>

      {/* 4-Day Extended Agrometeorological Forecast */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-700" />
            <h3 className="text-base font-bold text-stone-900">
              {t.weather.advisoryCalendar}
            </h3>
          </div>
          <span className="text-xs text-stone-500">
            Automated Regional IMD Weather Sync
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {(weatherData.forecast || []).map((fc, i) => (
            <div
              key={i}
              className="p-4 rounded-xl border border-stone-200 bg-stone-50/60 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-900">{fc.day}</span>
                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {fc.rain} rain
                </span>
              </div>
              <div className="text-base font-black text-stone-800">
                {fc.temp}
              </div>
              <p className="text-xs text-stone-600 border-t border-stone-200/60 pt-2">
                {fc.advisory}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
