import React, { useState, useEffect } from 'react';
import { X, Search, Upload, Link as LinkIcon, Image as ImageIcon, Check, AlertCircle } from 'lucide-react';
import { ImageSearchResult } from '../types/itinerary';
import { api } from '../services/api';

interface ImagePickerModalProps {
  isOpen: boolean;
  contextTitle: string;
  initialQuery?: string;
  currentImageUrl?: string | null;
  currentFocalX?: number;
  currentFocalY?: number;
  currentFit?: 'cover' | 'contain';
  onClose: () => void;
  onSelectImage: (params: {
    url: string;
    caption?: string;
    attribution?: string;
    focal_x: number;
    focal_y: number;
    fit: 'cover' | 'contain';
  }) => void;
}

export const ImagePickerModal: React.FC<ImagePickerModalProps> = ({
  isOpen,
  contextTitle,
  initialQuery = 'Kerala tourism',
  currentImageUrl,
  currentFocalX = 50,
  currentFocalY = 50,
  currentFit = 'cover',
  onClose,
  onSelectImage,
}) => {
  const [activeTab, setActiveTab] = useState<'search' | 'upload' | 'url'>('search');
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [searchResults, setSearchResults] = useState<ImageSearchResult[]>([]);
  const [selectedImage, setSelectedImage] = useState<ImageSearchResult | null>(null);
  const [customUrl, setCustomUrl] = useState('');
  const [urlAttribution, setUrlAttribution] = useState('');
  const [focalX, setFocalX] = useState<number>(currentFocalX);
  const [focalY, setFocalY] = useState<number>(currentFocalY);
  const [fitMode, setFitMode] = useState<'cover' | 'contain'>(currentFit);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSearchQuery(initialQuery || 'Munnar Kerala');
      handleSearch(initialQuery || 'Munnar Kerala');
    }
  }, [isOpen, initialQuery]);

  const handleSearch = async (q: string) => {
    if (!q.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const results = await api.searchImages(q);
      setSearchResults(results);
      if (results.length > 0) {
        setSelectedImage(results[0]);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load photos');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    try {
      const res = await api.uploadImage(file);
      const uploadedResult: ImageSearchResult = {
        id: res.storage_key,
        url: res.url,
        thumb_url: res.url,
        title: file.name,
        attribution: 'Uploaded asset',
        source: 'Device upload',
      };
      setSelectedImage(uploadedResult);
      setActiveTab('search');
      setSearchResults([uploadedResult, ...searchResults]);
    } catch (err: any) {
      setError(err.message || 'File upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleUrlValidateAndSet = async () => {
    if (!customUrl.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const validated = await api.validateImageUrl(customUrl.trim());
      const customResult: ImageSearchResult = {
        id: `url-${Date.now()}`,
        url: validated.url,
        thumb_url: validated.url,
        title: 'Custom Web Image',
        attribution: urlAttribution || 'External URL',
        source: 'Web URL',
      };
      setSelectedImage(customResult);
      setActiveTab('search');
      setSearchResults([customResult, ...searchResults]);
    } catch (err: any) {
      setError(err.message || 'Invalid or blocked image URL');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (!selectedImage) return;
    onSelectImage({
      url: selectedImage.url,
      caption: selectedImage.title,
      attribution: selectedImage.attribution,
      focal_x: focalX,
      focal_y: focalY,
      fit: fitMode,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-4xl w-full p-6 shadow-2xl relative max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded-lg bg-sky-50 text-sky-700 border border-sky-200">
                <ImageIcon className="w-4 h-4" />
              </span>
              <h2 className="text-base font-bold text-slate-900">Select Destination Photo</h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              For: <span className="text-slate-800 font-semibold">{contextTitle}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center space-x-2 pt-4 pb-2">
          <button
            type="button"
            onClick={() => setActiveTab('search')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'search'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Curated & Scenic Search</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'upload'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload File</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'url'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span>Image URL</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto py-3 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {activeTab === 'search' && (
            <div>
              {/* Search input */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSearch(searchQuery);
                }}
                className="flex items-center space-x-2 mb-4"
              >
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search destination, hills, backwaters, monuments..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-sky-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  {loading ? 'Searching...' : 'Search'}
                </button>
              </form>

              {/* Photo Results Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[300px] overflow-y-auto p-1">
                {searchResults.map((item) => {
                  const isSelected = selectedImage?.url === item.url;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedImage(item)}
                      className={`group relative rounded-xl overflow-hidden cursor-pointer border-2 transition-all aspect-video ${
                        isSelected
                          ? 'border-sky-500 ring-2 ring-sky-500/40 shadow-md'
                          : 'border-slate-200 hover:border-slate-400 opacity-85 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={item.thumb_url || item.url}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-2">
                        <span className="text-[11px] font-bold text-white line-clamp-1">{item.title}</span>
                        <span className="text-[9px] text-slate-200 line-clamp-1">{item.attribution}</span>
                      </div>
                      {isSelected && (
                        <div className="absolute top-1.5 right-1.5 p-1 rounded-full bg-sky-600 text-white shadow">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'upload' && (
            <div className="border-2 border-dashed border-slate-300 hover:border-sky-500 rounded-2xl p-8 text-center bg-slate-50 transition-colors">
              <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <h3 className="text-sm font-semibold text-slate-900 mb-1">
                Upload image from your computer
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Supported formats: PNG, JPG, JPEG, WebP (Up to 15MB)
              </p>
              <label className="inline-flex items-center px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold cursor-pointer shadow transition-all">
                <span>{uploading ? 'Uploading...' : 'Choose File'}</span>
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>
          )}

          {activeTab === 'url' && (
            <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Direct Image URL
                </label>
                <input
                  type="url"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-sky-500 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Image Caption / Attribution (Optional)
                </label>
                <input
                  type="text"
                  value={urlAttribution}
                  onChange={(e) => setUrlAttribution(e.target.value)}
                  placeholder="e.g. Photo by Travel Agency"
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-sky-500"
                />
              </div>
              <button
                type="button"
                onClick={handleUrlValidateAndSet}
                disabled={loading || !customUrl.trim()}
                className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer"
              >
                {loading ? 'Validating...' : 'Load & Preview URL'}
              </button>
            </div>
          )}

          {/* Focal & Fit Controls */}
          {selectedImage && (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <div>
                <div className="text-xs font-bold text-slate-800 mb-1">Selected Preview & Cropping</div>
                <div className="w-full h-28 rounded-lg overflow-hidden relative bg-slate-900 border border-slate-300">
                  <img
                    src={selectedImage.url}
                    alt={selectedImage.title}
                    className={`w-full h-full object-${fitMode}`}
                    style={{ objectPosition: `${focalX}% ${focalY}%` }}
                  />
                  <div className="absolute bottom-1 right-2 text-[9px] bg-black/60 px-1.5 py-0.5 rounded text-white">
                    Focal: {focalX}% {focalY}% • {fitMode}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700">Focal Point</label>
                  <div className="flex items-center space-x-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setFocalX(50);
                        setFocalY(20);
                      }}
                      className="px-2 py-1 rounded bg-white hover:bg-slate-200 border border-slate-300 text-[10px] text-slate-700 cursor-pointer"
                    >
                      Top
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setFocalX(50);
                        setFocalY(50);
                      }}
                      className="px-2 py-1 rounded bg-white hover:bg-slate-200 border border-slate-300 text-[10px] text-slate-700 cursor-pointer"
                    >
                      Center
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setFocalX(50);
                        setFocalY(80);
                      }}
                      className="px-2 py-1 rounded bg-white hover:bg-slate-200 border border-slate-300 text-[10px] text-slate-700 cursor-pointer"
                    >
                      Bottom
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700">Image Fit</label>
                  <div className="flex items-center space-x-1.5">
                    <button
                      type="button"
                      onClick={() => setFitMode('cover')}
                      className={`px-2.5 py-1 rounded text-[10px] font-semibold transition-colors cursor-pointer ${
                        fitMode === 'cover'
                          ? 'bg-sky-600 text-white'
                          : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      Cover (Fill)
                    </button>
                    <button
                      type="button"
                      onClick={() => setFitMode('contain')}
                      className={`px-2.5 py-1 rounded text-[10px] font-semibold transition-colors cursor-pointer ${
                        fitMode === 'contain'
                          ? 'bg-sky-600 text-white'
                          : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      Contain (Full)
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            {selectedImage ? (
              <span>
                Selected: <strong className="text-slate-800">{selectedImage.title}</strong>
              </span>
            ) : (
              <span>Choose an image to apply to this day</span>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApply}
              disabled={!selectedImage}
              className="flex items-center space-x-1.5 px-5 py-2 rounded-lg text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white shadow-xs transition-all disabled:opacity-40 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Apply Image</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
