import React, { useState } from 'react';
import { Send, LayoutGrid, PanelRightClose, PanelRightOpen, ExternalLink, HelpCircle } from 'lucide-react';
import { AI_AGENTS } from '@/lib/constants';

interface AiPanelProps {
    isExpanded: boolean;
    onToggle: () => void;
    onShowToast: (message: string, type: 'info' | 'success') => void;
}

const AiPanel: React.FC<AiPanelProps> = ({ isExpanded, onToggle, onShowToast }) => {
    const [selectedAgentId, setSelectedAgentId] = useState<string>(AI_AGENTS[0].id);
    const selectedAgent = AI_AGENTS.find(a => a.id === selectedAgentId) || AI_AGENTS[0];

    const getWelcomeMessage = (agentName: string) => {
        switch (agentName) {
            case 'Jerry': return "Pulse synchronized. What's the directive, Chief?";
            case 'Superman': return "Up, up and away! Where are we growing today?";
            case 'Batman': return "Systems operational. Surveillance active. Awaiting instructions.";
            case 'Flash': return "Product backlog analyzed in 0.03s. Ready to sprint.";
            case 'Wonder Woman': return "The truth about our numbers is clear. Shall we review the ledger?";
            case 'Green Lantern': return "The team's willpower is strong. Capacity at 85%.";
            case 'Cyborg': return "Network connected. Firewalls holding. What do you need?";
            case 'Aquaman': return "Contractual depths monitored. No leaks detected.";
            default: return "Online and ready.";
        }
    };

    return (
        <div className={`${isExpanded ? 'w-80' : 'w-20'} h-[calc(100vh-2rem)] fixed right-4 top-4 bg-white/80 backdrop-blur-xl border border-white/50 rounded-2xl flex flex-col z-40 shadow-glass transition-all duration-300 ease-in-out`}>
            
            {/* 1. Dock Header */}
            <div className={`h-16 flex items-center border-b border-stone-100 px-4 ${isExpanded ? 'justify-between' : 'justify-center'}`}>
                {isExpanded ? (
                    <div className="flex items-center gap-2 animate-fade-in">
                        <h2 className="text-sm font-serif font-bold text-emerald-950">Board of Directors</h2>
                    </div>
                ) : (
                    <button onClick={onToggle} title="Expand Dock">
                        <PanelRightOpen className="w-5 h-5 text-stone-400 hover:text-emerald-600 transition-colors" />
                    </button>
                )}
                
                {isExpanded && (
                    <div className="flex items-center gap-1">
                        <button 
                            onClick={() => onShowToast("🚀 Opening Full AI Dashboard...", "info")}
                            className="p-1.5 rounded-lg text-stone-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors" 
                            title="Full Page View"
                        >
                            <LayoutGrid className="w-4 h-4" />
                        </button>
                        <button 
                            onClick={onToggle}
                            className="p-1.5 rounded-lg text-stone-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                        >
                            <PanelRightClose className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>

            {/* 2. Agent List (Navigation) */}
            <div className={`flex-shrink-0 overflow-y-auto custom-scrollbar border-b border-stone-100 ${isExpanded ? 'h-64' : 'h-full'}`}>
                <div className="p-2 space-y-1">
                    {AI_AGENTS.map((agent) => (
                        <button
                            key={agent.id}
                            onClick={() => setSelectedAgentId(agent.id)}
                            className={`w-full flex items-center rounded-xl transition-all group relative ${
                                selectedAgentId === agent.id 
                                    ? 'bg-emerald-50 border border-emerald-100 shadow-sm' 
                                    : 'hover:bg-white hover:shadow-sm border border-transparent'
                            } ${isExpanded ? 'p-3' : 'p-3 justify-center'}`}
                        >
                            <div className={`text-xl transition-transform ${selectedAgentId === agent.id ? 'scale-110' : 'group-hover:scale-110'}`}>
                                {agent.emoji}
                            </div>
                            
                            {isExpanded && (
                                <div className="ml-3 text-left overflow-hidden animate-fade-in">
                                    <p className={`text-sm font-bold truncate ${selectedAgentId === agent.id ? 'text-emerald-900' : 'text-stone-700'}`}>
                                        {agent.name}
                                    </p>
                                    <p className="text-[10px] text-stone-500 uppercase tracking-wider truncate">
                                        {agent.role}
                                    </p>
                                </div>
                            )}

                            {/* Tooltip for Collapsed Mode */}
                            {!isExpanded && (
                                <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-stone-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
                                    {agent.name} • {agent.role}
                                </div>
                            )}

                            {/* Active Indicator Line */}
                            {selectedAgentId === agent.id && (
                                <div className="absolute left-0 top-3 bottom-3 w-1 bg-emerald-500 rounded-r-full"></div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* 3. Chat Area (Only visible when expanded) */}
            {isExpanded && (
                <div className="flex-1 flex flex-col bg-stone-50/30 rounded-b-2xl animate-fade-in overflow-hidden">
                    
                    {/* Chat Context Header */}
                    <div className="px-4 py-2 border-b border-stone-100 flex items-center justify-between bg-white/40">
                         <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest flex items-center gap-1">
                            Chatting with {selectedAgent.name}
                         </span>
                         <div className={`w-2 h-2 rounded-full ${selectedAgent.status === 'Running' ? 'bg-emerald-400 animate-pulse' : 'bg-stone-300'}`}></div>
                    </div>

                    {/* Message Area */}
                    <div className="flex-1 p-4 overflow-y-auto space-y-4">
                        {/* Agent Message */}
                        <div className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-white border border-stone-100 flex items-center justify-center text-lg shadow-sm flex-shrink-0">
                                {selectedAgent.emoji}
                            </div>
                            <div className="space-y-1">
                                <div className="bg-white border border-stone-100 p-3 rounded-2xl rounded-tl-none shadow-sm text-sm text-stone-700 leading-relaxed">
                                    {getWelcomeMessage(selectedAgent.name)}
                                </div>
                                <span className="text-[10px] text-stone-400 pl-1">Just now</span>
                            </div>
                        </div>

                        {/* Contextual Task Info */}
                         <div className="flex justify-center">
                            <span className="text-[10px] text-stone-400 bg-stone-100 px-2 py-1 rounded-full border border-stone-200">
                                Current Focus: {selectedAgent.task}
                            </span>
                        </div>
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-white border-t border-stone-100">
                        <div className="relative group">
                            <input 
                                type="text" 
                                placeholder={`Ask ${selectedAgent.name}...`} 
                                className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-4 pr-10 py-3 text-sm text-stone-700 focus:outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 placeholder:text-stone-400 transition-all shadow-inner"
                            />
                            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-emerald-500 transition-all">
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AiPanel;