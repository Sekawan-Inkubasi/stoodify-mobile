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
    <div className={`h-dvh max-h-dvh w-full ${showNav ? 'bg-[#EAF1FC]' : 'bg-white'} flex justify-center overflow-hidden`}>
      {/* Real Mobile App Viewport (Stationary viewport, scroll restricted to main content) */}
      <div className={`w-full max-w-[448px] h-dvh max-h-dvh flex flex-col relative ${showNav ? 'bg-gradient-to-b from-[#EAF1FC] via-[#F2F6FE] to-[#F7FAFF] shadow-sm' : 'bg-white'} overflow-hidden select-none`}>
        
        {/* Scrollable Screen Content Container (ONLY this scrolls) */}
        <main className={`flex-1 overflow-y-auto no-scrollbar flex flex-col ${showNav ? 'pb-24 pt-safe' : 'pb-0'}`}>
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
