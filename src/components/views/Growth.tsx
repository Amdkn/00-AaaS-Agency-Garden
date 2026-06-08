import React from 'react';
import { MOCK_LEADS } from '@/repos';
import { Lead, ViewProps } from '@/lib/types';
import { MoreHorizontal, Plus } from 'lucide-react';

const Column = ({ title, status, leads, color }: { title: string, status: Lead['status'], leads: ReadonlyArray<Lead>, color: string }) => {
    const columnLeads = leads.filter(l => l.status === status);
    
    return (
        <div className="flex-1 bg-white/50 rounded-2xl border border-stone-200 flex flex-col h-[calc(100vh-12rem)] backdrop-blur-sm">
            <div className={`p-4 border-b border-stone-200 flex justify-between items-center rounded-t-2xl ${color}`}>
                <h3 className="font-bold text-sm tracking-wide text-stone-800">{title}</h3>
                <span className="text-xs bg-white px-2 py-0.5 rounded-lg text-stone-500 font-mono shadow-sm">{columnLeads.length}</span>
            </div>
            <div className="p-3 space-y-3 overflow-y-auto flex-1 custom-scrollbar">
                {columnLeads.map(lead => (
                    <div key={lead.id} className="bg-white border border-stone-200 p-4 rounded-xl shadow-sm hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer group">
                        <div className="flex justify-between items-start mb-2">
                             <h4 className="font-bold text-stone-800 text-sm font-serif">{lead.name}</h4>
                             <button className="text-stone-400 hover:text-stone-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                <MoreHorizontal className="w-4 h-4" />
                             </button>
                        </div>
                        <div className="flex justify-between items-end">
                            <span className="text-xs text-stone-500">Prob. {status === 'Lead' ? '20%' : status === 'In Discussion' ? '60%' : '100%'}</span>
                            <span className="text-sm font-bold text-emerald-700 font-mono">{lead.value}</span>
                        </div>
                    </div>
                ))}
                
                {columnLeads.length === 0 && (
                     <div className="h-24 flex items-center justify-center border-2 border-dashed border-stone-200 rounded-xl text-stone-400 text-sm">
                        Empty
                     </div>
                )}
            </div>
        </div>
    );
}

const Growth: React.FC<ViewProps> = ({ onOpenModal, onShowToast }) => {
  
  const handleNewLead = () => {
    onOpenModal("Create New Lead", (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Prospect Name</label>
                <input type="text" placeholder="e.g. Acme Corp" className="w-full p-2.5 rounded-lg border border-stone-200 focus:border-emerald-500 outline-none" />
            </div>
            <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Estimated Value (€)</label>
                <input type="number" placeholder="0" className="w-full p-2.5 rounded-lg border border-stone-200 focus:border-emerald-500 outline-none" />
            </div>
             <div className="pt-4 flex justify-end">
                <button 
                    onClick={() => {
                        const modalCloseBtn = document.querySelector('.lucide-x')?.parentElement;
                        if(modalCloseBtn instanceof HTMLElement) modalCloseBtn.click();
                        onShowToast("✨ New lead planted in the pipeline!", "success");
                    }}
                    className="bg-emerald-600 text-white px-6 py-2 rounded-xl font-medium hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200"
                >
                    Add Lead
                </button>
            </div>
        </div>
    ));
  };

  return (
    <div className="space-y-6 animate-fade-in h-full">
         <div className="flex justify-between items-center">
            <div>
                <h1 className="text-2xl font-semibold text-emerald-950 font-serif">Growth Pipeline</h1>
                <p className="text-stone-500 mt-1">Simple view. Move cards right.</p>
            </div>
            <div className="flex items-center gap-3">
                <div className="bg-white border border-stone-200 px-4 py-2 rounded-xl shadow-sm">
                    <span className="text-sm text-stone-500 mr-2">Total Pipeline:</span>
                    <span className="text-lg font-bold text-emerald-700">€105k</span>
                </div>
                <button 
                    onClick={handleNewLead}
                    className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-200"
                >
                    <Plus className="w-4 h-4" />
                    New Lead
                </button>
            </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 overflow-x-auto pb-4">
            <Column
                title="Leads (Inbound)"
                status="Lead"
                leads={MOCK_LEADS}
                color="bg-stone-50"
            />
            <Column
                title="In Discussion"
                status="In Discussion"
                leads={MOCK_LEADS}
                color="bg-amber-50"
            />
            <Column
                title="Won (Signed)"
                status="Won"
                leads={MOCK_LEADS}
                color="bg-emerald-50"
            />
        </div>
    </div>
  );
};

export default Growth;