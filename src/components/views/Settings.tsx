import React, { useState } from 'react';
import { Settings as SettingsIcon, UploadCloud, CreditCard, Palette, Layout, Crown } from 'lucide-react';
import { ViewProps } from '@/lib/types';
import { MOCK_BRANDING, MOCK_SUBSCRIPTION } from '@/repos';

const Settings: React.FC<ViewProps> = ({ onShowToast }) => {
  const [activeTab, setActiveTab] = useState<'branding' | 'subscription'>('branding');
  const [primaryColor, setPrimaryColor] = useState<string>(MOCK_BRANDING.primaryColor);

  return (
    <div className="space-y-6 animate-fade-in pb-10">
        
        {/* Header */}
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-2xl font-semibold text-emerald-950 font-serif">Settings</h1>
                <p className="text-stone-500 mt-1">Manage your white-label configuration and billing.</p>
            </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-stone-200">
            <button 
                onClick={() => setActiveTab('branding')}
                className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
                    activeTab === 'branding' 
                    ? 'border-emerald-600 text-emerald-800' 
                    : 'border-transparent text-stone-400 hover:text-stone-600'
                }`}
            >
                <Palette className="w-4 h-4" /> Branding
            </button>
            <button 
                onClick={() => setActiveTab('subscription')}
                className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
                    activeTab === 'subscription' 
                    ? 'border-emerald-600 text-emerald-800' 
                    : 'border-transparent text-stone-400 hover:text-stone-600'
                }`}
            >
                <CreditCard className="w-4 h-4" /> Subscription
            </button>
        </div>

        {/* Content */}
        <div className="bg-white border border-stone-100 rounded-3xl p-8 min-h-[500px] shadow-soft">
            
            {activeTab === 'branding' && (
                <div className="max-w-2xl space-y-8 animate-fade-in">
                    <div>
                        <h2 className="text-lg font-bold text-stone-800 mb-1 font-serif">Agency Identity</h2>
                        <p className="text-sm text-stone-500">Customize how the platform looks to your team and clients.</p>
                    </div>

                    <div className="space-y-6">
                        {/* Name & Slogan */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-stone-700">Agency Name</label>
                                <input
                                    type="text"
                                    defaultValue={MOCK_BRANDING.agencyName}
                                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-stone-800 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 transition-all shadow-inner"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-stone-700">Slogan / Tagline</label>
                                <input
                                    type="text"
                                    defaultValue={MOCK_BRANDING.slogan}
                                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-stone-800 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 transition-all shadow-inner"
                                />
                            </div>
                        </div>

                        {/* Primary Color */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-stone-700">Primary Brand Color</label>
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <input 
                                        type="color" 
                                        value={primaryColor}
                                        onChange={(e) => setPrimaryColor(e.target.value)}
                                        className="w-12 h-12 rounded-lg cursor-pointer border-none bg-transparent"
                                    />
                                    <div 
                                        className="absolute inset-0 rounded-lg pointer-events-none border border-stone-200 ring-2 ring-white shadow-sm" 
                                        style={{ backgroundColor: primaryColor }}
                                    ></div>
                                </div>
                                <span className="text-sm text-stone-500 font-mono">{primaryColor}</span>
                            </div>
                            <p className="text-xs text-stone-400">This color will replace the system accent color.</p>
                        </div>

                        {/* Logo Upload */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-stone-700">Agency Logo</label>
                            <div className="border-2 border-dashed border-stone-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:border-emerald-300 hover:bg-emerald-50 transition-all cursor-pointer group">
                                <div className="p-3 bg-stone-50 rounded-full mb-3 group-hover:bg-white transition-colors">
                                    <UploadCloud className="w-6 h-6 text-stone-400 group-hover:text-emerald-600" />
                                </div>
                                <p className="text-sm text-stone-600 font-medium">Click to upload or drag and drop</p>
                                <p className="text-xs text-stone-400 mt-1">SVG, PNG or JPG (max 2MB)</p>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-stone-100 flex justify-end">
                            <button 
                                onClick={() => onShowToast("✅ Branding settings saved", "success")}
                                className="bg-stone-900 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-emerald-700 transition-colors shadow-lg shadow-stone-200"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'subscription' && (
                <div className="max-w-2xl space-y-8 animate-fade-in">
                     <div>
                        <h2 className="text-lg font-bold text-stone-800 mb-1 font-serif">Subscription Plan</h2>
                        <p className="text-sm text-stone-500">Manage your billing tier and payment methods.</p>
                    </div>

                    <div className="bg-gradient-to-br from-stone-800 to-stone-900 border border-stone-700 rounded-3xl p-6 relative overflow-hidden text-white shadow-xl">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                        
                        <div className="flex items-center justify-between relative z-10">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <Crown className="w-5 h-5 text-amber-400" />
                                    <span className="text-sm font-bold text-amber-400 uppercase tracking-wider">Current Plan</span>
                                </div>
                                <h3 className="text-2xl font-bold font-serif">{MOCK_SUBSCRIPTION.tier}</h3>
                                <p className="text-sm text-stone-400 mt-1">Includes 5 AI Agents, Unlimited SOPs, and Priority Support.</p>
                            </div>
                            <div className="text-right">
                                <span className="text-3xl font-bold">€{MOCK_SUBSCRIPTION.monthlyPrice}</span>
                                <span className="text-stone-400">/mo</span>
                            </div>
                        </div>

                        <div className="mt-8 flex gap-4">
                            <button 
                                onClick={() => onShowToast("🚀 Upgrading to Tier 3...", "success")}
                                className="flex-1 bg-white text-stone-900 px-4 py-2.5 rounded-xl font-bold hover:bg-emerald-50 transition-colors"
                            >
                                Upgrade Plan
                            </button>
                            <button className="px-4 py-2.5 rounded-xl font-medium text-stone-300 hover:text-white border border-stone-600 hover:bg-stone-700 transition-colors">
                                Manage Billing
                            </button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-stone-700">Payment Method</h3>
                        <div className="flex items-center justify-between p-4 border border-stone-200 rounded-xl bg-stone-50">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white rounded-lg border border-stone-100 shadow-sm">
                                    <CreditCard className="w-5 h-5 text-stone-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-stone-800">{MOCK_SUBSCRIPTION.paymentMethod.brand} ending in {MOCK_SUBSCRIPTION.paymentMethod.last4}</p>
                                    <p className="text-xs text-stone-500">Expires {MOCK_SUBSCRIPTION.paymentMethod.expiry}</p>
                                </div>
                            </div>
                            <button className="text-xs font-bold text-emerald-600 hover:text-emerald-700">
                                Edit
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    </div>
  );
};

export default Settings;