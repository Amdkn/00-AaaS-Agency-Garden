import React from 'react';
import { MOCK_LISTINGS } from '@/repos';
import { CreditCard, Star, Package, CheckCircle } from 'lucide-react';
import { ViewProps } from '@/lib/types';

const Marketplace: React.FC<ViewProps> = ({ onShowToast }) => {
  return (
    <div className="space-y-8 animate-fade-in">
         <div className="text-center max-w-2xl mx-auto pt-4">
            <h1 className="text-3xl font-bold text-emerald-950 mb-2 font-serif">Upgrade Your OS</h1>
            <p className="text-stone-500">Plug-and-play modules to scale your agency without adding headcount.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {MOCK_LISTINGS.map((item) => (
                <div key={item.id} className="bg-white border border-stone-100 rounded-3xl p-8 flex flex-col hover:border-emerald-200 hover:shadow-lg transition-all relative overflow-hidden group">
                    
                    {/* Decorative Background Glow */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-stone-50 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-emerald-50 pointer-events-none"></div>

                    <div className="flex justify-between items-start mb-6 relative z-10">
                        <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100 group-hover:bg-white group-hover:border-emerald-100 transition-colors">
                            <Package className="w-6 h-6 text-stone-600 group-hover:text-emerald-600" />
                        </div>
                        <span className="px-3 py-1 bg-stone-50 rounded-full text-xs font-bold text-stone-500 border border-stone-100 uppercase tracking-wide">
                            {item.category}
                        </span>
                    </div>

                    <h3 className="text-xl font-bold text-stone-800 mb-2 font-serif">{item.title}</h3>
                    <p className="text-stone-500 text-sm mb-6 flex-1 leading-relaxed">
                        {item.description}
                    </p>

                    <div className="flex items-center justify-between pt-6 border-t border-stone-50 mt-auto">
                        <span className="text-2xl font-bold text-emerald-900 font-serif">{item.price}</span>
                        <button 
                            onClick={() => onShowToast(`💳 Redirecting to Stripe for ${item.title}...`, 'success')}
                            className="flex items-center bg-stone-900 text-white px-5 py-2.5 rounded-xl font-medium text-sm hover:bg-emerald-700 transition-colors shadow-lg shadow-stone-200"
                        >
                            <CreditCard className="w-4 h-4 mr-2" />
                            Activate
                        </button>
                    </div>
                </div>
            ))}
        </div>

        {/* Social Proof */}
        <div className="border-t border-stone-200 pt-8 mt-8">
            <div className="flex justify-center gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
                 {/* Mock Logos - simplified for code */}
                 <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-stone-800 rounded-full"></div>
                    <span className="font-bold text-stone-800">Stripe</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-stone-800 rounded-sm"></div>
                    <span className="font-bold text-stone-800">Notion</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-stone-800 rounded-tr-lg"></div>
                    <span className="font-bold text-stone-800">Slack</span>
                 </div>
            </div>
        </div>
    </div>
  );
};

export default Marketplace;