import React, { useState, useEffect } from "react";
import { FarmerField } from "../types";
import {
  ALL_CROPS,
  SOIL_TYPES,
  IRRIGATION_METHODS,
  GROWTH_STAGES,
} from "../data/indiaLocations";
import {
  Layers,
  CheckCircle2,
  X,
  Trash2,
  Sprout,
  Calendar,
  Activity,
  Sliders,
} from "lucide-react";

interface FieldManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialField?: FarmerField | null;
  onSaveField: (fieldData: Partial<FarmerField>) => Promise<void>;
  onDeleteField?: (fieldId: string) => Promise<void>;
}

export const FieldManagementModal: React.FC<FieldManagementModalProps> = ({
  isOpen,
  onClose,
  initialField,
  onSaveField,
  onDeleteField,
}) => {
  const isEditing = Boolean(initialField && initialField.id);

  const [name, setName] = useState(initialField?.name || "");
  const [crop, setCrop] = useState(initialField?.crop || "onion");
  const [areaAcres, setAreaAcres] = useState<number>(initialField?.areaAcres || 1.5);
  const [soilType, setSoilType] = useState(initialField?.soilType || "Medium Black Soil");
  const [growthStage, setGrowthStage] = useState(initialField?.growthStage || "Vegetative");
  const [plantingDate, setPlantingDate] = useState(
    initialField?.plantingDate || new Date().toISOString().split("T")[0]
  );
  const [irrigationMethod, setIrrigationMethod] = useState(
    initialField?.irrigationMethod || "Drip"
  );
  const [soilMoisturePercent, setSoilMoisturePercent] = useState<number>(
    initialField?.soilMoisturePercent ?? 45
  );
  const [cropHealthStatus, setCropHealthStatus] = useState<
    "Good" | "Moderate" | "Critical" | "Stressed"
  >(initialField?.cropHealthStatus || "Good");
  const [notes, setNotes] = useState(initialField?.notes || "");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialField) {
      setName(initialField.name);
      setCrop(initialField.crop);
      setAreaAcres(initialField.areaAcres);
      setSoilType(initialField.soilType);
      setGrowthStage(initialField.growthStage);
      setPlantingDate(initialField.plantingDate);
      setIrrigationMethod(initialField.irrigationMethod);
      setSoilMoisturePercent(initialField.soilMoisturePercent);
      setCropHealthStatus(initialField.cropHealthStatus);
      setNotes(initialField.notes || "");
    } else {
      setName("");
      setCrop("onion");
      setAreaAcres(1.5);
      setSoilType("Medium Black Soil");
      setGrowthStage("Vegetative");
      setPlantingDate(new Date().toISOString().split("T")[0]);
      setIrrigationMethod("Drip");
      setSoilMoisturePercent(45);
      setCropHealthStatus("Good");
      setNotes("");
    }
  }, [initialField, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Field name is required");
      return;
    }
    if (!areaAcres || areaAcres <= 0) {
      setError("Please enter a positive acreage");
      return;
    }

    const selectedCropObj = ALL_CROPS.find(
      (c) => c.id.toLowerCase() === crop.toLowerCase()
    );

    try {
      setLoading(true);
      setError(null);
      await onSaveField({
        ...(initialField ? { id: initialField.id } : {}),
        name: name.trim(),
        crop,
        cropDisplayName: selectedCropObj ? `${selectedCropObj.name} (${selectedCropObj.vernacular})` : crop,
        areaAcres: Number(areaAcres),
        soilType,
        growthStage,
        plantingDate,
        irrigationMethod,
        soilMoisturePercent: Number(soilMoisturePercent),
        cropHealthStatus,
        notes: notes.trim(),
      });
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to save field details");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!initialField || !onDeleteField) return;
    if (!window.confirm(`Are you sure you want to remove "${initialField.name}" from your farm?`)) {
      return;
    }
    try {
      setLoading(true);
      await onDeleteField(initialField.id);
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to delete field");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-stone-200 shadow-2xl max-w-xl w-full overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-emerald-900 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-700 flex items-center justify-center text-emerald-100">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">
                {isEditing ? "Edit Field Details" : "Add New Field / Crop Zone"}
              </h3>
              <p className="text-xs text-emerald-200">
                Track soil moisture, growth stage, and irrigation for this specific zone
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
          <div className="mx-5 mt-3 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 font-semibold">
            {error}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto flex-1 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-stone-700 mb-1">Field / Plot Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. North Onion Plot / Shade Block 2"
                className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Crop Type *</label>
              <select
                value={crop}
                onChange={(e) => setCrop(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              >
                {ALL_CROPS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.vernacular})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Field Size (Acres) *</label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                required
                value={areaAcres}
                onChange={(e) => setAreaAcres(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Growth Stage *</label>
              <select
                value={growthStage}
                onChange={(e) => setGrowthStage(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              >
                {GROWTH_STAGES.map((gs) => (
                  <option key={gs} value={gs}>
                    {gs}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Planting / Sowing Date</label>
              <input
                type="date"
                value={plantingDate}
                onChange={(e) => setPlantingDate(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Soil Type in this Field</label>
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
              <label className="block font-bold text-stone-700 mb-1">Irrigation Method</label>
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
              <label className="block font-bold text-stone-700 mb-1">
                Current Soil Moisture: <span className="text-emerald-800 font-extrabold">{soilMoisturePercent}%</span>
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="10"
                  max="95"
                  value={soilMoisturePercent}
                  onChange={(e) => setSoilMoisturePercent(parseInt(e.target.value, 10))}
                  className="w-full accent-emerald-700 cursor-pointer"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Crop Health Status</label>
              <select
                value={cropHealthStatus}
                onChange={(e) => setCropHealthStatus(e.target.value as any)}
                className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              >
                <option value="Good">Good (Healthy Growth)</option>
                <option value="Moderate">Moderate (Needs Attention)</option>
                <option value="Stressed">Stressed (Water/Nutrient Stress)</option>
                <option value="Critical">Critical (Disease/Pest Threat)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Agronomic Notes</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Weed control scheduled next Tuesday"
                className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-stone-200 flex items-center justify-between gap-3">
            {isEditing && onDeleteField ? (
              <button
                type="button"
                onClick={handleDelete}
                className="px-3 py-2 rounded-xl text-rose-700 hover:bg-rose-50 font-bold transition flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                Delete Field
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
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
                {loading ? "Saving..." : isEditing ? "Update Field" : "Add Field to Farm"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
