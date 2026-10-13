import React from 'react';
import { ArrowLeft, Save, Eye, Download, Undo2, Check, RefreshCw, AlertCircle, Sparkles } from 'lucide-react';
import { Itinerary } from '../../types/itinerary';

interface TopActionBarProps {
  itinerary: Itinerary;
  saveStatus: 'saved' | 'saving' | 'error';
  canUndo: boolean;
  exporting: boolean;
  onUpdateItinerary: (updated: Partial<Itinerary>) => void;
  onSave: () => void;
  onUndo: () => void;
  onOpenPreview: () => void;
  onExportPdf: () => void;
  onBackToDashboard: () => void;
  onToggleThemeDrawer: () => void;
}

export const TopActionBar: React.FC<TopActionBarProps> = ({
  itinerary,
  saveStatus,
  canUndo,
  exporting,
  onUpdateItinerary,
  onSave,
  onUndo,
  onOpenPreview,
  onExportPdf,
  onBackToDashboard,
  onToggleThemeDrawer,
}) => {
  return (
    <div className="bg-white border-b border-slate-200 px-4 py-3 sticky top-16 z-30 flex flex-wrap items-center justify-between gap-3 shadow-xs">
      {/* Left: Back button & Title/Subtitle editing */}
      <div className="flex items-center space-x-3 flex-1 min-w-[280px]">
        <button
          onClick={onBackToDashboard}
          className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors cursor-pointer"
          title="Back to Dashboard"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="flex-1">
          <input
            type="text"
            value={itinerary.title}
            onChange={(e) => onUpdateItinerary({ title: e.target.value })}
            className="w-full bg-transparent hover:bg-slate-50 focus:bg-white px-2 py-1 rounded text-base font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-500 border border-transparent hover:border-slate-200"
            placeholder="Itinerary Title"
          />
          <input
            type="text"
            value={itinerary.subtitle || ''}
            onChange={(e) => onUpdateItinerary({ subtitle: e.target.value })}
            className="w-full bg-transparent hover:bg-slate-50 focus:bg-white px-2 py-0.5 rounded text-xs text-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-500 border border-transparent hover:border-slate-200"
            placeholder="Add a subtitle or trip tag..."
          />
        </div>
      </div>

      {/* Center: Days & Nights independent controls */}
      <div className="flex items-center space-x-2 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
        <div className="flex items-center space-x-1.5 text-xs text-slate-700 font-medium">
          <span>Days:</span>
          <input
            type="number"
            min={1}
            max={60}
            value={itinerary.days_count}
            onChange={(e) =>
              onUpdateItinerary({ days_count: Math.max(1, parseInt(e.target.value) || 1) })
            }
            className="w-12 bg-white border border-slate-300 rounded px-1.5 py-0.5 text-center text-xs text-slate-900 font-bold"
          />
        </div>

        <span className="text-slate-400">/</span>

        <div className="flex items-center space-x-1.5 text-xs text-slate-700 font-medium">
          <span>Nights:</span>
          <input
            type="number"
            min={0}
            max={60}
            value={itinerary.nights_count}
            onChange={(e) =>
              onUpdateItinerary({ nights_count: Math.max(0, parseInt(e.target.value) || 0) })
            }
            className="w-12 bg-white border border-slate-300 rounded px-1.5 py-0.5 text-center text-xs text-slate-900 font-bold"
          />
        </div>
      </div>

      {/* Right: Autosave Status, Undo, Theme, Preview & Export */}
      <div className="flex items-center space-x-2">
        {/* Autosave Status Indicator */}
        <div className="text-xs px-2.5 py-1 rounded-lg flex items-center space-x-1.5 font-medium">
          {saveStatus === 'saving' && (
            <span className="text-amber-600 flex items-center space-x-1">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span className="hidden sm:inline">Saving...</span>
            </span>
          )}
          {saveStatus === 'saved' && (
            <span className="text-emerald-600 flex items-center space-x-1">
              <Check className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Saved</span>
            </span>
          )}
          {saveStatus === 'error' && (
            <span className="text-rose-600 flex items-center space-x-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Unable to save — retry</span>
            </span>
          )}
        </div>

        {/* Undo Button */}
        {canUndo && (
          <button
            onClick={onUndo}
            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors cursor-pointer"
            title="Undo last destructive change"
          >
            <Undo2 className="w-4 h-4" />
          </button>
        )}

        {/* Manual Save fallback */}
        <button
          onClick={onSave}
          className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors cursor-pointer"
          title="Manual Save"
        >
          <Save className="w-4 h-4" />
        </button>

        {/* Theme Settings Drawer Trigger */}
        <button
          onClick={onToggleThemeDrawer}
          className="flex items-center space-x-1 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 text-xs font-semibold transition-colors cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span className="capitalize hidden md:inline">{itinerary.theme} Theme</span>
        </button>

        {/* Live Preview Button */}
        <button
          onClick={onOpenPreview}
          className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 text-xs font-semibold transition-colors cursor-pointer"
        >
          <Eye className="w-4 h-4 text-sky-600" />
          <span>Preview</span>
        </button>

        {/* Real PDF Export */}
        <button
          onClick={onExportPdf}
          disabled={exporting}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-sm shadow-sky-600/30 transition-all disabled:opacity-50 cursor-pointer"
        >
          {exporting ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Rendering PDF...</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>Export PDF</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
