import React, { useState } from 'react';
import { X, Download, RefreshCw, Sparkles } from 'lucide-react';
import { Itinerary, Agency, ThemeType } from '../types/itinerary';

interface PreviewModalProps {
  isOpen: boolean;
  itinerary: Itinerary;
  agency: Agency;
  onClose: () => void;
  onExportPdf: () => Promise<void>;
  exporting: boolean;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({
  isOpen,
  itinerary,
  agency,
  onClose,
  onExportPdf,
  exporting,
}) => {
  const [selectedTheme, setSelectedTheme] = useState<ThemeType>(itinerary.theme || 'editorial');

  if (!isOpen) return null;

  const isEditorial = selectedTheme === 'editorial';
  const brandColor = agency.brand_colour || '#0284c7';
  const accentColor = isEditorial ? '#c29d59' : brandColor;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-5xl w-full h-[95vh] shadow-2xl flex flex-col overflow-hidden text-left">
        {/* Top Preview Bar */}
        <div className="flex flex-wrap items-center justify-between px-6 py-3.5 bg-white border-b border-slate-200 gap-3">
          <div className="flex items-center space-x-3">
            <span className="p-1.5 rounded-lg bg-sky-50 text-sky-700 border border-sky-200">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Live Proposal Document Preview (A4)</h2>
              <p className="text-[11px] text-slate-500">
                Visualizing pixel-perfect print layout and typography.
              </p>
            </div>
          </div>

          {/* Theme switcher */}
          <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setSelectedTheme('editorial')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedTheme === 'editorial'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Editorial Style
            </button>
            <button
              onClick={() => setSelectedTheme('classic')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedTheme === 'classic'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Classic Style
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onExportPdf}
              disabled={exporting}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-xs transition-all disabled:opacity-50 cursor-pointer"
            >
              {exporting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Generating PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable A4 Document Container */}
        <div className="flex-1 overflow-y-auto bg-slate-100 p-4 sm:p-8 flex justify-center">
          <div className="a4-page bg-white text-slate-900 rounded-sm shadow-md p-8 sm:p-12 max-w-3xl w-full text-left">
            {/* Header */}
            <header className="border-b border-slate-200 pb-4 mb-6 flex items-center justify-between">
              <div>
                {agency.logo_url ? (
                  <img
                    src={agency.logo_url}
                    alt={agency.name}
                    className="h-9 max-w-[150px] object-contain mb-1"
                  />
                ) : (
                  <div className="font-extrabold text-lg tracking-tight text-slate-900">
                    {agency.name}
                  </div>
                )}
                <div className="text-[10px] text-slate-500">
                  {agency.email} • {agency.phone} • {agency.website}
                </div>
              </div>

              <div className="text-right">
                <span
                  className="inline-block px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider rounded"
                  style={{ backgroundColor: `${brandColor}15`, color: brandColor }}
                >
                  {itinerary.days_count} Days / {itinerary.nights_count} Nights
                </span>
                {itinerary.customer_name && itinerary.show_customer_name_in_pdf && (
                  <div className="text-[11px] text-slate-600 mt-1">
                    Prepared for: <strong className="text-slate-900">{itinerary.customer_name}</strong>
                  </div>
                )}
              </div>
            </header>

            {/* Cover Banner */}
            <div className="mb-6 rounded-xl overflow-hidden bg-slate-900 text-white relative shadow-xs">
              {itinerary.cover_image_url ? (
                <img
                  src={itinerary.cover_image_url}
                  alt={itinerary.title}
                  className="w-full h-48 object-cover opacity-60"
                />
              ) : (
                <div className="w-full h-28 bg-slate-800" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent p-6 flex flex-col justify-end">
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 mb-1">
                  {itinerary.destination_summary || 'Custom Itinerary'}
                </span>
                <h1
                  className={`text-2xl sm:text-3xl font-extrabold text-white ${
                    isEditorial ? 'font-serif' : 'font-sans'
                  }`}
                >
                  {itinerary.title}
                </h1>
                {itinerary.subtitle && (
                  <p className="text-xs text-slate-200 mt-0.5">{itinerary.subtitle}</p>
                )}
              </div>
            </div>

            {/* Trip Overview Note */}
            {itinerary.notes && (
              <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 leading-relaxed">
                <h4 className="font-bold uppercase tracking-wider text-[10px] text-amber-800 mb-1">
                  Trip Overview & Highlights
                </h4>
                <p className="whitespace-pre-line">{itinerary.notes}</p>
              </div>
            )}

            {/* Day by Day Sections */}
            <div className="space-y-6">
              <h2
                className="text-xs font-black uppercase tracking-widest text-slate-900 pb-2 border-b-2"
                style={{ borderColor: brandColor }}
              >
                Day-by-Day Journey
              </h2>

              {itinerary.days.map((day) => (
                <div
                  key={day.id}
                  className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs"
                >
                  {/* Hero photo */}
                  {day.hero_image_url && (
                    <div className="w-full h-40 overflow-hidden bg-slate-100 relative">
                      <img
                        src={day.hero_image_url}
                        alt={day.title}
                        className={`w-full h-full object-${day.hero_image_fit || 'cover'}`}
                        style={{
                          objectPosition: `${day.hero_image_focal_x || 50}% ${day.hero_image_focal_y || 50}%`,
                        }}
                      />
                    </div>
                  )}

                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span
                          className="px-2 py-0.5 text-[11px] font-black uppercase rounded tracking-wider"
                          style={{
                            backgroundColor: `${accentColor}15`,
                            color: accentColor,
                            border: `1px solid ${accentColor}40`,
                          }}
                        >
                          Day {day.day_number}
                        </span>
                        <h3
                          className={`text-sm font-bold text-slate-900 ${
                            isEditorial ? 'font-serif text-base' : 'font-sans'
                          }`}
                        >
                          {day.title}
                        </h3>
                        {day.date && (
                          <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                            {day.date}
                          </span>
                        )}
                      </div>

                      {day.destination && (
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          📍 {day.destination}
                        </span>
                      )}
                    </div>

                    {day.description && (
                      <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                        {day.description}
                      </p>
                    )}

                    {/* Day items */}
                    {day.items.length > 0 && (
                      <div className="pt-2 border-t border-slate-100 space-y-1.5">
                        {day.items.map((it) => (
                          <div
                            key={it.id}
                            className="p-2 rounded bg-slate-50 border border-slate-200 text-xs"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                                  {it.item_type}
                                </span>
                                <span className="font-bold text-slate-900">{it.title}</span>
                                {it.location && (
                                  <span className="text-[10px] text-slate-500 italic">
                                    📍 {it.location}
                                  </span>
                                )}
                              </div>
                              {it.time_text && (
                                <span className="text-[10px] font-semibold text-slate-500">
                                  {it.time_text}
                                </span>
                              )}
                            </div>
                            {it.description && (
                              <p className="text-[11px] text-slate-600 mt-1">{it.description}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Sections */}
            {itinerary.sections.filter((s) => s.visible_in_pdf).length > 0 && (
              <div className="mt-8 pt-4 border-t border-slate-200 space-y-3">
                <h2
                  className="text-xs font-black uppercase tracking-widest text-slate-900 pb-2 border-b-2"
                  style={{ borderColor: brandColor }}
                >
                  Trip Details, Inclusions & Policies
                </h2>

                <div className="grid grid-cols-1 gap-3">
                  {itinerary.sections
                    .filter((s) => s.visible_in_pdf && s.content)
                    .map((sec) => (
                      <div
                        key={sec.id}
                        className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                      >
                        <h4
                          className={`font-bold uppercase tracking-wider text-[11px] mb-1.5 ${
                            isEditorial ? 'font-serif' : 'font-sans'
                          }`}
                          style={{ color: brandColor }}
                        >
                          {sec.title}
                        </h4>
                        <div className="text-slate-700 space-y-1 whitespace-pre-line">
                          {sec.content}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Footer */}
            <footer className="mt-10 pt-4 border-t border-slate-200 text-center text-[10px] text-slate-500">
              <p className="font-semibold text-slate-700">{agency.name} — Travel Proposal</p>
              <p className="mt-0.5">{agency.footer_disclaimer}</p>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
};
