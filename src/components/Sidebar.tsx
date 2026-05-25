import React from 'react';
import { NavView } from '@/lib/types';
import { 
  LayoutDashboard, 
  BarChart3, 
  Users, 
  CheckSquare, 
  Briefcase, 
  Library, 
  Scale, 
  Rocket, 
  ShoppingBag, 
  Server, 
  Settings,
  Leaf,
  PanelLeftClose,
  ShieldCheck
} from 'lucide-react';

interface SidebarProps {
  currentView: NavView;
  onChangeView: (view: NavView) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView, isOpen, onToggle }) => {
  
  const sections = [
    {
        title: 'Cultivate',
        items: [
            { id: NavView.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
            { id: NavView.FINANCE, label: 'Finance', icon: BarChart3 },
            { id: NavView.PEOPLE, label: 'People', icon: Users },
        ]
    },
    {
        title: 'Nurture',
        items: [
            { id: NavView.TASKS, label: 'Tasks', icon: CheckSquare },
            { id: NavView.CLIENTS, label: 'Clients', icon: Briefcase },
            { id: NavView.SOP_LIBRARY, label: 'Knowledge', icon: Library },
            { id: NavView.LEGAL, label: 'Legal', icon: Scale },
        ]
    },
    {
        title: 'Bloom',
        items: [
            { id: NavView.GROWTH, label: 'Growth', icon: Rocket },
            { id: NavView.SALES, label: 'Sales Sanctum', icon: ShieldCheck },
            { id: NavView.MARKETPLACE, label: 'Marketplace', icon: ShoppingBag },
        ]
    },
    {
        title: 'Roots',
        items: [
             { id: NavView.IT_DATA, label: 'System Roots', icon: Server },
             { id: NavView.SETTINGS, label: 'Settings', icon: Settings },
        ]
    }
  ];

  return (
    <div className={`${isOpen ? 'w-64' : 'w-20'} h-[calc(100vh-2rem)] fixed left-4 top-4 z-50 rounded-2xl flex flex-col glass-panel shadow-soft transition-all duration-300 ease-in-out`}>
      
      {/* Brand & Toggle */}
      <div className="h-20 flex items-center px-4 border-b border-stone-100 justify-between relative">
        <div className="flex items-center">
            <div className={`w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 transition-all ${isOpen ? 'mr-3' : 'mx-auto'}`}>
                <Leaf className="w-5 h-5 fill-current" />
            </div>
            {isOpen && (
                <div className="flex flex-col animate-fade-in">
                    <span className="text-lg font-serif font-bold tracking-tight text-emerald-900">A&apos;Space</span>
                    <span className="text-[10px] text-emerald-600 uppercase tracking-widest font-medium">Digital Garden</span>
                </div>
            )}
        </div>
        
        <button 
            onClick={onToggle}
            className={`absolute -right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-white border border-stone-200 rounded-full flex items-center justify-center text-stone-500 hover:text-emerald-600 hover:border-emerald-300 shadow-sm transition-colors z-50 ${!isOpen ? 'left-16 rotate-180' : ''}`}
        >
            <PanelLeftClose className="w-3 h-3" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 space-y-6 overflow-y-auto custom-scrollbar overflow-x-hidden">
        {sections.map((section, idx) => (
            <div key={idx} className={!isOpen ? 'text-center' : ''}>
                {isOpen && <h3 className="px-4 text-xs font-serif italic text-stone-400 mb-2 truncate">{section.title}</h3>}
                {!isOpen && <div className="h-px w-8 bg-stone-200 mx-auto mb-2"></div>}
                
                <div className="space-y-1">
                    {section.items.map((item) => {
                    const isActive = currentView === item.id;
                    const Icon = item.icon;
                    return (
                        <button
                        key={item.id}
                        onClick={() => onChangeView(item.id)}
                        title={!isOpen ? item.label : ''}
                        className={`flex items-center transition-all duration-300 group relative overflow-hidden ${
                            isOpen 
                            ? 'w-full px-4 py-2.5 text-sm font-medium rounded-xl text-left' 
                            : 'w-10 h-10 mx-auto justify-center rounded-xl'
                        } ${
                            isActive 
                            ? 'bg-emerald-100/80 text-emerald-900 shadow-sm' 
                            : 'text-stone-500 hover:text-stone-800 hover:bg-stone-100/50'
                        }`}
                        >
                        <Icon 
                            className={`w-4 h-4 transition-colors ${
                                isOpen ? 'mr-3' : ''
                            } ${
                                isActive ? 'text-emerald-600' : 'text-stone-400 group-hover:text-stone-600'
                            }`} 
                        />
                        {isOpen && <span className="truncate">{item.label}</span>}
                        </button>
                    );
                    })}
                </div>
            </div>
        ))}
      </nav>

      {/* Footer / User Profile */}
      <div className="p-4 border-t border-stone-100 bg-white/40 rounded-b-2xl overflow-hidden">
        <div className={`flex items-center ${isOpen ? 'gap-3' : 'justify-center'} p-2 rounded-xl hover:bg-white/60 transition-colors cursor-pointer`}>
            <div className="w-8 h-8 rounded-full bg-stone-200 border-2 border-white flex items-center justify-center text-xs font-serif font-bold text-stone-600 overflow-hidden flex-shrink-0">
                <img src="https://api.dicebear.com/7.x/notionists/svg?seed=JD" alt="Avatar" className="w-full h-full" />
            </div>
            {isOpen && (
                <div className="flex-1 min-w-0 animate-fade-in">
                    <p className="text-sm font-semibold text-stone-800 font-serif truncate">John Doe</p>
                    <p className="text-xs text-emerald-600 truncate">Head Gardener</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
