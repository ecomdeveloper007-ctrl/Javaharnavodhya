import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import {
  Globe,
  School,
  User,
  Award,
  Shield,
  Building,
  Save,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  Eye,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  Layers,
  FileText,
  Download,
  Upload
} from 'lucide-react';
import { BoardTopper, VMCLeader, HouseInfo } from '../../types';
import { CSVBulkImportModal } from './CSVBulkImportModal';

export const AdminWebsiteCMS: React.FC = () => {
  const {
    schoolSettings,
    updateSchoolSettings,
    houses,
    updateHouse,
    toppers,
    addTopper,
    updateTopper,
    deleteTopper,
    vmcMembers,
    addVMCMember,
    updateVMCMember,
    deleteVMCMember,
    getCSVTemplate
  } = useData();

  const [activeSubTab, setActiveSubTab] = useState<'general' | 'principal' | 'houses' | 'toppers' | 'vmc'>('general');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [csvModalModule, setCsvModalModule] = useState<string | null>(null);

  const handleDownloadSample = (moduleId: string) => {
    const template = getCSVTemplate(moduleId);
    const blob = new Blob([template], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sample_${moduleId}_data.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Local Form state for General settings
  const [generalForm, setGeneralForm] = useState(schoolSettings);

  // Modal / Form state for Toppers
  const [isAddTopperOpen, setIsAddTopperOpen] = useState(false);
  const [editingTopper, setEditingTopper] = useState<BoardTopper | null>(null);
  const [newTopper, setNewTopper] = useState<Omit<BoardTopper, 'id'>>({
    name: '',
    exam: 'CBSE AISSCE Class XII',
    stream: 'Science (PCM + CS)',
    percentage: 98.2,
    year: 2025,
    photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&fit=crop',
    currentPursuit: 'B.Tech at IIT Bombay'
  });

  // Modal / Form state for VMC Member
  const [isAddVMCOpen, setIsAddVMCOpen] = useState(false);
  const [editingVMC, setEditingVMC] = useState<VMCLeader | null>(null);
  const [newVMC, setNewVMC] = useState<Omit<VMCLeader, 'id'>>({
    name: '',
    designation: 'Member',
    organization: 'District Administration'
  });

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    updateSchoolSettings(generalForm);
    setSaveSuccessMsg('School website settings updated successfully and published live!');
    setTimeout(() => setSaveSuccessMsg(null), 4000);
  };

  const handleSaveTopper = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTopper) {
      updateTopper(editingTopper.id, editingTopper);
      setEditingTopper(null);
    } else {
      addTopper(newTopper);
      setIsAddTopperOpen(false);
      setNewTopper({
        name: '',
        exam: 'CBSE AISSCE Class XII',
        stream: 'Science (PCM + CS)',
        percentage: 98.0,
        year: 2025,
        photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&fit=crop',
        currentPursuit: ''
      });
    }
  };

  const handleSaveVMC = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingVMC) {
      updateVMCMember(editingVMC.id, editingVMC);
      setEditingVMC(null);
    } else {
      addVMCMember(newVMC);
      setIsAddVMCOpen(false);
      setNewVMC({
        name: '',
        designation: 'Member',
        organization: ''
      });
    }
  };

  return (
    <div className="space-y-6" id="admin-website-cms-container">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-900/40 via-teal-900/30 to-slate-900 border border-emerald-500/30 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-2">
              <Globe className="w-3.5 h-3.5" />
              Live Content Management System (CMS)
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Website & Content Master</h2>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Instantly update school institutional information, principal message, house points, CBSE board toppers, and Vidyalaya Management Committee leaders.
            </p>
          </div>
          {saveSuccessMsg && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold animate-pulse">
              <CheckCircle className="w-4 h-4" />
              {saveSuccessMsg}
            </div>
          )}
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mt-6 pt-5 border-t border-emerald-500/20">
          {[
            { id: 'general', label: 'School Identity & Ticker', icon: School },
            { id: 'principal', label: "Principal's Desk & Bio", icon: User },
            { id: 'houses', label: 'Houses & Points Master', icon: Layers },
            { id: 'toppers', label: 'CBSE Board Toppers', icon: Award },
            { id: 'vmc', label: 'VMC Governing Committee', icon: Shield }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`cms-tab-${tab.id}`}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 1. General Settings Form */}
      {activeSubTab === 'general' && (
        <form onSubmit={handleSaveGeneral} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-white">General Institutional Settings</h3>
              <p className="text-xs text-slate-400">Controls header branding, hero banner headline, and contact coordinates</p>
            </div>
            <button
              type="submit"
              id="save-general-settings-btn"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              Save & Publish Changes
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">School Official Name</label>
              <input
                type="text"
                value={generalForm.schoolName}
                onChange={e => setGeneralForm({ ...generalForm, schoolName: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">School Name in Hindi</label>
              <input
                type="text"
                value={generalForm.schoolHindiName || ''}
                onChange={e => setGeneralForm({ ...generalForm, schoolHindiName: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">CBSE Affiliation Number</label>
              <input
                type="text"
                value={generalForm.affiliationNumber}
                onChange={e => setGeneralForm({ ...generalForm, affiliationNumber: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">CBSE School Code</label>
              <input
                type="text"
                value={generalForm.schoolCode}
                onChange={e => setGeneralForm({ ...generalForm, schoolCode: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Established Year</label>
              <input
                type="number"
                value={generalForm.establishedYear}
                onChange={e => setGeneralForm({ ...generalForm, establishedYear: Number(e.target.value) })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Campus Area (Acres)</label>
              <input
                type="text"
                value={generalForm.campusArea || ''}
                onChange={e => setGeneralForm({ ...generalForm, campusArea: e.target.value })}
                placeholder="e.g. 30.5 Acres"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Marquee Ticker Notice */}
          <div className="pt-4 border-t border-slate-800">
            <label className="block text-xs font-semibold text-amber-400 mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Live Marquee Alert Ticker (Displayed across top of homepage)
            </label>
            <input
              type="text"
              value={generalForm.tickerNotice}
              onChange={e => setGeneralForm({ ...generalForm, tickerNotice: e.target.value })}
              placeholder="e.g. Admission for Class VI JNVST 2026-27 is open. Last date for online registration: September 15, 2026."
              className="w-full bg-slate-800 border border-amber-500/40 rounded-xl px-3.5 py-2.5 text-sm text-amber-200 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Hero Banner text */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4 border-t border-slate-800">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Hero Headline</label>
              <input
                type="text"
                value={generalForm.heroHeadline}
                onChange={e => setGeneralForm({ ...generalForm, heroHeadline: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Hero Sub-Headline</label>
              <input
                type="text"
                value={generalForm.heroSubheadline}
                onChange={e => setGeneralForm({ ...generalForm, heroSubheadline: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Vision & Mission Settings */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <h4 className="text-sm font-bold text-amber-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              Vision, Mission & Institutional Overview (Live on About School page)
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Institutional Vision Statement</label>
                <textarea
                  rows={4}
                  value={generalForm.visionText || ''}
                  onChange={e => setGeneralForm({ ...generalForm, visionText: e.target.value })}
                  placeholder="Enter the official vision statement..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Institutional Mission Statement</label>
                <textarea
                  rows={4}
                  value={generalForm.missionText || ''}
                  onChange={e => setGeneralForm({ ...generalForm, missionText: e.target.value })}
                  placeholder="Enter the official mission statement..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 leading-relaxed"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">About School Detailed Overview</label>
              <textarea
                rows={3}
                value={generalForm.aboutOverview || ''}
                onChange={e => setGeneralForm({ ...generalForm, aboutOverview: e.target.value })}
                placeholder="Overview text displayed prominently on About School..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Migration Partner JNV</label>
                <input
                  type="text"
                  value={generalForm.migrationPartnerJNV || ''}
                  onChange={e => setGeneralForm({ ...generalForm, migrationPartnerJNV: e.target.value })}
                  placeholder="e.g. JNV Rewa (Madhya Pradesh)"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Pace-Setting Activities Summary</label>
                <input
                  type="text"
                  value={generalForm.paceSettingActivities || ''}
                  onChange={e => setGeneralForm({ ...generalForm, paceSettingActivities: e.target.value })}
                  placeholder="e.g. Inter-school science congress, teacher training..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Contact Coordinates */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4 border-t border-slate-800">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Contact Email</label>
              <input
                type="email"
                value={generalForm.contactEmail}
                onChange={e => setGeneralForm({ ...generalForm, contactEmail: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Contact Phone</label>
              <input
                type="text"
                value={generalForm.contactPhone}
                onChange={e => setGeneralForm({ ...generalForm, contactPhone: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Postal Address</label>
              <input
                type="text"
                value={generalForm.address}
                onChange={e => setGeneralForm({ ...generalForm, address: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </form>
      )}

      {/* 2. Principal's Desk & Speech */}
      {activeSubTab === 'principal' && (
        <form onSubmit={handleSaveGeneral} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-white">Principal's Desk & Vision Statement</h3>
              <p className="text-xs text-slate-400">Configure Principal message displayed on the Principal's Desk page</p>
            </div>
            <button
              type="submit"
              id="save-principal-desk-btn"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              Save Principal Updates
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Principal Name</label>
              <input
                type="text"
                value={generalForm.principalName}
                onChange={e => setGeneralForm({ ...generalForm, principalName: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Principal Photo URL</label>
              <input
                type="text"
                value={generalForm.principalPhotoUrl || ''}
                onChange={e => setGeneralForm({ ...generalForm, principalPhotoUrl: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Principal Email</label>
              <input
                type="email"
                value={generalForm.principalEmail || ''}
                onChange={e => setGeneralForm({ ...generalForm, principalEmail: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Principal Contact Phone</label>
              <input
                type="text"
                value={generalForm.principalPhone || ''}
                onChange={e => setGeneralForm({ ...generalForm, principalPhone: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Principal's Address / Speech</label>
            <textarea
              rows={8}
              value={generalForm.principalMessage}
              onChange={e => setGeneralForm({ ...generalForm, principalMessage: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-emerald-500 leading-relaxed font-sans"
            />
          </div>
        </form>
      )}

      {/* 3. Houses & Points Master */}
      {activeSubTab === 'houses' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white">Houses Master & Points Leaderboard</h3>
            <p className="text-xs text-slate-400">Manage house details, motto, and live points tally</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {houses.map(house => (
              <div
                key={house.id}
                id={`house-card-${house.id}`}
                className="bg-slate-800/80 border border-slate-700 rounded-xl p-5 shadow-lg space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-5 h-5 rounded-full shadow-md"
                      style={{ backgroundColor: house.color }}
                    />
                    <h4 className="text-base font-bold text-white">{house.name} House</h4>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-900 text-amber-400 border border-slate-700">
                    {house.points} Total Points
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Current Points</label>
                    <input
                      type="number"
                      value={house.points}
                      onChange={e => updateHouse(house.id, { points: Number(e.target.value) })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-amber-300 font-bold focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">House Captain</label>
                    <input
                      type="text"
                      value={house.captainName || ''}
                      onChange={e => updateHouse(house.id, { captainName: e.target.value })}
                      placeholder="e.g. Rahul Singh"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">House Motto</label>
                  <input
                    type="text"
                    value={house.motto}
                    onChange={e => updateHouse(house.id, { motto: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={house.description}
                    onChange={e => updateHouse(house.id, { description: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. CBSE Board Toppers */}
      {activeSubTab === 'toppers' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-white">CBSE Board Toppers & Merit Roll</h3>
              <p className="text-xs text-slate-400">Manage Class X & XII academic toppers featured on the website</p>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                id="download-toppers-sample-csv-btn"
                onClick={() => handleDownloadSample('toppers')}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600/90 hover:bg-emerald-500 text-white text-xs font-bold transition shadow"
                title="Download sample board toppers CSV template"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Sample Data</span>
              </button>
              <button
                id="upload-toppers-csv-btn"
                onClick={() => setCsvModalModule('toppers')}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition shadow"
                title="Bulk upload or update board toppers via CSV"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload through CSV</span>
              </button>
              <button
                onClick={() => {
                  setEditingTopper(null);
                  setIsAddTopperOpen(true);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
              >
                <Plus className="w-4 h-4" />
                Add Board Topper
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {toppers.map(top => (
              <div
                key={top.id}
                id={`topper-card-${top.id}`}
                className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <img
                      src={top.photoUrl || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&fit=crop'}
                      alt={top.name}
                      className="w-12 h-12 rounded-xl object-cover border border-amber-500/40"
                    />
                    <div>
                      <div className="font-bold text-white text-sm">{top.name}</div>
                      <div className="text-amber-400 font-black text-base">{top.percentage}%</div>
                    </div>
                  </div>
                  <div className="mt-3 text-xs space-y-1 text-slate-300">
                    <div><strong>Exam:</strong> {top.exam} ({top.year})</div>
                    <div><strong>Stream:</strong> {top.stream}</div>
                    {top.currentPursuit && (
                      <div className="text-emerald-300 bg-slate-900/60 p-2 rounded-lg mt-2 text-[11px]">
                        {top.currentPursuit}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-700 flex items-center justify-end gap-2">
                  <button
                    onClick={() => {
                      setEditingTopper(top);
                      setIsAddTopperOpen(true);
                    }}
                    className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200"
                    title="Edit"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteTopper(top.id)}
                    className="p-1.5 rounded-lg bg-rose-900/40 hover:bg-rose-800 text-rose-300"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. VMC Committee Leaders */}
      {activeSubTab === 'vmc' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-white">Vidyalaya Management Committee (VMC)</h3>
              <p className="text-xs text-slate-400">Institutional governing board comprising district administration</p>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                id="download-vmc-sample-csv-btn"
                onClick={() => handleDownloadSample('vmc_members')}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600/90 hover:bg-emerald-500 text-white text-xs font-bold transition shadow"
                title="Download sample VMC members CSV template"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Sample Data</span>
              </button>
              <button
                id="upload-vmc-csv-btn"
                onClick={() => setCsvModalModule('vmc_members')}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition shadow"
                title="Bulk upload or update VMC members via CSV"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload through CSV</span>
              </button>
              <button
                onClick={() => {
                  setEditingVMC(null);
                  setIsAddVMCOpen(true);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
              >
                <Plus className="w-4 h-4" />
                Add VMC Member
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vmcMembers.map(member => (
              <div
                key={member.id}
                id={`vmc-card-${member.id}`}
                className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    {member.designation}
                  </span>
                  <h4 className="font-bold text-white text-sm mt-2">{member.name}</h4>
                  <p className="text-xs text-slate-400 mt-1">{member.organization}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-700 flex items-center justify-end gap-2">
                  <button
                    onClick={() => {
                      setEditingVMC(member);
                      setIsAddVMCOpen(true);
                    }}
                    className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200"
                    title="Edit"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteVMCMember(member.id)}
                    className="p-1.5 rounded-lg bg-rose-900/40 hover:bg-rose-800 text-rose-300"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add / Edit Topper Modal */}
      {isAddTopperOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">
              {editingTopper ? 'Edit Board Topper' : 'Add New Board Topper'}
            </h3>
            <form onSubmit={handleSaveTopper} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Student Name *</label>
                <input
                  type="text"
                  required
                  value={editingTopper ? editingTopper.name : newTopper.name}
                  onChange={e =>
                    editingTopper
                      ? setEditingTopper({ ...editingTopper, name: e.target.value })
                      : setNewTopper({ ...newTopper, name: e.target.value })
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Percentage Score (%) *</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={editingTopper ? editingTopper.percentage : newTopper.percentage}
                    onChange={e =>
                      editingTopper
                        ? setEditingTopper({ ...editingTopper, percentage: Number(e.target.value) })
                        : setNewTopper({ ...newTopper, percentage: Number(e.target.value) })
                    }
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Exam Year *</label>
                  <input
                    type="number"
                    required
                    value={editingTopper ? editingTopper.year : newTopper.year}
                    onChange={e =>
                      editingTopper
                        ? setEditingTopper({ ...editingTopper, year: Number(e.target.value) })
                        : setNewTopper({ ...newTopper, year: Number(e.target.value) })
                    }
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Exam & Stream</label>
                <input
                  type="text"
                  value={editingTopper ? editingTopper.stream : newTopper.stream}
                  onChange={e =>
                    editingTopper
                      ? setEditingTopper({ ...editingTopper, stream: e.target.value })
                      : setNewTopper({ ...newTopper, stream: e.target.value })
                  }
                  placeholder="e.g. Science (PCM + CS)"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Current College / Pursuit</label>
                <input
                  type="text"
                  value={editingTopper ? (editingTopper.currentPursuit || '') : (newTopper.currentPursuit || '')}
                  onChange={e =>
                    editingTopper
                      ? setEditingTopper({ ...editingTopper, currentPursuit: e.target.value })
                      : setNewTopper({ ...newTopper, currentPursuit: e.target.value })
                  }
                  placeholder="e.g. B.Tech Computer Science at IIT Bombay"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddTopperOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
                >
                  Save Topper
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add / Edit VMC Modal */}
      {isAddVMCOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">
              {editingVMC ? 'Edit VMC Leader' : 'Add VMC Leader'}
            </h3>
            <form onSubmit={handleSaveVMC} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Officer / Member Name *</label>
                <input
                  type="text"
                  required
                  value={editingVMC ? editingVMC.name : newVMC.name}
                  onChange={e =>
                    editingVMC
                      ? setEditingVMC({ ...editingVMC, name: e.target.value })
                      : setNewVMC({ ...newVMC, name: e.target.value })
                  }
                  placeholder="e.g. District Collector & Magistrate, Barmer"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">VMC Designation *</label>
                <input
                  type="text"
                  required
                  value={editingVMC ? editingVMC.designation : newVMC.designation}
                  onChange={e =>
                    editingVMC
                      ? setEditingVMC({ ...editingVMC, designation: e.target.value })
                      : setNewVMC({ ...newVMC, designation: e.target.value })
                  }
                  placeholder="e.g. Chairman, VMC / Member Secretary"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Department / Organization</label>
                <input
                  type="text"
                  value={editingVMC ? editingVMC.organization : newVMC.organization}
                  onChange={e =>
                    editingVMC
                      ? setEditingVMC({ ...editingVMC, organization: e.target.value })
                      : setNewVMC({ ...newVMC, organization: e.target.value })
                  }
                  placeholder="e.g. Indian Administrative Service (IAS)"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddVMCOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
                >
                  Save VMC Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* CSV Bulk Import Modal */}
      <CSVBulkImportModal
        isOpen={!!csvModalModule}
        onClose={() => setCsvModalModule(null)}
        initialModule={csvModalModule || 'toppers'}
      />
    </div>
  );
};
