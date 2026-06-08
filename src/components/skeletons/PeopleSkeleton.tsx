import React from 'react';

const SkeletonBar = ({ className }: { className: string }) => (
  <div className={`bg-stone-200 animate-pulse rounded ${className}`} />
);

export default function PeopleSkeleton() {
  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <SkeletonBar className="h-7 w-48" />
          <SkeletonBar className="h-4 w-72" />
        </div>
        <SkeletonBar className="h-8 w-40 rounded-lg" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="bg-white border border-stone-200 p-6 rounded-3xl space-y-4">
            <div className="flex items-center gap-4">
              <SkeletonBar className="h-14 w-14 rounded-2xl" />
              <div className="space-y-2 flex-1">
                <SkeletonBar className="h-4 w-3/4" />
                <SkeletonBar className="h-3 w-1/2" />
              </div>
            </div>
            <SkeletonBar className="h-2 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
