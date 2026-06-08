import React from 'react';

const SkeletonBar = ({ className }: { className: string }) => (
  <div className={`bg-stone-200 animate-pulse rounded ${className}`} />
);

export default function SopLibrarySkeleton() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <SkeletonBar className="h-7 w-40" />
          <SkeletonBar className="h-4 w-72" />
        </div>
        <SkeletonBar className="h-10 w-64 rounded-full" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white border border-stone-100 rounded-3xl p-6 space-y-4">
            <SkeletonBar className="h-12 w-12 rounded-2xl" />
            <SkeletonBar className="h-5 w-3/4" />
            <SkeletonBar className="h-4 w-20" />
            <SkeletonBar className="h-10 w-full rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}
