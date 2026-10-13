import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { CreateImportModal } from './components/CreateImportModal';
import { ParseReviewModal } from './components/ParseReviewModal';
import { TopActionBar } from './components/Editor/TopActionBar';
import { DaySidebarRail } from './components/Editor/DaySidebarRail';
import { DayCard } from './components/Editor/DayCard';
import { SectionEditor } from './components/Editor/SectionEditor';
import { ThemeControlDrawer } from './components/Editor/ThemeControlDrawer';
import { ImagePickerModal } from './components/ImagePickerModal';
import { PreviewModal } from './components/PreviewModal';
import { AgencySettingsModal } from './components/AgencySettingsModal';
import { GoogleSheetsConfigModal } from './components/GoogleSheetsConfigModal';
import { ConfirmDialog } from './components/ConfirmDialog';
import {
  Itinerary,
  Agency,
  ItineraryDay,
  DayItem,
  ItinerarySection,
  ItemType,
  SectionType,
  ParseResponse,
} from './types/itinerary';
import { api } from './services/api';
import { Info } from 'lucide-react';

export function App() {
  // Global State
  const [activeView, setActiveView] = useState<'dashboard' | 'editor'>('dashboard');
  const [agency, setAgency] = useState<Agency | null>(null);
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [loadingDashboard, setLoadingDashboard] = useState(true);
  const [sheetsConnected, setSheetsConnected] = useState(false);

  // Editor State
  const [currentItinerary, setCurrentItinerary] = useState<Itinerary | null>(null);
  const [activeDayId, setActiveDayId] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');
  const [historyStack, setHistoryStack] = useState<Itinerary[]>([]);
  const [exporting, setExporting] = useState(false);

  // Modals & Drawers
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showParseReviewModal, setShowParseReviewModal] = useState(false);
  const [pendingParseResult, setPendingParseResult] = useState<ParseResponse | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showAgencyModal, setShowAgencyModal] = useState(false);
  const [showSheetsModal, setShowSheetsModal] = useState(false);
  const [showThemeDrawer, setShowThemeDrawer] = useState(false);

  // Image Picker State
  const [imagePickerContext, setImagePickerContext] = useState<{
    dayId?: string;
    dayIndex?: number;
    title: string;
    query: string;
    currentUrl?: string | null;
  } | null>(null);

  // Confirm Dialog State
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const saveTimeoutRef = useRef<any>(null);

  // Load initial Agency & Itineraries list
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoadingDashboard(true);
      const agencyData = await api.getAgency();
      setAgency(agencyData);

      const itinList = await api.getItineraries();
      setItineraries(itinList);

      const sheetsConf = await api.getGoogleSheetsConfig();
      if (sheetsConf.enabled && sheetsConf.sheet_id) {
        setSheetsConnected(true);
      }
    } catch (err) {
      console.error('Failed to load initial data:', err);
    } finally {
      setLoadingDashboard(false);
    }
  };

  // Warn before leaving if unsaved changes are pending
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (saveStatus === 'saving') {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [saveStatus]);

  // Debounced Autosave
  const triggerAutoSave = useCallback((itin: Itinerary) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    setSaveStatus('saving');
    saveTimeoutRef.current = setTimeout(async () => {
      try {
        await api.saveItinerary(itin);
        setSaveStatus('saved');
        // Refresh local dashboard list
        const updatedList = await api.getItineraries();
        setItineraries(updatedList);
      } catch (err) {
        console.error('Autosave error:', err);
        setSaveStatus('error');
      }
    }, 450);
  }, []);

  // Update Itinerary Helper with History Tracking
  const updateItinerary = (updatedFields: Partial<Itinerary>, isDestructive = false) => {
    if (!currentItinerary) return;

    if (isDestructive) {
      // Push snapshot to undo stack
      setHistoryStack((prev) => [JSON.parse(JSON.stringify(currentItinerary)), ...prev.slice(0, 9)]);
    }

    const newItinerary: Itinerary = {
      ...currentItinerary,
      ...updatedFields,
      updated_at: new Date().toISOString(),
    };

    setCurrentItinerary(newItinerary);
    triggerAutoSave(newItinerary);
  };

  // Undo last action
  const handleUndo = () => {
    if (historyStack.length === 0) return;
    const [previousState, ...rest] = historyStack;
    setCurrentItinerary(previousState);
    setHistoryStack(rest);
    triggerAutoSave(previousState);
  };

  // Open Itinerary in Editor
  const handleOpenItinerary = async (id: string) => {
    try {
      const itin = await api.getItinerary(id);
      setCurrentItinerary(itin);
      if (itin.days.length > 0) {
        setActiveDayId(itin.days[0].id);
      }
      setActiveView('editor');
    } catch (err) {
      alert('Failed to load itinerary details');
    }
  };

  // Duplicate Itinerary
  const handleDuplicateItinerary = async (id: string) => {
    try {
      const duplicated = await api.duplicateItinerary(id);
      const updatedList = await api.getItineraries();
      setItineraries(updatedList);
    } catch (err) {
      alert('Failed to duplicate itinerary');
    }
  };

  // Delete Itinerary with Confirmation
  const handleDeleteItinerary = (id: string, title: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Itinerary',
      message: `Are you sure you want to permanently delete "${title}"? This action cannot be undone.`,
      onConfirm: async () => {
        try {
          await api.deleteItinerary(id);
          const updatedList = await api.getItineraries();
          setItineraries(updatedList);
          setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
          if (currentItinerary?.id === id) {
            setActiveView('dashboard');
            setCurrentItinerary(null);
          }
        } catch (err) {
          alert('Failed to delete itinerary');
        }
      },
    });
  };

  // Create Blank Itinerary
  const handleStartBlank = () => {
    const blankItinerary: Itinerary = {
      id: `itin-${Date.now()}`,
      agency_id: agency?.id || 'default_agency',
      created_by: 'agent',
      title: 'New Custom Itinerary',
      subtitle: '',
      customer_name: '',
      show_customer_name_in_pdf: true,
      notes: '',
      internal_notes: '',
      show_internal_notes_in_pdf: false,
      days_count: 1,
      nights_count: 0,
      destination_summary: '',
      status: 'draft',
      theme: agency?.default_theme || 'editorial',
      cover_image_url:
        'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1600&q=80',
      days: [
        {
          id: `day-${Date.now()}`,
          position: 0,
          day_number: 1,
          title: 'Day 1: Arrival & Welcome',
          destination: '',
          hero_image_url:
            'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80',
          description: 'Welcome and tour briefing. Check into the hotel and relax.',
          items: [],
        },
      ],
      sections: [
        {
          id: `sec-inc-${Date.now()}`,
          position: 0,
          section_type: 'inclusions',
          title: 'Inclusions',
          content: '• Hotel accommodation\n• Breakfast included\n• Private airport transfers',
          visible_in_pdf: true,
        },
        {
          id: `sec-exc-${Date.now()}`,
          position: 1,
          section_type: 'exclusions',
          title: 'Exclusions',
          content: '• Flight tickets\n• Entry tickets & personal expenses',
          visible_in_pdf: true,
        },
      ],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setCurrentItinerary(blankItinerary);
    setActiveDayId(blankItinerary.days[0].id);
    setActiveView('editor');
    triggerAutoSave(blankItinerary);
  };

  // Confirm Parsed Itinerary from Review Modal
  const handleConfirmParsed = (parsedItin: Itinerary) => {
    setCurrentItinerary(parsedItin);
    if (parsedItin.days.length > 0) {
      setActiveDayId(parsedItin.days[0].id);
    }
    setActiveView('editor');
    triggerAutoSave(parsedItin);
  };

  // Day Operations
  const handleAddDay = () => {
    if (!currentItinerary) return;
    const nextNum = currentItinerary.days.length + 1;
    const newDay: ItineraryDay = {
      id: `day-${Date.now()}`,
      itinerary_id: currentItinerary.id,
      position: currentItinerary.days.length,
      day_number: nextNum,
      title: `Day ${nextNum}: Exploration & Journey`,
      destination: '',
      hero_image_url:
        'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80',
      description: 'Morning sightseeing, local exploration and leisurely evening.',
      items: [],
    };

    const updatedDays = [...currentItinerary.days, newDay];
    updateItinerary(
      {
        days: updatedDays,
        days_count: Math.max(currentItinerary.days_count, updatedDays.length),
      },
      false
    );
    setActiveDayId(newDay.id);
  };

  const handleUpdateDay = (dayIdx: number, updatedDay: Partial<ItineraryDay>) => {
    if (!currentItinerary) return;
    const updatedDays = [...currentItinerary.days];
    updatedDays[dayIdx] = { ...updatedDays[dayIdx], ...updatedDay };
    updateItinerary({ days: updatedDays }, false);
  };

  const handleDeleteDay = (dayIdx: number) => {
    if (!currentItinerary) return;
    const dayToDelete = currentItinerary.days[dayIdx];
    setConfirmDialog({
      isOpen: true,
      title: `Delete Day ${dayToDelete.day_number}`,
      message: `Are you sure you want to remove Day ${dayToDelete.day_number}: "${dayToDelete.title}"?`,
      onConfirm: () => {
        const remaining = currentItinerary.days.filter((_, idx) => idx !== dayIdx);
        // Renumber remaining days
        const renumbered = remaining.map((d, idx) => ({
          ...d,
          position: idx,
          day_number: idx + 1,
        }));
        updateItinerary(
          {
            days: renumbered,
            days_count: Math.max(1, renumbered.length),
          },
          true
        );
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const handleDuplicateDay = (dayIdx: number) => {
    if (!currentItinerary) return;
    const origDay = currentItinerary.days[dayIdx];
    const clonedItems: DayItem[] = origDay.items.map((it) => ({
      ...it,
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    }));

    const clonedDay: ItineraryDay = {
      ...origDay,
      id: `day-${Date.now()}`,
      day_number: origDay.day_number + 1,
      title: `Copy of ${origDay.title}`,
      items: clonedItems,
    };

    const newDays = [...currentItinerary.days];
    newDays.splice(dayIdx + 1, 0, clonedDay);

    // Renumber
    const renumbered = newDays.map((d, idx) => ({
      ...d,
      position: idx,
      day_number: idx + 1,
    }));

    updateItinerary(
      {
        days: renumbered,
        days_count: Math.max(currentItinerary.days_count, renumbered.length),
      },
      false
    );
  };

  const handleMoveDay = (fromIdx: number, toIdx: number) => {
    if (!currentItinerary || toIdx < 0 || toIdx >= currentItinerary.days.length) return;
    const newDays = [...currentItinerary.days];
    const [moved] = newDays.splice(fromIdx, 1);
    newDays.splice(toIdx, 0, moved);

    // Renumber
    const renumbered = newDays.map((d, idx) => ({
      ...d,
      position: idx,
      day_number: idx + 1,
    }));

    updateItinerary({ days: renumbered }, false);
  };

  // Day Item Operations
  const handleAddItemToDay = (dayIdx: number, type: ItemType) => {
    if (!currentItinerary) return;
    const targetDay = currentItinerary.days[dayIdx];
    const defaultTitle =
      type === 'accommodation'
        ? 'Resort / Hotel Stay'
        : type === 'transfer'
        ? 'Scenic Transfer'
        : type === 'meal'
        ? 'Buffet Breakfast Included'
        : type === 'sightseeing'
        ? 'Guided Sightseeing'
        : type === 'arrival'
        ? 'Airport Welcome & Pickup'
        : type === 'departure'
        ? 'Departure Transfer'
        : 'Important Note';

    const newItem: DayItem = {
      id: `item-${Date.now()}`,
      day_id: targetDay.id,
      position: targetDay.items.length,
      item_type: type,
      title: defaultTitle,
      description: '',
    };

    const updatedDays = [...currentItinerary.days];
    updatedDays[dayIdx] = {
      ...targetDay,
      items: [...targetDay.items, newItem],
    };

    updateItinerary({ days: updatedDays }, false);
  };

  const handleUpdateDayItem = (
    dayIdx: number,
    itemIdx: number,
    updatedItem: Partial<DayItem>
  ) => {
    if (!currentItinerary) return;
    const targetDay = currentItinerary.days[dayIdx];
    const updatedItems = [...targetDay.items];
    updatedItems[itemIdx] = { ...updatedItems[itemIdx], ...updatedItem };

    const updatedDays = [...currentItinerary.days];
    updatedDays[dayIdx] = { ...targetDay, items: updatedItems };

    updateItinerary({ days: updatedDays }, false);
  };

  const handleDeleteDayItem = (dayIdx: number, itemIdx: number) => {
    if (!currentItinerary) return;
    const targetDay = currentItinerary.days[dayIdx];
    const updatedItems = targetDay.items.filter((_, idx) => idx !== itemIdx);

    const updatedDays = [...currentItinerary.days];
    updatedDays[dayIdx] = { ...targetDay, items: updatedItems };

    updateItinerary({ days: updatedDays }, true);
  };

  const handleMoveItemToDay = (
    fromDayIdx: number,
    itemIdx: number,
    targetDayIdx: number
  ) => {
    if (
      !currentItinerary ||
      fromDayIdx === targetDayIdx ||
      targetDayIdx < 0 ||
      targetDayIdx >= currentItinerary.days.length
    )
      return;

    const sourceDay = currentItinerary.days[fromDayIdx];
    const targetDay = currentItinerary.days[targetDayIdx];
    const itemToMove = sourceDay.items[itemIdx];

    const newSourceItems = sourceDay.items.filter((_, idx) => idx !== itemIdx);
    const newTargetItems = [...targetDay.items, { ...itemToMove, day_id: targetDay.id }];

    const updatedDays = [...currentItinerary.days];
    updatedDays[fromDayIdx] = { ...sourceDay, items: newSourceItems };
    updatedDays[targetDayIdx] = { ...targetDay, items: newTargetItems };

    updateItinerary({ days: updatedDays }, false);
  };

  // Section Operations
  const handleAddSection = (type: SectionType, defaultTitle: string) => {
    if (!currentItinerary) return;
    const newSec: ItinerarySection = {
      id: `sec-${Date.now()}`,
      itinerary_id: currentItinerary.id,
      position: currentItinerary.sections.length,
      section_type: type,
      title: defaultTitle,
      content: '• Item description here',
      visible_in_pdf: true,
    };

    updateItinerary({ sections: [...currentItinerary.sections, newSec] }, false);
  };

  const handleUpdateSection = (secIdx: number, updatedSec: Partial<ItinerarySection>) => {
    if (!currentItinerary) return;
    const updatedSections = [...currentItinerary.sections];
    updatedSections[secIdx] = { ...updatedSections[secIdx], ...updatedSec };
    updateItinerary({ sections: updatedSections }, false);
  };

  const handleDeleteSection = (secIdx: number) => {
    if (!currentItinerary) return;
    const updatedSections = currentItinerary.sections.filter((_, idx) => idx !== secIdx);
    updateItinerary({ sections: updatedSections }, true);
  };

  // PDF Export Action
  const handleExportPdf = async () => {
    if (!currentItinerary) return;
    setExporting(true);
    try {
      await api.exportPdf(currentItinerary);

      // Refresh itinerary status
      setCurrentItinerary({ ...currentItinerary, status: 'exported' });
      const updatedList = await api.getItineraries();
      setItineraries(updatedList);
    } catch (err: any) {
      alert(`PDF export failed: ${err.message || 'Please check server logs'}`);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased selection:bg-sky-500 selection:text-white">
      {/* Top Main Navbar */}
      <Navbar
        agency={agency}
        onOpenSettings={() => setShowAgencyModal(true)}
        onOpenSheetsModal={() => setShowSheetsModal(true)}
        onNewItinerary={() => setShowCreateModal(true)}
        sheetsConnected={sheetsConnected}
        activeView={activeView}
        onGoDashboard={() => {
          setActiveView('dashboard');
          loadInitialData();
        }}
      />

      {/* Main Workspace */}
      <main className="flex-1 flex flex-col">
        {activeView === 'dashboard' ? (
          <Dashboard
            itineraries={itineraries}
            loading={loadingDashboard}
            onOpenItinerary={handleOpenItinerary}
            onPreviewItinerary={(itin) => {
              setCurrentItinerary(itin);
              setShowPreviewModal(true);
            }}
            onDuplicateItinerary={handleDuplicateItinerary}
            onDeleteItinerary={handleDeleteItinerary}
            onNewItinerary={() => setShowCreateModal(true)}
          />
        ) : currentItinerary ? (
          <div className="flex-1 flex flex-col">
            {/* Editor Action Bar */}
            <TopActionBar
              itinerary={currentItinerary}
              saveStatus={saveStatus}
              canUndo={historyStack.length > 0}
              exporting={exporting}
              onUpdateItinerary={(upd) => updateItinerary(upd, false)}
              onSave={() => triggerAutoSave(currentItinerary)}
              onUndo={handleUndo}
              onOpenPreview={() => setShowPreviewModal(true)}
              onExportPdf={handleExportPdf}
              onBackToDashboard={() => {
                setActiveView('dashboard');
                loadInitialData();
              }}
              onToggleThemeDrawer={() => setShowThemeDrawer(true)}
            />

            <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex gap-6">
              {/* Left Day Rail (Desktop) */}
              <div className="hidden md:block">
                <DaySidebarRail
                  days={currentItinerary.days}
                  activeDayId={activeDayId}
                  onSelectDay={(id) => {
                    setActiveDayId(id);
                    document
                      .getElementById(`day-card-${id}`)
                      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  onAddDay={handleAddDay}
                  onMoveDay={handleMoveDay}
                />
              </div>

              {/* Main Day Cards Workspace */}
              <div className="flex-1 max-w-4xl space-y-6">
                {/* Trip Metadata Panel */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4 text-left">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center space-x-1.5">
                      <Info className="w-4 h-4 text-sky-600" />
                      <span>Trip Summary & Client Info</span>
                    </span>
                    <button
                      onClick={() =>
                        setImagePickerContext({
                          title: 'Cover Image for Proposal',
                          query:
                            currentItinerary.destination_summary ||
                            currentItinerary.title ||
                            'Luxury Travel',
                          currentUrl: currentItinerary.cover_image_url,
                        })
                      }
                      className="text-xs text-sky-600 hover:text-sky-700 font-semibold cursor-pointer"
                    >
                      Change Cover Photo
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                        Client / Passenger Name
                      </label>
                      <input
                        type="text"
                        value={currentItinerary.customer_name || ''}
                        onChange={(e) => updateItinerary({ customer_name: e.target.value })}
                        placeholder="e.g. Mr. David Smith"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-sky-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                        Travel Dates (Optional)
                      </label>
                      <input
                        type="text"
                        value={currentItinerary.start_date || ''}
                        onChange={(e) => updateItinerary({ start_date: e.target.value })}
                        placeholder="e.g. 15 Oct - 20 Oct 2026"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-sky-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                        Destination Route Summary
                      </label>
                      <input
                        type="text"
                        value={currentItinerary.destination_summary || ''}
                        onChange={(e) =>
                          updateItinerary({ destination_summary: e.target.value })
                        }
                        placeholder="e.g. Cochin → Munnar → Thekkady"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-sky-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Trip Overview Notes (Shown on Cover Page)
                    </label>
                    <textarea
                      rows={2}
                      value={currentItinerary.notes || ''}
                      onChange={(e) => updateItinerary({ notes: e.target.value })}
                      placeholder="Brief introductory paragraph or highlights for traveler..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-sky-500 leading-relaxed"
                    />
                  </div>
                </div>

                {/* Day Cards List */}
                <div className="space-y-6">
                  {currentItinerary.days.map((day, dayIdx) => (
                    <DayCard
                      key={day.id}
                      day={day}
                      dayIndex={dayIdx}
                      totalDays={currentItinerary.days.length}
                      onUpdateDay={(upd) => handleUpdateDay(dayIdx, upd)}
                      onOpenImagePicker={() =>
                        setImagePickerContext({
                          dayId: day.id,
                          dayIndex: dayIdx,
                          title: `Day ${day.day_number}: ${day.title || day.destination}`,
                          query:
                            `${day.destination} ${day.title} travel scenic`.trim() || 'Kerala tourism',
                          currentUrl: day.hero_image_url,
                        })
                      }
                      onDuplicateDay={() => handleDuplicateDay(dayIdx)}
                      onDeleteDay={() => handleDeleteDay(dayIdx)}
                      onAddItem={(type) => handleAddItemToDay(dayIdx, type)}
                      onUpdateItem={(itIdx, upd) =>
                        handleUpdateDayItem(dayIdx, itIdx, upd)
                      }
                      onDeleteItem={(itIdx) => handleDeleteDayItem(dayIdx, itIdx)}
                      onMoveItemToDay={(itIdx, targetDayIdx) =>
                        handleMoveItemToDay(dayIdx, itIdx, targetDayIdx)
                      }
                    />
                  ))}
                </div>

                {/* Proposal Sections Editor */}
                <SectionEditor
                  sections={currentItinerary.sections}
                  onAddSection={handleAddSection}
                  onUpdateSection={handleUpdateSection}
                  onDeleteSection={handleDeleteSection}
                />
              </div>
            </div>
          </div>
        ) : null}
      </main>

      {/* Create / Import Modal */}
      <CreateImportModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onParsedResult={(res) => {
          setPendingParseResult(res);
          setShowParseReviewModal(true);
        }}
        onStartBlank={handleStartBlank}
      />

      {/* Parse Review Modal */}
      <ParseReviewModal
        isOpen={showParseReviewModal}
        parseResult={pendingParseResult}
        onClose={() => setShowParseReviewModal(false)}
        onConfirm={handleConfirmParsed}
      />

      {/* Image Picker Modal */}
      {imagePickerContext && (
        <ImagePickerModal
          isOpen={Boolean(imagePickerContext)}
          contextTitle={imagePickerContext.title}
          initialQuery={imagePickerContext.query}
          currentImageUrl={imagePickerContext.currentUrl}
          onClose={() => setImagePickerContext(null)}
          onSelectImage={({ url, caption, attribution, focal_x, focal_y, fit }) => {
            if (imagePickerContext.dayIndex !== undefined && currentItinerary) {
              handleUpdateDay(imagePickerContext.dayIndex, {
                hero_image_url: url,
                hero_image_caption: caption,
                hero_image_attribution: attribution,
                hero_image_focal_x: focal_x,
                hero_image_focal_y: focal_y,
                hero_image_fit: fit,
              });
            } else if (currentItinerary) {
              updateItinerary({ cover_image_url: url }, false);
            }
          }}
        />
      )}

      {/* Live PDF Preview Modal */}
      {showPreviewModal && currentItinerary && agency && (
        <PreviewModal
          isOpen={showPreviewModal}
          itinerary={currentItinerary}
          agency={agency}
          onClose={() => setShowPreviewModal(false)}
          onExportPdf={handleExportPdf}
          exporting={exporting}
        />
      )}

      {/* Agency Settings Modal */}
      {showAgencyModal && agency && (
        <AgencySettingsModal
          isOpen={showAgencyModal}
          agency={agency}
          onClose={() => setShowAgencyModal(false)}
          onSave={async (updatedAgency) => {
            const saved = await api.updateAgency(updatedAgency);
            setAgency(saved);
          }}
        />
      )}

      {/* Google Sheets Config Modal */}
      <GoogleSheetsConfigModal
        isOpen={showSheetsModal}
        onClose={() => setShowSheetsModal(false)}
        onConnectionChange={(connected) => setSheetsConnected(connected)}
      />

      {/* Theme Drawer */}
      {showThemeDrawer && currentItinerary && agency && (
        <ThemeControlDrawer
          isOpen={showThemeDrawer}
          itinerary={currentItinerary}
          agency={agency}
          onClose={() => setShowThemeDrawer(false)}
          onUpdateItinerary={(upd) => updateItinerary(upd, false)}
        />
      )}

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}

export default App;
