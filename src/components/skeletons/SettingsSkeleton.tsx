import React from 'react';

const SkeletonBar = ({ className }: { className: string }) => (
  <div className={`bg-stone-200 animate-pulse rounded ${className}`} />
);

export default function SettingsSkeleton() {
  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="space-y-2">
        <SkeletonBar className="h-7 w-32" />
        <SkeletonBar className="h-4 w-72" />
      </div>
      <div className="flex gap-6 border-b border-stone-200 pb-3">
        <SkeletonBar className="h-6 w-24" />
        <SkeletonBar className="h-6 w-32" />
      </div>
      <div className="bg-white border border-stone-100 rounded-3xl p-8 min-h-[500px] space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <SkeletonBar className="h-4 w-28" />
            <SkeletonBar className="h-10 w-full rounded-xl" />
          </div>
          <div className="space-y-2">
            <SkeletonBar className="h-4 w-28" />
            <SkeletonBar className="h-10 w-full rounded-xl" />
          </div>
        </div>
        <SkeletonBar className="h-32 w-full rounded-2xl" />
      </div>
    </div>
  );
}
