import React from 'react';
import { MOCK_SOPS } from '@/repos';
import { Lock, FileText, UserPlus, Target, Terminal, LogOut, ShieldAlert, Search, BookOpen } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { ViewProps } from '@/lib/types';

const IconMap: Record<string, LucideIcon> = {
    UserPlus, Target, FileText, Terminal, LogOut, ShieldAlert
};

const SopLibrary: React.FC<ViewProps> = ({ onOpenModal, onShowToast }) => {

  const handleReadSop = (title: string) => {
      onOpenModal(title, (
        <div className="space-y-6">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-stone-400">
                <span>Last Updated: Oct 24, 2023</span>
                <span>•</span>
                <span>Version 2.1</span>
            </div>
            
            <div className="prose prose-stone prose-sm">
                <p className="text-stone-600 leading-relaxed">
                    This Standard Operating Procedure (SOP) outlines the mandatory steps for executing the <strong>{title}</strong> workflow. 
                    Adherence to this protocol ensures consistency, quality, and compliance across all agency operations.
                </p>
                
                <h4 className="font-serif font-bold text-emerald-900 mt-6 mb-2">Phase 1: Preparation</h4>
                <ul className="list-disc pl-5 space-y-1 text-stone-600">
                    <li>Verify all prerequisites are met.</li>
                    <li>Initialize the workspace environment.</li>
                    <li>Notify relevant stakeholders via Slack #ops channel.</li>
                </ul>

                <h4 className="font-serif font-bold text-emerald-900 mt-6 mb-2">Phase 2: Execution</h4>
                <p className="text-stone-600">
                    Proceed with the core tasks as defined in the master playbook. Ensure all data entry points are validated before submission.
                </p>

                <div className="bg-amber-50 border-l-4 border-amber-400 p-4 my-4 rounded-r-lg">
                    <p className="text-amber-800 text-xs font-medium">
                        <strong>Critical Checkpoint:</strong> Do not proceed without Manager approval if budget exceeds €500.
                    </p>
                </div>
            </div>

            <div className="pt-6 border-t border-stone-100 flex justify-end gap-3">
                <button 
                    onClick={() => {
                        const modalCloseBtn = document.querySelector('.lucide-x')?.parentElement;
                        if(modalCloseBtn instanceof HTMLElement) modalCloseBtn.click();
                    }}
                    className="px-4 py-2 text-stone-500 hover:text-stone-800 transition-colors text-sm font-medium"
                >
                    Close
                </button>
                <button 
                    onClick={() => {
                        const modalCloseBtn = document.querySelector('.lucide-x')?.parentElement;
                        if(modalCloseBtn instanceof HTMLElement) modalCloseBtn.click();
                        onShowToast("✅ SOP marked as read", "success");
                    }}
                    className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-emerald-700 shadow-md shadow-emerald-200 transition-all"
                >
                    <BookOpen className="w-4 h-4" />
                    Mark as Read
                </button>
            </div>
        </div>
      ));
  };

  return (
    <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
                <h1 className="text-2xl font-semibold text-emerald-950 font-serif">SOP Library</h1>
                <p className="text-stone-500 mt-1">Standard Operating Procedures. The &quot;Brain&quot; of your agency.</p>
            </div>
            <div className="relative group">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 group-hover:text-emerald-600 transition-colors" />
                <input 
                    type="text" 
                    placeholder="Search procedures..." 
                    className="bg-white border border-stone-200 rounded-full pl-9 pr-4 py-2 text-sm text-stone-700 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 w-64 shadow-sm transition-all"
                />
            </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_SOPS.map((sop) => {
                const Icon = IconMap[sop.iconName] || FileText;
                return (
                    <div key={sop.id} className="group relative bg-white border border-stone-100 rounded-3xl p-6 hover:border-emerald-100 transition-all hover:shadow-soft hover:-translate-y-1">
                        {/* Lock Badge */}
                        <div className="absolute top-5 right-5 text-stone-300">
                             {sop.locked && <Lock className="w-4 h-4" />}
                        </div>

                        <div className="w-12 h-12 rounded-2xl bg-stone-50 flex items-center justify-center mb-4 border border-stone-100 group-hover:bg-emerald-50 group-hover:border-emerald-100 transition-colors">
                            <Icon className="w-6 h-6 text-stone-400 group-hover:text-emerald-600 transition-colors" />
                        </div>

                        <h3 className="text-lg font-bold text-stone-800 mb-2 font-serif">{sop.title}</h3>
                        
                        <div className="flex items-center space-x-2 mb-6">
                            <span className="text-[10px] uppercase tracking-wider font-bold text-stone-400 bg-stone-50 px-2 py-1 rounded-lg border border-stone-100">
                                {sop.department}
                            </span>
                        </div>

                        <button 
                            onClick={() => handleReadSop(sop.title)}
                            className="w-full py-2.5 rounded-xl border border-stone-200 text-sm font-bold text-stone-500 hover:text-emerald-700 hover:border-emerald-200 hover:bg-emerald-50 transition-all flex items-center justify-center"
                        >
                            Read Procedure
                        </button>
                    </div>
                )
            })}
        </div>
    </div>
  );
};

export default SopLibrary;
