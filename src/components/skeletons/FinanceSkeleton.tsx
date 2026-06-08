import React from 'react';

const SkeletonBar = ({ className }: { className: string }) => (
  <div className={`bg-stone-200 animate-pulse rounded ${className}`} />
);

export default function FinanceSkeleton() {
  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <SkeletonBar className="h-7 w-52" />
          <SkeletonBar className="h-4 w-72" />
        </div>
        <SkeletonBar className="h-10 w-32 rounded-xl" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white border border-stone-100 p-6 rounded-3xl space-y-3">
            <SkeletonBar className="h-4 w-24" />
            <SkeletonBar className="h-8 w-20" />
            <SkeletonBar className="h-3 w-32" />
          </div>
        ))}
      </div>
      <div className="bg-white border border-stone-100 rounded-3xl p-6 space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between">
            <SkeletonBar className="h-4 w-32" />
            <SkeletonBar className="h-4 w-20" />
            <SkeletonBar className="h-4 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}
