import React from 'react';
import { Home, Calendar, CheckSquare, Sparkles, User } from 'lucide-react';

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  urgentTaskCount: number;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onTabChange,
  urgentTaskCount,
}) => {
  const tabs = [
    { id: 'home', label: 'Beranda', icon: Home },
    { id: 'calendar', label: 'Kalender', icon: Calendar },
    { id: 'tasks', label: 'Tugas', icon: CheckSquare, badge: urgentTaskCount > 0 ? urgentTaskCount : undefined },
    { id: 'ai-plan', label: 'Rencana AI', icon: Sparkles },
    { id: 'profile', label: 'Profil', icon: User },
  ];

  return (
    <nav className="bg-white/95 backdrop-blur-xl border border-white/80 shadow-[0_12px_36px_rgba(20,40,90,0.12)] rounded-full px-2.5 py-2 flex items-center justify-between">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`relative flex items-center justify-center transition-all duration-300 cursor-pointer ${
              isActive
                ? 'bg-[#0062FF] text-white w-12 h-10 rounded-full shadow-md shadow-blue-500/30'
                : 'text-slate-600 hover:text-slate-900 w-11 h-10 rounded-full hover:bg-slate-100/60'
            }`}
            title={tab.label}
          >
            <Icon className={`w-5 h-5 transition-transform ${isActive ? 'stroke-[2.4px]' : 'stroke-[1.8px]'}`} />

            {/* Notification Badge on Tasks */}
            {tab.badge && !isActive && (
              <span className="absolute top-1.5 right-2 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
            )}
            {tab.badge && isActive && (
              <span className="absolute -top-1 -right-1 bg-amber-400 text-slate-900 text-[9px] font-bold px-1 rounded-full ring-2 ring-blue-600">
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
};
