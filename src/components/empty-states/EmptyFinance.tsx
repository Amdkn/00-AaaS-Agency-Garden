import React from 'react';
import { CreditCard } from 'lucide-react';

export default function EmptyFinance() {
  return (
    <div className="flex flex-col items-center justify-center h-96 text-stone-400">
      <div className="p-4 bg-stone-50 rounded-full mb-4">
        <CreditCard className="w-10 h-10 text-stone-300" />
      </div>
      <p className="text-lg font-serif italic text-stone-600">No transactions yet</p>
      <p className="text-sm mt-2">Your financial ledger is clear. Create your first invoice.</p>
    </div>
  );
}
