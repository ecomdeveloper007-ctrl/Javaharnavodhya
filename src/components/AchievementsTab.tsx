import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Achievement } from '../types';
import {
  Award,
  Shield,
  Star,
  Sparkles,
  GraduationCap,
  PlusCircle,
  X
} from 'lucide-react';

export const AchievementsTab: React.FC = () => {
  const { achievements, addAchievement } = useData();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New achievement form
  const [title, setTitle] = useState('');
  const [alumniName, setAlumniName] = useState('');
  const [batchYear, setBatchYear] = useState(2010);
  const [category, setCategory] = useState<'Civil Services' | 'Defense Forces' | 'Medical' | 'Engineering & Tech' | 'Entrepreneurship' | 'Sports' | 'Academia'>('Civil Services');
  const [award, setAward] = useState('');
  const [description, setDescription] = useState('');

  const filteredAchievements = selectedCategory === 'ALL'
    ? achievements
    : achievements.filter(a => a.category === selectedCategory);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !alumniName) return;

    addAchievement({
      title,
      alumniName,
      batchYear: Number(batchYear),
      category,
      award,
      description,
      imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop'
    });

    setIsModalOpen(false);
    setTitle('');
    setAlumniName('');
    setDescription('');
    setAward('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
              <Award className="w-6 h-6 text-amber-400" />
              <span>Wall of Fame & Honors</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Honoring distinguished alumni who brought pride to JNV Pachpadra and the Nation.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-amber-500/20 transition cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Nominate an Alumnus</span>
          </button>
        </div>

        {/* Filter chips */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800">
          {(['ALL', 'Civil Services', 'Defense Forces', 'Engineering & Tech', 'Entrepreneurship'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
              }`}
            >
              {cat === 'ALL' ? 'All Honors' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Honors Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredAchievements.map((ach) => (
          <div
            key={ach.id}
            className="bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-3xl p-6 shadow-xl space-y-4 flex flex-col justify-between transition group"
          >
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <img
                  src={ach.imageUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop'}
                  alt={ach.alumniName}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-500 shadow-md group-hover:scale-105 transition"
                />

                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
                    {ach.category}
                  </span>
                  <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition">
                    {ach.alumniName}
                  </h3>
                  <p className="text-xs text-slate-400 flex items-center space-x-1">
                    <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
                    <span>Passout Batch of {ach.batchYear}</span>
                  </p>
                </div>
              </div>

              <div className="bg-slate-800/60 p-3.5 rounded-2xl border border-slate-800 space-y-1.5">
                <p className="text-xs font-bold text-amber-300 flex items-center space-x-1.5">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400 shrink-0" />
                  <span>{ach.title}</span>
                </p>
                {ach.award && (
                  <p className="text-[11px] font-semibold text-emerald-300 pl-5">
                    Honor: {ach.award}
                  </p>
                )}
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {ach.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Nominate Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-5 shadow-2xl relative text-white">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-5 top-5 p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white flex items-center space-x-2">
              <Award className="w-5 h-5 text-amber-400" />
              <span>Nominate Alumnus for Wall of Fame</span>
            </h3>

            <form onSubmit={handleAdd} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Alumnus Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Major Arvind Kumar Soni"
                  value={alumniName}
                  onChange={(e) => setAlumniName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 text-white rounded-xl border border-slate-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Batch Year</label>
                  <input
                    type="number"
                    required
                    value={batchYear}
                    onChange={(e) => setBatchYear(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-800 text-white rounded-xl border border-slate-700"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-2 py-2 bg-slate-800 text-white rounded-xl border border-slate-700"
                  >
                    <option value="Civil Services">Civil Services (IAS/IPS/IFS)</option>
                    <option value="Defense Forces">Defense Forces (Army/Navy/AirForce)</option>
                    <option value="Engineering & Tech">Engineering & Tech</option>
                    <option value="Medical">Medical & Healthcare</option>
                    <option value="Entrepreneurship">Entrepreneurship</option>
                    <option value="Sports">Sports</option>
                    <option value="Academia">Academia & Research</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Achievement Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. UPSC CSE Rank 34 or Sena Medal"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 text-white rounded-xl border border-slate-700"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Formal Award / Honor (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. President of India Gold Medal"
                  value={award}
                  onChange={(e) => setAward(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 text-white rounded-xl border border-slate-700"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Description of Accomplishment</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Provide background, service impact, and milestones..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 text-white rounded-xl border border-slate-700"
                />
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-1/2 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl shadow-lg transition"
                >
                  Submit Nomination
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
