import React from 'react';
import { Plus, Trash2, Eye, EyeOff, FileText } from 'lucide-react';
import { ItinerarySection, SectionType } from '../../types/itinerary';

interface SectionEditorProps {
  sections: ItinerarySection[];
  onAddSection: (type: SectionType, defaultTitle: string) => void;
  onUpdateSection: (index: number, updated: Partial<ItinerarySection>) => void;
  onDeleteSection: (index: number) => void;
}

const PRESET_SECTIONS: { type: SectionType; title: string; defaultContent: string }[] = [
  {
    type: 'inclusions',
    title: 'Inclusions',
    defaultContent: '• Hotel accommodation with breakfast\n• Private AC vehicle for all transfers\n• Driver charges, toll, and parking',
  },
  {
    type: 'exclusions',
    title: 'Exclusions',
    defaultContent: '• Airfare / Train tickets\n• Monument entry fees & safari tickets\n• Personal expenses, laundry & tips',
  },
  {
    type: 'important_notes',
    title: 'Important Notes',
    defaultContent: '• Hotel check-in time is 14:00 hrs & check-out is 11:00 hrs.\n• Government ID required at check-in.',
  },
  {
    type: 'terms_and_conditions',
    title: 'Terms & Policies',
    defaultContent: '• Rates valid for 7 days from proposal date.\n• Standard cancellation policy applies.',
  },
];

export const SectionEditor: React.FC<SectionEditorProps> = ({
  sections,
  onAddSection,
  onUpdateSection,
  onDeleteSection,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4 text-left mb-8">
      <div className="flex flex-wrap items-center justify-between pb-3 border-b border-slate-200 gap-2">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
            <FileText className="w-4 h-4 text-sky-600" />
            <span>Proposal Sections & Policies</span>
          </h3>
          <p className="text-xs text-slate-500">
            Configure inclusions, exclusions, booking notes and terms shown in the PDF export.
          </p>
        </div>

        {/* Add Preset Section buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          {PRESET_SECTIONS.map((preset) => {
            const alreadyExists = sections.some((s) => s.section_type === preset.type);
            return (
              <button
                key={preset.type}
                onClick={() => onAddSection(preset.type, preset.title)}
                disabled={alreadyExists}
                className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
              >
                + {preset.title}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sections List */}
      <div className="space-y-3">
        {sections.map((sec, idx) => (
          <div
            key={sec.id || idx}
            className={`p-4 rounded-xl border transition-all ${
              sec.visible_in_pdf
                ? 'bg-slate-50 border-slate-200'
                : 'bg-slate-100/50 border-slate-200 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <input
                type="text"
                value={sec.title}
                onChange={(e) => onUpdateSection(idx, { title: e.target.value })}
                className="bg-transparent hover:bg-white focus:bg-white px-2 py-0.5 rounded text-xs font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-500 border border-transparent hover:border-slate-300"
              />

              <div className="flex items-center space-x-2">
                {/* PDF Visibility toggle */}
                <button
                  onClick={() => onUpdateSection(idx, { visible_in_pdf: !sec.visible_in_pdf })}
                  className={`flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-semibold border cursor-pointer ${
                    sec.visible_in_pdf
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : 'bg-slate-200 text-slate-600 border-slate-300'
                  }`}
                  title="Toggle PDF visibility"
                >
                  {sec.visible_in_pdf ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                  <span>{sec.visible_in_pdf ? 'Visible in PDF' : 'Hidden'}</span>
                </button>

                <button
                  onClick={() => onDeleteSection(idx)}
                  className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                  title="Delete Section"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <textarea
              rows={3}
              value={sec.content}
              onChange={(e) => onUpdateSection(idx, { content: e.target.value })}
              placeholder="Enter bullet points (start lines with • or -)..."
              className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:border-sky-500 leading-relaxed font-mono"
            />
          </div>
        ))}

        {sections.length === 0 && (
          <div className="text-center py-6 text-xs text-slate-400">
            No policy sections added yet. Click one of the buttons above to add Inclusions or Exclusions.
          </div>
        )}
      </div>
    </div>
  );
};
