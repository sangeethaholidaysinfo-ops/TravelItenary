import React from 'react';
import { X, CheckCircle2, AlertTriangle, ArrowRight, ListChecks } from 'lucide-react';
import { ParseResponse, Itinerary } from '../types/itinerary';

interface ParseReviewModalProps {
  isOpen: boolean;
  parseResult: ParseResponse | null;
  onClose: () => void;
  onConfirm: (itinerary: Itinerary) => void;
}

export const ParseReviewModal: React.FC<ParseReviewModalProps> = ({
  isOpen,
  parseResult,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !parseResult) return null;

  const { itinerary, warnings, unassigned_text } = parseResult;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-5xl w-full p-6 shadow-2xl relative max-h-[92vh] flex flex-col text-left">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
                <ListChecks className="w-5 h-5" />
              </span>
              <h2 className="text-lg font-bold text-slate-900">Review Extracted Itinerary Structure</h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Verify detected days, accommodations, activities, and duration before opening the editor. Original source text is preserved.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Warnings Banner if any */}
        {warnings.length > 0 && (
          <div className="mt-4 p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs space-y-1.5">
            <div className="flex items-center space-x-2 font-bold text-amber-800">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Parsing Notices & Verification:</span>
            </div>
            {warnings.map((w, idx) => (
              <div key={idx} className="pl-6 text-[11px] leading-relaxed">
                • {w.message}
              </div>
            ))}
          </div>
        )}

        {/* Split Screen: Source Text vs Extracted Structured Draft */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 my-4 overflow-hidden">
          {/* Left Column: Source Text Preview */}
          <div className="flex flex-col bg-slate-50 rounded-xl border border-slate-200 p-4 overflow-hidden">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Original Source Content
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Preserved</span>
            </div>
            <div className="flex-1 overflow-y-auto text-xs text-slate-700 font-mono whitespace-pre-wrap leading-relaxed pr-2">
              {itinerary.source_text || unassigned_text || 'No raw text available.'}
            </div>
          </div>

          {/* Right Column: Extracted Structure Preview */}
          <div className="flex flex-col bg-slate-50/60 rounded-xl border border-slate-200 p-4 overflow-hidden">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Structured Proposal Preview
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200 font-semibold">
                {itinerary.days.length} Days Detected
              </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-2">
              {/* Trip Title & Metadata */}
              <div className="p-3 rounded-lg bg-white border border-slate-200 shadow-2xs">
                <h3 className="text-sm font-bold text-slate-900">{itinerary.title}</h3>
                {itinerary.subtitle && (
                  <p className="text-xs text-slate-500 mt-0.5">{itinerary.subtitle}</p>
                )}
                <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
                  <span className="px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-sky-200 font-semibold">
                    {itinerary.days_count} Days / {itinerary.nights_count} Nights
                  </span>
                  {itinerary.destination_summary && (
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      📍 {itinerary.destination_summary}
                    </span>
                  )}
                </div>
              </div>

              {/* Day items breakdown */}
              {itinerary.days.map((day, idx) => (
                <div
                  key={day.id || idx}
                  className="p-3 rounded-lg bg-white border border-slate-200 space-y-1.5 shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="px-1.5 py-0.5 rounded bg-sky-100 text-sky-800 text-[10px] font-bold">
                        Day {day.day_number}
                      </span>
                      <span className="text-xs font-bold text-slate-900 line-clamp-1">{day.title}</span>
                    </div>
                    {day.destination && (
                      <span className="text-[10px] text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                        {day.destination}
                      </span>
                    )}
                  </div>

                  {day.description && (
                    <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                      {day.description}
                    </p>
                  )}

                  {day.items.length > 0 && (
                    <div className="pt-1.5 border-t border-slate-100 flex flex-wrap gap-1.5">
                      {day.items.map((it, itIdx) => (
                        <span
                          key={itIdx}
                          className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 line-clamp-1"
                        >
                          {it.item_type === 'accommodation' && '🏨 '}
                          {it.item_type === 'transfer' && '🚗 '}
                          {it.item_type === 'meal' && '🍽️ '}
                          {it.item_type === 'sightseeing' && '📷 '}
                          {it.title || it.description}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Sections list */}
              {itinerary.sections.length > 0 && (
                <div className="p-3 rounded-lg bg-white border border-slate-200 shadow-2xs">
                  <div className="text-xs font-bold text-slate-700 mb-1">Extracted Policy Sections:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {itinerary.sections.map((sec, secIdx) => (
                      <span
                        key={secIdx}
                        className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200"
                      >
                        ✓ {sec.title}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 cursor-pointer"
          >
            Back / Edit Text
          </button>

          <button
            type="button"
            onClick={() => {
              onConfirm(itinerary);
              onClose();
            }}
            className="flex items-center space-x-2 px-6 py-2 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-all hover:scale-[1.02] cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Confirm & Open Itinerary Editor</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};
