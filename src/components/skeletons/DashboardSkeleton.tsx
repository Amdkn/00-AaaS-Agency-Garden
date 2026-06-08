import React from 'react';

const SkeletonBar = ({ className }: { className: string }) => (
  <div className={`bg-stone-200 animate-pulse rounded ${className}`} />
);

export default function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <div className="flex items-center justify-between mb-6">
        <SkeletonBar className="h-7 w-40" />
        <SkeletonBar className="h-5 w-28" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-stone-100 space-y-4">
            <SkeletonBar className="h-4 w-20" />
            <SkeletonBar className="h-8 w-24" />
            <SkeletonBar className="h-3 w-32" />
          </div>
        ))}
      </div>
    </div>
  );
}
