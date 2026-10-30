import React from 'react';

// Base Shimmer block with subtle animation
export const SkeletonBox: React.FC<{
  className?: string;
  style?: React.CSSProperties;
}> = ({ className = '', style }) => (
  <div 
    aria-hidden="true"
    className={`bg-slate-200/80 animate-pulse rounded-xl ${className}`}
    style={style}
  />
);

// Skeleton for Home Screen: mirrors header, deck, quick actions, workload strip, priority card, dual cards, and tasks feed
export const HomeSkeleton: React.FC = () => {
  return (
    <div className="space-y-4 px-4 pt-3 pb-8" aria-busy="true" aria-label="Memuat beranda">
      {/* 1. Header user info skeleton */}
      <div className="flex items-center justify-between pt-1 pb-1">
        <div className="flex items-center gap-3">
          <SkeletonBox className="w-11 h-11 rounded-full shrink-0" />
          <div className="space-y-1.5">
            <SkeletonBox className="w-28 h-4 rounded-md" />
            <SkeletonBox className="w-20 h-3 rounded-md" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <SkeletonBox className="w-10 h-10 rounded-full" />
          <SkeletonBox className="w-10 h-10 rounded-full" />
        </div>
      </div>

      {/* 2. Signature Study Deck card */}
      <div className="rounded-[28px] p-5 bg-linear-to-br from-blue-600/30 to-indigo-600/30 border border-blue-200/40 shadow-xs relative overflow-hidden">
        <div className="grid grid-cols-2 gap-3 pb-4 mb-4 border-b border-white/20">
          <div className="space-y-2">
            <SkeletonBox className="w-16 h-3 bg-white/30 rounded-md" />
            <SkeletonBox className="w-24 h-7 bg-white/40 rounded-lg" />
          </div>
          <div className="border-l border-white/20 pl-4 space-y-2">
            <SkeletonBox className="w-20 h-3 bg-white/30 rounded-md" />
            <SkeletonBox className="w-24 h-7 bg-white/40 rounded-lg" />
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <SkeletonBox className="flex-1 h-10 bg-white/40 rounded-full" />
          <SkeletonBox className="flex-1 h-10 bg-white/30 rounded-full" />
        </div>
      </div>

      {/* 3. Quick Action Grid (4 buttons) */}
      <div className="grid grid-cols-4 gap-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-2xl p-2.5 border border-white shadow-xs flex flex-col items-center gap-1.5">
            <SkeletonBox className="w-10 h-10 rounded-2xl" />
            <SkeletonBox className="w-12 h-2.5 rounded-md" />
            <SkeletonBox className="w-10 h-2 rounded-md" />
          </div>
        ))}
      </div>

      {/* 4. Smart Workload Insight strip */}
      <div className="bg-white rounded-2xl p-3.5 border border-white shadow-xs flex items-center gap-3">
        <SkeletonBox className="w-9 h-9 rounded-xl shrink-0" />
        <div className="flex-1 space-y-1.5 min-w-0">
          <SkeletonBox className="w-32 h-3.5 rounded-md" />
          <SkeletonBox className="w-48 h-2.5 rounded-md" />
        </div>
        <SkeletonBox className="w-12 h-6 rounded-full shrink-0" />
      </div>

      {/* 5. Priority Recommendation card */}
      <div className="bg-white rounded-[28px] p-5 border border-white shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <SkeletonBox className="w-36 h-6 rounded-full" />
          <SkeletonBox className="w-9 h-9 rounded-full" />
        </div>
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-1.5">
              <SkeletonBox className="w-14 h-4 rounded-full" />
              <SkeletonBox className="w-24 h-3 rounded-md" />
            </div>
            <SkeletonBox className="w-44 h-5 rounded-md" />
          </div>
          <SkeletonBox className="w-13 h-13 rounded-2xl shrink-0" />
        </div>
        <SkeletonBox className="w-full h-14 rounded-2xl" />
        <div className="pt-2">
          <SkeletonBox className="w-full h-11 rounded-full" />
        </div>
      </div>

      {/* 6. Dual Accent Power Cards */}
      <div className="grid grid-cols-2 gap-3">
        {[1, 2].map((i) => (
          <div key={i} className="rounded-[26px] p-4 bg-slate-200/90 border border-slate-100 flex flex-col justify-between min-h-[165px]">
            <div className="flex items-center justify-between">
              <SkeletonBox className="w-8 h-8 rounded-full" />
              <SkeletonBox className="w-12 h-4 rounded-full" />
            </div>
            <div className="space-y-1.5 my-2">
              <SkeletonBox className="w-full h-3.5 rounded-md" />
              <SkeletonBox className="w-3/4 h-3.5 rounded-md" />
            </div>
            <div className="flex items-center gap-2 pt-1">
              <SkeletonBox className="w-5 h-5 rounded-full shrink-0" />
              <SkeletonBox className="w-20 h-3 rounded-md" />
            </div>
          </div>
        ))}
      </div>

      {/* 7. Urgent Tasks Feed */}
      <div className="space-y-2.5 pt-1">
        <div className="flex items-center justify-between px-1">
          <SkeletonBox className="w-36 h-3.5 rounded-md" />
          <SkeletonBox className="w-16 h-3.5 rounded-md" />
        </div>
        <div className="space-y-2">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-3.5 border border-white shadow-xs flex items-start gap-3">
              <SkeletonBox className="w-5 h-5 rounded-full shrink-0 mt-0.5" />
              <div className="flex-1 space-y-2 min-w-0">
                <div className="flex items-center gap-1.5">
                  <SkeletonBox className="w-14 h-4 rounded-full" />
                  <SkeletonBox className="w-16 h-4 rounded-full" />
                </div>
                <SkeletonBox className="w-48 h-3.5 rounded-md" />
                <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                  <SkeletonBox className="w-24 h-3 rounded-md" />
                  <SkeletonBox className="w-16 h-4 rounded-md" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Skeleton for Tasks Screen: header, search bar, status tabs, subject chips, task cards
