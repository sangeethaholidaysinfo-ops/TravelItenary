import React from 'react';
import { X, Sparkles, Check } from 'lucide-react';
import { ThemeType, Itinerary, Agency } from '../../types/itinerary';

interface ThemeControlDrawerProps {
  isOpen: boolean;
  itinerary: Itinerary;
  agency: Agency;
  onClose: () => void;
  onUpdateItinerary: (updated: Partial<Itinerary>) => void;
}

export const ThemeControlDrawer: React.FC<ThemeControlDrawerProps> = ({
  isOpen,
  itinerary,
  agency,
  onClose,
  onUpdateItinerary,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs animate-fadeIn">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-slate-200 p-6 flex flex-col justify-between shadow-2xl text-left">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-bold text-slate-900">Document Theme & Display</h3>
              </div>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Theme Selector */}
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                PDF Design Theme
              </label>

              {/* Editorial Theme Option */}
              <div
                onClick={() => onUpdateItinerary({ theme: 'editorial' })}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  itinerary.theme === 'editorial'
                    ? 'border-sky-500 bg-sky-50 ring-2 ring-sky-500/30 shadow-xs'
                    : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-serif font-bold text-sm text-slate-900">Editorial Style</span>
                  {itinerary.theme === 'editorial' && <Check className="w-4 h-4 text-sky-600" />}
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Large scenic photography, spacious luxury layout, elegant serif typography, gold accents.
                </p>
              </div>

              {/* Classic Theme Option */}
              <div
                onClick={() => onUpdateItinerary({ theme: 'classic' })}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  itinerary.theme === 'classic'
                    ? 'border-sky-500 bg-sky-50 ring-2 ring-sky-500/30 shadow-xs'
                    : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-sans font-bold text-sm text-slate-900">Classic Style</span>
                  {itinerary.theme === 'classic' && <Check className="w-4 h-4 text-sky-600" />}
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Compact, formal, information-first, clean corporate structured tables, charcoal accents.
                </p>
              </div>
            </div>

            {/* PDF Visibility Options */}
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                PDF Content Controls
              </label>

              {/* Show customer name */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <div className="text-xs font-semibold text-slate-900">Customer Name Header</div>
                  <div className="text-[11px] text-slate-500">
                    Show "Prepared for: {itinerary.customer_name || 'Customer'}" in export
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={itinerary.show_customer_name_in_pdf}
                  onChange={(e) =>
                    onUpdateItinerary({ show_customer_name_in_pdf: e.target.checked })
                  }
                  className="rounded bg-white border-slate-300 text-sky-600 focus:ring-sky-500 w-4 h-4 cursor-pointer"
                />
              </div>

              {/* Show internal notes */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <div className="text-xs font-semibold text-slate-900">Include Internal Notes in PDF</div>
                  <div className="text-[11px] text-slate-500">
                    Default is hidden. Toggle on if sharing internal logistics.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={itinerary.show_internal_notes_in_pdf}
                  onChange={(e) =>
                    onUpdateItinerary({ show_internal_notes_in_pdf: e.target.checked })
                  }
                  className="rounded bg-white border-slate-300 text-sky-600 focus:ring-sky-500 w-4 h-4 cursor-pointer"
                />
              </div>
            </div>

            {/* Active Agency Brand Preview */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-xs font-bold text-slate-700">Active Agency Brand</div>
              <div className="flex items-center space-x-3 text-xs text-slate-600">
                <span
                  className="w-4 h-4 rounded-full border border-slate-300"
                  style={{ backgroundColor: agency.brand_colour }}
                />
                <span className="text-slate-900 font-semibold">{agency.name}</span>
              </div>
              <p className="text-[11px] text-slate-500">{agency.footer_disclaimer}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};
