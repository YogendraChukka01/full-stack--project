import React from 'react';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  activeTaskCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  activeTaskCount = 1,
}) => {
  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-50 pb-safe bg-[#ffffff]/95 backdrop-blur-xl border-t border-[#eaedff] shadow-[0_-4px_20px_rgba(0,0,0,0.06)]"
      role="navigation"
      aria-label="Mobile Bottom Navigation"
    >
      <div className="max-w-lg mx-auto flex items-center justify-around h-16 px-2">
        {/* Home / Landing */}
        <button
          type="button"
          onClick={() => onTabChange('landing')}
          className={`flex flex-col items-center justify-center min-w-[50px] min-h-[48px] transition-colors ${
            activeTab === 'landing'
              ? 'text-[#006948] font-bold'
              : 'text-[#3d4a42] hover:text-[#131b2e]'
          }`}
        >
          <span
            className="material-symbols-outlined text-[22px]"
            style={{
              fontVariationSettings: activeTab === 'landing' ? "'FILL' 1" : "'FILL' 0",
            }}
          >
            home
          </span>
          <span className="text-[10px] font-semibold tracking-wide mt-0.5">Home</span>
        </button>

        {/* Nearby */}
        <button
          type="button"
          onClick={() => onTabChange('nearby')}
          className={`flex flex-col items-center justify-center min-w-[50px] min-h-[48px] transition-colors ${
            activeTab === 'nearby'
              ? 'text-[#006948] font-bold'
              : 'text-[#3d4a42] hover:text-[#131b2e]'
          }`}
        >
          <span
            className="material-symbols-outlined text-[22px]"
            style={{
              fontVariationSettings: activeTab === 'nearby' ? "'FILL' 1" : "'FILL' 0",
            }}
          >
            near_me
          </span>
          <span className="text-[10px] font-semibold tracking-wide mt-0.5">Explore</span>
        </button>

        {/* Center Floating Action Button (Donate Post) */}
        <div className="relative -top-3 flex items-center justify-center">
          <button
            type="button"
            onClick={() => onTabChange('donate')}
            aria-label="Post Surplus Food Donation"
            className={`flex flex-col items-center justify-center w-12 h-12 rounded-full bg-[#006948] hover:bg-[#00855d] text-white shadow-[0_8px_16px_-4px_rgba(0,105,72,0.4)] active:scale-95 transition-all ${
              activeTab === 'donate' ? 'ring-4 ring-[#85f8c4]' : ''
            }`}
          >
            <span className="material-symbols-outlined text-[26px]">add</span>
            <span className="sr-only">Post Food Donation</span>
          </button>
        </div>

        {/* Activity */}
        <button
          type="button"
          onClick={() => onTabChange('activity')}
          className={`relative flex flex-col items-center justify-center min-w-[50px] min-h-[48px] transition-colors ${
            activeTab === 'activity'
              ? 'text-[#006948] font-bold'
              : 'text-[#3d4a42] hover:text-[#131b2e]'
          }`}
        >
          <div className="relative">
            <span
              className="material-symbols-outlined text-[22px]"
              style={{
                fontVariationSettings: activeTab === 'activity' ? "'FILL' 1" : "'FILL' 0",
              }}
            >
              assignment
            </span>
            {activeTaskCount > 0 && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#fd651e] animate-ping" />
            )}
          </div>
          <span className="text-[10px] font-semibold tracking-wide mt-0.5">Missions</span>
        </button>

        {/* Impact */}
        <button
          type="button"
          onClick={() => onTabChange('impact')}
          className={`flex flex-col items-center justify-center min-w-[50px] min-h-[48px] transition-colors ${
            activeTab === 'impact'
              ? 'text-[#006948] font-bold'
              : 'text-[#3d4a42] hover:text-[#131b2e]'
          }`}
        >
          <span
            className="material-symbols-outlined text-[22px]"
            style={{
              fontVariationSettings: activeTab === 'impact' ? "'FILL' 1" : "'FILL' 0",
            }}
          >
            bar_chart
          </span>
          <span className="text-[10px] font-semibold tracking-wide mt-0.5">Impact</span>
        </button>
      </div>
    </nav>
  );
};
