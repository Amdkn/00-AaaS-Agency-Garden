import React from 'react';
import { Users } from 'lucide-react';

export default function EmptyClients() {
  return (
    <div className="flex flex-col items-center justify-center h-96 text-stone-400">
      <div className="p-4 bg-stone-50 rounded-full mb-4">
        <Users className="w-10 h-10 text-stone-300" />
      </div>
      <p className="text-lg font-serif italic text-stone-600">No active partners yet</p>
      <p className="text-sm mt-2">Your client garden is freshly tilled. Plant your first seed.</p>
    </div>
  );
}
