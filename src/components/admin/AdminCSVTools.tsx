import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import {
  Download,
  Upload,
  FileSpreadsheet,
  CheckCircle,
  AlertTriangle,
  FileText,
  RefreshCw,
  Info
} from 'lucide-react';

export const AdminCSVTools: React.FC = () => {
  const { exportToCSV, importFromCSV, getCSVTemplate } = useData();

  const [selectedModule, setSelectedModule] = useState<string>('alumni');
  const [csvInput, setCsvInput] = useState<string>('');
  const [importResult, setImportResult] = useState<{
    success: boolean;
    importedCount: number;
    duplicateCount: number;
    errors: string[];
    message: string;
  } | null>(null);

  const modules = [
    { id: 'alumni', name: 'Alumni Members', description: 'Name, Batch, Email, House, Profession, Location, Blood Group' },
    { id: 'events', name: 'School & Alumni Events', description: 'Title, Category, Date, Time, Location, Capacity' },
    { id: 'financial_reports', name: 'Financial & Audit Reports', description: 'Title, Financial Year, Summary, Auditor, Visibility' },
    { id: 'ledger', name: 'Financial Ledger Transactions', description: 'Txn ID, Type, Category, Amount, Visibility, Payee/Donor' },
    { id: 'notices', name: 'School Notices & Circulars', description: 'Title, Category, Audience, Content, Reference No' },
    { id: 'faculty', name: 'Faculty & Staff Directory', description: 'Name, Department, Designation, Qualification, Experience' }
  ];

  const handleDownloadTemplate = () => {
    const template = getCSVTemplate(selectedModule);
    const blob = new Blob([template], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${selectedModule}_template.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        setCsvInput(text);
      }
    };
    reader.readAsText(file);
  };

  const handleExecuteImport = () => {
    if (!csvInput.trim()) {
      alert('Please select a CSV file or paste CSV content below.');
      return;
    }

    const result = importFromCSV(selectedModule, csvInput);
    setImportResult(result);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-100">Universal CSV Import & Export Hub</h2>
              <p className="text-xs text-slate-400">
                Bulk upload, audit verification, duplicate prevention & instant template downloads.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => exportToCSV(selectedModule)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition flex items-center space-x-2 cursor-pointer"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Export {modules.find(m => m.id === selectedModule)?.name}</span>
            </button>
            <button
              onClick={handleDownloadTemplate}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl transition flex items-center space-x-2 shadow cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>Download Template</span>
            </button>
          </div>
        </div>
      </div>

      {/* Module Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {modules.map((m) => (
          <button
            key={m.id}
            onClick={() => {
              setSelectedModule(m.id);
              setImportResult(null);
            }}
            className={`p-3.5 rounded-2xl text-left border transition cursor-pointer flex flex-col justify-between ${
              selectedModule === m.id
                ? 'bg-amber-500/10 border-amber-500 text-amber-300 ring-1 ring-amber-500/30'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <div>
              <div className="font-semibold text-xs text-slate-100">{m.name}</div>
              <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">{m.description}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Import & Validator Container */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload & CSV Input */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
              <Upload className="w-4 h-4 text-amber-400" />
              <span>Import {modules.find(m => m.id === selectedModule)?.name}</span>
            </h3>
            <label className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg border border-slate-700 cursor-pointer flex items-center space-x-1.5">
              <FileSpreadsheet className="w-3.5 h-3.5 text-blue-400" />
              <span>Choose CSV File</span>
              <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 text-[11px] text-slate-400 flex items-start space-x-2">
            <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <p>
              Download the official CSV template first to ensure matching header columns. Duplicates (by unique email or transaction ID) are automatically detected and preserved safely.
            </p>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Or Paste CSV Data Below:
            </label>
            <textarea
              rows={8}
              value={csvInput}
              onChange={(e) => setCsvInput(e.target.value)}
              placeholder={`Paste comma-separated rows with headers here...\nExample:\nfullName,email,batchYear...\n"Rahul Kumar","rahul@jnv.in",2012`}
              className="w-full bg-slate-950 text-slate-200 text-xs font-mono p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500 leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-end space-x-2 pt-2">
            <button
              onClick={() => {
                setCsvInput('');
                setImportResult(null);
              }}
              className="px-3.5 py-2 text-xs text-slate-400 hover:text-slate-200 transition"
            >
              Clear
            </button>
            <button
              onClick={handleExecuteImport}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-bold rounded-xl shadow-lg transition flex items-center space-x-2 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Validate & Process CSV</span>
            </button>
          </div>
        </div>

        {/* Results & Audit Validation Feedback */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2 mb-3">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>Import Audit & Validation Report</span>
            </h3>

            {importResult ? (
              <div className="space-y-3">
                <div
                  className={`p-4 rounded-xl border flex items-start space-x-3 ${
                    importResult.success
                      ? 'bg-emerald-950/40 border-emerald-800/80 text-emerald-300'
                      : 'bg-red-950/40 border-red-800/80 text-red-300'
                  }`}
                >
                  {importResult.success ? (
                    <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <h4 className="font-bold text-xs">{importResult.message}</h4>
                    <div className="flex items-center space-x-4 mt-2 text-xs">
                      <span>Imported: <strong>{importResult.importedCount}</strong></span>
                      <span>Duplicates: <strong>{importResult.duplicateCount}</strong></span>
                      <span>Errors: <strong>{importResult.errors.length}</strong></span>
                    </div>
                  </div>
                </div>

                {importResult.errors.length > 0 && (
                  <div className="bg-slate-950 p-3.5 rounded-xl border border-red-900/40 space-y-1.5 max-h-48 overflow-y-auto">
                    <h5 className="text-[11px] font-bold text-red-400">Row Errors:</h5>
                    {importResult.errors.map((err, i) => (
                      <p key={i} className="text-[10px] text-red-300/80 font-mono">
                        • {err}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="h-48 rounded-xl border border-dashed border-slate-800 flex flex-col items-center justify-center p-6 text-center text-slate-500">
                <FileSpreadsheet className="w-8 h-8 mb-2 opacity-50" />
                <p className="text-xs">No import executed yet.</p>
                <p className="text-[10px] text-slate-600 mt-1">
                  Upload or paste CSV rows and click "Validate & Process CSV" to inspect results.
                </p>
              </div>
            )}
          </div>

          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <span className="font-semibold text-slate-300">Data Integrity Safeguards:</span>
            <p>
              • Email and transaction reference keys ensure zero duplicates.
            </p>
            <p>
              • All imports update live database state and can be immediately exported back.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
