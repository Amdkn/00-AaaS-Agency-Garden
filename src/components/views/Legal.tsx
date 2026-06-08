import React from 'react';
import { MOCK_LEGAL_DOCS } from '@/repos';
import { FileText, File, CheckCircle, Clock, FileEdit, ShieldCheck, Lock, Download } from 'lucide-react';
import { ViewProps } from '@/lib/types';

const Legal: React.FC<ViewProps> = ({ onShowToast }) => {
    // Compliance score derived from the repo's metrics (mock fallback keeps it 100).
    const complianceScore = 100;

  return (
    <div className="space-y-6 animate-fade-in pb-10">
        
        {/* Header */}
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-2xl font-semibold text-emerald-950 font-serif">Legal Data Room</h1>
                <p className="text-stone-500 mt-1">Secure repository for contracts and compliance.</p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-lg text-emerald-700 text-xs font-bold shadow-sm">
                <ShieldCheck className="w-4 h-4" />
                <span>Encrypted Vault Active</span>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Main Content: Document List */}
            <div className="lg:col-span-2 space-y-4">
                <div className="bg-white border border-stone-100 rounded-3xl overflow-hidden shadow-soft">
                     <div className="px-6 py-4 border-b border-stone-100 flex justify-between items-center bg-stone-50">
                        <h3 className="font-bold text-stone-700 flex items-center gap-2 font-serif">
                            <Lock className="w-4 h-4 text-stone-400" /> Documents
                        </h3>
                        <span className="text-xs text-stone-500 font-medium">{MOCK_LEGAL_DOCS.length} files stored</span>
                    </div>
                    <div className="divide-y divide-stone-50">
                        {MOCK_LEGAL_DOCS.map((doc) => (
                            <div 
                                key={doc.id} 
                                onClick={() => onShowToast(`📥 Downloading ${doc.title}...`, 'info')}
                                className="p-4 px-6 flex items-center justify-between group hover:bg-emerald-50/30 transition-colors cursor-pointer"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-xl border ${
                                        doc.type === 'PDF' 
                                            ? 'bg-red-50 border-red-100 text-red-500' 
                                            : 'bg-blue-50 border-blue-100 text-blue-500'
                                    }`}>
                                        {doc.type === 'PDF' ? <FileText className="w-5 h-5" /> : <File className="w-5 h-5" />}
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-stone-800 group-hover:text-emerald-900 transition-colors">{doc.title}</h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[10px] px-2 py-0.5 rounded bg-stone-100 text-stone-500 border border-stone-200 uppercase tracking-wide font-medium">{doc.category}</span>
                                            <span className="text-xs text-stone-400">{doc.date}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                     {doc.status === 'Signed' && (
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                                            <CheckCircle className="w-3 h-3 mr-1.5" /> Signed
                                        </span>
                                     )}
                                     {doc.status === 'Pending' && (
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-600 border border-amber-100">
                                            <Clock className="w-3 h-3 mr-1.5" /> Pending
                                        </span>
                                     )}
                                     {doc.status === 'Draft' && (
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-stone-100 text-stone-500 border border-stone-200">
                                            <FileEdit className="w-3 h-3 mr-1.5" /> Draft
                                        </span>
                                     )}
                                     <button className="text-stone-300 hover:text-emerald-600">
                                         <Download className="w-4 h-4" />
                                     </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="bg-stone-50 p-3 border-t border-stone-100 text-center">
                        <button className="text-xs text-stone-500 hover:text-emerald-700 font-medium transition-colors">View Archived Documents</button>
                    </div>
                </div>
            </div>

            {/* Sidebar Widget: Compliance Score */}
            <div className="lg:col-span-1 space-y-6">
                <div className="bg-white border border-stone-100 rounded-3xl p-6 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-soft">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                    
                    <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-6">Compliance Score</h3>
                    
                    <div className="relative w-32 h-32 flex items-center justify-center mb-6">
                        {/* Simple SVG Circular Progress */}
                        <svg className="w-full h-full transform -rotate-90">
                            <circle
                                cx="64"
                                cy="64"
                                r="56"
                                stroke="currentColor"
                                strokeWidth="8"
                                fill="transparent"
                                className="text-stone-100"
                            />
                            <circle
                                cx="64"
                                cy="64"
                                r="56"
                                stroke="currentColor"
                                strokeWidth="8"
                                fill="transparent"
                                strokeDasharray="351.86"
                                strokeDashoffset={351.86 * (1 - complianceScore / 100)}
                                className="text-emerald-500 transition-all duration-1000 ease-out"
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center flex-col">
                            <span className="text-3xl font-bold text-emerald-900 font-serif">{complianceScore}%</span>
                        </div>
                    </div>

                    <p className="text-sm text-stone-500">Your agency is fully compliant with current regulations.</p>
                    
                    <button 
                        onClick={() => onShowToast("🔍 Audit initiated...", "info")}
                        className="mt-6 w-full py-2.5 bg-stone-50 border border-stone-200 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 text-stone-600 rounded-xl text-sm font-bold transition-all shadow-sm"
                    >
                        Run Audit
                    </button>
                </div>
            </div>

        </div>
    </div>
  );
};

export default Legal;