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
    <div className="min-h-dvh w-full bg-[#EAF1FC] flex justify-center">
      {/* Real Mobile App Viewport (No Fake Bezel Ring, No Fake Notch) */}
      <div className="w-full max-w-[448px] min-h-dvh flex flex-col relative bg-gradient-to-b from-[#EAF1FC] via-[#F2F6FE] to-[#F7FAFF] shadow-sm overflow-x-hidden">
        
        {/* Scrollable Screen Content Container */}
        <main className={`flex-1 overflow-y-auto no-scrollbar ${showNav ? 'pb-24' : 'pb-6'} pt-safe`}>
          {children}
        </main>

        {/* Floating Pill Dock Navigation */}
        {showNav && bottomNav && (
          <div className="fixed sm:absolute bottom-4 left-4 right-4 max-w-[416px] mx-auto z-40 pointer-events-auto">
            {bottomNav}
          </div>
        )}

        {/* Global Persistent Side Slide Chatbot */}
        {sideDrawer}
      </div>
    </div>
  );
};
