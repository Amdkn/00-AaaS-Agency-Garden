import React from 'react';
import { MOCK_STACK_CONNECTIONS } from '@/repos';
import { Server, Database, Activity, Wifi, Shield, HardDrive, RefreshCw } from 'lucide-react';

const ItData: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in pb-10">
        
        {/* Header */}
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-2xl font-semibold text-emerald-950 font-serif">IT & Infrastructure</h1>
                <p className="text-stone-500 mt-1">System status, connectivity, and data health monitoring.</p>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-stone-600 bg-white px-3 py-1.5 rounded-lg border border-stone-200 shadow-sm">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                System Operational
            </div>
        </div>

        {/* Section: Stack Connectivity */}
        <section>
            <h2 className="text-lg font-medium text-emerald-900 mb-4 flex items-center gap-2 font-serif">
                <Activity className="w-5 h-5 text-emerald-600" />
                Stack Connectivity
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {MOCK_STACK_CONNECTIONS.map((conn) => (
                    <div key={conn.id} className="bg-white border border-stone-200 p-5 rounded-3xl flex flex-col justify-between hover:border-emerald-300 hover:shadow-lg transition-all group shadow-md shadow-stone-200/50">
                        
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 rounded-2xl bg-stone-50 border border-stone-100 text-stone-500 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                                {conn.type === 'Database' && <Database className="w-5 h-5" />}
                                {conn.type === 'API' && <Wifi className="w-5 h-5" />}
                                {conn.type === 'Auth' && <Shield className="w-5 h-5" />}
                                {conn.type === 'AI' && <Activity className="w-5 h-5" />}
                            </div>
                            <div className={`flex items-center gap-1.5 px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wider border ${
                                conn.status === 'Connected' 
                                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                                    : conn.status === 'Maintenance'
                                    ? 'bg-amber-50 text-amber-600 border-amber-100'
                                    : 'bg-red-50 text-red-600 border-red-100'
                            }`}>
                                <div className={`w-1.5 h-1.5 rounded-full ${
                                    conn.status === 'Connected' ? 'bg-emerald-500' : 
                                    conn.status === 'Maintenance' ? 'bg-amber-500' : 'bg-red-500'
                                }`}></div>
                                {conn.status}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-base font-bold text-stone-800 mb-1 font-serif">{conn.name}</h3>
                            <div className="flex justify-between items-end text-xs text-stone-500 font-mono pt-2 border-t border-stone-50 mt-2">
                                <span>Latency: <span className={conn.status === 'Connected' ? 'text-emerald-600 font-bold' : 'text-stone-400'}>{conn.latency}</span></span>
                                <span>Up: {conn.uptime}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>

        {/* Section: Data Health */}
        <section>
             <h2 className="text-lg font-medium text-emerald-900 mb-4 flex items-center gap-2 font-serif">
                <Database className="w-5 h-5 text-emerald-600" />
                Data Health
            </h2>
            <div className="bg-white border border-stone-200 rounded-3xl p-8 grid grid-cols-1 md:grid-cols-3 gap-8 shadow-md shadow-stone-200/50">
                
                {/* Backup Status */}
                <div className="flex flex-col items-center justify-center text-center p-6 border border-stone-100 rounded-2xl bg-stone-50/50 hover:bg-emerald-50/30 transition-colors">
                    <div className="mb-4 p-3 rounded-full bg-emerald-100 text-emerald-600 border border-emerald-200 shadow-sm">
                        <RefreshCw className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">Last Backup</span>
                    <span className="text-2xl font-bold text-emerald-900 mt-1 font-serif">24 mins ago</span>
                    <span className="text-xs text-stone-500 mt-2 font-medium">Automated • Encryption AES-256</span>
                </div>

                {/* Storage Size */}
                <div className="flex flex-col items-center justify-center text-center p-6 border border-stone-100 rounded-2xl bg-stone-50/50 hover:bg-emerald-50/30 transition-colors">
                     <div className="mb-4 p-3 rounded-full bg-blue-50 text-blue-600 border border-blue-100 shadow-sm">
                        <HardDrive className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">Database Size</span>
                    <span className="text-2xl font-bold text-stone-800 mt-1 font-serif">4.2 GB</span>
                    <div className="w-32 h-2 bg-stone-200 rounded-full mt-3 overflow-hidden">
                        <div className="bg-blue-500 w-1/4 h-full rounded-full"></div>
                    </div>
                </div>

                {/* API Usage */}
                <div className="flex flex-col items-center justify-center text-center p-6 border border-stone-100 rounded-2xl bg-stone-50/50 hover:bg-emerald-50/30 transition-colors">
                     <div className="mb-4 p-3 rounded-full bg-purple-50 text-purple-600 border border-purple-100 shadow-sm">
                        <Activity className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">API Requests</span>
                    <span className="text-2xl font-bold text-stone-800 mt-1 font-serif">1.2M / mo</span>
                    <span className="text-xs text-stone-500 mt-2 font-medium">Within Tier 2 Limits</span>
                </div>

            </div>
        </section>

    </div>
  );
};

export default ItData;