import React from 'react';
import { BookOpen } from 'lucide-react';

export default function EmptySopLibrary() {
  return (
    <div className="flex flex-col items-center justify-center h-96 text-stone-400">
      <div className="p-4 bg-stone-50 rounded-full mb-4">
        <BookOpen className="w-10 h-10 text-stone-300" />
      </div>
      <p className="text-lg font-serif italic text-stone-600">Library is bare</p>
      <p className="text-sm mt-2">No procedures authored yet. Add your first SOP.</p>
    </div>
  );
}
