import React from 'react';
import { Plus, ChevronUp, ChevronDown, Calendar, MapPin, Layers } from 'lucide-react';
import { ItineraryDay } from '../../types/itinerary';

interface DaySidebarRailProps {
  days: ItineraryDay[];
  activeDayId: string | null;
  onSelectDay: (id: string) => void;
  onAddDay: () => void;
  onMoveDay: (fromIdx: number, toIdx: number) => void;
}

export const DaySidebarRail: React.FC<DaySidebarRailProps> = ({
  days,
  activeDayId,
  onSelectDay,
  onAddDay,
  onMoveDay,
}) => {
  return (
    <aside className="w-64 bg-white border border-slate-200 rounded-2xl p-4 flex flex-col h-[calc(100vh-8.5rem)] sticky top-32 overflow-hidden text-left shadow-xs">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
        <div className="flex items-center space-x-2">
          <Layers className="w-4 h-4 text-sky-600" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Day Schedule ({days.length})
          </span>
        </div>
        <button
          onClick={onAddDay}
          className="p-1 rounded-md bg-sky-50 text-sky-700 hover:bg-sky-600 hover:text-white border border-sky-200 transition-colors cursor-pointer"
          title="Add New Day"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Days List */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {days.map((day, idx) => {
          const isActive = day.id === activeDayId;
          return (
            <div
              key={day.id}
              onClick={() => onSelectDay(day.id)}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer group relative ${
                isActive
                  ? 'bg-sky-50 border-sky-500 shadow-xs ring-1 ring-sky-500/50'
                  : 'bg-slate-50 border-slate-200 hover:bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 min-w-0">
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-extrabold ${
                      isActive
                        ? 'bg-sky-600 text-white'
                        : 'bg-slate-200 text-slate-700 group-hover:bg-slate-300'
                    }`}
                  >
                    D{day.day_number}
                  </span>
                  <span
                    className={`text-xs font-semibold truncate ${
                      isActive ? 'text-sky-900 font-bold' : 'text-slate-700'
                    }`}
                  >
                    {day.title || `Day ${day.day_number}`}
                  </span>
                </div>

                {/* Reorder Up/Down arrows */}
                <div
                  className="flex items-center space-x-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    disabled={idx === 0}
                    onClick={() => onMoveDay(idx, idx - 1)}
                    className="p-0.5 hover:text-sky-600 disabled:opacity-20 text-slate-400 cursor-pointer"
                    title="Move Day Up"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    disabled={idx === days.length - 1}
                    onClick={() => onMoveDay(idx, idx + 1)}
                    className="p-0.5 hover:text-sky-600 disabled:opacity-20 text-slate-400 cursor-pointer"
                    title="Move Day Down"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {day.destination && (
                <div className="mt-1 flex items-center space-x-1 text-[10px] text-slate-500 truncate">
                  <MapPin className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                  <span className="truncate">{day.destination}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="pt-3 border-t border-slate-200 mt-2">
        <button
          onClick={onAddDay}
          className="w-full flex items-center justify-center space-x-2 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-200 text-xs font-semibold transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Another Day</span>
        </button>
      </div>
    </aside>
  );
};
