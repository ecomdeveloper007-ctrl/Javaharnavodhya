import React, { useState } from 'react';
import { useData, CSVImportResult } from '../../context/DataContext';
import {
  Download,
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  FileText,
  RefreshCw,
  Info,
  Database,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Table
} from 'lucide-react';
import { CSVBulkImportModal } from './CSVBulkImportModal';

export const AdminCSVTools: React.FC = () => {
  const { exportToCSV, importFromCSV, getCSVTemplate } = useData();

  const [selectedModule, setSelectedModule] = useState<string>('alumni');
  const [csvInput, setCsvInput] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [updateExisting, setUpdateExisting] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [importResult, setImportResult] = useState<CSVImportResult | null>(null);
  const [previewRows, setPreviewRows] = useState<{ headers: string[]; rows: string[][] }>({
    headers: [],
    rows: []
  });

  const modules = [
    { id: 'alumni', name: 'Alumni Members', icon: '🎓', description: 'Name, Batch, Email, House, Profession, Location, Blood Group, Mentorship' },
    { id: 'faculty', name: 'Faculty & Staff Directory', icon: '👨‍🏫', description: 'Name, Department, Designation, Qualification, Experience, Contact' },
    { id: 'notices', name: 'School Notices & Circulars', icon: '📢', description: 'Title, Category, Audience, Content, Reference No, Pinned' },
    { id: 'ledger', name: 'Financial Ledger Transactions', icon: '💰', description: 'Txn ID, Type (CREDIT/DEBIT), Category, Amount, Auditor, Payee/Donor' },
    { id: 'toppers', name: 'Board Merit & Toppers', icon: '🏆', description: 'Student Name, Exam, Stream, Percentage, Year, Current Pursuit' },
    { id: 'blood_donors', name: 'Blood Donors Registry', icon: '🩸', description: 'Donor Name, Blood Group, City, Phone, Email, Hospital, Availability' },
    { id: 'events', name: 'School & Alumni Events', icon: '📅', description: 'Title, Category, Date, Time, Location, Capacity, Description' },
    { id: 'financial_reports', name: 'Statutory Audit Reports', icon: '📑', description: 'Title, Financial Year, Summary, Auditor Name, Amount Audited' },
    { id: 'donation_campaigns', name: 'Donation Causes & Campaigns', icon: '🤝', description: 'Campaign Title, Category, Target Amount, Current Amount, End Date' },
    { id: 'jobs', name: 'Jobs & Careers Board', icon: '💼', description: 'Job Title, Company, Location, Experience, Salary, Apply Contact' },
    { id: 'businesses', name: 'Alumni Business Directory', icon: '🏢', description: 'Business Name, Category, Owner Name, Contact, Alumni Discount' },
    { id: 'vmc_members', name: 'VMC Governing Council', icon: '🏛️', description: 'Member Name, Designation, Organization, Phone, Email' }
  ];

  const handleDownloadSampleData = (moduleId = selectedModule) => {
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

  const handleExportData = (moduleId = selectedModule) => {
    exportToCSV(moduleId);
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

  const handleExecuteImport = () => {
    if (!csvInput.trim()) {
      alert('Please upload a CSV file or paste CSV content below.');
      return;
    }

    const result = importFromCSV(selectedModule, csvInput, updateExisting);
    setImportResult(result);
  };

  const currentModObj = modules.find(m => m.id === selectedModule) || modules[0];

  return (
    <div className="space-y-6">
      {/* Header Banner with Direct Quick Actions */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center space-x-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0 shadow-inner">
              <FileSpreadsheet className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div>
              <div className="flex items-center space-x-2.5">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-100">
                  CSV Data Management Hub
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Live Sync
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Upload and update records via CSV with automatic Upsert mode, or download pre-populated sample templates for 12 school & alumni modules.
              </p>
            </div>
          </div>

          {/* Core 2 Options Highlight */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Option 2 Button */}
            <button
              id="download-sample-header-btn"
              onClick={() => handleDownloadSampleData(selectedModule)}
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-xl transition flex items-center space-x-2 shadow cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Sample Data (.csv)</span>
            </button>

            {/* Option 1 Quick Launch Modal */}
            <button
              id="open-csv-modal-btn"
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-bold rounded-xl shadow transition flex items-center space-x-2 cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Upload / Update via CSV</span>
            </button>

            {/* Live Data Export */}
            <button
              onClick={() => handleExportData(selectedModule)}
              className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition flex items-center space-x-1.5 cursor-pointer"
              title="Export currently stored records"
            >
              <Database className="w-4 h-4 text-blue-400" />
              <span className="hidden sm:inline">Export Current</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2 Primary Options Cards Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Option 1 Card */}
        <div className="bg-gradient-to-br from-blue-950/30 to-slate-900 border border-blue-900/40 rounded-2xl p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-blue-400">
              <Upload className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Option 1</span>
            </div>
            <h3 className="text-base font-bold text-slate-100">Upload & Update through CSV</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Import new alumni, faculty, notices, or financial transactions. Turn on <strong>Upsert Mode</strong> to update existing records with matching details without creating duplicates.
            </p>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
            <span className="text-[11px] text-slate-400">Supports drag & drop, file picker & raw paste</span>
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center space-x-1 cursor-pointer"
            >
              <span>Open Upload Tool</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Option 2 Card */}
        <div className="bg-gradient-to-br from-emerald-950/30 to-slate-900 border border-emerald-900/40 rounded-2xl p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-emerald-400">
              <Download className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Option 2</span>
            </div>
            <h3 className="text-base font-bold text-slate-100">Download Sample Data</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Get an accurate CSV spreadsheet with column headers and 2-3 verified realistic rows for <strong>{currentModObj.name}</strong>. Edit it in Excel or Google Sheets, then upload right back.
            </p>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
            <span className="text-[11px] text-slate-400">Includes exact headers & valid types</span>
            <button
              onClick={() => handleDownloadSampleData(selectedModule)}
              className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center space-x-1 cursor-pointer"
            >
              <span>Download {selectedModule}.csv</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Module Selector Grid */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span>Select Module to Manage ({modules.length} Modules Available)</span>
          </label>
          <span className="text-xs text-amber-400 font-semibold">
            Current Target: {currentModObj.name}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2.5">
          {modules.map((m) => (
            <button
              key={m.id}
              onClick={() => {
                setSelectedModule(m.id);
                setImportResult(null);
                setCsvInput('');
                setFileName('');
                setPreviewRows({ headers: [], rows: [] });
              }}
              className={`p-3 rounded-2xl text-left border transition cursor-pointer flex flex-col justify-between ${
                selectedModule === m.id
                  ? 'bg-amber-500/15 border-amber-500 text-amber-200 ring-1 ring-amber-500/30 shadow-md'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/60'
              }`}
            >
              <div>
                <div className="text-base mb-1">{m.icon}</div>
                <div className="font-bold text-xs text-slate-100 truncate">{m.name}</div>
                <p className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-tight">{m.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main In-Page CSV Upload & Processing Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Upload & Input Area (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center space-x-2">
                <Upload className="w-4 h-4 text-amber-400" />
                <span>Upload & Update {currentModObj.name}</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Upload your edited CSV file or paste raw text below.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleDownloadSampleData(selectedModule)}
                className="px-3 py-1.5 bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-800/80 rounded-xl text-xs font-semibold flex items-center space-x-1.5 cursor-pointer transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Sample Data</span>
              </button>
            </div>
          </div>

          {/* Upsert Mode Toggle */}
          <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 flex items-center justify-between">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={updateExisting}
                onChange={(e) => setUpdateExisting(e.target.checked)}
                className="w-4 h-4 text-amber-500 rounded border-slate-700 bg-slate-900 focus:ring-amber-500"
              />
              <div>
                <span className="text-xs font-bold text-slate-200">
                  Update Existing Records (Upsert Details)
                </span>
                <p className="text-[11px] text-slate-400">
                  Matches records by email / ID / name and overwrites fields with new CSV values.
                </p>
              </div>
            </label>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
              {updateExisting ? 'Upsert Enabled' : 'Insert Only'}
            </span>
          </div>

          {/* File Upload Box */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300">
                Choose CSV File from Computer:
              </label>
              {fileName && (
                <span className="text-xs text-emerald-400 font-mono">
                  {fileName}
                </span>
              )}
            </div>

            <label className="border-2 border-dashed border-slate-700 hover:border-amber-500/60 rounded-2xl p-5 flex items-center justify-center space-x-3 bg-slate-950/60 cursor-pointer transition group">
              <FileSpreadsheet className="w-6 h-6 text-amber-400 group-hover:scale-110 transition" />
              <div className="text-left">
                <span className="text-xs font-bold text-slate-200 group-hover:text-amber-300">
                  {fileName ? `Change File (${fileName})` : 'Click to Browse .csv File'}
                </span>
                <span className="block text-[10px] text-slate-400">
                  Accepts UTF-8 comma-separated files
                </span>
              </div>
              <input type="file" accept=".csv,text/csv" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>

          {/* Or Paste Raw Text */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300">
                Or Direct Text Input (Paste CSV):
              </label>
              {csvInput && (
                <button
                  onClick={() => {
                    setCsvInput('');
                    setFileName('');
                    setPreviewRows({ headers: [], rows: [] });
                    setImportResult(null);
                  }}
                  className="text-[11px] text-slate-400 hover:text-slate-200"
                >
                  Clear
                </button>
              )}
            </div>
            <textarea
              rows={7}
              value={csvInput}
              onChange={(e) => {
                setCsvInput(e.target.value);
                parsePreview(e.target.value);
                setImportResult(null);
              }}
              placeholder={`fullName,batchYear,email...\n"Ravi Sharma",2012,"ravi.sharma@example.com"...`}
              className="w-full bg-slate-950 text-slate-200 text-xs font-mono p-3.5 rounded-2xl border border-slate-800 focus:outline-none focus:border-amber-500 leading-relaxed resize-y"
            />
          </div>

          {/* Live Preview Table */}
          {previewRows.headers.length > 0 && (
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-200 flex items-center space-x-1.5">
                  <Table className="w-3.5 h-3.5 text-blue-400" />
                  <span>Preview ({previewRows.rows.length} rows detected)</span>
                </span>
                <span className="text-[11px] text-slate-400">
                  {previewRows.headers.length} headers parsed
                </span>
              </div>
              <div className="overflow-x-auto border border-slate-800/80 rounded-xl max-h-36 overflow-y-auto">
                <table className="w-full text-left text-[11px] text-slate-300 font-mono">
                  <thead className="bg-slate-900 text-slate-400 sticky top-0 border-b border-slate-800">
                    <tr>
                      <th className="px-2.5 py-1.5">#</th>
                      {previewRows.headers.map((h, i) => (
                        <th key={i} className="px-2.5 py-1.5 whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40">
                    {previewRows.rows.map((row, rIdx) => (
                      <tr key={rIdx}>
                        <td className="px-2.5 py-1 text-slate-500">{rIdx + 1}</td>
                        {row.map((val, cIdx) => (
                          <td key={cIdx} className="px-2.5 py-1 whitespace-nowrap max-w-xs truncate">
                            {val}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Process Button */}
          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              onClick={handleExecuteImport}
              disabled={!csvInput.trim()}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 text-xs font-bold rounded-2xl shadow-lg transition flex items-center space-x-2 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Validate & Process CSV Updates</span>
            </button>
          </div>
        </div>

        {/* Right Side: Sample Data & Audit Validation Report (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Sample Data Reference Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>Sample Data for {currentModObj.name}</span>
              </h4>
              <button
                onClick={() => handleDownloadSampleData(selectedModule)}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer"
              >
                Download .csv
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Below is the verified structure with realistic test data. Click the button to download this file:
            </p>

            <pre className="bg-slate-950 p-3.5 rounded-2xl text-emerald-300 text-[11px] font-mono overflow-x-auto leading-relaxed border border-slate-800/80 max-h-40 overflow-y-auto">
              {getCSVTemplate(selectedModule)}
            </pre>

            <button
              onClick={() => handleDownloadSampleData(selectedModule)}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition flex items-center justify-center space-x-2 shadow cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download {selectedModule}_sample.csv</span>
            </button>
          </div>

          {/* Audit Validation Feedback */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4">
            <h4 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Audit & Execution Log</span>
            </h4>

            {importResult ? (
              <div className="space-y-3">
                <div
                  className={`p-4 rounded-2xl border ${
                    importResult.success
                      ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                      : 'bg-red-950/40 border-red-800 text-red-300'
                  }`}
                >
                  <div className="flex items-start space-x-2.5">
                    {importResult.success ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <h5 className="font-bold text-xs text-slate-100">{importResult.message}</h5>
                      <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                        <div className="bg-slate-950/80 p-2 rounded-lg border border-slate-800">
                          <span className="text-slate-400 text-[10px] block">New Records</span>
                          <strong className="text-emerald-400 text-sm">{importResult.importedCount}</strong>
                        </div>
                        <div className="bg-slate-950/80 p-2 rounded-lg border border-slate-800">
                          <span className="text-slate-400 text-[10px] block">Updated Details</span>
                          <strong className="text-blue-400 text-sm">{importResult.updatedCount}</strong>
                        </div>
                        <div className="bg-slate-950/80 p-2 rounded-lg border border-slate-800">
                          <span className="text-slate-400 text-[10px] block">Duplicates Skipped</span>
                          <strong className="text-amber-400 text-sm">{importResult.duplicateCount}</strong>
                        </div>
                        <div className="bg-slate-950/80 p-2 rounded-lg border border-slate-800">
                          <span className="text-slate-400 text-[10px] block">Errors</span>
                          <strong className="text-red-400 text-sm">{importResult.errors.length}</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {importResult.errors.length > 0 && (
                  <div className="bg-slate-950 p-3.5 rounded-2xl border border-red-900/40 space-y-1 max-h-36 overflow-y-auto">
                    <h5 className="text-[11px] font-bold text-red-400">Row Errors:</h5>
                    {importResult.errors.map((err, i) => (
                      <p key={i} className="text-[10px] text-red-300 font-mono">
                        • {err}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-6 rounded-2xl border border-dashed border-slate-800 text-center text-slate-500 space-y-2">
                <FileSpreadsheet className="w-7 h-7 mx-auto opacity-40" />
                <p className="text-xs">No import executed yet.</p>
                <p className="text-[10px] text-slate-500">
                  Select a CSV file and click "Validate & Process CSV Updates" to view live counts.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dedicated Bulk Modal */}
      <CSVBulkImportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialModule={selectedModule}
      />
    </div>
  );
};
