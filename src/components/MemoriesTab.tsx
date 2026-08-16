import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { AlumniMemory } from '../types';
import {
  Camera,
  Heart,
  PlusCircle,
  X,
  Sparkles,
  GraduationCap,
  Calendar,
  Share2
} from 'lucide-react';

export const MemoriesTab: React.FC = () => {
  const { memories, addMemory, toggleLikeMemory, user } = useData();
  const [selectedHouse, setSelectedHouse] = useState<string>('ALL');
  const [isAddMemoryModalOpen, setIsAddMemoryModalOpen] = useState(false);

  // New memory form state
  const [newTitle, setNewTitle] = useState('');
  const [newCaption, setNewCaption] = useState('');
  const [newYear, setNewYear] = useState(2014);
  const [newHouse, setNewHouse] = useState<'Aravali' | 'Nilgiri' | 'Shivalik' | 'Udaygiri' | 'Campus'>('Campus');
  const [newImageUrl, setNewImageUrl] = useState('');

  const filteredMemories = selectedHouse === 'ALL'
    ? memories
    : memories.filter(m => m.house === selectedHouse);

  const handleAddMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newCaption) return;

    addMemory({
      title: newTitle,
      caption: newCaption,
      year: Number(newYear),
      house: newHouse,
      submittedByName: user?.displayName || 'Alumnus',
      submittedByBatch: user?.profile?.batchYear || 2012,
      imageUrl: newImageUrl || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&h=400&fit=crop'
    });

    setIsAddMemoryModalOpen(false);
    setNewTitle('');
    setNewCaption('');
    setNewImageUrl('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
              <Camera className="w-6 h-6 text-amber-400" />
              <span>Navodaya Nostalgia & Memories Wall</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Hostel nights, mess puries, morning assembly prayers, house sports rivalries & eternal memories.
            </p>
          </div>

          <button
            onClick={() => setIsAddMemoryModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-amber-500/20 transition cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Share Campus Memory</span>
          </button>
        </div>

        {/* Filter chips */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800">
          {(['ALL', 'Aravali', 'Nilgiri', 'Shivalik', 'Udaygiri', 'Campus'] as const).map((h) => (
            <button
              key={h}
              onClick={() => setSelectedHouse(h)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                selectedHouse === h
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
              }`}
            >
              {h === 'ALL' ? 'All Memories' : `${h} House`}
            </button>
          ))}
        </div>
      </div>

      {/* Memories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredMemories.map((mem) => (
          <div
            key={mem.id}
            className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl hover:border-slate-700 transition flex flex-col justify-between"
          >
            <div className="relative h-64 sm:h-72 w-full overflow-hidden">
              <img
                src={mem.imageUrl}
                alt={mem.title}
                className="w-full h-full object-cover hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
              <div className="absolute top-3 left-3 flex items-center space-x-2">
                <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-slate-900/90 text-amber-300 border border-slate-700">
                  {mem.house} House
                </span>
                <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-slate-900/90 text-slate-300 border border-slate-700">
                  circa {mem.year}
                </span>
              </div>
            </div>

            <div className="p-5 sm:p-6 space-y-3.5 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                  {mem.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {mem.caption}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <div className="text-xs text-slate-400 flex items-center space-x-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Shared by <strong className="text-slate-200">{mem.submittedByName}</strong> (Batch {mem.submittedByBatch})</span>
                </div>

                <button
                  onClick={() => toggleLikeMemory(mem.id)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    mem.liked
                      ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${mem.liked ? 'fill-red-500 text-red-500' : ''}`} />
                  <span>{mem.likesCount} Nostalgia</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Memory Modal */}
      {isAddMemoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-5 shadow-2xl relative text-white">
            <button
              onClick={() => setIsAddMemoryModalOpen(false)}
              className="absolute right-5 top-5 p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white flex items-center space-x-2">
              <Camera className="w-5 h-5 text-amber-400" />
              <span>Share Campus Nostalgia</span>
            </h3>

            <form onSubmit={handleAddMemory} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Memory Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Volleyball Championship Finals 2011"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 text-white rounded-xl border border-slate-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">House / Category</label>
                  <select
                    value={newHouse}
                    onChange={(e) => setNewHouse(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-800 text-white rounded-xl border border-slate-700"
                  >
                    <option value="Campus">All Campus</option>
                    <option value="Aravali">Aravali House</option>
                    <option value="Nilgiri">Nilgiri House</option>
                    <option value="Shivalik">Shivalik House</option>
                    <option value="Udaygiri">Udaygiri House</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Year</label>
                  <input
                    type="number"
                    value={newYear}
                    onChange={(e) => setNewYear(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-800 text-white rounded-xl border border-slate-700"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">The Story / Caption</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Tell the unforgettable memory, teachers involved, hostel mischiefs..."
                  value={newCaption}
                  onChange={(e) => setNewCaption(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 text-white rounded-xl border border-slate-700"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Photo Image URL (Unsplash or Image URL)</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 text-white rounded-xl border border-slate-700"
                />
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddMemoryModalOpen(false)}
                  className="w-1/2 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl shadow-lg transition"
                >
                  Post Memory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
