import React from 'react';
import { Sprout } from 'lucide-react';

export default function EmptyDashboard() {
  return (
    <div className="flex flex-col items-center justify-center h-96 text-stone-400">
      <div className="p-4 bg-stone-50 rounded-full mb-4">
        <Sprout className="w-10 h-10 text-emerald-200" />
      </div>
      <p className="text-lg font-serif italic text-emerald-900">Ecosystem quiet</p>
      <p className="text-sm mt-2">No vital signs to report. Your pulse will appear here.</p>
    </div>
  );
}
