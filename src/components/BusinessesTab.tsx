import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { BusinessListing } from '../types';
import {
  Store,
  MapPin,
  Globe,
  Phone,
  Mail,
  Tag,
  ShieldCheck,
  PlusCircle,
  X,
  Sparkles
} from 'lucide-react';

export const BusinessesTab: React.FC = () => {
  const { businesses, addBusiness, user } = useData();
  const [isAddBizModalOpen, setIsAddBizModalOpen] = useState(false);

  // New biz form state
  const [name, setName] = useState('');
  const [category, setCategory] = useState('IT & Software');
  const [city, setCity] = useState('Barmer / Jaipur');
  const [ownerName, setOwnerName] = useState(user?.displayName || '');
  const [ownerBatch, setOwnerBatch] = useState(user?.profile?.batchYear || 2012);
  const [ownerEmail, setOwnerEmail] = useState(user?.email || '');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [discountForAlumni, setDiscountForAlumni] = useState('15% discount for all verified Navodayans');
  const [description, setDescription] = useState('');

  const handleAddBiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description) return;

    addBusiness({
      name,
      category,
      ownerName: ownerName || 'Alumnus',
      ownerBatch: Number(ownerBatch),
      ownerEmail: ownerEmail || 'contact@business.com',
      ownerPhone: ownerPhone || '+91 98000 00000',
      website,
      description,
      city,
      discountForAlumni,
      logoUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200&h=200&fit=crop'
    });

    setIsAddBizModalOpen(false);
    setName('');
    setDescription('');
    setWebsite('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
              <Store className="w-6 h-6 text-emerald-400" />
              <span>Alumni Business Directory & Network</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Support alumni-owned ventures, startups, and consulting firms offering special discounts to Navodayans.
            </p>
          </div>

          <button
            onClick={() => setIsAddBizModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-500/20 transition cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>List My Business</span>
          </button>
        </div>
      </div>

      {/* Business Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {businesses.map((biz) => (
          <div
            key={biz.id}
            className="bg-slate-900 border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-5 shadow-xl transition flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                  {biz.category}
                </span>
                {biz.isVerified && (
                  <span className="flex items-center space-x-1 text-[11px] text-blue-400 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Verified</span>
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-base font-bold text-white leading-snug">
                  {biz.name}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5 flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span>{biz.city}</span>
                </p>
              </div>

              <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                {biz.description}
              </p>

              {biz.discountForAlumni && (
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-2.5 flex items-start space-x-2">
                  <Tag className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span className="text-[11px] text-amber-300 font-semibold leading-tight">
                    {biz.discountForAlumni}
                  </span>
                </div>
              )}

              <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800 space-y-1">
                <p>Founder: <span className="text-slate-200 font-semibold">{biz.ownerName}</span> (Batch {biz.ownerBatch})</p>
              </div>
            </div>

            <div className="pt-2 flex items-center space-x-2">
              {biz.website && (
                <a
                  href={biz.website}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-2 bg-slate-800 hover:bg-emerald-600 text-slate-200 hover:text-white text-xs font-bold rounded-xl border border-slate-700 transition flex items-center justify-center space-x-1.5"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Visit Website</span>
                </a>
              )}
              {biz.ownerPhone && (
                <a
                  href={`tel:${biz.ownerPhone}`}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-slate-700 transition"
                  title="Call Business"
                >
                  <Phone className="w-4 h-4" />
                </a>
              )}
              {biz.ownerEmail && (
                <a
                  href={`mailto:${biz.ownerEmail}`}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-slate-700 transition"
                  title="Email"
                >
                  <Mail className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* List Business Modal */}
      {isAddBizModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-5 shadow-2xl relative text-white">
            <button
              onClick={() => setIsAddBizModalOpen(false)}
              className="absolute right-5 top-5 p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white flex items-center space-x-2">
              <Store className="w-5 h-5 text-emerald-400" />
              <span>List Your Alumni Business / Venture</span>
            </h3>

            <form onSubmit={handleAddBiz} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Business Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Marwar Solar Energy"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 text-white rounded-xl border border-slate-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Category</label>
                  <input
                    type="text"
                    required
                    placeholder="Renewable Energy / IT / CA"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 text-white rounded-xl border border-slate-700"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Operational City</label>
                  <input
                    type="text"
                    required
                    placeholder="Barmer / Jaipur / Pan-India"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 text-white rounded-xl border border-slate-700"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Description of Services</label>
                <textarea
                  rows={3}
                  required
                  placeholder="What products or services do you offer?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 text-white rounded-xl border border-slate-700"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Exclusive Navodaya Alumni Discount / Offer</label>
                <input
                  type="text"
                  placeholder="e.g. 15% discount for all alumni + free consultation"
                  value={discountForAlumni}
                  onChange={(e) => setDiscountForAlumni(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 text-amber-300 rounded-xl border border-slate-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Website (Optional)</label>
                  <input
                    type="url"
                    placeholder="https://mybusiness.com"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 text-white rounded-xl border border-slate-700"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Contact Phone</label>
                  <input
                    type="tel"
                    placeholder="+91 94140 12345"
                    value={ownerPhone}
                    onChange={(e) => setOwnerPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 text-white rounded-xl border border-slate-700"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddBizModalOpen(false)}
                  className="w-1/2 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-xl shadow-lg transition"
                >
                  List Business
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
