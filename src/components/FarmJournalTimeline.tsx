import React, { useState } from "react";
import { FarmUpdate } from "../types";
import {
  BookOpen,
  Plus,
  Droplets,
  FlaskConical,
  Bug,
  AlertTriangle,
  Sprout,
  CheckCircle,
  FileText,
  Calendar,
  Clock,
} from "lucide-react";

interface FarmJournalTimelineProps {
  updates: FarmUpdate[];
  onOpenAddModal: () => void;
}

export const FarmJournalTimeline: React.FC<FarmJournalTimelineProps> = ({
  updates,
  onOpenAddModal,
}) => {
  const [filter, setFilter] = useState<string>("all");

  const getIconForType = (type: FarmUpdate["type"]) => {
    switch (type) {
      case "irrigation":
        return <Droplets className="w-4 h-4 text-sky-600" />;
      case "fertilizer":
        return <FlaskConical className="w-4 h-4 text-emerald-600" />;
      case "pest":
        return <Bug className="w-4 h-4 text-amber-600" />;
      case "disease":
        return <AlertTriangle className="w-4 h-4 text-rose-600" />;
      case "growth":
      case "crop_growth":
      case "harvest":
        return <Sprout className="w-4 h-4 text-teal-600" />;
      default:
        return <FileText className="w-4 h-4 text-stone-600" />;
    }
  };

  const getBadgeForType = (type: FarmUpdate["type"]) => {
    switch (type) {
      case "irrigation":
        return "bg-sky-100 text-sky-800 border-sky-200";
      case "fertilizer":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "pest":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "disease":
        return "bg-rose-100 text-rose-800 border-rose-200";
      case "growth":
      case "crop_growth":
      case "harvest":
        return "bg-teal-100 text-teal-800 border-teal-200";
      default:
        return "bg-stone-100 text-stone-700 border-stone-200";
    }
  };

  const filteredUpdates = filter === "all"
    ? updates
    : updates.filter((u) => u.type === filter);

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-4 sm:p-5 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-stone-900">Farm Journal & Timeline</h3>
            <p className="text-xs text-stone-500">
              Chronological log of irrigation, sprays, disease checks, and growth milestones
            </p>
          </div>
        </div>

        <button
          onClick={onOpenAddModal}
          className="flex items-center gap-1.5 text-xs font-bold bg-emerald-800 text-white px-3 py-1.5 rounded-xl hover:bg-emerald-900 transition self-start sm:self-auto shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Activity Note
        </button>
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap gap-1.5 text-xs">
        {[
          { id: "all", label: "All Activities" },
          { id: "irrigation", label: "Irrigation" },
          { id: "fertilizer", label: "Fertilizer" },
          { id: "disease", label: "Disease & Sprays" },
          { id: "pest", label: "Pest Checks" },
          { id: "growth", label: "Milestones" },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-3 py-1 rounded-lg font-bold text-[11px] transition ${
              filter === f.id
                ? "bg-stone-900 text-white shadow-xs"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Timeline List */}
      <div className="relative pl-6 space-y-4 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-200">
        {filteredUpdates.length === 0 ? (
          <div className="py-6 text-center text-xs text-stone-500">
            No farm entries recorded in this category yet. Click "Add Activity Note" to start logging.
          </div>
        ) : (
          filteredUpdates.map((item) => (
            <div key={item.id} className="relative group">
              {/* Timeline circle icon */}
              <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-white border-2 border-emerald-600 flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-700" />
              </div>

              <div className="bg-stone-50/80 border border-stone-200/80 rounded-xl p-3 text-xs space-y-1.5 hover:bg-white hover:border-emerald-300 transition">
                <div className="flex flex-wrap items-center justify-between gap-1.5">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded-md bg-white border border-stone-200 shadow-2xs">
                      {getIconForType(item.type)}
                    </span>
                    <span className="font-bold text-stone-900 text-xs sm:text-sm">
                      {item.title}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md border ${getBadgeForType(
                        item.type
                      )}`}
                    >
                      {item.type}
                    </span>
                  </div>

                  <span className="text-[11px] font-semibold text-stone-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {item.date}
                  </span>
                </div>

                <p className="text-stone-600 text-xs leading-relaxed pl-7">
                  {item.description}
                </p>

                {item.fieldName && (
                  <div className="pl-7 flex items-center gap-2 text-[11px] text-emerald-900 font-semibold">
                    <span>Field: {item.fieldName}</span>
                    {item.crop && <span>• Crop: {item.crop}</span>}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
