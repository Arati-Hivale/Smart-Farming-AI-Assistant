import React, { useState } from "react";
import {
  SensorDataResponse,
  SensorZone,
  LanguageCode,
  IrrigationPlan,
  FarmerUser,
  FarmerField,
} from "../types";
import { englishTranslations, SUPPORTED_AI_LANGUAGES } from "../data/translations";
import {
  Droplets,
  Power,
  TrendingDown,
  Clock,
  Sparkles,
  RefreshCw,
  Sun,
  CloudRain,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Volume2,
  VolumeX,
  Plus,
  Compass,
} from "lucide-react";

interface SmartIrrigationProps {
  aiLanguage: LanguageCode;
  sensorData: SensorDataResponse;
  farmer?: FarmerUser;
  onRefreshSensors: () => void;
  onTogglePump: (zoneId: string, action: "ON" | "OFF") => Promise<void>;
  onSimulateEnv: (mode: "normal" | "dry_spell" | "post_rain") => Promise<void>;
  onSpeak: (text: string, lang?: LanguageCode) => void;
  isSpeaking: boolean;
  onStopSpeaking: () => void;
  onOpenLogIrrigation?: (fieldId?: string) => void;
}

export const SmartIrrigation: React.FC<SmartIrrigationProps> = ({
  aiLanguage,
  sensorData,
  farmer,
  onRefreshSensors,
  onTogglePump,
  onSimulateEnv,
  onSpeak,
  isSpeaking,
  onStopSpeaking,
  onOpenLogIrrigation,
}) => {
  const t = englishTranslations;
  const currentLangMeta = SUPPORTED_AI_LANGUAGES.find((l) => l.code === aiLanguage) || SUPPORTED_AI_LANGUAGES[0];

  // Determine active list of fields: prioritize farmer's real fields if available
  const farmerFields = farmer?.fields || [];
  const [selectedFieldId, setSelectedFieldId] = useState<string>(
    farmerFields[0]?.id || sensorData.zones[0].id
  );

  const [irrigationPlan, setIrrigationPlan] = useState<IrrigationPlan | null>(null);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState<boolean>(false);
  const [operatingPumpZoneId, setOperatingPumpZoneId] = useState<string | null>(null);

  // Synchronize current selected item
  const selectedFarmerField = farmerFields.find((f) => f.id === selectedFieldId) || farmerFields[0];
  const selectedZone = sensorData.zones.find((z) => z.id === selectedFieldId) || sensorData.zones[0];

  const handlePumpClick = async (zoneId: string, currentStatus: "ON" | "OFF") => {
    try {
      setOperatingPumpZoneId(zoneId);
      const nextAction = currentStatus === "ON" ? "OFF" : "ON";
      await onTogglePump(zoneId, nextAction);
    } finally {
      setOperatingPumpZoneId(null);
    }
  };

  const handleFetchAiScheduleForField = async () => {
    setIsGeneratingPlan(true);
    setIrrigationPlan(null);

    const cropName = selectedFarmerField
      ? selectedFarmerField.crop
      : selectedZone.crop;
    const moisture = selectedFarmerField
      ? selectedFarmerField.soilMoisturePercent
      : selectedZone.moisturePercent;

    try {
      const res = await fetch("/api/gemini/irrigation-advice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          crop: cropName,
          soilMoisture: moisture,
          weatherCondition: "Warm tropical agricultural belt",
          tempC: 28,
          humidity: 74,
          language: aiLanguage,
        }),
      });
      if (res.ok) {
        const plan: IrrigationPlan = await res.json();
        setIrrigationPlan(plan);
        if (plan.farmerNote) {
          onSpeak(plan.farmerNote, aiLanguage);
        }
      }
    } catch (e) {
      console.error("Failed to generate AI irrigation schedule", e);
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  const getMoistureBadge = (percent: number) => {
    if (percent < 35) {
      return {
        text: "Critical Dry",
        bg: "bg-rose-100 text-rose-800 border-rose-300",
        barColor: "bg-rose-500",
      };
    }
    if (percent < 48) {
      return {
        text: "Low Moisture",
        bg: "bg-amber-100 text-amber-800 border-amber-300",
        barColor: "bg-amber-500",
      };
    }
    if (percent > 78) {
      return {
        text: "Saturated",
        bg: "bg-sky-100 text-sky-800 border-sky-300",
        barColor: "bg-sky-500",
      };
    }
    return {
      text: "Optimal",
      bg: "bg-emerald-100 text-emerald-800 border-emerald-300",
      barColor: "bg-emerald-500",
    };
  };

  const totalSavedFromRecords = farmer
    ? (farmer.irrigationRecords || []).reduce(
        (acc, r) => acc + (r.savedEstimateLiters || 0),
        0
      )
    : 0;

  const waterSavedLiters = farmer
    ? farmer.farm.waterSavedThisMonthLiters ??
      (totalSavedFromRecords > 0 ? totalSavedFromRecords : 12450)
    : (sensorData?.waterSavedThisMonthLiters ?? 12450);

  return (
    <div className="space-y-6" id="smart-irrigation-section">
      {/* Top Banner with Simulation Controls & Farm Context */}
      <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-sky-50 text-sky-700">
              <Droplets className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-stone-900">
                {farmer ? `${farmer.profile.name}'s Smart Irrigation & Water Management` : t.tabs.irrigation}
              </h2>
              <p className="text-xs text-stone-500">
                {farmer
                  ? `${farmer.farm.farmName || "Farm"} • ${farmer.farm.district}, ${farmer.farm.state} • ${farmer.farm.irrigationMethod} via ${farmer.farm.waterSource}`
                  : "Precision capacitive moisture sensing, schedule automation, and conservation metrics"}
              </p>
            </div>
          </div>
        </div>

        {/* Environment Simulation Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-stone-500 mr-1 hidden sm:inline">Simulate Sensors:</span>
          <button
            onClick={() => onSimulateEnv("dry_spell")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition"
            title="Simulate hot dry spell to test low moisture alerts"
          >
            <Sun className="w-3.5 h-3.5 text-amber-600" />
            Dry Spell (-15%)
          </button>
          <button
            onClick={() => onSimulateEnv("post_rain")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 transition"
            title="Simulate sudden monsoon shower to test water shut-off"
          >
            <CloudRain className="w-3.5 h-3.5 text-sky-600" />
            Monsoon Rain (+25%)
          </button>
          <button
            onClick={() => onSimulateEnv("normal")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700 transition"
            title="Reset to balanced levels"
          >
            Reset
          </button>
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm">
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">
            Monitored Crop Fields
          </span>
          <div className="text-2xl font-black text-stone-900 mt-1">
            {farmer ? farmer.fields.length : sensorData.zones.length} Active Zones
          </div>
          <span className="text-xs text-stone-500 mt-1 block">
            {farmer ? `${farmer.farm.farmSizeAcres} Acres Total Area` : "Capacitive Telemetry Active"}
          </span>
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm">
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">
            Water Saved This Month
          </span>
          <div className="text-2xl font-black text-sky-700 mt-1">
            {(waterSavedLiters ?? 0).toLocaleString()} Liters
          </div>
          <span className="text-xs text-emerald-700 font-semibold mt-1 block flex items-center gap-1">
            <TrendingDown className="w-3.5 h-3.5" /> 35% reduction vs flood baseline
          </span>
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm">
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">
            Optimal Irrigation Window
          </span>
          <div className="text-2xl font-black text-emerald-800 mt-1">
            06:00 AM - 07:30 AM
          </div>
          <span className="text-xs text-stone-500 mt-1 block">
            Early morning (avoids solar evaporation)
          </span>
        </div>
      </div>

      {/* Main Grid: Left Fields List, Right Deep AI Inspection */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Fields / Zones List (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-stone-200 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-stone-900">
                {farmer ? "My Fields & Soil Moisture Telemetry" : t.irrigation.soilMoistureStatus}
              </h3>
              <p className="text-xs text-stone-500">
                Select a field below to inspect precision recommendations and calculate runtime
              </p>
            </div>

            <div className="flex items-center gap-2">
              {onOpenLogIrrigation && (
                <button
                  onClick={() => onOpenLogIrrigation()}
                  className="flex items-center gap-1 text-xs font-bold bg-sky-800 text-white px-3 py-1.5 rounded-xl hover:bg-sky-900 transition shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Log Irrigation
                </button>
              )}
              <button
                onClick={onRefreshSensors}
                className="text-xs font-semibold text-emerald-800 hover:text-emerald-900 flex items-center gap-1 bg-emerald-50 px-2.5 py-1.5 rounded-xl border border-emerald-200 transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Refresh
              </button>
            </div>
          </div>

          {/* Cards List */}
          <div className="space-y-3">
            {(farmer && farmer.fields.length > 0 ? farmer.fields : sensorData.zones).map((item: any) => {
              const isFarmerField = Boolean(item.areaAcres !== undefined);
              const fieldId = item.id;
              const name = item.name;
              const crop = item.cropDisplayName || item.crop;
              const moisture = item.soilMoisturePercent !== undefined ? item.soilMoisturePercent : item.moisturePercent;
              const lastIrrigated = item.lastIrrigated;
              const pumpStatus = item.pumpStatus || "OFF";
              const badge = getMoistureBadge(moisture);
              const isSelected = fieldId === selectedFieldId;
              const isOperating = operatingPumpZoneId === fieldId;

              return (
                <div
                  key={fieldId}
                  onClick={() => setSelectedFieldId(fieldId)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? "border-emerald-600 bg-emerald-50/40 ring-2 ring-emerald-500/20 shadow-sm"
                      : "border-stone-200 hover:border-stone-300 bg-white"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-stone-900">{name}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 border border-stone-200">
                          {crop}
                        </span>
                        {isFarmerField && (
                          <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100/60 px-1.5 py-0.5 rounded">
                            {item.areaAcres} ac • {item.growthStage}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-stone-500 mt-0.5 block">
                        Last irrigated: {lastIrrigated}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${badge.bg}`}>
                        {moisture}% • {badge.text}
                      </span>

                      {/* Log or Toggle Pump */}
                      {onOpenLogIrrigation && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenLogIrrigation(fieldId);
                          }}
                          className="px-2.5 py-1 rounded-lg text-xs font-bold bg-sky-800 hover:bg-sky-900 text-white transition flex items-center gap-1"
                        >
                          <Droplets className="w-3 h-3" />
                          Log
                        </button>
                      )}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePumpClick(fieldId, pumpStatus);
                        }}
                        disabled={isOperating}
                        className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
                          pumpStatus === "ON"
                            ? "bg-rose-700 hover:bg-rose-800 text-white shadow-xs"
                            : "bg-emerald-800 hover:bg-emerald-900 text-white shadow-xs"
                        }`}
                      >
                        <Power className="w-3.5 h-3.5" />
                        {pumpStatus === "ON" ? "Pump ON" : "Turn ON"}
                      </button>
                    </div>
                  </div>

                  {/* Visual Progress Bar */}
                  <div className="mt-3">
                    <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${badge.barColor}`}
                        style={{ width: `${Math.min(100, moisture)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-stone-400 mt-1">
                      <span>0% (Wilting)</span>
                      <span>Optimal: 45-65%</span>
                      <span>100% (Field Capacity)</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Field AI Precision Inspection & Schedule (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="border-b border-stone-100 pb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                Precision Field Inspection
              </span>
              <h3 className="text-lg font-bold text-stone-900 mt-0.5">
                {selectedFarmerField?.name || selectedZone?.name}
              </h3>
              <p className="text-xs text-stone-500">
                Crop: <strong className="text-stone-700">{selectedFarmerField?.cropDisplayName || selectedZone?.crop}</strong>
                {selectedFarmerField && ` • Soil: ${selectedFarmerField.soilType}`}
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-2.5">
                <span className="text-[10px] text-stone-500 font-bold uppercase block">Moisture</span>
                <span className="text-base font-black text-stone-900">
                  {selectedFarmerField ? selectedFarmerField.soilMoisturePercent : selectedZone.moisturePercent}%
                </span>
              </div>
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-2.5">
                <span className="text-[10px] text-stone-500 font-bold uppercase block">Area</span>
                <span className="text-base font-black text-stone-900">
                  {selectedFarmerField ? `${selectedFarmerField.areaAcres} ac` : "1.2 ac"}
                </span>
              </div>
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-2.5">
                <span className="text-[10px] text-stone-500 font-bold uppercase block">Method</span>
                <span className="text-xs font-bold text-emerald-800 block mt-1">
                  {selectedFarmerField ? selectedFarmerField.irrigationMethod : "Drip"}
                </span>
              </div>
            </div>

            {/* AI Calculation Trigger */}
            <button
              onClick={handleFetchAiScheduleForField}
              disabled={isGeneratingPlan}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-800 to-teal-800 hover:from-emerald-900 hover:to-teal-900 text-white font-bold text-xs shadow flex items-center justify-center gap-2 transition"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              {isGeneratingPlan
                ? "Calculating Agronomic Schedule..."
                : `Generate AI Irrigation Plan (${currentLangMeta.label})`}
            </button>

            {/* AI Irrigation Plan Display */}
            {irrigationPlan && (
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 text-xs space-y-3">
                <div className="flex items-center justify-between border-b border-emerald-200/80 pb-2">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-950">
                    <Droplets className="w-4 h-4 text-sky-600" />
                    <span>Decision: {irrigationPlan.irrigateNow ? "Irrigate Today" : "Skip Irrigation"}</span>
                  </div>
                  <span
                    className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                      irrigationPlan.urgency === "High"
                        ? "bg-rose-100 text-rose-800"
                        : "bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    {irrigationPlan.urgency}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="bg-white p-2 rounded-lg border border-emerald-100">
                    <span className="text-stone-500 block">Recommended Volume:</span>
                    <strong className="text-stone-800 font-bold">
                      {irrigationPlan.recommendedAmountLiters} Liters / Plant
                    </strong>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-emerald-100">
                    <span className="text-stone-500 block">Drip Duration:</span>
                    <strong className="text-stone-800 font-bold">
                      {irrigationPlan.recommendedDurationMinutes} Minutes
                    </strong>
                  </div>
                </div>

                <div className="text-[11px] text-stone-600 bg-white p-2 rounded-lg border border-emerald-100 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>Optimal: <strong>{irrigationPlan.optimalTimeOfDay}</strong></span>
                </div>

                {irrigationPlan.farmerNote && (
                  <div className="p-2.5 bg-amber-50/90 border border-amber-200 rounded-lg text-amber-950 font-medium leading-relaxed text-[11px]">
                    {irrigationPlan.farmerNote}
                  </div>
                )}

                {/* Voice Readout Controls */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-stone-500">
                    Language: {currentLangMeta.label} ({currentLangMeta.nativeLabel})
                  </span>
                  {isSpeaking ? (
                    <button
                      onClick={onStopSpeaking}
                      className="text-xs font-bold text-rose-700 hover:text-rose-800 flex items-center gap-1"
                    >
                      <VolumeX className="w-3.5 h-3.5" /> Stop
                    </button>
                  ) : (
                    <button
                      onClick={() => onSpeak(irrigationPlan.farmerNote, aiLanguage)}
                      className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
                    >
                      <Volume2 className="w-3.5 h-3.5" /> Read Aloud
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Water Conservation Guidance Note */}
          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 text-xs text-stone-600 space-y-2">
            <h4 className="font-bold text-stone-900 flex items-center gap-1.5">
              <TrendingDown className="w-4 h-4 text-emerald-700" />
              Agronomic Water Conservation Rule
            </h4>
            <p className="text-[11px] leading-relaxed">
              Applying drip irrigation between 6:00 AM and 8:00 AM reduces evaporative loss by up to 40%. Stopping pumps when soil moisture reaches 65% prevents collar-rot and fungal pathogens while safeguarding local groundwater.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
