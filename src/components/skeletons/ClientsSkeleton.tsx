import React from 'react';

const SkeletonBar = ({ className }: { className: string }) => (
  <div className={`bg-stone-200 animate-pulse rounded ${className}`} />
);

export default function ClientsSkeleton() {
  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <SkeletonBar className="h-7 w-48" />
          <SkeletonBar className="h-4 w-64" />
        </div>
        <SkeletonBar className="h-10 w-32 rounded-full" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white border border-stone-100 rounded-3xl p-6 space-y-4">
            <div className="flex items-center gap-4">
              <SkeletonBar className="h-12 w-12 rounded-2xl" />
              <div className="space-y-2 flex-1">
                <SkeletonBar className="h-4 w-3/4" />
                <SkeletonBar className="h-3 w-1/2" />
              </div>
            </div>
            <SkeletonBar className="h-2 w-full" />
            <div className="flex justify-between">
              <SkeletonBar className="h-3 w-20" />
              <SkeletonBar className="h-3 w-16" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
