import React, { useState } from 'react';
import { ViewProps } from '@/lib/types';
import {
  ShieldCheck,
  Zap,
  Terminal,
  Users,
  TrendingUp,
  Clock,
  Euro,
  Mail,
  Eye,
  ArrowRight,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  Activity,
  Cpu,
  Layers,
  Search,
  Brain,
  ZapOff,
  Flame,
  MousePointer2,
  Lock,
  Ghost
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MOCK_SALES_INBOX,
  MOCK_SALES_AGENT_STATUS,
  MOCK_SALES_PIPELINE,
} from '@/repos';

const Sales: React.FC<ViewProps> = ({ onShowToast, onOpenModal }) => {
  const [activeTab, setActiveTab] = useState<'pipeline' | 'logs'>('pipeline');

  // KPI Data (vitals are view-local in Phase D — these come from the
  // dashboard metrics repo in a future phase).
  const vitals = [
    { label: 'Closing Rate', value: '84.2%', trend: '+4.1%', icon: TrendingUp },
    { label: 'Avg. Time-to-Close', value: '3.2 Days', trend: '-12%', icon: Clock },
    { label: 'MTD Revenue Locked', value: '€142,500', trend: '+22%', icon: Euro },
  ];

  // Agent Data — sourced from the sales repo (typed accessors).
  const agentIconMap = { Brain, Cpu, ShieldCheck, Activity } as const;
  const agents = MOCK_SALES_AGENT_STATUS.map((a) => ({
    name: a.name,
    role: a.role,
    status: a.status,
    icon: agentIconMap[a.iconName],
  }));

  // Inbox Data — sourced from the sales repo.
  const inbox = MOCK_SALES_INBOX;

  // Pipeline Data — sourced from the sales repo.
  const columns = MOCK_SALES_PIPELINE;

  const handleReviewAudit = (name: string) => {
    onShowToast(`Dr. Strange: Audit for ${name} reviewed and approved for delivery.`, 'success');
  };

  return (
    <div className="flex flex-col space-y-8 animate-in fade-in duration-700 text-stone-800 font-sans">
      
      {/* Header with Title & Tab Toggle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
        <div>
          <h2 className="text-3xl font-serif font-bold text-emerald-900 tracking-tight">Sales Sanctum</h2>
          <p className="text-stone-500 mt-1 italic text-sm font-serif">Managed by the Sales Director (John Jones) & The Illuminati</p>
        </div>

        <div className="flex bg-stone-200/50 p-1 rounded-xl border border-stone-200">
          <button 
            onClick={() => setActiveTab('pipeline')}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'pipeline' ? 'bg-white text-emerald-800 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
          >
            Pipeline View
          </button>
          <button 
            onClick={() => setActiveTab('logs')}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'logs' ? 'bg-white text-emerald-800 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
          >
            Agent Logs
          </button>
        </div>
      </div>

      {/* Conversion Vitals */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {vitals.map((kpi, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white border border-stone-200 p-6 rounded-2xl relative overflow-hidden group hover:border-emerald-200 transition-all shadow-soft"
          >
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-all group-hover:scale-110">
              <kpi.icon className="w-12 h-12 text-emerald-600" />
            </div>
            <p className="text-stone-500 text-xs uppercase tracking-widest font-semibold">{kpi.label}</p>
            <div className="mt-3 flex items-baseline space-x-3">
              <h3 className="text-3xl font-serif font-bold text-emerald-950 tracking-tight">{kpi.value}</h3>
              <span className={`text-xs font-bold ${kpi.trend.startsWith('+') ? 'text-emerald-600' : 'text-rose-500'}`}>
                {kpi.trend}
              </span>
            </div>
            <div className="mt-4 h-1.5 w-full bg-stone-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500" style={{ width: '70%' }}></div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Illuminati Swarm Status */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {agents.map((agent, idx) => (
          <div key={idx} className="bg-white/80 backdrop-blur-sm border border-stone-200 p-4 rounded-xl flex items-center space-x-3 hover:bg-white transition-all group shadow-sm">
            <div className={`p-2 rounded-lg ${
              agent.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 
              agent.status === 'Processing' ? 'bg-amber-50 text-amber-600' : 'bg-stone-100 text-stone-400'
            }`}>
              <agent.icon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-stone-800 text-sm font-bold truncate">{agent.name}</h4>
              <p className="text-stone-400 text-[10px] uppercase tracking-wide truncate">{agent.role}</p>
            </div>
            <div className={`w-2 h-2 rounded-full ${
              agent.status === 'Active' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)] animate-pulse' : 
              agent.status === 'Processing' ? 'bg-amber-500 animate-pulse' : 'bg-stone-300'
            }`}></div>
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'pipeline' ? (
          <motion.div 
            key="pipeline"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="grid lg:grid-cols-2 gap-8"
          >
            {/* Telepathy Inbox */}
            <div className="bg-white border border-stone-200 rounded-2xl flex flex-col p-6 shadow-soft">
              <div className="flex items-center justify-between mb-6">
                 <div>
                    <h3 className="text-lg font-serif font-bold text-emerald-950">Telepathy Inbox</h3>
                    <p className="text-stone-500 text-xs mt-1">Awaiting audit approval</p>
                 </div>
                 <div className="bg-stone-100 p-2 rounded-lg text-stone-400">
                    <Search className="w-4 h-4" />
                 </div>
              </div>

              <div className="space-y-4 overflow-y-auto max-h-[440px] pr-2 custom-scrollbar">
                {inbox.map((lead) => (
                  <div key={lead.id} className="group relative bg-stone-50 border border-stone-100 p-4 rounded-xl hover:border-emerald-200 hover:bg-white transition-all cursor-pointer shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center space-x-2">
                             <h4 className="font-bold text-stone-800 group-hover:text-emerald-700 transition-colors uppercase text-sm tracking-tight">{lead.name}</h4>
                             <span className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded uppercase font-bold">{lead.agency}</span>
                          </div>
                          <p className="text-xs text-rose-600 font-medium mt-1 italic">€{lead.bleed} Margin Bleed Calculated</p>
                        </div>
                        <button 
                           onClick={() => handleReviewAudit(lead.name)}
                           className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-emerald-700 shadow-sm transition-all flex items-center space-x-1"
                        >
                          <Brain className="w-3 h-3" />
                          <span>Review Audit</span>
                        </button>
                    </div>

                    {/* Tooltip emulation on hover */}
                    <div className="absolute left-1/2 -top-12 -translate-x-1/2 bg-stone-900 text-white px-3 py-2 rounded-lg text-[10px] border border-stone-800 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50 shadow-2xl min-w-[200px]">
                        <p className="text-emerald-400 font-bold mb-1">Goulot d&apos;étranglement:</p>
                        <p>{lead.bottleneck}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Asynchronous Pipeline */}
            <div className="flex flex-col space-y-4">
               <div className="flex items-center justify-between px-2">
                  <h3 className="text-lg font-serif font-bold text-emerald-950">Closing Pipeline</h3>
                  <div className="flex space-x-1">
                    {[1,2,3].map(i => <div key={i} className="w-1 h-1 rounded-full bg-stone-300"></div>)}
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4 h-full">
                  {columns.map((col, idx) => (
                    <div key={idx} className="bg-white/60 border border-stone-200 rounded-xl p-4 flex flex-col shadow-sm">
                       <h4 className="text-[10px] uppercase tracking-widest font-bold text-emerald-700 mb-4 flex items-center space-x-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          <span>{col.title}</span>
                       </h4>
                       <div className="space-y-3">
                          {col.items.map(item => (
                            <div key={item.id} className="bg-white border border-stone-100 p-3 rounded-lg hover:border-emerald-100 hover:shadow-sm transition-all">
                               <p className="text-sm font-bold text-stone-800">{item.name}</p>
                               <div className="flex items-center space-x-1.5 mt-1">
                                  <div className="w-1 h-1 rounded-full bg-emerald-300"></div>
                                  <p className="text-[10px] text-stone-500 italic">{item.sub}</p>
                               </div>
                            </div>
                          ))}
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="logs"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white border border-stone-200 rounded-2xl p-8 shadow-soft"
          >
            <div className="flex items-center space-x-3 pb-6 border-b border-stone-100">
               <Terminal className="w-6 h-6 text-emerald-600" />
               <h3 className="text-xl font-serif font-bold text-emerald-950">Illuminati Swarm Logs</h3>
            </div>
            
            <div className="mt-6 space-y-4 font-mono text-xs">
               {[
                 { time: '12:44:21', agent: 'Dr. Strange', msg: 'Audit logic for Alaric Chen complete. Calculating margin bleed...', status: 'success' },
                 { time: '12:43:05', agent: 'Iron Man', msg: 'Rendering AaaS UI Demo for Zenith SEO using project_genesis.v4', status: 'info' },
                 { time: '12:40:11', agent: 'Namor', msg: 'Lead Alaric Chen passed intent threshold (94%). Syncing to Telepathy.', status: 'success' },
                 { time: '12:35:58', agent: 'System', msg: 'Rotating agent authentication keys. Next swarm sync in 4m.', status: 'system' },
                 { time: '12:32:44', agent: 'Black Panther', msg: 'Waiting for deposit signal from Crimson Creative...', status: 'info' },
               ].map((log, i) => (
                 <div key={i} className="flex space-x-4 p-2 rounded hover:bg-stone-50 transition-colors border-l-2 border-transparent hover:border-emerald-500">
                    <span className="text-stone-400 shrink-0">{log.time}</span>
                    <span className={`font-bold shrink-0 w-24 ${
                      log.status === 'success' ? 'text-emerald-600' : 
                      log.status === 'system' ? 'text-amber-600' : 'text-stone-500'
                    }`}>[{log.agent}]</span>
                    <span className="text-stone-600">{log.msg}</span>
                 </div>
               ))}
               <div className="flex items-center space-x-2 pt-4">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-emerald-600 font-bold">Listening for incoming mental signals...</span>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer / Status */}
      <div className="pt-8 grid grid-cols-1 md:grid-cols-2 gap-8 text-stone-400 text-xs items-center">
         <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
               <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></div>
               <span className="font-bold tracking-tight text-emerald-800">OS CORE SECURE</span>
            </div>
            <div className="h-3 w-px bg-stone-200"></div>
            <span>STRIKE RATE: 100% (NO LEAKS)</span>
         </div>
         <div className="flex justify-end space-x-6 uppercase tracking-widest font-bold text-stone-400">
            <span className="hover:text-emerald-700 cursor-pointer transition-colors">Emergency Protocol</span>
            <span className="hover:text-emerald-700 cursor-pointer transition-colors">Direct Director Line</span>
         </div>
      </div>
    </div>
  );
};

export default Sales;
