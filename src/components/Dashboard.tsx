import React, { useState } from 'react';
import { Search, Plus, Sparkles, Copy, Trash2, Eye, Calendar, MapPin, Clock, FileText, ArrowRight } from 'lucide-react';
import { Itinerary } from '../types/itinerary';

interface DashboardProps {
  itineraries: Itinerary[];
  loading: boolean;
  onOpenItinerary: (id: string) => void;
  onPreviewItinerary: (itinerary: Itinerary) => void;
  onDuplicateItinerary: (id: string) => void;
  onDeleteItinerary: (id: string, title: string) => void;
  onNewItinerary: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  itineraries,
  loading,
  onOpenItinerary,
  onPreviewItinerary,
  onDuplicateItinerary,
  onDeleteItinerary,
  onNewItinerary,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'exported'>('all');
  const [sortBy, setSortBy] = useState<'updated_at' | 'title'>('updated_at');

  const filtered = itineraries
    .filter((item) => {
      if (statusFilter !== 'all' && item.status !== statusFilter) return false;
      if (!searchTerm.trim()) return true;
      const term = searchTerm.toLowerCase();
      return (
        item.title.toLowerCase().includes(term) ||
        (item.destination_summary && item.destination_summary.toLowerCase().includes(term)) ||
        (item.notes && item.notes.toLowerCase().includes(term)) ||
        (item.customer_name && item.customer_name.toLowerCase().includes(term))
      );
    })
    .sort((a, b) => {
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-left">
      {/* Welcome Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
            <span>Proposal & Itinerary Workspace</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Build, edit, customize images and publish high-resolution PDF proposals for your travelers.
          </p>
        </div>

        <button
          onClick={onNewItinerary}
          className="flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-sky-600 hover:bg-sky-500 text-white shadow-md shadow-sky-600/20 transition-all hover:scale-[1.02] cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Itinerary</span>
        </button>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center space-x-2 flex-1 min-w-[260px] max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by trip title, destination, customer..."
              className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500 shadow-xs"
            />
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Status filter pills */}
          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({itineraries.length})
            </button>
            <button
              onClick={() => setStatusFilter('draft')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                statusFilter === 'draft'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Drafts
            </button>
            <button
              onClick={() => setStatusFilter('exported')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                statusFilter === 'exported'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Exported
            </button>
          </div>

          {/* Sort dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'updated_at' | 'title')}
            className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-700 font-semibold focus:outline-none focus:border-sky-500 shadow-xs cursor-pointer"
          >
            <option value="updated_at">Sort: Last Edited</option>
            <option value="title">Sort: Title A-Z</option>
          </select>
        </div>
      </div>

      {/* Grid of Itinerary Cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="bg-white border border-slate-200 rounded-2xl h-72 animate-pulse p-4 space-y-3 shadow-xs"
            >
              <div className="bg-slate-100 h-36 rounded-xl" />
              <div className="bg-slate-100 h-5 w-3/4 rounded" />
              <div className="bg-slate-100 h-4 w-1/2 rounded" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="border border-slate-200 bg-white rounded-2xl p-12 text-center max-w-lg mx-auto mt-8 shadow-xs">
          <FileText className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 mb-1">No itineraries found</h3>
          <p className="text-xs text-slate-500 mb-6">
            {searchTerm
              ? `No matching proposals for "${searchTerm}". Try resetting search.`
              : 'Create your first itinerary by pasting raw text or uploading a travel document.'}
          </p>
          <button
            onClick={onNewItinerary}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Itinerary</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((itin) => {
            const daysCount = itin.days?.length || itin.days_count;
            return (
              <div
                key={itin.id}
                className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all hover:scale-[1.01] flex flex-col group text-left"
              >
                {/* Thumbnail Header */}
                <div
                  onClick={() => onOpenItinerary(itin.id)}
                  className="relative h-44 bg-slate-100 overflow-hidden cursor-pointer"
                >
                  {itin.cover_image_url ? (
                    <img
                      src={itin.cover_image_url}
                      alt={itin.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
                      <FileText className="w-8 h-8 opacity-40" />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex items-center space-x-2">
                    <span className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white text-[11px] font-extrabold shadow">
                      {itin.days_count}D / {itin.nights_count}N
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        itin.status === 'exported'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}
                    >
                      {itin.status}
                    </span>
                  </div>

                  {/* Destination summary over image */}
                  {itin.destination_summary && (
                    <div className="absolute bottom-3 left-3 right-3 flex items-center space-x-1.5 text-[11px] font-bold text-emerald-300 bg-black/70 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-white/10 truncate">
                      <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-emerald-400" />
                      <span className="truncate">{itin.destination_summary}</span>
                    </div>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3
                      onClick={() => onOpenItinerary(itin.id)}
                      className="text-base font-bold text-slate-900 hover:text-sky-600 transition-colors cursor-pointer line-clamp-1"
                    >
                      {itin.title}
                    </h3>
                    {itin.subtitle && (
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{itin.subtitle}</p>
                    )}

                    {itin.customer_name && (
                      <div className="mt-2 text-xs text-slate-600">
                        Client: <strong className="text-slate-800">{itin.customer_name}</strong>
                      </div>
                    )}
                  </div>

                  {/* Card Footer: Metadata & Actions */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-400">
                      {daysCount} {daysCount === 1 ? 'day' : 'days'} schedule
                    </span>

                    <div className="flex items-center space-x-1">
                      {/* Preview */}
                      <button
                        onClick={() => onPreviewItinerary(itin)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                        title="Preview PDF"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* Duplicate */}
                      <button
                        onClick={() => onDuplicateItinerary(itin.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                        title="Duplicate Itinerary"
                      >
                        <Copy className="w-4 h-4" />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => onDeleteItinerary(itin.id, itin.title)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Delete Itinerary"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      {/* Open Editor Button */}
                      <button
                        onClick={() => onOpenItinerary(itin.id)}
                        className="ml-1 flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs transition-colors cursor-pointer shadow-xs"
                      >
                        <span>Edit</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
