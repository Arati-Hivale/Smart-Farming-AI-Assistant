import React, { useState } from "react";
import { FarmerField } from "../types";
import { IRRIGATION_METHODS } from "../data/indiaLocations";
import {
  Droplets,
  CheckCircle2,
  X,
  Clock,
  Calendar,
} from "lucide-react";

interface LogIrrigationModalProps {
  isOpen: boolean;
  onClose: () => void;
  fields: FarmerField[];
  selectedFieldId?: string;
  onRecordIrrigation: (data: {
    fieldId: string;
    amountLiters: number;
    durationMinutes: number;
    method: string;
    notes?: string;
  }) => Promise<void>;
}

export const LogIrrigationModal: React.FC<LogIrrigationModalProps> = ({
  isOpen,
  onClose,
  fields,
  selectedFieldId,
  onRecordIrrigation,
}) => {
  const [fieldId, setFieldId] = useState<string>(
    selectedFieldId || (fields[0]?.id ?? "")
  );
  const [amountLiters, setAmountLiters] = useState<number>(1200);
  const [durationMinutes, setDurationMinutes] = useState<number>(45);
  const [method, setMethod] = useState<string>("Drip");
  const [notes, setNotes] = useState<string>("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentField = fields.find((f) => f.id === fieldId) || fields[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fieldId) {
      setError("Please select a field to irrigate");
      return;
    }
    if (!amountLiters || amountLiters <= 0) {
      setError("Please provide water quantity in liters");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await onRecordIrrigation({
        fieldId,
        amountLiters: Number(amountLiters),
        durationMinutes: Number(durationMinutes) || 30,
        method,
        notes: notes.trim(),
      });
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to record irrigation event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-stone-200 shadow-2xl max-w-md w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-sky-900 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-700 flex items-center justify-center text-sky-100">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">Log Irrigation Event</h3>
              <p className="text-xs text-sky-200">
                Record applied water to maintain soil moisture and track water conservation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-sky-200 hover:text-white p-1 rounded-lg hover:bg-sky-800 transition"
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
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto flex-1 space-y-3.5 text-xs">
          <div>
            <label className="block font-bold text-stone-700 mb-1">Target Field / Crop Zone *</label>
            <select
              value={fieldId}
              onChange={(e) => setFieldId(e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-sky-700 focus:outline-none"
            >
              {fields.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name} ({f.cropDisplayName || f.crop} • {f.areaAcres} ac • {f.soilMoisturePercent}% moisture)
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-stone-700 mb-1">Water Applied (Liters) *</label>
              <input
                type="number"
                step="50"
                min="50"
                required
                value={amountLiters}
                onChange={(e) => setAmountLiters(parseInt(e.target.value, 10) || 0)}
                className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-sky-700 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Pump Runtime (Minutes)</label>
              <input
                type="number"
                step="5"
                min="5"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(parseInt(e.target.value, 10) || 0)}
                className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-sky-700 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1">Irrigation Method</label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-sky-700 focus:outline-none"
            >
              {IRRIGATION_METHODS.map((im) => (
                <option key={im} value={im}>
                  {im}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1">Operational Notes (Optional)</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Early morning drip cycle; checked line pressure"
              className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-sky-700 focus:outline-none"
            />
          </div>

          <div className="bg-sky-50 border border-sky-200 rounded-xl p-3 text-sky-900 text-[11px] leading-relaxed">
            Recording this irrigation event will automatically boost <strong>{currentField?.name}</strong>'s soil moisture reading by +20% and log to your farm timeline.
          </div>

          {/* Action buttons */}
          <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
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
              className="px-5 py-2 rounded-xl bg-sky-800 hover:bg-sky-900 text-white font-bold transition flex items-center gap-1.5 shadow-xs"
            >
              <CheckCircle2 className="w-4 h-4" />
              {loading ? "Recording..." : "Save Irrigation"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
