import React from 'react';
import { TrendingUp } from 'lucide-react';

export default function EmptyGrowth() {
  return (
    <div className="flex flex-col items-center justify-center h-96 text-stone-400">
      <div className="p-4 bg-stone-50 rounded-full mb-4">
        <TrendingUp className="w-10 h-10 text-stone-300" />
      </div>
      <p className="text-lg font-serif italic text-stone-600">Pipeline is empty</p>
      <p className="text-sm mt-2">No leads in motion. Add your first prospect to start the flow.</p>
    </div>
  );
}
