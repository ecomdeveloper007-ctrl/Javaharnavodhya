import React, { useState, useRef } from 'react';
import { useData } from '../../context/DataContext';
import { BannerSlide } from '../../types';
import {
  Image as ImageIcon,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Upload,
  Link as LinkIcon,
  Sparkles,
  ExternalLink,
  RotateCcw,
  X,
  Check,
  AlertCircle
} from 'lucide-react';
import { ImageWithFallback } from '../common/ImageWithFallback';

// Preset sample banner image URLs for quick selection
const PRESET_BANNER_IMAGES = [
  {
    title: 'School Campus & Main Block',
    url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1920&h=800&fit=crop'
  },
  {
    title: 'Alumni Network & Graduates',
    url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1920&h=800&fit=crop'
  },
  {
    title: 'Smart Classroom & Science Exhibition',
    url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1920&h=800&fit=crop'
  },
  {
    title: 'Grand Reunion & Alumni Convention',
    url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1920&h=800&fit=crop'
  },
  {
    title: 'Library & Academic Excellence',
    url: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1920&h=800&fit=crop'
  },
  {
    title: 'Sports Grounds & Athletics Meet',
    url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1920&h=800&fit=crop'
  }
];

export const AdminSliderCMS: React.FC = () => {
  const {
    bannerSlides,
    addBannerSlide,
    updateBannerSlide,
    deleteBannerSlide,
    reorderBannerSlides,
    resetBannerSlidesToDefault,
    setActiveTab
  } = useData();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<BannerSlide | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<Omit<BannerSlide, 'id' | 'createdAt'>>({
    title: '',
    titleHindi: '',
    subtitle: '',
    subtitleHindi: '',
    badgeText: 'Announcements',
    badgeTextHindi: 'नवीनतम सूचना',
    imageUrl: '',
    ctaText: 'Explore More',
    ctaTextHindi: 'अधिक जानें',
    ctaLink: 'about',
    secondaryCtaText: '',
    secondaryCtaTextHindi: '',
    secondaryCtaLink: '',
    isActive: true,
    order: bannerSlides.length + 1
  });

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  // Convert uploaded image file to Data URL
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, isEditing: boolean) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setImageError('Please select a valid image file (PNG, JPG, JPEG, WEBP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setImageError('Image file is large (> 5MB). Compressing or resizing is recommended.');
    } else {
      setImageError(null);
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (isEditing && editingSlide) {
        setEditingSlide({ ...editingSlide, imageUrl: result });
      } else {
        setFormData(prev => ({ ...prev, imageUrl: result }));
      }
    };
    reader.readAsDataURL(file);
  };

  // Save new slide
  const handleCreateSlide = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.imageUrl) {
      setImageError('Please provide a slide title and upload or enter an image URL.');
      return;
    }

    addBannerSlide(formData);
    setIsAddModalOpen(false);
    showToast('New slider banner created and published live!');
    
    // Reset form
    setFormData({
      title: '',
      titleHindi: '',
      subtitle: '',
      subtitleHindi: '',
      badgeText: 'Announcements',
      badgeTextHindi: 'नवीनतम सूचना',
      imageUrl: '',
      ctaText: 'Explore More',
      ctaTextHindi: 'अधिक जानें',
      ctaLink: 'about',
      secondaryCtaText: '',
      secondaryCtaTextHindi: '',
      secondaryCtaLink: '',
      isActive: true,
      order: bannerSlides.length + 2
    });
    setImageError(null);
  };

  // Save edited slide
  const handleUpdateSlide = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSlide || !editingSlide.title || !editingSlide.imageUrl) return;

    updateBannerSlide(editingSlide.id, editingSlide);
    setEditingSlide(null);
    showToast('Slider banner updated successfully!');
  };

  // Toggle active status
  const handleToggleActive = (slide: BannerSlide) => {
    const newStatus = !slide.isActive;
    updateBannerSlide(slide.id, { isActive: newStatus });
    showToast(`Slide "${slide.title.slice(0, 20)}..." ${newStatus ? 'enabled' : 'hidden'}.`);
  };

  // Move slide Up/Down
  const handleMoveSlide = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= bannerSlides.length) return;

    const updated = [...bannerSlides];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);

    reorderBannerSlides(updated);
    showToast('Banner slide order updated.');
  };

  // Delete slide
  const handleDeleteSlide = (id: string) => {
    deleteBannerSlide(id);
    setDeleteConfirmId(null);
    showToast('Banner slide deleted successfully.');
  };

  return (
    <div className="space-y-6" id="admin-slider-cms-container">
      {/* Top Header Card */}
      <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-indigo-950/40 border border-amber-500/30 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-2">
              <ImageIcon className="w-3.5 h-3.5" />
              Frontend Carousel & Banner Manager
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Hero Slider Banners</h2>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Upload custom high-resolution banner images, configure headlines, badges, and action CTA buttons for the public homepage carousel.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                setFormData(prev => ({ ...prev, order: bannerSlides.length + 1 }));
                setIsAddModalOpen(true);
              }}
              id="admin-add-slider-banner-btn"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs sm:text-sm font-bold shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Upload New Banner</span>
            </button>

            <button
              onClick={() => setActiveTab('home')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold transition cursor-pointer"
              title="Preview Slider on Public Homepage"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Homepage</span>
            </button>

            <button
              onClick={() => {
                if (window.confirm('Reset all slider banners to default school presets?')) {
                  resetBannerSlidesToDefault();
                  showToast('Slider banners reset to defaults.');
                }
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 text-xs font-medium transition cursor-pointer"
              title="Restore Default Preset Slides"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>
          </div>
        </div>

        {/* Success Toast */}
        {successToast && (
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold animate-pulse">
            <CheckCircle className="w-4 h-4" />
            <span>{successToast}</span>
          </div>
        )}
      </div>

      {/* Slider Banner Cards List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-bold text-white">Active Slides</span>
            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold">
              {bannerSlides.length} Banners
            </span>
          </div>
          <span className="text-xs text-slate-400">
            Drag, toggle, or reorder slides using arrows
          </span>
        </div>

        {bannerSlides.length === 0 ? (
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
              <ImageIcon className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">No Slider Banners Available</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Add your first slider banner or restore the default school presets to showcase on the homepage.
              </p>
            </div>
            <button
              onClick={resetBannerSlidesToDefault}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl shadow transition cursor-pointer"
            >
              Load Default Presets
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {bannerSlides.map((slide, idx) => (
              <div
                key={slide.id || idx}
                className={`bg-slate-900/90 border rounded-2xl p-4 sm:p-5 transition-all shadow-lg ${
                  slide.isActive
                    ? 'border-slate-800 hover:border-amber-500/40'
                    : 'border-slate-800/60 opacity-60 bg-slate-950/60'
                }`}
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                  
                  {/* Thumbnail & Order */}
                  <div className="md:col-span-4 relative rounded-xl overflow-hidden aspect-[16/8] bg-slate-950 border border-slate-800 group">
                    <ImageWithFallback
                      src={slide.imageUrl}
                      alt={slide.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-md text-[10px] font-mono font-bold text-amber-400 border border-slate-700">
                      #{idx + 1}
                    </div>

                    {slide.badgeText && (
                      <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-amber-500/90 backdrop-blur-md text-[10px] font-bold text-slate-950">
                        {slide.badgeText}
                      </div>
                    )}

                    {!slide.isActive && (
                      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center text-slate-400 text-xs font-bold">
                        <EyeOff className="w-4 h-4 mr-1.5" />
                        Hidden
                      </div>
                    )}
                  </div>

                  {/* Slide Content Details */}
                  <div className="md:col-span-5 space-y-1.5">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold ${
                          slide.isActive
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {slide.isActive ? 'Active on Homepage' : 'Hidden'}
                      </span>
                      {slide.ctaLink && (
                        <span className="text-[11px] text-amber-400/90 font-mono">
                          Target: {slide.ctaLink}
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-white line-clamp-1">{slide.title}</h3>
                    {slide.titleHindi && (
                      <p className="text-xs text-amber-200/80 font-devanagari line-clamp-1">
                        {slide.titleHindi}
                      </p>
                    )}
                    <p className="text-xs text-slate-400 line-clamp-2">{slide.subtitle}</p>

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      {slide.ctaText && (
                        <span className="text-[11px] bg-slate-800 px-2 py-0.5 rounded text-slate-300 border border-slate-700">
                          CTA: {slide.ctaText}
                        </span>
                      )}
                      {slide.secondaryCtaText && (
                        <span className="text-[11px] bg-slate-800 px-2 py-0.5 rounded text-slate-400 border border-slate-700">
                          2nd: {slide.secondaryCtaText}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions & Ordering Controls */}
                  <div className="md:col-span-3 flex flex-wrap md:flex-col items-center md:items-end justify-between gap-2.5 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
                    
                    {/* Move Up / Down Buttons */}
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleMoveSlide(idx, 'up')}
                        disabled={idx === 0}
                        className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 hover:text-white border border-slate-700 transition cursor-pointer"
                        title="Move Slide Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleMoveSlide(idx, 'down')}
                        disabled={idx === bannerSlides.length - 1}
                        className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 hover:text-white border border-slate-700 transition cursor-pointer"
                        title="Move Slide Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Visibility & Edit/Delete Buttons */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleToggleActive(slide)}
                        className={`p-2 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center space-x-1 ${
                          slide.isActive
                            ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700'
                            : 'bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40'
                        }`}
                        title={slide.isActive ? 'Hide from homepage' : 'Show on homepage'}
                      >
                        {slide.isActive ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        <span className="text-[11px] hidden sm:inline">
                          {slide.isActive ? 'Hide' : 'Show'}
                        </span>
                      </button>

                      <button
                        onClick={() => setEditingSlide({ ...slide })}
                        className="p-2 rounded-lg bg-amber-500/15 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 transition cursor-pointer flex items-center space-x-1"
                        title="Edit Slide"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span className="text-[11px] hidden sm:inline">Edit</span>
                      </button>

                      <button
                        onClick={() => setDeleteConfirmId(slide.id)}
                        className="p-2 rounded-lg bg-red-500/15 hover:bg-red-500/30 text-red-400 border border-red-500/30 transition cursor-pointer"
                        title="Delete Slide"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL: Upload & Add New Banner Slide */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-5 shadow-2xl">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Upload / Add Slider Banner</h3>
                  <p className="text-xs text-slate-400">Upload banner image and configure live captions</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setImageError(null);
                }}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSlide} className="space-y-4">
              
              {/* Image Upload Area */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300">
                  Banner Image (Upload File or Enter Image URL) <span className="text-amber-400">*</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* File Upload Box */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-700 hover:border-amber-500/60 rounded-2xl p-4 text-center cursor-pointer transition bg-slate-950/50 flex flex-col items-center justify-center space-y-2 group"
                  >
                    <Upload className="w-6 h-6 text-amber-400 group-hover:scale-110 transition-transform" />
                    <div className="text-xs font-medium text-slate-300">
                      Click to upload image file
                    </div>
                    <div className="text-[10px] text-slate-500">
                      PNG, JPG, WEBP (Recommended: 1920 × 800px)
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, false)}
                    />
                  </div>

                  {/* Direct URL Input Box */}
                  <div className="space-y-2 flex flex-col justify-center">
                    <div className="relative">
                      <LinkIcon className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                      <input
                        type="url"
                        placeholder="Or paste image URL (https://...)"
                        value={formData.imageUrl}
                        onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    {/* Presets dropdown */}
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          setFormData({ ...formData, imageUrl: e.target.value });
                        }
                      }}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-amber-500"
                    >
                      <option value="">Choose from school image presets...</option>
                      {PRESET_BANNER_IMAGES.map((preset, pIdx) => (
                        <option key={pIdx} value={preset.url}>
                          {preset.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {imageError && (
                  <div className="text-xs text-rose-400 flex items-center space-x-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{imageError}</span>
                  </div>
                )}

                {/* Image Live Preview */}
                {formData.imageUrl && (
                  <div className="relative rounded-xl overflow-hidden aspect-[16/7] bg-slate-950 border border-slate-700 mt-2">
                    <ImageWithFallback
                      src={formData.imageUrl}
                      alt="Banner Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 px-2 py-1 rounded bg-slate-950/80 text-[10px] text-emerald-400 font-mono font-bold">
                      ✓ Image Loaded Preview
                    </div>
                  </div>
                )}
              </div>

              {/* Title & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Slide Headline / Title (English) <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., JNVST Admissions 2026-27 Open"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Badge Tag (English)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Admissions / Alumni Meet / Sports"
                    value={formData.badgeText || ''}
                    onChange={e => setFormData({ ...formData, badgeText: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Hindi Title & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Headline in Hindi (वैकल्पिक)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., जे.एन.वी.एस.टी. प्रवेश 2026-27 प्रारंभ"
                    value={formData.titleHindi || ''}
                    onChange={e => setFormData({ ...formData, titleHindi: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-devanagari focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Badge Tag in Hindi (वैकल्पिक)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., प्रवेश सूचना / पूर्व छात्र संजाल"
                    value={formData.badgeTextHindi || ''}
                    onChange={e => setFormData({ ...formData, badgeTextHindi: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-devanagari focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Subtitle */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Subtitle / Description
                </label>
                <textarea
                  rows={2}
                  placeholder="A short informative description about the announcement or campus feature..."
                  value={formData.subtitle}
                  onChange={e => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Action Buttons Routing */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Primary CTA Label
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Apply for Admission"
                    value={formData.ctaText || ''}
                    onChange={e => setFormData({ ...formData, ctaText: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white mb-2"
                  />

                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Primary Target Destination
                  </label>
                  <select
                    value={formData.ctaLink || 'about'}
                    onChange={e => setFormData({ ...formData, ctaLink: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white"
                  >
                    <option value="admissions">Admissions Page</option>
                    <option value="alumni">Alumni Portal & Directory</option>
                    <option value="events">Events & Reunions</option>
                    <option value="gallery">Photo Gallery</option>
                    <option value="academics">Academics & Toppers</option>
                    <option value="faculty">Faculty & Staff</option>
                    <option value="about">About School</option>
                    <option value="donations">Alumni Giving & Welfare</option>
                    <option value="contact">Contact Us</option>
                    <option value="register">Alumni Registration Dialog</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Secondary CTA Label (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Campus Overview"
                    value={formData.secondaryCtaText || ''}
                    onChange={e => setFormData({ ...formData, secondaryCtaText: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white mb-2"
                  />

                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Secondary Target Destination
                  </label>
                  <select
                    value={formData.secondaryCtaLink || ''}
                    onChange={e => setFormData({ ...formData, secondaryCtaLink: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white"
                  >
                    <option value="">None (Single Button)</option>
                    <option value="about">About School</option>
                    <option value="admissions">Admissions</option>
                    <option value="gallery">Photo Gallery</option>
                    <option value="faculty">Faculty Directory</option>
                    <option value="donations">Alumni Giving & Welfare</option>
                    <option value="contact">Contact Details</option>
                  </select>
                </div>
              </div>

              {/* Status Toggle */}
              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="new-slide-is-active"
                  checked={formData.isActive}
                  onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded text-amber-500 focus:ring-amber-400 w-4 h-4 bg-slate-800 border-slate-700"
                />
                <label htmlFor="new-slide-is-active" className="text-xs font-medium text-slate-300 cursor-pointer">
                  Publish immediately to homepage slider (Active)
                </label>
              </div>

              {/* Form Buttons */}
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl shadow transition cursor-pointer"
                >
                  Publish Banner Slide
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* MODAL: Edit Existing Slide */}
      {editingSlide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-5 shadow-2xl">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                  <Edit2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Edit Banner Slide</h3>
                  <p className="text-xs text-slate-400">Modify image, captions, and links</p>
                </div>
              </div>
              <button
                onClick={() => setEditingSlide(null)}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateSlide} className="space-y-4">
              
              {/* Image Upload Area */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300">
                  Banner Image (Upload File or Enter Image URL)
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => editFileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-700 hover:border-amber-500/60 rounded-2xl p-4 text-center cursor-pointer transition bg-slate-950/50 flex flex-col items-center justify-center space-y-2 group"
                  >
                    <Upload className="w-6 h-6 text-amber-400 group-hover:scale-110 transition-transform" />
                    <div className="text-xs font-medium text-slate-300">Replace Image File</div>
                    <div className="text-[10px] text-slate-500">PNG, JPG, WEBP (1920 × 800px)</div>
                    <input
                      ref={editFileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, true)}
                    />
                  </div>

                  <div className="space-y-2 flex flex-col justify-center">
                    <input
                      type="url"
                      placeholder="Or update image URL"
                      value={editingSlide.imageUrl}
                      onChange={e => setEditingSlide({ ...editingSlide, imageUrl: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                {editingSlide.imageUrl && (
                  <div className="relative rounded-xl overflow-hidden aspect-[16/7] bg-slate-950 border border-slate-700 mt-2">
                    <ImageWithFallback
                      src={editingSlide.imageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Title & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Slide Headline / Title (English)
                  </label>
                  <input
                    type="text"
                    required
                    value={editingSlide.title}
                    onChange={e => setEditingSlide({ ...editingSlide, title: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Badge Tag (English)
                  </label>
                  <input
                    type="text"
                    value={editingSlide.badgeText || ''}
                    onChange={e => setEditingSlide({ ...editingSlide, badgeText: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              {/* Hindi Title & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Headline in Hindi
                  </label>
                  <input
                    type="text"
                    value={editingSlide.titleHindi || ''}
                    onChange={e => setEditingSlide({ ...editingSlide, titleHindi: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-devanagari"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Badge Tag in Hindi
                  </label>
                  <input
                    type="text"
                    value={editingSlide.badgeTextHindi || ''}
                    onChange={e => setEditingSlide({ ...editingSlide, badgeTextHindi: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-devanagari"
                  />
                </div>
              </div>

              {/* Subtitle */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Subtitle / Description
                </label>
                <textarea
                  rows={2}
                  value={editingSlide.subtitle}
                  onChange={e => setEditingSlide({ ...editingSlide, subtitle: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              {/* Action Buttons Routing */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Primary CTA Label
                  </label>
                  <input
                    type="text"
                    value={editingSlide.ctaText || ''}
                    onChange={e => setEditingSlide({ ...editingSlide, ctaText: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white mb-2"
                  />

                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Primary Target Destination
                  </label>
                  <select
                    value={editingSlide.ctaLink || 'about'}
                    onChange={e => setEditingSlide({ ...editingSlide, ctaLink: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white"
                  >
                    <option value="admissions">Admissions Page</option>
                    <option value="alumni">Alumni Portal & Directory</option>
                    <option value="events">Events & Reunions</option>
                    <option value="gallery">Photo Gallery</option>
                    <option value="academics">Academics & Toppers</option>
                    <option value="faculty">Faculty & Staff</option>
                    <option value="about">About School</option>
                    <option value="donations">Alumni Giving & Welfare</option>
                    <option value="contact">Contact Us</option>
                    <option value="register">Alumni Registration Dialog</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Secondary CTA Label (Optional)
                  </label>
                  <input
                    type="text"
                    value={editingSlide.secondaryCtaText || ''}
                    onChange={e => setEditingSlide({ ...editingSlide, secondaryCtaText: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white mb-2"
                  />

                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Secondary Target Destination
                  </label>
                  <select
                    value={editingSlide.secondaryCtaLink || ''}
                    onChange={e => setEditingSlide({ ...editingSlide, secondaryCtaLink: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white"
                  >
                    <option value="">None (Single Button)</option>
                    <option value="about">About School</option>
                    <option value="admissions">Admissions</option>
                    <option value="gallery">Photo Gallery</option>
                    <option value="faculty">Faculty Directory</option>
                    <option value="donations">Alumni Giving & Welfare</option>
                    <option value="contact">Contact Details</option>
                  </select>
                </div>
              </div>

              {/* Status Toggle */}
              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="edit-slide-is-active"
                  checked={editingSlide.isActive}
                  onChange={e => setEditingSlide({ ...editingSlide, isActive: e.target.checked })}
                  className="rounded text-amber-500 focus:ring-amber-400 w-4 h-4 bg-slate-800 border-slate-700"
                />
                <label htmlFor="edit-slide-is-active" className="text-xs font-medium text-slate-300 cursor-pointer">
                  Visible on Homepage (Active)
                </label>
              </div>

              {/* Form Buttons */}
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingSlide(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl shadow transition cursor-pointer"
                >
                  Save Changes
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* MODAL: Delete Confirmation */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-bold text-white">Delete Banner Slide?</h4>
              <p className="text-xs text-slate-400">
                This slide will be permanently removed from the homepage carousel.
              </p>
            </div>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteSlide(deleteConfirmId)}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl shadow transition cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
