import React from 'react';

interface MobileContainerProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  urgentTaskCount: number;
  showNav?: boolean;
  bottomNav?: React.ReactNode;
  sideDrawer?: React.ReactNode;
}

export const MobileContainer: React.FC<MobileContainerProps> = ({
  children,
  showNav = true,
  bottomNav,
  sideDrawer,
}) => {
  return (
    <div className="h-dvh max-h-dvh w-full bg-[#EAF1FC] flex justify-center overflow-hidden">
      {/* Real Mobile App Viewport (Stationary viewport, scroll restricted to main content) */}
      <div className="w-full max-w-[448px] h-dvh max-h-dvh flex flex-col relative bg-gradient-to-b from-[#EAF1FC] via-[#F2F6FE] to-[#F7FAFF] shadow-sm overflow-hidden select-none">
        
        {/* Scrollable Screen Content Container (ONLY this scrolls) */}
        <main className={`flex-1 overflow-y-auto no-scrollbar ${showNav ? 'pb-24' : 'pb-6'} pt-safe`}>
          {children}
        </main>

        {/* Floating Pill Dock Navigation (Stationary at bottom) */}
        {showNav && bottomNav && (
          <div className="absolute bottom-4 left-4 right-4 z-40 pointer-events-auto">
            {bottomNav}
          </div>
        )}

        {/* Global Persistent Side Slide Chatbot (Stationary at right edge) */}
        {sideDrawer}
      </div>
    </div>
  );
};
