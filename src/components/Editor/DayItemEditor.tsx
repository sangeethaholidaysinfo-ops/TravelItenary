import React from 'react';
import { Trash2, MoveRight, Clock, MapPin } from 'lucide-react';
import { DayItem, ItemType } from '../../types/itinerary';

interface DayItemEditorProps {
  item: DayItem;
  dayIndex: number;
  totalDays: number;
  onUpdate: (updated: Partial<DayItem>) => void;
  onDelete: () => void;
  onMoveToDay: (targetDayIndex: number) => void;
}

const ITEM_TYPES: { type: ItemType; label: string; badgeColor: string }[] = [
  { type: 'sightseeing', label: 'Sightseeing', badgeColor: 'bg-teal-50 text-teal-800 border-teal-200' },
  { type: 'accommodation', label: 'Accommodation', badgeColor: 'bg-amber-50 text-amber-800 border-amber-200' },
  { type: 'transfer', label: 'Transfer', badgeColor: 'bg-blue-50 text-blue-800 border-blue-200' },
  { type: 'meal', label: 'Meal Plan', badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
  { type: 'arrival', label: 'Arrival', badgeColor: 'bg-purple-50 text-purple-800 border-purple-200' },
  { type: 'departure', label: 'Departure', badgeColor: 'bg-rose-50 text-rose-800 border-rose-200' },
  { type: 'free_time', label: 'Free Time', badgeColor: 'bg-slate-100 text-slate-800 border-slate-200' },
  { type: 'custom_note', label: 'Important Note', badgeColor: 'bg-orange-50 text-orange-800 border-orange-200' },
];

export const DayItemEditor: React.FC<DayItemEditorProps> = ({
  item,
  dayIndex,
  totalDays,
  onUpdate,
  onDelete,
  onMoveToDay,
}) => {
  const currentBadge =
    ITEM_TYPES.find((t) => t.type === item.item_type) || ITEM_TYPES[0];

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-3 transition-all hover:border-slate-300 shadow-2xs">
      {/* Top Header: Type selector, Title & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2 flex-1 min-w-[200px]">
          <select
            value={item.item_type}
            onChange={(e) => onUpdate({ item_type: e.target.value as ItemType })}
            className={`text-[11px] font-bold uppercase tracking-wider rounded-lg px-2.5 py-1 border bg-white focus:outline-none cursor-pointer ${currentBadge.badgeColor}`}
          >
            {ITEM_TYPES.map((t) => (
              <option key={t.type} value={t.type} className="bg-white text-slate-900">
                {t.label}
              </option>
            ))}
          </select>

          <input
            type="text"
            value={item.title}
            onChange={(e) => onUpdate({ title: e.target.value })}
            placeholder="Item title / Activity heading..."
            className="flex-1 bg-white hover:bg-slate-100/60 focus:bg-white px-2 py-1 rounded text-xs font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-500 border border-slate-200"
          />
        </div>

        {/* Right action controls */}
        <div className="flex items-center space-x-2">
          {/* Move to another day dropdown */}
          {totalDays > 1 && (
            <div className="flex items-center space-x-1 text-[11px] text-slate-500">
              <MoveRight className="w-3 h-3 text-slate-400" />
              <select
                value={dayIndex}
                onChange={(e) => onMoveToDay(parseInt(e.target.value))}
                className="bg-white border border-slate-300 rounded px-1.5 py-0.5 text-[10px] text-slate-700 focus:outline-none cursor-pointer"
                title="Move item to another day"
              >
                {Array.from({ length: totalDays }).map((_, idx) => (
                  <option key={idx} value={idx}>
                    Move to Day {idx + 1}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Delete item */}
          <button
            onClick={onDelete}
            className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
            title="Remove item"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Description Textarea */}
      <textarea
        rows={2}
        value={item.description}
        onChange={(e) => onUpdate({ description: e.target.value })}
        placeholder="Add details, highlights, timing notes, or booking references..."
        className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:border-sky-500 leading-relaxed"
      />

      {/* Optional Metadata Row: Time & Location */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div className="flex items-center space-x-1.5 bg-white rounded-lg px-2.5 py-1 border border-slate-200">
          <Clock className="w-3 h-3 text-slate-400 flex-shrink-0" />
          <input
            type="text"
            value={item.time_text || ''}
            onChange={(e) => onUpdate({ time_text: e.target.value })}
            placeholder="Time (e.g. 09:30 AM)"
            className="w-full bg-transparent text-[11px] text-slate-700 focus:outline-none"
          />
        </div>

        <div className="flex items-center space-x-1.5 bg-white rounded-lg px-2.5 py-1 border border-slate-200">
          <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
          <input
            type="text"
            value={item.location || ''}
            onChange={(e) => onUpdate({ location: e.target.value })}
            placeholder="Location / Spot name"
            className="w-full bg-transparent text-[11px] text-slate-700 focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
};
