import React, { useState } from 'react';
import { X, Building2, Save, Check } from 'lucide-react';
import { Agency } from '../types/itinerary';

interface AgencySettingsModalProps {
  isOpen: boolean;
  agency: Agency;
  onClose: () => void;
  onSave: (updated: Agency) => Promise<void>;
}

const BRAND_PALETTES = [
  { name: 'Ocean Sky', color: '#0284c7' },
  { name: 'Royal Indigo', color: '#4f46e5' },
  { name: 'Emerald Forest', color: '#059669' },
  { name: 'Warm Amber', color: '#d97706' },
  { name: 'Rose Luxury', color: '#e11d48' },
  { name: 'Midnight Charcoal', color: '#1e293b' },
];

export const AgencySettingsModal: React.FC<AgencySettingsModalProps> = ({
  isOpen,
  agency,
  onClose,
  onSave,
}) => {
  const [form, setForm] = useState<Agency>({ ...agency });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(form);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 700);
    } catch (err) {
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto text-left">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-sky-50 text-sky-700 border border-sky-200">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Agency Branding & Settings</h2>
              <p className="text-xs text-slate-500">
                Customizes proposal headers, PDF footers, contact information and brand colors.
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

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Agency Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Agency Display Name
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-sky-500"
              placeholder="e.g. Wanderlust Luxury Holidays"
            />
          </div>

          {/* Logo URL */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Logo Image URL (Optional)
            </label>
            <input
              type="url"
              value={form.logo_url || ''}
              onChange={(e) => setForm({ ...form, logo_url: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-sky-500"
              placeholder="https://example.com/logo.png"
            />
            {form.logo_url && (
              <div className="mt-2 p-2 bg-slate-100 rounded border border-slate-200 inline-block">
                <img src={form.logo_url} alt="Logo preview" className="h-8 max-w-[140px] object-contain" />
              </div>
            )}
          </div>

          {/* Brand Colour Palette */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Brand Accent Color
            </label>
            <div className="flex items-center space-x-3 mb-3">
              <input
                type="color"
                value={form.brand_colour}
                onChange={(e) => setForm({ ...form, brand_colour: e.target.value })}
                className="w-10 h-10 rounded cursor-pointer bg-transparent border-0"
              />
              <input
                type="text"
                value={form.brand_colour}
                onChange={(e) => setForm({ ...form, brand_colour: e.target.value })}
                className="w-32 bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 font-mono"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {BRAND_PALETTES.map((p) => (
                <button
                  key={p.color}
                  type="button"
                  onClick={() => setForm({ ...form, brand_colour: p.color })}
                  className={`flex items-center space-x-2 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                    form.brand_colour === p.color
                      ? 'border-sky-600 ring-2 ring-sky-500/30 bg-sky-50 text-sky-900'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: p.color }} />
                  <span>{p.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Phone</label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Website</label>
              <input
                type="text"
                value={form.website}
                onChange={(e) => setForm({ ...form, website: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          {/* Footer Disclaimer */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Default Proposal Footer / Terms Note
            </label>
            <textarea
              rows={2}
              value={form.footer_disclaimer}
              onChange={(e) => setForm({ ...form, footer_disclaimer: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-sky-500 leading-relaxed"
            />
          </div>

          {/* Default Theme */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Default PDF Document Theme
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setForm({ ...form, default_theme: 'editorial' })}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  form.default_theme === 'editorial'
                    ? 'border-sky-500 bg-sky-50 ring-2 ring-sky-500/30'
                    : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                }`}
              >
                <div className="font-bold text-sm text-slate-900 font-serif">Editorial Style</div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Large scenic photography, spacious luxury layout, elegant typography.
                </div>
              </button>

              <button
                type="button"
                onClick={() => setForm({ ...form, default_theme: 'classic' })}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  form.default_theme === 'classic'
                    ? 'border-sky-500 bg-sky-50 ring-2 ring-sky-500/30'
                    : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                }`}
              >
                <div className="font-bold text-sm text-slate-900 font-sans">Classic Style</div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Compact, formal, information-first, clean corporate structured tables.
                </div>
              </button>
            </div>
          </div>

          {/* Save Footer */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center space-x-2 px-5 py-2 rounded-lg text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white shadow-xs transition-all disabled:opacity-50 cursor-pointer"
            >
              {success ? (
                <>
                  <Check className="w-4 h-4 text-emerald-200" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Saving...' : 'Save Settings'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
