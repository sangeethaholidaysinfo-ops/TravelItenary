import React from 'react';
import { Compass, FileSpreadsheet, Settings, Plus, Building } from 'lucide-react';
import { Agency } from '../types/itinerary';

interface NavbarProps {
  agency: Agency | null;
  onOpenSettings: () => void;
  onOpenSheetsModal: () => void;
  onNewItinerary: () => void;
  sheetsConnected: boolean;
  activeView: 'dashboard' | 'editor';
  onGoDashboard: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  agency,
  onOpenSettings,
  onOpenSheetsModal,
  onNewItinerary,
  sheetsConnected,
  activeView,
  onGoDashboard,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & Agency */}
        <div className="flex items-center space-x-6">
          <button
            onClick={onGoDashboard}
            className="flex items-center space-x-3 text-left focus:outline-none group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
              <Compass className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="text-base font-bold tracking-tight text-slate-900 flex items-center space-x-2">
                <span>Travel Itinerary Studio</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
                  Pro Studio
                </span>
              </div>
              <div className="text-xs text-slate-500 flex items-center space-x-1">
                <Building className="w-3 h-3 text-slate-400" />
                <span className="text-slate-700 font-medium">{agency?.name || 'Wanderlust Expeditions'}</span>
              </div>
            </div>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-3">
          {/* Google Sheets status pill */}
          <button
            onClick={onOpenSheetsModal}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
              sheetsConnected
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100'
                : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
            title="Configure Google Sheets primary database connection"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">
              {sheetsConnected ? 'Google Sheets: Connected' : 'Connect Google Sheets'}
            </span>
            <span
              className={`w-2 h-2 rounded-full ${
                sheetsConnected ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
              }`}
            />
          </button>

          {/* Agency Settings */}
          <button
            onClick={onOpenSettings}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-200 transition-colors cursor-pointer"
            title="Agency branding and defaults"
          >
            <Settings className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">Agency Settings</span>
          </button>

          {/* Create Itinerary button */}
          <button
            onClick={onNewItinerary}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white shadow-sm shadow-sky-600/30 transition-all hover:scale-[1.02] cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Itinerary</span>
          </button>
        </div>
      </div>
    </header>
  );
};
