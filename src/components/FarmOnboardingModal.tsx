import React, { useState, useEffect } from "react";
import { FarmerUser, LanguageCode } from "../types";
import {
  INDIAN_STATES,
  SOIL_TYPES,
  IRRIGATION_METHODS,
  WATER_SOURCES,
} from "../data/indiaLocations";
import { SUPPORTED_AI_LANGUAGES } from "../data/translations";
import {
  MapPin,
  CheckCircle2,
  X,
  Droplets,
  Layers,
  Sprout,
  User,
  Phone,
  Compass,
} from "lucide-react";

interface FarmOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  farmer: FarmerUser;
  onSave: (data: {
    name: string;
    mobile: string;
    preferredLanguage: LanguageCode;
    farmName: string;
    state: string;
    district: string;
    village: string;
    farmSizeAcres: number;
    soilType: string;
    irrigationMethod: string;
    waterSource: string;
  }) => Promise<void>;
}

export const FarmOnboardingModal: React.FC<FarmOnboardingModalProps> = ({
  isOpen,
  onClose,
  farmer,
  onSave,
}) => {
  const [name, setName] = useState(farmer.profile.name);
  const [mobile, setMobile] = useState(farmer.profile.mobile);
  const [preferredLanguage, setPreferredLanguage] = useState<LanguageCode>(farmer.profile.preferredLanguage);

  const [farmName, setFarmName] = useState(farmer.farm.farmName || `${farmer.profile.name}'s Farm`);
  const [state, setState] = useState(farmer.farm.state || "Maharashtra");
  const [district, setDistrict] = useState(farmer.farm.district || "Nashik");
  const [village, setVillage] = useState(farmer.farm.village || "");
  const [farmSizeAcres, setFarmSizeAcres] = useState<number>(farmer.farm.farmSizeAcres || 3.5);
  const [soilType, setSoilType] = useState(farmer.farm.soilType || "Medium Black Soil");
  const [irrigationMethod, setIrrigationMethod] = useState(farmer.farm.irrigationMethod || "Drip Irrigation");
  const [waterSource, setWaterSource] = useState(farmer.farm.waterSource || "Borewell");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Available districts for chosen state
  const selectedStateObj = INDIAN_STATES.find(
    (s) => s.name.toLowerCase() === state.toLowerCase()
  ) || INDIAN_STATES[0];

  // When state changes, auto-select the first district in that state if current district doesn't belong
  const handleStateChange = (newState: string) => {
    setState(newState);
    const matched = INDIAN_STATES.find((s) => s.name.toLowerCase() === newState.toLowerCase());
    if (matched && matched.districts.length > 0) {
      setDistrict(matched.districts[0].name);
    }
  };

  useEffect(() => {
    if (farmer) {
      setName(farmer.profile.name);
      setMobile(farmer.profile.mobile);
      setPreferredLanguage(farmer.profile.preferredLanguage);
      setFarmName(farmer.farm.farmName || `${farmer.profile.name}'s Farm`);
      setState(farmer.farm.state);
      setDistrict(farmer.farm.district);
      setVillage(farmer.farm.village || "");
      setFarmSizeAcres(farmer.farm.farmSizeAcres);
      setSoilType(farmer.farm.soilType);
      setIrrigationMethod(farmer.farm.irrigationMethod);
      setWaterSource(farmer.farm.waterSource);
    }
  }, [farmer]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Farmer name is required");
      return;
    }
    if (!state.trim() || !district.trim()) {
      setError("Please select both State and District");
      return;
    }
    if (!farmSizeAcres || farmSizeAcres <= 0) {
      setError("Please enter a valid farm size in acres");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await onSave({
        name: name.trim(),
        mobile: mobile.trim(),
        preferredLanguage,
        farmName: farmName.trim(),
        state,
        district,
        village: village.trim(),
        farmSizeAcres: Number(farmSizeAcres),
        soilType,
        irrigationMethod,
        waterSource,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to save farm setup");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-stone-200 shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-emerald-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 flex items-center justify-center text-emerald-100">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg leading-tight">Set Up Your Farm</h3>
              <p className="text-xs text-emerald-200">
                Personalize soil, weather, irrigation schedules, and crop advisory for your real land
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-emerald-200 hover:text-white p-1 rounded-lg hover:bg-emerald-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 font-semibold">
            {error}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-5 text-xs">
          {/* Section 1: Farmer Identity */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 pb-1 border-b border-stone-200 text-stone-900 font-bold text-sm">
              <User className="w-4 h-4 text-emerald-700" />
              <h4>1. Farmer Profile</h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Farmer Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  placeholder="e.g. Ramesh Patil"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Mobile Number (10 Digits)</label>
                <input
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  placeholder="e.g. 9822012345"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-stone-700 mb-1">Preferred AI Advisor Language</label>
                <select
                  value={preferredLanguage}
                  onChange={(e) => setPreferredLanguage(e.target.value as LanguageCode)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                >
                  {SUPPORTED_AI_LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.flag} {lang.label} ({lang.nativeLabel})
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-stone-500 mt-1">
                  The dashboard interface remains in English; only AI voice & chat responses will use this language.
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Farm Location */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 pb-1 border-b border-stone-200 text-stone-900 font-bold text-sm">
              <MapPin className="w-4 h-4 text-emerald-700" />
              <h4>2. Farm Location & Size</h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-stone-700 mb-1">State (India) *</label>
                <select
                  value={state}
                  onChange={(e) => handleStateChange(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                >
                  {INDIAN_STATES.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">District *</label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                >
                  {(selectedStateObj?.districts || []).map((d) => (
                    <option key={d.id} value={d.name}>
                      {d.name} {d.majorCrops && d.majorCrops.length > 0 ? `(${d.majorCrops.slice(0, 2).join(", ")})` : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Village / Taluka / Area</label>
                <input
                  type="text"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  placeholder="e.g. Niphad / Mananthavady"
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Total Farm Size (Acres) *</label>
                <input
                  type="number"
                  step="0.1"
                  min="0.2"
                  max="500"
                  required
                  value={farmSizeAcres}
                  onChange={(e) => setFarmSizeAcres(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-stone-700 mb-1">Farm / Property Name</label>
                <input
                  type="text"
                  value={farmName}
                  onChange={(e) => setFarmName(e.target.value)}
                  placeholder="e.g. Patil Organic Agro Farm"
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Soil & Water Infrastructure */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 pb-1 border-b border-stone-200 text-stone-900 font-bold text-sm">
              <Droplets className="w-4 h-4 text-emerald-700" />
              <h4>3. Soil & Irrigation Infrastructure</h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Primary Soil Type *</label>
                <select
                  value={soilType}
                  onChange={(e) => setSoilType(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                >
                  {SOIL_TYPES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Primary Irrigation Method *</label>
                <select
                  value={irrigationMethod}
                  onChange={(e) => setIrrigationMethod(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                >
                  {IRRIGATION_METHODS.map((im) => (
                    <option key={im} value={im}>
                      {im}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Water Source *</label>
                <select
                  value={waterSource}
                  onChange={(e) => setWaterSource(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                >
                  {WATER_SOURCES.map((ws) => (
                    <option key={ws} value={ws}>
                      {ws}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 font-bold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold transition flex items-center gap-2 shadow-xs"
            >
              <CheckCircle2 className="w-4 h-4" />
              {loading ? "Saving Farm..." : "Save Farm Details"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
