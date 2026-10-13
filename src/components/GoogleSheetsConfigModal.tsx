import React, { useState, useEffect } from 'react';
import { X, FileSpreadsheet, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { GoogleSheetsConfig } from '../types/itinerary';
import { api } from '../services/api';

interface GoogleSheetsConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnectionChange: (connected: boolean) => void;
}

export const GoogleSheetsConfigModal: React.FC<GoogleSheetsConfigModalProps> = ({
  isOpen,
  onClose,
  onConnectionChange,
}) => {
  const [config, setConfig] = useState<GoogleSheetsConfig>({
    enabled: false,
    sheet_id: '',
    service_account_json: '',
  });
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadConfig();
    }
  }, [isOpen]);

  const loadConfig = async () => {
    try {
      setLoading(true);
      const data = await api.getGoogleSheetsConfig();
      setConfig(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTest = async () => {
    setTesting(true);
    setStatusMessage(null);
    try {
      const res = await api.testGoogleSheetsConnection(config);
      setStatusMessage({ type: 'success', text: res.message });
      onConnectionChange(true);
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Connection failed' });
      onConnectionChange(false);
    } finally {
      setTesting(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage(null);
    try {
      await api.saveGoogleSheetsConfig(config);
      setStatusMessage({ type: 'success', text: 'Google Sheets configuration saved successfully.' });
      if (config.enabled && config.sheet_id) {
        onConnectionChange(true);
      } else {
        onConnectionChange(false);
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Failed to save config' });
    } finally {
      setLoading(false);
    }
  };

  const handleSyncAll = async () => {
    setSyncing(true);
    setStatusMessage(null);
    try {
      const res = await api.syncWithGoogleSheets();
      setStatusMessage({ type: 'success', text: res.message });
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Sync failed' });
    } finally {
      setSyncing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto text-left">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Google Sheets Primary Database</h2>
              <p className="text-xs text-slate-500">
                Directly store and sync itineraries and agency data into your Google Spreadsheet.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-left">
          {/* Enable Switch */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <div className="text-sm font-semibold text-slate-900">Enable Google Sheets Database</div>
              <div className="text-xs text-slate-500">
                When enabled, itineraries sync automatically with your configured spreadsheet.
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.enabled}
                onChange={(e) => setConfig({ ...config, enabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          {/* Spreadsheet ID */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Google Spreadsheet ID
            </label>
            <input
              type="text"
              value={config.sheet_id}
              onChange={(e) => setConfig({ ...config, sheet_id: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 font-mono focus:bg-white focus:outline-none focus:border-emerald-500"
              placeholder="e.g. 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Found in your sheet URL: https://docs.google.com/spreadsheets/d/
              <strong className="text-emerald-700">YOUR_SHEET_ID</strong>/edit
            </p>
          </div>

          {/* Service Account JSON */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>Google Service Account JSON Credentials</span>
              <span className="text-[10px] text-slate-400 lowercase">paste JSON credentials</span>
            </label>
            <textarea
              rows={5}
              value={config.service_account_json || ''}
              onChange={(e) => setConfig({ ...config, service_account_json: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-xs text-slate-900 font-mono focus:bg-white focus:outline-none focus:border-emerald-500 leading-relaxed"
              placeholder='{"type": "service_account", "project_id": "...", "private_key": "...", "client_email": "..."}'
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Remember to share your Google Sheet with the Service Account email with{' '}
              <strong className="text-slate-800">Editor</strong> permissions.
            </p>
          </div>

          {/* Status feedback */}
          {statusMessage && (
            <div
              className={`p-3 rounded-lg border text-xs flex items-start space-x-2 ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  : 'bg-rose-50 border-rose-300 text-rose-800'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
              ) : (
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={handleTest}
                disabled={testing || !config.sheet_id}
                className="px-3.5 py-2 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors disabled:opacity-40 cursor-pointer"
              >
                {testing ? 'Testing...' : 'Test Connection'}
              </button>
              <button
                type="button"
                onClick={handleSyncAll}
                disabled={syncing || !config.enabled}
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-xs font-medium bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 transition-colors disabled:opacity-40 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
                <span>{syncing ? 'Syncing...' : 'Sync All to Sheet'}</span>
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 cursor-pointer"
              >
                Close
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs transition-all disabled:opacity-50 cursor-pointer"
              >
                {loading ? 'Saving...' : 'Save Configuration'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