export const TasksSkeleton: React.FC = () => {
  return (
    <div className="space-y-4 px-4 pt-3 pb-8" aria-busy="true" aria-label="Memuat daftar tugas">
      {/* 1. Header & Add button */}
      <div className="flex items-center justify-between pt-1 pb-1">
        <div className="space-y-1.5">
          <SkeletonBox className="w-28 h-5 rounded-md" />
          <SkeletonBox className="w-36 h-3 rounded-md" />
        </div>
        <SkeletonBox className="w-24 h-8 rounded-full" />
      </div>

      {/* 2. Search bar */}
      <SkeletonBox className="w-full h-11 rounded-full" />

      {/* 3. Status Tabs */}
      <div className="grid grid-cols-3 gap-1.5 p-1 bg-white/70 rounded-full border border-white/60">
        <SkeletonBox className="h-8 rounded-full" />
        <SkeletonBox className="h-8 rounded-full" />
        <SkeletonBox className="h-8 rounded-full" />
      </div>

      {/* 4. Subject chips */}
      <div className="flex items-center gap-1.5 overflow-x-hidden py-0.5">
        <SkeletonBox className="w-24 h-7 rounded-full shrink-0" />
        <SkeletonBox className="w-20 h-7 rounded-full shrink-0" />
        <SkeletonBox className="w-20 h-7 rounded-full shrink-0" />
        <SkeletonBox className="w-24 h-7 rounded-full shrink-0" />
      </div>

      {/* 5. Task list cards */}
      <div className="space-y-2.5">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-2xl p-4 border border-white shadow-xs space-y-3">
            <div className="flex items-start gap-3">
              <SkeletonBox className="w-5 h-5 rounded-full shrink-0 mt-0.5" />
              <div className="flex-1 space-y-2 min-w-0">
                <div className="flex items-center gap-1.5">
                  <SkeletonBox className="w-14 h-4 rounded-full" />
                  <SkeletonBox className="w-16 h-4 rounded-full" />
                </div>
                <SkeletonBox className="w-48 h-4 rounded-md" />
                <SkeletonBox className="w-full h-8 rounded-xl" />
              </div>
            </div>
            <div className="flex items-center justify-between pt-2.5 border-t border-slate-100">
              <SkeletonBox className="w-24 h-3.5 rounded-md" />
              <SkeletonBox className="w-20 h-4 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Skeleton for Calendar Screen: header, segmented switcher, day chips, schedule cards, ai recommendation card
export const CalendarSkeleton: React.FC = () => {
  return (
    <div className="space-y-4 px-4 pt-3 pb-8" aria-busy="true" aria-label="Memuat kalender">
      {/* 1. Header */}
      <div className="flex items-center justify-between pt-1 pb-1">
        <div className="space-y-1.5">
          <SkeletonBox className="w-36 h-5 rounded-md" />
          <SkeletonBox className="w-44 h-3 rounded-md" />
        </div>
        <SkeletonBox className="w-24 h-7 rounded-full" />
      </div>

      {/* Segmented switcher */}
      <div className="bg-white/80 p-1 rounded-full border border-white shadow-xs flex items-center gap-1">
        <SkeletonBox className="flex-1 h-7 rounded-full" />
        <SkeletonBox className="flex-1 h-7 rounded-full" />
      </div>

      {/* Day chips */}
      <div className="grid grid-cols-5 gap-1.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <SkeletonBox key={i} className="h-14 rounded-2xl" />
        ))}
      </div>

      {/* Daily school schedule items */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <SkeletonBox className="w-36 h-4 rounded-md" />
          <SkeletonBox className="w-28 h-4 rounded-md" />
        </div>
        <div className="space-y-2">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-3.5 border border-white shadow-xs flex items-center gap-3">
              <div className="w-20 space-y-1">
                <SkeletonBox className="w-14 h-3.5 rounded-md mx-auto" />
                <SkeletonBox className="w-10 h-2.5 rounded-md mx-auto" />
              </div>
              <div className="w-px h-8 bg-slate-100" />
              <div className="flex-1 space-y-1.5 min-w-0">
                <SkeletonBox className="w-32 h-3.5 rounded-md" />
                <div className="flex items-center gap-3">
                  <SkeletonBox className="w-16 h-3 rounded-md" />
                  <SkeletonBox className="w-20 h-3 rounded-md" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Recommendation card */}
      <div className="space-y-2 pt-1">
        <SkeletonBox className="w-48 h-4 rounded-md px-1" />
        <div className="bg-white rounded-[26px] p-4 border border-white shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <SkeletonBox className="w-32 h-5 rounded-full" />
            <SkeletonBox className="w-20 h-5 rounded-full" />
          </div>
          <SkeletonBox className="w-44 h-4 rounded-md" />
          <SkeletonBox className="w-full h-12 rounded-xl" />
          <SkeletonBox className="w-full h-10 rounded-full" />
        </div>
      </div>
    </div>
  );
};

