import React from "react";
import { DailyFarmRecommendation, FarmerUser, WeatherData } from "../types";
import {
  Sparkles,
  Droplets,
  CloudSun,
  AlertTriangle,
  CheckCircle2,
  Lightbulb,
  Clock,
  ArrowRight,
  TrendingDown,
  RefreshCw,
  Zap,
} from "lucide-react";

interface TodayFarmRecommendationsProps {
  farmer: FarmerUser;
  weather: WeatherData;
  recommendations: DailyFarmRecommendation[];
  onAskAi: (prompt: string) => void;
  onRefresh?: () => void;
  onIrrigateField?: (fieldId: string) => void;
}

export const TodayFarmRecommendations: React.FC<TodayFarmRecommendationsProps> = ({
  farmer,
  weather,
  recommendations,
  onAskAi,
  onRefresh,
  onIrrigateField,
}) => {
  const getIconForType = (type?: string) => {
    switch (type) {
      case "irrigation":
        return <Droplets className="w-5 h-5 text-sky-600" />;
      case "weather":
        return <CloudSun className="w-5 h-5 text-amber-600" />;
      case "disease_risk":
      case "disease":
        return <AlertTriangle className="w-5 h-5 text-rose-600" />;
      case "priority_task":
      case "growth":
        return <CheckCircle2 className="w-5 h-5 text-emerald-700" />;
      case "water_saving":
        return <Lightbulb className="w-5 h-5 text-teal-600" />;
      default:
        return <Sparkles className="w-5 h-5 text-amber-500" />;
    }
  };

  const getUrgencyBadge = (urgency?: string) => {
    switch (urgency) {
      case "urgent":
        return (
          <span className="bg-rose-100 text-rose-800 border border-rose-300 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-ping" /> Urgent
          </span>
        );
      case "high":
        return (
          <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full">
            High Priority
          </span>
        );
      case "medium":
        return (
          <span className="bg-sky-100 text-sky-800 border border-sky-300 text-[10px] font-medium uppercase px-2 py-0.5 rounded-full">
            Medium
          </span>
        );
      case "optimal":
      case "low":
        return (
          <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-medium uppercase px-2 py-0.5 rounded-full">
            Optimal
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <section className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-300/30 flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold tracking-tight text-white">
                Today's AI Farm Recommendations
              </h2>
              <span className="bg-amber-400 text-emerald-950 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md">
                Live
              </span>
            </div>
            <p className="text-xs text-emerald-100/85">
              Personalized for <span className="font-semibold text-white">{farmer.profile.name}</span>'s farm in{" "}
              <span className="font-semibold text-amber-200">
                {farmer.farm.village ? `${farmer.farm.village}, ` : ""}
                {farmer.farm.district} ({farmer.farm.state})
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="flex items-center gap-1 text-xs font-semibold bg-emerald-700/80 hover:bg-emerald-700 text-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-500/30 transition"
              title="Refresh recommendations with latest sensor & weather data"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Refresh
            </button>
          )}
        </div>
      </div>

      {/* Grid of 5 Mandatory Recommendation Cards */}
      <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommendations.map((rec, index) => {
          const cardKey = rec.id || `rec-${rec.category || "item"}-${rec.fieldId || "general"}-${index}`;
          const effectiveType = rec.type || rec.category;
          const effectiveUrgency =
            rec.urgency ||
            (rec.priority === "high" ? "high" : rec.priority === "medium" ? "medium" : "optimal");
          const descriptionText = rec.description || rec.message;
          const actionText = rec.actionText || rec.actionableStep || "Follow recommended agronomic protocol";

          return (
            <div
              key={cardKey}
              className={`rounded-xl border p-4 flex flex-col justify-between transition-all duration-200 hover:shadow-md ${
                effectiveUrgency === "urgent"
                  ? "border-rose-200 bg-rose-50/40"
                  : effectiveUrgency === "high"
                  ? "border-amber-200 bg-amber-50/30"
                  : "border-stone-200 bg-stone-50/50"
              }`}
            >
              <div>
                {/* Card Header */}
                <div className="flex items-start justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-white shadow-xs border border-stone-200/80">
                      {getIconForType(effectiveType)}
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-stone-700">
                      {rec.category}
                    </span>
                  </div>
                  {getUrgencyBadge(effectiveUrgency)}
                </div>

                {/* Title & Description */}
                <h3 className="text-sm font-bold text-stone-900 leading-snug mb-1.5">
                  {rec.title}
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed mb-3">
                  {descriptionText}
                </p>

                {/* Actionable Details Box */}
                <div className="bg-white rounded-lg p-2.5 border border-stone-200/80 space-y-1.5 mb-3 text-xs">
                  <div className="flex items-center gap-1.5 font-semibold text-emerald-900">
                    <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>{actionText}</span>
                  </div>

                  {rec.optimalTime && (
                    <div className="flex items-center gap-1.5 text-stone-500 text-[11px]">
                      <Clock className="w-3 h-3 shrink-0" />
                      <span>Recommended Window: <strong className="text-stone-700">{rec.optimalTime}</strong></span>
                    </div>
                  )}

                  {rec.waterSavedEstimateLiters != null && (
                    <div className="flex items-center gap-1.5 text-emerald-700 text-[11px]">
                      <TrendingDown className="w-3 h-3 shrink-0" />
                      <span>Est. Water Saved: <strong>{Number(rec.waterSavedEstimateLiters || 0).toLocaleString()} Liters</strong></span>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between gap-2">
                {rec.fieldId && onIrrigateField && effectiveType === "irrigation" ? (
                  <button
                    onClick={() => onIrrigateField(rec.fieldId!)}
                    className="w-full text-xs font-bold py-1.5 px-3 rounded-lg bg-emerald-800 text-white hover:bg-emerald-900 transition flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Droplets className="w-3.5 h-3.5" />
                    Record Irrigation Now
                  </button>
                ) : (
                  <button
                    onClick={() => onAskAi(`Regarding my farm's ${rec.title}: ${descriptionText}. What detailed agronomic steps should I take today?`)}
                    className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 py-1 transition group"
                  >
                    <span>Ask Kisan Mitra</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
