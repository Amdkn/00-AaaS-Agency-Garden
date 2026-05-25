"use client";

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import AiPanel from '@/components/AiPanel';
import Dashboard from '@/components/views/Dashboard';
import SopLibrary from '@/components/views/SopLibrary';
import Tasks from '@/components/views/Tasks';
import Growth from '@/components/views/Growth';
import Marketplace from '@/components/views/Marketplace';
import Sales from '@/components/views/Sales';
import Finance from '@/components/views/Finance';
import Clients from '@/components/views/Clients';
import People from '@/components/views/People';
import Legal from '@/components/views/Legal';
import ItData from '@/components/views/ItData';
import Settings from '@/components/views/Settings';
import Toast from '@/components/Toast';
import Modal from '@/components/Modal';
import { NavView, ToastMessage } from '@/lib/types';
import { PanelRightClose, PanelRightOpen, Bell, Search, Leaf } from 'lucide-react';

export default function Home() {
  const [currentView, setCurrentView] = useState<NavView>(NavView.DASHBOARD);
  const [isAiPanelExpanded, setIsAiPanelExpanded] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Interaction State
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState<{title: string, content: React.ReactNode} | null>(null);

  // Interaction Handlers
  const handleShowToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const handleCloseToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleOpenModal = (title: string, content: React.ReactNode) => {
    setModalConfig({ title, content });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setModalConfig(null), 300); // Clear after animation
  };

  const commonProps = {
    onShowToast: handleShowToast,
    onOpenModal: handleOpenModal,
  };

  const renderView = () => {
    switch (currentView) {
      case NavView.DASHBOARD:
        return <Dashboard {...commonProps} />;
      case NavView.FINANCE:
        return <Finance {...commonProps} />;
      case NavView.CLIENTS:
        return <Clients {...commonProps} />;
      case NavView.PEOPLE:
        return <People />; 
      case NavView.LEGAL:
        return <Legal {...commonProps} />;
      case NavView.SOP_LIBRARY:
        return <SopLibrary {...commonProps} />;
      case NavView.TASKS:
        return <Tasks {...commonProps} />;
      case NavView.GROWTH:
        return <Growth {...commonProps} />;
      case NavView.SALES:
        return <Sales {...commonProps} />;
      case NavView.MARKETPLACE:
        return <Marketplace {...commonProps} />;
      case NavView.IT_DATA:
        return <ItData />;
      case NavView.SETTINGS:
        return <Settings {...commonProps} />;
      default:
        return (
            <div className="flex flex-col items-center justify-center h-96 text-solar-muted">
                <Leaf className="w-12 h-12 mb-4 text-emerald-200" />
                <p className="text-lg font-serif italic text-emerald-900">Module Sprouting...</p>
                <p className="text-sm mt-2">This section of the garden is being cultivated.</p>
            </div>
        );
    }
  };

  const getPageTitle = (view: NavView) => {
      return view.charAt(0) + view.slice(1).toLowerCase().replace('_', ' ');
  };

  return (
    <div className="min-h-screen bg-stone-50 text-solar-text font-sans flex overflow-hidden">
      
      {/* 1. Left Sidebar (Fixed) */}
      <Sidebar 
        currentView={currentView} 
        onChangeView={setCurrentView} 
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      
      {/* 2. Main Content Area (Fluid) */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out ${isSidebarOpen ? 'ml-64' : 'ml-24'} ${isAiPanelExpanded ? 'mr-80' : 'mr-24'} bg-stone-50`}>
        
        {/* Top Header - Glassmorphism */}
        <header className="h-20 sticky top-0 z-30 flex items-center justify-between px-8 glass-panel m-4 rounded-2xl shadow-sm">
            
            {/* Context / Breadcrumb */}
            <div className="flex items-center">
                <span className="text-solar-muted font-medium mr-2 text-sm">Garden</span>
                <span className="text-emerald-300 mr-2">/</span>
                <h1 className="text-emerald-900 font-serif font-bold text-xl tracking-tight">{getPageTitle(currentView)}</h1>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4">
                <div className="relative hidden md:block group">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 group-hover:text-emerald-600 transition-colors" />
                    <input 
                        type="text" 
                        placeholder="Search the ecosystem..." 
                        className="bg-white/50 border border-stone-200 rounded-full pl-9 pr-4 py-2 text-sm text-stone-700 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 w-56 transition-all hover:bg-white"
                    />
                </div>
                
                <button className="text-stone-400 hover:text-emerald-700 transition-colors relative p-2 rounded-full hover:bg-emerald-50">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-full border border-white"></span>
                </button>

                <div className="h-6 w-px bg-stone-200 mx-2"></div>

                <button 
                    onClick={() => setIsAiPanelExpanded(!isAiPanelExpanded)}
                    className={`flex items-center space-x-2 text-xs font-medium px-4 py-2 rounded-full border transition-all shadow-sm ${
                        isAiPanelExpanded 
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-200' 
                            : 'bg-white text-stone-600 border-stone-200 hover:text-emerald-700 hover:border-emerald-200'
                    }`}
                >
                    {isAiPanelExpanded ? <PanelRightClose className="w-4 h-4" /> : <PanelRightOpen className="w-4 h-4" />}
                    <span className="hidden sm:inline font-serif italic">Companion</span>
                </button>
            </div>
        </header>

        {/* View Content */}
        <main className="flex-1 px-8 pb-8 overflow-y-auto">
             <div className="max-w-6xl mx-auto">
                {renderView()}
             </div>
        </main>
      </div>
      
      {/* 3. Right Sidebar (Collapsible Dock) */}
      <AiPanel 
        isExpanded={isAiPanelExpanded} 
        onToggle={() => setIsAiPanelExpanded(!isAiPanelExpanded)} 
        onShowToast={handleShowToast}
      />

      {/* 4. Global Overlays */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end pointer-events-none">
        <div className="pointer-events-auto">
             {toasts.map(toast => (
                <Toast key={toast.id} toast={toast} onClose={handleCloseToast} />
             ))}
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        title={modalConfig?.title || ''}
      >
          {modalConfig?.content}
      </Modal>
      
    </div>
  );
}