// Skeleton for AI Plan Screen: header, chatbot banner, workload card, filter pills, study session cards
export const AIPlanSkeleton: React.FC = () => {
  return (
    <div className="space-y-4 px-4 pt-3 pb-8" aria-busy="true" aria-label="Memuat rencana AI">
      {/* 1. Header */}
      <div className="flex items-center justify-between pt-1 pb-1">
        <div className="flex items-center gap-2.5">
          <SkeletonBox className="w-10 h-10 rounded-full" />
          <div className="space-y-1.5">
            <SkeletonBox className="w-36 h-5 rounded-md" />
            <SkeletonBox className="w-44 h-3 rounded-md" />
          </div>
        </div>
        <SkeletonBox className="w-10 h-10 rounded-full" />
      </div>

      {/* 2. Banner shortcut */}
      <div className="rounded-2xl p-4 bg-gradient-to-r from-blue-600/30 to-indigo-600/30 border border-blue-200/40 space-y-2">
        <SkeletonBox className="w-40 h-3 bg-white/40 rounded-md" />
        <SkeletonBox className="w-48 h-4 bg-white/50 rounded-md" />
        <SkeletonBox className="w-32 h-7 bg-white/40 rounded-full" />
      </div>

      {/* 3. Workload balancer card */}
      <div className="bg-white rounded-[24px] p-4 border border-white shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <SkeletonBox className="w-36 h-4 rounded-md" />
          <SkeletonBox className="w-24 h-4 rounded-full" />
        </div>
        <div className="grid grid-cols-3 gap-2 pt-1">
          <SkeletonBox className="h-14 rounded-xl" />
          <SkeletonBox className="h-14 rounded-xl" />
          <SkeletonBox className="h-14 rounded-xl" />
        </div>
        <SkeletonBox className="w-full h-12 rounded-xl" />
      </div>

      {/* 4. Filter header */}
      <div className="flex items-center justify-between px-1">
        <SkeletonBox className="w-40 h-4 rounded-md" />
        <SkeletonBox className="w-32 h-6 rounded-full" />
      </div>

      {/* 5. Session cards */}
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white rounded-[26px] p-4 border border-white shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SkeletonBox className="w-7 h-7 rounded-full" />
                <SkeletonBox className="w-28 h-4 rounded-md" />
              </div>
              <SkeletonBox className="w-20 h-5 rounded-full" />
            </div>
            <SkeletonBox className="w-14 h-4 rounded-full" />
            <SkeletonBox className="w-44 h-4 rounded-md" />
            <SkeletonBox className="w-full h-12 rounded-xl" />
            <div className="flex items-center gap-2 pt-1">
              <SkeletonBox className="flex-1 h-11 rounded-full" />
              <SkeletonBox className="w-11 h-11 rounded-full shrink-0" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Skeleton for Profile Screen: header, student card, metrics cards, list menu
export const ProfileSkeleton: React.FC = () => {
  return (
    <div className="space-y-4 px-4 pt-3 pb-8" aria-busy="true" aria-label="Memuat profil">
      <div className="pt-1 pb-1 space-y-1.5">
        <SkeletonBox className="w-32 h-5 rounded-md" />
        <SkeletonBox className="w-48 h-3 rounded-md" />
      </div>

      <div className="bg-white rounded-[28px] p-5 border border-white shadow-xs space-y-4">
        <div className="flex items-center gap-3.5">
          <SkeletonBox className="w-14 h-14 rounded-full shrink-0" />
          <div className="space-y-2 flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <SkeletonBox className="w-28 h-4 rounded-md" />
              <SkeletonBox className="w-14 h-4 rounded-full" />
            </div>
            <SkeletonBox className="w-20 h-3 rounded-md" />
            <SkeletonBox className="w-24 h-2.5 rounded-md" />
          </div>
        </div>
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <SkeletonBox className="w-8 h-8 rounded-full" />
            <div className="space-y-1">
              <SkeletonBox className="w-28 h-3.5 rounded-md" />
              <SkeletonBox className="w-40 h-2.5 rounded-md" />
            </div>
          </div>
          <SkeletonBox className="w-4 h-4 rounded-md" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        <SkeletonBox className="h-20 rounded-2xl bg-white" />
        <SkeletonBox className="h-20 rounded-2xl bg-white" />
        <SkeletonBox className="h-20 rounded-2xl bg-white" />
      </div>

      <div className="bg-white rounded-[24px] p-2 border border-white shadow-xs space-y-1">
        <SkeletonBox className="w-full h-14 rounded-2xl" />
        <SkeletonBox className="w-full h-14 rounded-2xl" />
        <SkeletonBox className="w-full h-14 rounded-2xl" />
      </div>
    </div>
  );
};
