import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { motion } from 'framer-motion';
import { Image, Eye, Calendar, Sparkles, Filter, X } from 'lucide-react';
import { GalleryItem } from '../../types';
import { ImageWithFallback } from '../common/ImageWithFallback';

export const GalleryView: React.FC = () => {
  const { gallery } = useData();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activePhoto, setActivePhoto] = useState<GalleryItem | null>(null);

  const categories = [
    'All',
    'Campus & Infrastructure',
    'Academic & Labs',
    'Sports & Athletics',
    'Cultural & Festivals',
    'Hostel Life & Dining',
    'Alumni Meets'
  ];

  const filteredPhotos = gallery.filter(g => {
    return selectedCategory === 'All' || g.category === selectedCategory;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8"
      id="gallery-view-container"
    >
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 space-y-4 shadow-xs">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-200 text-amber-800 text-xs font-semibold">
          <Image className="w-3.5 h-3.5" />
          <span>Vivid Visual Chronicles</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-bold text-slate-900">
          Campus Life & Events Photo Gallery
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
          Glances into the lively residential life, academic discoveries, sporting triumphs, annual functions, and nostalgic alumni gatherings at JNV Pachpadra.
        </p>
      </div>

      {/* Categories */}
      <div className="flex space-x-2 overflow-x-auto no-scrollbar pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              selectedCategory === cat
                ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Photo Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPhotos.map((item) => (
          <div
            key={item.id}
            onClick={() => setActivePhoto(item)}
            className="bg-white border border-slate-200 rounded-3xl overflow-hidden cursor-pointer group hover:border-amber-400/60 transition duration-300 flex flex-col justify-between shadow-xs"
          >
            <div className="relative overflow-hidden">
              <ImageWithFallback
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-56 object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition"></div>
              <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-white/90 text-amber-800 backdrop-blur-xs border border-amber-200 shadow-2xs">
                {item.category}
              </span>
            </div>

            <div className="p-5 space-y-1.5 bg-white">
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-amber-800 transition">
                {item.title}
              </h3>
              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {item.caption}
              </p>
              <div className="pt-2 flex justify-between items-center text-[10px] text-slate-400 font-mono border-t border-slate-100">
                <span>{item.date}</span>
                <span className="text-amber-800 font-medium flex items-center space-x-1 group-hover:underline">
                  <Eye className="w-3 h-3" />
                  <span>Enlarge</span>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Photo Lightbox Modal */}
      {activePhoto && (
        <div
          onClick={() => setActivePhoto(null)}
          className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white border border-slate-200 rounded-3xl overflow-hidden max-w-4xl w-full shadow-2xl space-y-4"
          >
            <div className="relative">
              <ImageWithFallback
                src={activePhoto.imageUrl}
                alt={activePhoto.title}
                className="w-full max-h-[70vh] object-contain bg-slate-950"
              />
              <button
                onClick={() => setActivePhoto(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/80 text-slate-700 hover:text-slate-950 border border-slate-200 cursor-pointer shadow-xs"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 pt-0 space-y-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                {activePhoto.category}
              </span>
              <h3 className="text-lg font-bold text-slate-900">{activePhoto.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{activePhoto.caption}</p>
              <div className="text-[11px] text-slate-400 font-mono pt-2 border-t border-slate-100">
                Archived Date: {activePhoto.date}
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};
