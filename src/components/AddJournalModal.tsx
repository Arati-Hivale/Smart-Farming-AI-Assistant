import React, { useState } from "react";
import { FarmerField } from "../types";
import {
  BookOpen,
  CheckCircle2,
  X,
  Plus,
} from "lucide-react";

interface AddJournalModalProps {
  isOpen: boolean;
  onClose: () => void;
  fields: FarmerField[];
  onAddUpdate: (data: {
    type: "irrigation" | "fertilizer" | "pest" | "disease" | "growth" | "harvest" | "general";
    title: string;
    description: string;
    fieldId?: string;
    fieldName?: string;
    crop?: string;
    date?: string;
  }) => Promise<void>;
}

export const AddJournalModal: React.FC<AddJournalModalProps> = ({
  isOpen,
  onClose,
  fields,
  onAddUpdate,
}) => {
  const [type, setType] = useState<
    "irrigation" | "fertilizer" | "pest" | "disease" | "growth" | "harvest" | "general"
  >("fertilizer");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fieldId, setFieldId] = useState<string>(fields[0]?.id || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Please provide a title for this activity");
      return;
    }

    const matchedField = fields.find((f) => f.id === fieldId);

    try {
      setLoading(true);
      setError(null);
      await onAddUpdate({
        type,
        title: title.trim(),
        description: description.trim(),
        fieldId: matchedField?.id,
        fieldName: matchedField?.name,
        crop: matchedField?.cropDisplayName || matchedField?.crop,
        date: "Today",
      });
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to record farm entry");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-stone-200 shadow-2xl max-w-md w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-emerald-900 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-700 flex items-center justify-center text-emerald-100">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">Add Farm Journal Entry</h3>
              <p className="text-xs text-emerald-200">
                Log field milestones, sprays, weed removal, or fertilizer top-dressing
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
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto flex-1 space-y-3.5 text-xs">
          <div>
            <label className="block font-bold text-stone-700 mb-1">Activity Category *</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-700 focus:outline-none"
            >
              <option value="fertilizer">Fertilizer / Bio-Manure Application</option>
              <option value="irrigation">Irrigation Event</option>
              <option value="pest">Pest Sighting / Pheromone Trap</option>
              <option value="disease">Disease Check / Foliar Spray</option>
              <option value="growth">Crop Growth Milestone</option>
              <option value="harvest">Harvesting / Yield Weighing</option>
              <option value="general">General Field Note</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1">Related Field</label>
            <select
              value={fieldId}
              onChange={(e) => setFieldId(e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-700 focus:outline-none"
            >
              <option value="">Whole Farm (All Fields)</option>
              {fields.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name} ({f.cropDisplayName || f.crop})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1">Activity Summary / Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Applied Trichoderma + Well-rotted FYM"
              className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-700 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1">Detailed Observation / Dosages</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Mixed 2kg per acre with vermicompost along drip line during morning hours."
              className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-700 focus:outline-none resize-none"
            />
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
              className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold transition flex items-center gap-1.5 shadow-xs"
            >
              <CheckCircle2 className="w-4 h-4" />
              {loading ? "Saving..." : "Save Entry"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
