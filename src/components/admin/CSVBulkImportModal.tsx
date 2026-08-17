import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { CSVImportResult } from '../../context/DataContext';
import {
  X,
  Download,
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  FileText,
  RefreshCw,
  Info,
  Database,
  ArrowRight,
  Sparkles,
  Layers,
  HelpCircle
} from 'lucide-react';

interface CSVBulkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialModule?: string;
}

export const CSVBulkImportModal: React.FC<CSVBulkImportModalProps> = ({
  isOpen,
  onClose,
  initialModule = 'alumni'
}) => {
  const { exportToCSV, importFromCSV, getCSVTemplate } = useData();

  const [selectedModule, setSelectedModule] = useState<string>(initialModule);
  const [csvInput, setCsvInput] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [updateExisting, setUpdateExisting] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'upload' | 'sample'>('upload');
  const [importResult, setImportResult] = useState<CSVImportResult | null>(null);
  const [previewRows, setPreviewRows] = useState<{ headers: string[]; rows: string[][] }>({
    headers: [],
    rows: []
  });
  const [showSchemaGuide, setShowSchemaGuide] = useState<boolean>(false);

  useEffect(() => {
    if (initialModule) {
      setSelectedModule(initialModule);
    }
    setImportResult(null);
    setCsvInput('');
    setFileName('');
    setPreviewRows({ headers: [], rows: [] });
  }, [initialModule, isOpen]);

  const modules = [
    { id: 'alumni', name: 'Alumni Directory', icon: '🎓', countField: 'alumni', desc: 'Full profile, batch, house, profession, company, blood group, contact' },
    { id: 'faculty', name: 'Faculty & Staff', icon: '👨‍🏫', countField: 'faculty', desc: 'Designation, department, qualification, experience, email, phone' },
    { id: 'notices', name: 'Notices & Circulars', icon: '📢', countField: 'notices', desc: 'Circular title, category, audience, reference no, content, pinned' },
    { id: 'ledger', name: 'Financial Ledger', icon: '💰', countField: 'ledger', desc: 'Transaction ID, type (CREDIT/DEBIT), category, amount, auditor, date' },
    { id: 'toppers', name: 'Board Merit & Toppers', icon: '🏆', countField: 'toppers', desc: 'Student name, exam, stream, percentage, year, current pursuit' },
    { id: 'blood_donors', name: 'Blood Donors Registry', icon: '🩸', countField: 'blood_donors', desc: 'Donor name, blood group, city, phone, email, hospital, last donated' },
    { id: 'events', name: 'Events & Reunions', icon: '📅', countField: 'events', desc: 'Event title, category, date, time, venue, capacity, description' },
    { id: 'financial_reports', name: 'Statutory Audit Reports', icon: '📑', countField: 'financial_reports', desc: 'Report title, FY year, category, audited amount, auditor name' },
    { id: 'donation_campaigns', name: 'Donation Causes', icon: '🤝', countField: 'donation_campaigns', desc: 'Campaign title, target amount, current amount, end date' },
    { id: 'jobs', name: 'Jobs & Careers Board', icon: '💼', countField: 'jobs', desc: 'Job title, company, location, experience, salary, apply link' },
    { id: 'businesses', name: 'Alumni Business Directory', icon: '🏢', countField: 'businesses', desc: 'Company name, owner name, category, website, discount for alumni' },
    { id: 'vmc_members', name: 'VMC Governing Council', icon: '🏛️', countField: 'vmc_members', desc: 'Member name, designation, organization, phone, email' }
  ];

  if (!isOpen) return null;

  const handleDownloadSampleData = () => {
    const template = getCSVTemplate(selectedModule);
    const blob = new Blob([template], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sample_${selectedModule}_data.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportCurrentData = () => {
    exportToCSV(selectedModule);
  };

  const parsePreview = (text: string) => {
    const lines = text.trim().split(/\r?\n/).filter(l => l.trim().length > 0);
    if (lines.length === 0) {
      setPreviewRows({ headers: [], rows: [] });
      return;
    }

    const parseLine = (line: string): string[] => {
      const result: string[] = [];
      let cur = '';
      let inQuotes = false;
      for (let i = 0; i < line.length; i++) {
        const c = line[i];
        if (c === '"') {
          if (inQuotes && line[i + 1] === '"') {
            cur += '"';
            i++;
          } else {
            inQuotes = !inQuotes;
          }
        } else if (c === ',' && !inQuotes) {
          result.push(cur.trim());
          cur = '';
        } else {
          cur += c;
        }
      }
      result.push(cur.trim());
      return result;
    };

    const headers = parseLine(lines[0]).map(h => h.replace(/^["']|["']$/g, '').trim());
    const dataLines = lines.slice(1, 6).map(l => parseLine(l).map(v => v.replace(/^["']|["']$/g, '').trim()));
    setPreviewRows({ headers, rows: dataLines });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = (event.target?.result as string) || '';
      setCsvInput(text);
      parsePreview(text);
      setImportResult(null);
    };
    reader.readAsText(file);
  };

  const handleTextChange = (text: string) => {
    setCsvInput(text);
    parsePreview(text);
    setImportResult(null);
  };

  const handleExecuteImport = () => {
    if (!csvInput.trim()) {
      alert('Please upload a CSV file or paste CSV content first.');
      return;
    }

    const result = importFromCSV(selectedModule, csvInput, updateExisting);
    setImportResult(result);
  };

  const currentModObj = modules.find(m => m.id === selectedModule) || modules[0];

  return (
    <div
      id="csv-bulk-import-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="csv-bulk-import-modal-container"
        className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-5xl my-auto shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Modal Top Header */}
        <div className="bg-slate-950/80 px-5 sm:px-8 py-4 sm:py-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold text-xl shadow-inner">
              <FileSpreadsheet className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg sm:text-xl font-bold text-slate-100">
                  CSV Data Management & Update Portal
                </h2>
                <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  Admin Tool
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Two easy options: Upload & Update details via CSV or Download pre-filled sample data template
              </p>
            </div>
          </div>

          <button
            id="csv-modal-close-button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition cursor-pointer"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body with 2-Column or Tabbed Layout */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6 flex-1">
          {/* Target Module Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                <span>Select Target Category / Module to Update</span>
              </label>
              <span className="text-[11px] text-amber-400/90 font-medium">
                Active: {currentModObj.name}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
              {modules.map((m) => (
                <button
                  key={m.id}
                  id={`module-btn-${m.id}`}
                  onClick={() => {
                    setSelectedModule(m.id);
                    setImportResult(null);
                    setCsvInput('');
                    setFileName('');
                    setPreviewRows({ headers: [], rows: [] });
                  }}
                  className={`p-3 rounded-xl text-left border transition cursor-pointer flex items-start space-x-2.5 ${
                    selectedModule === m.id
                      ? 'bg-amber-500/15 border-amber-500 text-amber-200 ring-1 ring-amber-500/30'
                      : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:border-slate-700 hover:bg-slate-800/50'
                  }`}
                >
                  <span className="text-lg shrink-0 mt-0.5">{m.icon}</span>
                  <div className="min-w-0">
                    <div className="font-semibold text-xs text-slate-100 truncate">{m.name}</div>
                    <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{m.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Dual Action Option Banner */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Option 1: Upload through CSV */}
            <div
              className={`p-4 sm:p-5 rounded-2xl border transition ${
                activeTab === 'upload'
                  ? 'bg-gradient-to-b from-blue-950/40 to-slate-900 border-blue-500/50 ring-1 ring-blue-500/30'
                  : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-sm">
                    1
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-1.5">
                      <Upload className="w-4 h-4 text-blue-400" />
                      <span>Option 1: Upload through CSV</span>
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Bulk insert new records or update existing details seamlessly.
                    </p>
                  </div>
                </div>
                <button
                  id="tab-select-upload"
                  onClick={() => setActiveTab('upload')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition ${
                    activeTab === 'upload'
                      ? 'bg-blue-500 text-white shadow'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Upload Mode
                </button>
              </div>
            </div>

            {/* Option 2: Download Sample Data */}
            <div
              className={`p-4 sm:p-5 rounded-2xl border transition ${
                activeTab === 'sample'
                  ? 'bg-gradient-to-b from-emerald-950/40 to-slate-900 border-emerald-500/50 ring-1 ring-emerald-500/30'
                  : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
                    2
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-1.5">
                      <Download className="w-4 h-4 text-emerald-400" />
                      <span>Option 2: Download Sample Data</span>
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Download ready-to-use template with verified example rows.
                    </p>
                  </div>
                </div>
                <button
                  id="tab-select-sample"
                  onClick={() => setActiveTab('sample')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition ${
                    activeTab === 'sample'
                      ? 'bg-emerald-600 text-white shadow'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Sample & Export
                </button>
              </div>
            </div>
          </div>

          {/* Option 2 Section: Download Sample Data & Current Export */}
          {activeTab === 'sample' && (
            <div className="bg-slate-950/70 border border-emerald-900/40 rounded-2xl p-5 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-emerald-400" />
                    <span>Download Ready-Made Sample Data for {currentModObj.name}</span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Pre-populated with 2-3 realistic sample rows and all accurate column headers. Open in Excel, Google Sheets, or Numbers, replace or add details, and upload back.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                  <button
                    id="download-sample-csv-btn"
                    onClick={handleDownloadSampleData}
                    className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-xl transition flex items-center space-x-2 shadow cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Sample Data (.csv)</span>
                  </button>

                  <button
                    id="export-live-csv-btn"
                    onClick={handleExportCurrentData}
                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition flex items-center space-x-2 cursor-pointer"
                  >
                    <Database className="w-4 h-4 text-blue-400" />
                    <span>Export Current Live Records</span>
                  </button>
                </div>
              </div>

              {/* Sample Data Preview Card */}
              <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-4 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                  <span>Sample Data File Preview ({selectedModule}_template.csv):</span>
                  <span className="text-[11px] text-slate-500 font-mono">UTF-8 Comma-Separated</span>
                </div>
                <pre className="bg-slate-950 p-3.5 rounded-lg text-emerald-300 text-[11px] font-mono overflow-x-auto leading-relaxed border border-slate-800/80">
                  {getCSVTemplate(selectedModule)}
                </pre>
              </div>

              <div className="flex items-center justify-between pt-1">
                <p className="text-xs text-slate-400">
                  Ready to update? Switch to <strong>Option 1: Upload through CSV</strong> once you have edited your spreadsheet.
                </p>
                <button
                  onClick={() => setActiveTab('upload')}
                  className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center space-x-1 cursor-pointer"
                >
                  <span>Go to Upload & Update</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Option 1 Section: Upload & Update Data */}
          {activeTab === 'upload' && (
            <div className="space-y-5">
              {/* Controls bar: Update Existing mode toggle + Quick Download Sample link */}
              <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <label className="relative flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      id="update-existing-checkbox"
                      checked={updateExisting}
                      onChange={(e) => setUpdateExisting(e.target.checked)}
                      className="w-4 h-4 text-amber-500 rounded border-slate-700 bg-slate-900 focus:ring-amber-500"
                    />
                    <span className="ml-2.5 text-xs font-semibold text-slate-200">
                      Update existing details if matched (Upsert Mode)
                    </span>
                  </label>
                  <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    Recommended
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleDownloadSampleData}
                    className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-800/60 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Sample Data First</span>
                  </button>
                </div>
              </div>

              {/* Upload Dropzone & Paste Area */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* File Dropzone */}
                <div className="bg-slate-950/80 border-2 border-dashed border-slate-700 hover:border-amber-500/60 rounded-2xl p-6 flex flex-col items-center justify-center text-center transition group cursor-pointer relative">
                  <input
                    type="file"
                    id="csv-file-input"
                    accept=".csv,text/csv"
                    onChange={handleFileUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-3 group-hover:scale-110 transition">
                    <FileSpreadsheet className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-100">
                    {fileName ? fileName : `Select ${currentModObj.name} CSV File`}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs">
                    Drag and drop your spreadsheet export here, or click to browse (.csv format)
                  </p>
                  {fileName && (
                    <span className="mt-3 px-3 py-1 bg-emerald-950 border border-emerald-700 text-emerald-300 text-xs rounded-full flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Loaded: {fileName}</span>
                    </span>
                  )}
                </div>

                {/* Direct CSV Textarea */}
                <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-slate-300">
                      Or Paste Raw CSV Data with Headers:
                    </label>
                    {csvInput && (
                      <button
                        onClick={() => handleTextChange('')}
                        className="text-[11px] text-slate-400 hover:text-slate-200"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <textarea
                    id="csv-raw-textarea"
                    rows={6}
                    value={csvInput}
                    onChange={(e) => handleTextChange(e.target.value)}
                    placeholder={`fullName,batchYear,email...\n"Ravi Sharma",2012,"ravi.sharma@example.com"...`}
                    className="w-full flex-1 bg-slate-900 text-slate-200 text-xs font-mono p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500 resize-none leading-relaxed"
                  />
                </div>
              </div>

              {/* Live Preview Table (Before Processing) */}
              {previewRows.headers.length > 0 && (
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                      <h4 className="text-xs font-bold text-slate-200">
                        Parsed CSV Preview (First {previewRows.rows.length} rows detected)
                      </h4>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      Columns: <strong>{previewRows.headers.length}</strong>
                    </span>
                  </div>

                  <div className="overflow-x-auto border border-slate-800 rounded-xl">
                    <table className="w-full text-left text-xs text-slate-300">
                      <thead className="bg-slate-900/90 text-slate-400 text-[11px] uppercase tracking-wider font-semibold border-b border-slate-800">
                        <tr>
                          <th className="px-3 py-2">#</th>
                          {previewRows.headers.map((h, i) => (
                            <th key={i} className="px-3 py-2 whitespace-nowrap">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                        {previewRows.rows.map((row, rIdx) => (
                          <tr key={rIdx} className="hover:bg-slate-900/40">
                            <td className="px-3 py-2 text-slate-500">{rIdx + 1}</td>
                            {row.map((val, cIdx) => (
                              <td key={cIdx} className="px-3 py-2 text-slate-300 whitespace-nowrap max-w-xs truncate">
                                {val || <span className="text-slate-600 italic">empty</span>}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <div className="text-xs text-slate-400">
                  {updateExisting ? (
                    <span>
                      Mode: <strong className="text-emerald-400">Upsert</strong> (Existing records with matching ID/email will have their details updated).
                    </span>
                  ) : (
                    <span>
                      Mode: <strong className="text-amber-400">Insert Only</strong> (Duplicates will be skipped).
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 transition"
                  >
                    Cancel
                  </button>
                  <button
                    id="execute-csv-update-btn"
                    onClick={handleExecuteImport}
                    disabled={!csvInput.trim()}
                    className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 text-xs font-bold rounded-xl shadow-lg transition flex items-center space-x-2 cursor-pointer"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Process & Update {currentModObj.name}</span>
                  </button>
                </div>
              </div>

              {/* Audit & Validation Report Result */}
              {importResult && (
                <div
                  id="csv-import-result-card"
                  className={`p-5 rounded-2xl border space-y-3 ${
                    importResult.success
                      ? 'bg-emerald-950/30 border-emerald-800 text-emerald-300'
                      : 'bg-red-950/30 border-red-800 text-red-300'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    {importResult.success ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <h4 className="font-bold text-sm text-slate-100">
                        {importResult.message}
                      </h4>
                      <div className="flex flex-wrap items-center gap-3 sm:gap-6 mt-2 text-xs text-slate-300">
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                          New Added: {importResult.importedCount}
                        </span>
                        <span className="px-2.5 py-1 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/30 font-semibold">
                          Details Updated: {importResult.updatedCount}
                        </span>
                        <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold">
                          Duplicates Skipped: {importResult.duplicateCount}
                        </span>
                        <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-400 font-semibold">
                          Errors: {importResult.errors.length}
                        </span>
                      </div>
                    </div>
                  </div>

                  {importResult.errors.length > 0 && (
                    <div className="bg-slate-950 p-4 rounded-xl border border-red-900/50 space-y-1.5 max-h-40 overflow-y-auto">
                      <h5 className="text-xs font-bold text-red-400">Error Details:</h5>
                      {importResult.errors.map((err, i) => (
                        <p key={i} className="text-[11px] text-red-300 font-mono">
                          • {err}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Bottom Footer */}
        <div className="bg-slate-950/80 px-6 py-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <Info className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              All imported and updated details sync live with database records.
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleDownloadSampleData}
              className="text-xs text-slate-300 hover:text-white underline cursor-pointer"
            >
              Download Sample CSV
            </button>
            <span>•</span>
            <button
              onClick={handleExportCurrentData}
              className="text-xs text-slate-300 hover:text-white underline cursor-pointer"
            >
              Export Live Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
