import React from 'react';
import { KPI, Alert, ViewProps } from '@/lib/types';
import { MOCK_KPIS, MOCK_ALERTS, MOCK_CLIENT_WIDGETS } from '@/repos';
import { TrendingUp, TrendingDown, Minus, AlertTriangle, AlertCircle, Info, ArrowRight, Sprout, CreditCard, Sparkles, Wind } from 'lucide-react';

const TrendIcon = ({ trend }: { trend: KPI['trend'] }) => {
  switch (trend) {
    case 'up': return <TrendingUp className="w-4 h-4 text-emerald-600" />;
    case 'down': return <TrendingDown className="w-4 h-4 text-amber-600" />;
    case 'stable': return <Minus className="w-4 h-4 text-stone-400" />;
    default: return <Minus className="w-4 h-4 text-stone-400" />;
  }
};

const AlertIcon = ({ severity }: { severity: Alert['severity'] }) => {
    switch (severity) {
        case 'critical': return <AlertTriangle className="w-5 h-5 text-amber-600" />;
        case 'warning': return <AlertCircle className="w-5 h-5 text-amber-500" />;
        case 'info': return <Info className="w-5 h-5 text-stone-400" />;
    }
};

const Dashboard: React.FC<ViewProps> = ({ onShowToast }) => {
  
  const handleAlertAction = (action: string) => {
    onShowToast(`✅ Action triggered: ${action}`, 'success');
  };

  const handleWidgetClick = (name: string) => {
      onShowToast(`📂 Opening details for ${name}...`, 'info');
  };

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      
      {/* Zone A: Business Pulse (Vitals) */}
      <section>
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-serif font-bold text-emerald-950 flex items-center gap-2">
                <Sprout className="w-6 h-6 text-emerald-600" />
                Ecosystem Vitals
            </h2>
            <span className="text-xs text-stone-400 font-medium bg-white px-3 py-1 rounded-full shadow-sm">Updated: Just now</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {MOCK_KPIS.map((kpi) => (
            <div key={kpi.id} className="bg-white p-6 rounded-3xl shadow-soft hover:shadow-lg transition-all duration-300 border border-transparent hover:border-emerald-100 group">
                <div className="flex justify-between items-start mb-4">
                    <span className="text-sm font-medium text-stone-500 font-sans uppercase tracking-wide">{kpi.label}</span>
                    <div className={`p-1.5 rounded-full ${
                        kpi.color === 'success' ? 'bg-emerald-50' :
                        kpi.color === 'info' ? 'bg-cyan-50' :
                        kpi.color === 'ai' ? 'bg-purple-50' :
                        'bg-amber-50'
                    }`}>
                        <TrendIcon trend={kpi.trend} />
                    </div>
                </div>
                <div className="flex items-baseline space-x-2">
                    <span className="text-3xl font-serif font-bold text-stone-800">{kpi.value}</span>
                </div>
                <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-stone-400">{kpi.subValue}</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        kpi.trend === 'up' ? 'text-emerald-700 bg-emerald-100' : 
                        kpi.trend === 'down' && kpi.id !== 'people' ? 'text-amber-700 bg-amber-100' :
                        'text-stone-500 bg-stone-100'
                    }`}>
                        {kpi.trendValue}
                    </span>
                </div>
            </div>
            ))}
        </div>
      </section>

      {/* Zone B: Cockpit (Split View) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Action Center (Alerts) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between">
                 <h2 className="text-xl font-serif font-bold text-stone-800">Wind Direction</h2>
                 <span className="text-sm text-stone-400 italic">Things requiring attention</span>
            </div>
            <div className="bg-white rounded-3xl shadow-soft overflow-hidden border border-stone-50">
                <div className="divide-y divide-stone-100">
                    {MOCK_ALERTS.map((alert) => (
                        <div key={alert.id} className="p-5 flex items-center justify-between group hover:bg-stone-50 transition-colors">
                            <div className="flex items-center space-x-5">
                                <div className={`flex-shrink-0 p-3 rounded-2xl ${
                                    alert.severity === 'critical' ? 'bg-amber-50' : 'bg-stone-100'
                                }`}>
                                    <AlertIcon severity={alert.severity} />
                                </div>
                                <div>
                                    <p className="text-base font-medium text-stone-800 group-hover:text-emerald-900 transition-colors">{alert.message}</p>
                                    <p className="text-xs text-stone-400 mt-1 flex items-center gap-1">
                                        <Wind className="w-3 h-3" />
                                        {alert.date}
                                    </p>
                                </div>
                            </div>
                            <button 
                                onClick={() => handleAlertAction(alert.actionLabel)}
                                className="px-5 py-2 text-sm font-medium text-stone-600 bg-white border border-stone-200 hover:border-emerald-200 hover:text-emerald-700 hover:shadow-sm rounded-xl transition-all flex items-center"
                            >
                                {alert.actionLabel}
                                <ArrowRight className="w-4 h-4 ml-2 opacity-60" />
                            </button>
                        </div>
                    ))}
                </div>
                {/* Empty State / Footer */}
                <div className="bg-stone-50/50 p-3 text-center border-t border-stone-100">
                    <span className="text-xs text-stone-400 font-medium">All systems clear</span>
                </div>
            </div>
          </div>

          {/* Right Column: Quick Access Cards */}
          <div className="lg:col-span-4 space-y-6">
             <h2 className="text-xl font-serif font-bold text-stone-800">Seeds</h2>
             <div className="space-y-6">
                 
                 {/* Active Clients Widget */}
                 <div className="bg-white rounded-3xl shadow-soft p-6 border border-stone-50">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">Active Roots</span>
                    </div>
                    <div className="space-y-3">
                        {MOCK_CLIENT_WIDGETS.map(client => (
                            <div 
                                key={client.id} 
                                onClick={() => handleWidgetClick(client.name)}
                                className="flex items-center justify-between text-sm p-3 rounded-2xl bg-stone-50 hover:bg-emerald-50/50 cursor-pointer transition-colors group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm group-hover:scale-110 transition-transform"></div>
                                    <span className="text-stone-700 font-medium">{client.name}</span>
                                </div>
                                <span className="text-[10px] bg-white px-2 py-1 rounded-lg text-stone-500 shadow-sm">
                                    {client.status}
                                </span>
                            </div>
                        ))}
                    </div>
                 </div>

                 {/* Payments Widget */}
                 <div className="bg-white rounded-3xl shadow-soft p-6 border border-stone-50 relative overflow-hidden group hover:shadow-md transition-shadow cursor-pointer" onClick={() => onShowToast('💰 Analyzing cashflow details...', 'info')}>
                    <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
                    <div className="flex items-center justify-between mb-4 relative z-10">
                        <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">Harvest</span>
                        <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                            <CreditCard className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="flex items-baseline gap-2 mb-3 relative z-10">
                         <span className="text-3xl font-serif font-bold text-stone-800">€4,250</span>
                         <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">Pending</span>
                    </div>
                    <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-amber-400 w-1/3 h-full rounded-full"></div>
                    </div>
                    <p className="text-xs text-stone-400 mt-3 font-medium">3 invoices ripening.</p>
                 </div>

                 {/* AI Agents Mini-Status */}
                 <div className="bg-gradient-to-br from-emerald-800 to-emerald-950 rounded-3xl p-6 relative overflow-hidden shadow-lg text-white group hover:scale-[1.02] transition-transform cursor-pointer" onClick={() => onShowToast('🤖 Checking Agent Status...', 'info')}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full -mr-10 -mt-10 pointer-events-none"></div>
                    <div className="flex items-center justify-between mb-4 relative z-10">
                        <span className="text-xs font-bold text-emerald-200 uppercase tracking-widest">Mycelium Network</span>
                        <Sparkles className="w-4 h-4 text-emerald-200" />
                    </div>
                    <div className="flex items-end space-x-2 relative z-10">
                        <span className="text-3xl font-serif font-bold">24</span>
                        <span className="text-sm text-emerald-200 mb-1.5">tasks automated</span>
                    </div>
                 </div>

             </div>
          </div>

      </div>

    </div>
  );
};

export default Dashboard;