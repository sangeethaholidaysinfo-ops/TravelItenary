import React, { useState } from 'react';
import { X, FileText, Upload, PlusCircle, Sparkles, AlertCircle, FileCheck, ArrowRight, RefreshCw } from 'lucide-react';
import { ParseResponse } from '../types/itinerary';
import { api } from '../services/api';

interface CreateImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onParsedResult: (parsed: ParseResponse) => void;
  onStartBlank: () => void;
}

const SAMPLE_KERALA_TEXT = `Kerala Family Holiday — 5 Days / 4 Nights

Day 1: Arrive at Cochin International Airport. Meet the driver and transfer to Munnar. Check in to the hotel and relax.
Hotel: Green Valley Resort, Munnar.
Notes: Arrival time may vary.

Day 2: After breakfast, visit the tea museum, Mattupetty Dam, Echo Point and Top Station. Return to the hotel.
Meals: Breakfast.

Day 3: Check out after breakfast and travel towards Thekkady via Vagamon. Enjoy scenic viewpoints on the way, subject to time and road conditions. Check in at Thekkady.
Hotel: Spice Garden Stay, Thekkady.

Day 4: Visit Periyar area and enjoy optional local activities. Activities and entry tickets are subject to availability and local rules.
Meals: Breakfast.

Day 5: Breakfast, check out, and transfer to Cochin Airport for departure.
Notes: Confirm flight timing before finalizing transfer pickup.

Inclusions:
- Accommodation as listed
- Transfers mentioned in the itinerary

Exclusions:
- Personal expenses
- Any activity not explicitly listed as included

Important note: This sample is for parser testing only. Do not invent rates, opening hours, hotel ratings, or availability.`;

export const CreateImportModal: React.FC<CreateImportModalProps> = ({
  isOpen,
  onClose,
  onParsedResult,
  onStartBlank,
}) => {
  const [activeTab, setActiveTab] = useState<'paste' | 'upload' | 'blank'>('paste');
  const [pasteContent, setPasteContent] = useState('');
  const [parsing, setParsing] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleParseText = async () => {
    if (!pasteContent.trim()) {
      setError('Please paste itinerary text or click "Load Sample Itinerary".');
      return;
    }
    setParsing(true);
    setError(null);
    try {
      const res = await api.parseText(pasteContent);
      onParsedResult(res);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to parse text');
    } finally {
      setParsing(false);
    }
  };

  const handleParseFile = async () => {
    if (!uploadFile) {
      setError('Please select a file to import (.txt, .docx, or .pdf).');
      return;
    }
    setParsing(true);
    setError(null);
    try {
      const res = await api.parseFile(uploadFile);
      onParsedResult(res);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to parse file');
    } finally {
      setParsing(false);
    }
  };

  const handleLoadSample = () => {
    setPasteContent(SAMPLE_KERALA_TEXT);
    setError(null);
  };

  const handleClear = () => {
    setPasteContent('');
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-3xl w-full p-6 shadow-2xl relative max-h-[90vh] flex flex-col text-left">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-sky-600" />
              <span>Create or Import Itinerary</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Transform unstructured text, email proposals, Word or PDF files into an editable structured proposal.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab selection */}
        <div className="grid grid-cols-3 gap-2 py-4">
          <button
            type="button"
            onClick={() => setActiveTab('paste')}
            className={`flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'paste'
                ? 'bg-sky-50 border-sky-500 text-sky-700 shadow-2xs'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Paste Text</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'upload'
                ? 'bg-sky-50 border-sky-500 text-sky-700 shadow-2xs'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Upload Document</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('blank')}
            className={`flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'blank'
                ? 'bg-sky-50 border-sky-500 text-sky-700 shadow-2xs'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Start Blank</span>
          </button>
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto py-2">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {activeTab === 'paste' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 font-medium">
                  Paste WhatsApp, email or day-wise text:
                </span>
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={handleLoadSample}
                    className="text-sky-600 hover:text-sky-700 font-semibold underline cursor-pointer"
                  >
                    Load Sample Kerala Itinerary
                  </button>
                  <button
                    type="button"
                    onClick={handleClear}
                    className="text-slate-500 hover:text-slate-800 cursor-pointer"
                  >
                    Clear
                  </button>
                </div>
              </div>

              <textarea
                rows={11}
                value={pasteContent}
                onChange={(e) => setPasteContent(e.target.value)}
                placeholder="Day 1: Arrive Cochin, transfer to Munnar...&#10;Hotel: Green Valley Resort&#10;Day 2: Tea Museum & Echo Point..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3.5 text-xs text-slate-900 font-mono focus:bg-white focus:outline-none focus:border-sky-500 leading-relaxed shadow-2xs"
              />
            </div>
          )}

          {activeTab === 'upload' && (
            <div className="border-2 border-dashed border-slate-300 hover:border-sky-500 rounded-2xl p-8 text-center bg-slate-50 transition-colors">
              <Upload className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <h3 className="text-sm font-semibold text-slate-900 mb-1">
                Upload Itinerary Document
              </h3>
              <p className="text-xs text-slate-500 mb-4 max-w-sm mx-auto">
                Select a <span className="text-slate-800 font-semibold">.txt</span>,{' '}
                <span className="text-slate-800 font-semibold">.docx</span>, or text-based{' '}
                <span className="text-slate-800 font-semibold">.pdf</span> file.
              </p>

              <label className="inline-flex items-center px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold cursor-pointer shadow-xs transition-all">
                <span>{uploadFile ? uploadFile.name : 'Select Document'}</span>
                <input
                  type="file"
                  accept=".txt,.docx,.pdf,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
              </label>

              {uploadFile && (
                <div className="mt-3 flex items-center justify-center space-x-2 text-xs text-emerald-600 font-medium">
                  <FileCheck className="w-4 h-4" />
                  <span>Ready to parse: {uploadFile.name} ({(uploadFile.size / 1024).toFixed(1)} KB)</span>
                </div>
              )}
            </div>
          )}

          {activeTab === 'blank' && (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <PlusCircle className="w-12 h-12 text-sky-600 mx-auto" />
              <h3 className="text-base font-bold text-slate-900">Start from a Clean Slate</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Begin with an empty itinerary workspace. You can manually add days, configure destinations, add accommodations, transfers, and activities.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 cursor-pointer"
          >
            Cancel
          </button>

          {activeTab === 'blank' ? (
            <button
              type="button"
              onClick={() => {
                onStartBlank();
                onClose();
              }}
              className="flex items-center space-x-2 px-5 py-2 rounded-lg text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white shadow-xs transition-all cursor-pointer"
            >
              <span>Create Blank Itinerary</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : activeTab === 'upload' ? (
            <button
              type="button"
              onClick={handleParseFile}
              disabled={parsing || !uploadFile}
              className="flex items-center space-x-2 px-5 py-2 rounded-lg text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white shadow-xs transition-all disabled:opacity-40 cursor-pointer"
            >
              {parsing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Extracting & Parsing...</span>
                </>
              ) : (
                <>
                  <span>Parse Document</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleParseText}
              disabled={parsing || !pasteContent.trim()}
              className="flex items-center space-x-2 px-5 py-2 rounded-lg text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white shadow-xs transition-all disabled:opacity-40 cursor-pointer"
            >
              {parsing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Parsing Days & Details...</span>
                </>
              ) : (
                <>
                  <span>Parse Itinerary</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
