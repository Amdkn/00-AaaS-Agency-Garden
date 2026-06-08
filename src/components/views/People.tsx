import React from 'react';
import { MOCK_TEAM_MEMBERS, MOCK_ROLE_ALLOCATIONS } from '@/repos';
import { Users, Shield, Cpu, Zap, AlertCircle } from 'lucide-react';

const People: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in pb-10">
        
        {/* Header */}
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-2xl font-semibold text-emerald-950 font-serif">Team & Capacity</h1>
                <p className="text-stone-500 mt-1">Resource planning for Humans and AI Agents.</p>
            </div>
            <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-lg border border-stone-200 shadow-sm">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
                <span className="text-xs text-stone-600 font-medium">System Healthy</span>
            </div>
        </div>

        {/* Section A: Team Capacity */}
        <section className="space-y-4">
             <h2 className="text-lg font-medium text-emerald-900 flex items-center gap-2 font-serif">
                <Users className="w-5 h-5 text-emerald-600" />
                Capacity Load
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {MOCK_TEAM_MEMBERS.map((member) => (
                    <div key={member.id} className="bg-white border border-stone-200 p-6 rounded-3xl relative overflow-hidden group hover:border-emerald-200 hover:shadow-lg transition-all shadow-md shadow-stone-200/50">
                        
                        {/* Type Badge */}
                        <div className="absolute top-4 right-4">
                             {member.type === 'AI' ? (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-purple-50 text-purple-600 border border-purple-100">
                                    <Cpu className="w-3 h-3 mr-1" /> AI Agent
                                </span>
                             ) : (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-stone-100 text-stone-500 border border-stone-200">
                                    {member.type}
                                </span>
                             )}
                        </div>

                        <div className="flex items-center gap-4 mb-6">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-sm font-bold shadow-sm ${
                                member.type === 'AI' 
                                ? 'bg-purple-50 border border-purple-100 text-purple-600' 
                                : 'bg-stone-50 border border-stone-100 text-stone-600'
                            }`}>
                                {member.avatar}
                            </div>
                            <div>
                                <h3 className="font-bold text-stone-800 text-lg font-serif">{member.name}</h3>
                                <p className="text-xs text-stone-500 font-medium">{member.role}</p>
                            </div>
                        </div>

                        {/* Load Bar */}
                        <div>
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">Current Load</span>
                                <div className="flex items-center gap-1.5">
                                    {member.load > 90 && <AlertCircle className="w-3 h-3 text-amber-500" />}
                                    <span className={`text-sm font-bold ${
                                        member.load > 90 ? 'text-amber-600' : 
                                        member.load > 70 ? 'text-amber-500' : 
                                        'text-emerald-600'
                                    }`}>{member.load}%</span>
                                </div>
                            </div>
                            <div className="w-full bg-stone-100 rounded-full h-2.5 overflow-hidden border border-stone-200">
                                <div 
                                    className={`h-full rounded-full transition-all duration-500 shadow-sm ${
                                         member.load > 90 ? 'bg-amber-500' : 
                                         member.load > 70 ? 'bg-amber-400' : 
                                         'bg-emerald-500'
                                    }`} 
                                    style={{ width: `${member.load}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>

        {/* Section B: Role Distribution */}
        <section className="space-y-4 pt-4">
             <h2 className="text-lg font-medium text-emerald-900 flex items-center gap-2 font-serif">
                <Shield className="w-5 h-5 text-emerald-600" />
                Role Distribution
            </h2>
            <div className="bg-white border border-stone-200 rounded-3xl overflow-hidden max-w-2xl shadow-md shadow-stone-200/50">
                <table className="w-full text-left text-sm text-stone-500">
                    <thead className="bg-stone-50 text-xs uppercase font-bold text-stone-400">
                        <tr>
                            <th className="px-6 py-4">Domain</th>
                            <th className="px-6 py-4">Owner</th>
                            <th className="px-6 py-4 text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                        {MOCK_ROLE_ALLOCATIONS.map((role) => (
                            <tr key={role.id} className="hover:bg-emerald-50/30 transition-colors">
                                <td className="px-6 py-4 font-bold text-stone-700 font-serif">{role.domain}</td>
                                <td className="px-6 py-4">
                                     <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-[10px] font-bold text-stone-600 border border-stone-200">
                                            {role.ownerAvatar}
                                        </div>
                                        <span className="font-medium text-stone-600">{role.ownerName}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100 uppercase tracking-wide">
                                        Covered
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>

    </div>
  );
};

export default People;