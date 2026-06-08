import React from 'react';
import { TrendingUp } from 'lucide-react';

export default function EmptySales() {
  return (
    <div className="flex flex-col items-center justify-center h-96 text-stone-400">
      <div className="p-4 bg-stone-50 rounded-full mb-4">
        <TrendingUp className="w-10 h-10 text-stone-300" />
      </div>
      <p className="text-lg font-serif italic text-stone-600">Sales sanctum is quiet</p>
      <p className="text-sm mt-2">No deals in motion. Open a new conversation.</p>
    </div>
  );
}
