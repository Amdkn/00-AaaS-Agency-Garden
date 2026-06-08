import React from 'react';
import { MOCK_FINANCE_KPIS, MOCK_TRANSACTIONS } from '@/repos';
import { MOCK_CLIENTS } from '@/repos';
import { Plus, Download, ArrowUpRight, ArrowDownLeft, FileText, Send } from 'lucide-react';
import { ViewProps } from '@/lib/types';

const Finance: React.FC<ViewProps> = ({ onShowToast, onOpenModal }) => {
  
  const handleNewInvoice = () => {
      onOpenModal("Create New Invoice", (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">Select Client</label>
                <div className="space-y-2">
                    {MOCK_CLIENTS.slice(0, 3).map(client => (
                        <div key={client.id} className="flex items-center gap-3 p-3 rounded-xl border border-stone-200 hover:border-emerald-500 cursor-pointer bg-stone-50 hover:bg-emerald-50 transition-colors">
                            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-xs font-bold text-emerald-800">
                                {client.logo}
                            </div>
                            <span className="text-sm font-medium text-stone-800">{client.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Amount (€)</label>
                    <input type="number" placeholder="0.00" className="w-full p-2.5 rounded-lg border border-stone-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 outline-none transition-all font-mono" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Due Date</label>
                    <input type="date" className="w-full p-2.5 rounded-lg border border-stone-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 outline-none transition-all" />
                </div>
            </div>

            <div className="pt-4 flex justify-end">
                <button 
                    onClick={() => {
                        // In a real app, this would submit form data
                        const modalCloseBtn = document.querySelector('.lucide-x')?.parentElement;
                        if(modalCloseBtn instanceof HTMLElement) modalCloseBtn.click();
                        onShowToast("✅ Invoice created and sent to drafting!", "success");
                    }}
                    className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200"
                >
                    <Send className="w-4 h-4" />
                    Create Invoice
                </button>
            </div>
        </div>
      ));
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
        
        {/* Header */}
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-2xl font-semibold text-emerald-950 font-serif">Financial Control</h1>
                <p className="text-stone-500 mt-1">Cashflow, invoices, and run-rate monitoring.</p>
            </div>
            <button 
                onClick={handleNewInvoice}
                className="flex items-center gap-2 bg-emerald-100 text-emerald-800 border border-emerald-200 px-4 py-2 rounded-xl text-sm font-medium hover:bg-emerald-200 hover:scale-105 transition-all shadow-sm"
            >
                <Plus className="w-4 h-4" />
                New Invoice
            </button>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {MOCK_FINANCE_KPIS.map((kpi) => (
                <div key={kpi.id} className="bg-white border border-stone-100 p-6 rounded-3xl hover:shadow-soft transition-all">
                     <div className="flex justify-between items-start mb-4">
                        <span className="text-sm font-medium text-stone-400 font-sans uppercase tracking-wider">{kpi.label}</span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                             kpi.trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 
                             kpi.trend === 'down' ? 'bg-amber-50 text-amber-600' :
                             'bg-stone-100 text-stone-500'
                        }`}>
                            {kpi.trendValue}
                        </span>
                     </div>
                     <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-stone-800 font-serif">{kpi.value}</span>
                     </div>
                     <p className="text-xs text-stone-500 mt-2 font-mono">{kpi.subValue}</p>
                </div>
            ))}
        </div>

        {/* Transactions Table */}
        <div className="bg-white border border-stone-100 rounded-3xl overflow-hidden shadow-soft">
            <div className="px-6 py-4 border-b border-stone-100 flex justify-between items-center bg-stone-50/50">
                <h3 className="font-bold text-stone-700 font-serif">Recent Transactions</h3>
                <button 
                    onClick={() => onShowToast('📥 Exporting financial data...', 'info')}
                    className="text-xs text-stone-500 hover:text-emerald-600 flex items-center gap-1 transition-colors"
                >
                    <Download className="w-3 h-3" /> Export CSV
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-stone-500">
                    <thead className="bg-stone-50 text-xs uppercase font-medium text-stone-400">
                        <tr>
                            <th className="px-6 py-3">Date</th>
                            <th className="px-6 py-3">Client / Entity</th>
                            <th className="px-6 py-3">Type</th>
                            <th className="px-6 py-3">Amount</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                        {MOCK_TRANSACTIONS.map((tx) => (
                            <tr key={tx.id} className="group hover:bg-stone-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap font-mono text-xs text-stone-400">{tx.date}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-xs font-bold text-stone-600 border border-stone-200">
                                            {tx.clientAvatar}
                                        </div>
                                        <span className="text-stone-700 font-medium">{tx.clientName}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        {tx.type === 'Invoice' 
                                            ? <ArrowUpRight className="w-3 h-3 text-emerald-500" /> 
                                            : <ArrowDownLeft className="w-3 h-3 text-stone-400" />
                                        }
                                        <span>{tx.type}</span>
                                    </div>
                                </td>
                                <td className={`px-6 py-4 font-mono font-medium ${
                                    tx.type === 'Invoice' ? 'text-emerald-600' : 'text-stone-600'
                                }`}>
                                    {tx.amount}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold border ${
                                        tx.status === 'Paid' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                        tx.status === 'Pending' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                        'bg-red-50 text-red-500 border-red-100'
                                    }`}>
                                        {tx.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button 
                                        onClick={() => onShowToast(`📥 Invoice #${tx.id} downloaded`, 'success')}
                                        className="text-stone-400 hover:text-emerald-600 transition-colors p-2 hover:bg-emerald-50 rounded-lg"
                                    >
                                        <FileText className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );
};

export default Finance;