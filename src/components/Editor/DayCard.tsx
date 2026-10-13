import React from 'react';
import { ImageIcon, Trash2, Copy, Plus, MapPin } from 'lucide-react';
import { ItineraryDay, DayItem, ItemType } from '../../types/itinerary';
import { DayItemEditor } from './DayItemEditor';

interface DayCardProps {
  day: ItineraryDay;
  dayIndex: number;
  totalDays: number;
  onUpdateDay: (updated: Partial<ItineraryDay>) => void;
  onOpenImagePicker: () => void;
  onDuplicateDay: () => void;
  onDeleteDay: () => void;
  onAddItem: (type: ItemType) => void;
  onUpdateItem: (itemIdx: number, updated: Partial<DayItem>) => void;
  onDeleteItem: (itemIdx: number) => void;
  onMoveItemToDay: (itemIdx: number, targetDayIndex: number) => void;
}

export const DayCard: React.FC<DayCardProps> = ({
  day,
  dayIndex,
  totalDays,
  onUpdateDay,
  onOpenImagePicker,
  onDuplicateDay,
  onDeleteDay,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  onMoveItemToDay,
}) => {
  return (
    <div
      id={`day-card-${day.id}`}
      className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs transition-all hover:border-slate-300 text-left mb-6"
    >
      {/* Hero Image Section */}
      <div className="relative h-48 sm:h-56 bg-slate-100 overflow-hidden group">
        {day.hero_image_url ? (
          <img
            src={day.hero_image_url}
            alt={day.title}
            className={`w-full h-full object-${day.hero_image_fit || 'cover'} transition-transform duration-500 group-hover:scale-105`}
            style={{
              objectPosition: `${day.hero_image_focal_x || 50}% ${day.hero_image_focal_y || 50}%`,
            }}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400">
            <ImageIcon className="w-10 h-10 mb-2 opacity-40" />
            <span className="text-xs">No hero image selected</span>
          </div>
        )}

        {/* Hero image overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

        {/* Hero action buttons */}
        <div className="absolute top-3 right-3 flex items-center space-x-2">
          <button
            onClick={onOpenImagePicker}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-black/60 hover:bg-black/80 backdrop-blur-md text-white text-xs font-semibold border border-white/20 transition-all shadow-md hover:scale-105 cursor-pointer"
          >
            <ImageIcon className="w-3.5 h-3.5 text-sky-400" />
            <span>{day.hero_image_url ? 'Change Photo' : 'Add Photo'}</span>
          </button>
        </div>

        {/* Day Number badge over image */}
        <div className="absolute bottom-3 left-4 flex items-center space-x-2">
          <span className="px-3 py-1 rounded-lg bg-sky-600 text-white text-xs font-black uppercase tracking-wider shadow">
            Day {day.day_number}
          </span>
          {day.destination && (
            <span className="px-2.5 py-1 rounded-lg bg-emerald-950/80 backdrop-blur-md text-emerald-300 text-xs font-bold border border-emerald-700/60 shadow">
              📍 {day.destination}
            </span>
          )}
        </div>
      </div>

      {/* Main Day Content */}
      <div className="p-5 space-y-4">
        {/* Title, Destination, and Date Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-6">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Day Heading / Title
            </label>
            <input
              type="text"
              value={day.title}
              onChange={(e) => onUpdateDay({ title: e.target.value })}
              placeholder="e.g. Arrival in Cochin & Transfer to Munnar"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="sm:col-span-3">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Destination / Region
            </label>
            <div className="relative">
              <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={day.destination}
                onChange={(e) => onUpdateDay({ destination: e.target.value })}
                placeholder="e.g. Munnar"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div className="sm:col-span-3">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Explicit Date (Optional)
            </label>
            <input
              type="text"
              value={day.date || ''}
              onChange={(e) => onUpdateDay({ date: e.target.value })}
              placeholder="e.g. 12 Oct 2026"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-sky-500"
            />
          </div>
        </div>

        {/* Day Description Textarea */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
            Day Narrative / Overview
          </label>
          <textarea
            rows={3}
            value={day.description}
            onChange={(e) => onUpdateDay({ description: e.target.value })}
            placeholder="Describe the day's journey, scenic highlights, atmosphere, and schedule..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-sky-500 leading-relaxed"
          />
        </div>

        {/* Structured Items List */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Day Activities & Bookings ({day.items.length})
            </span>

            {/* Add item dropdown */}
            <div className="relative inline-block text-left">
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    onAddItem(e.target.value as ItemType);
                    e.target.value = '';
                  }
                }}
                defaultValue=""
                className="bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 rounded-lg px-2.5 py-1 text-xs font-semibold cursor-pointer focus:outline-none"
              >
                <option value="" disabled className="text-slate-400">
                  + Add Item...
                </option>
                <option value="sightseeing">Sightseeing / Activity</option>
                <option value="accommodation">Hotel / Accommodation</option>
                <option value="transfer">Transfer / Drive</option>
                <option value="meal">Meal Plan</option>
                <option value="arrival">Arrival Pickup</option>
                <option value="departure">Departure Drop</option>
                <option value="custom_note">Important Note</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            {day.items.map((item, itIdx) => (
              <DayItemEditor
                key={item.id || itIdx}
                item={item}
                dayIndex={dayIndex}
                totalDays={totalDays}
                onUpdate={(upd) => onUpdateItem(itIdx, upd)}
                onDelete={() => onDeleteItem(itIdx)}
                onMoveToDay={(targetIdx) => onMoveItemToDay(itIdx, targetIdx)}
              />
            ))}
          </div>
        </div>

        {/* Day Card Footer Controls */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <button
            onClick={onDuplicateDay}
            className="flex items-center space-x-1.5 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Duplicate Day</span>
          </button>

          <button
            onClick={onDeleteDay}
            className="flex items-center space-x-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Day</span>
          </button>
        </div>
      </div>
    </div>
  );
};
