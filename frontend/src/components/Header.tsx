import React, { useState } from 'react';
import { UserRole } from '../types';

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  unreadCount: number;
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
  isMobileFrame: boolean;
  onToggleFrame: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  activeTab,
  onTabChange,
  unreadCount,
  onOpenNotifications,
  onOpenProfile,
  isMobileFrame,
  onToggleFrame,
}) => {
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const roleLabels: Record<UserRole, { label: string; badgeClass: string }> = {
    donor: { label: 'Donor', badgeClass: 'bg-[#85f8c4] text-[#002114]' },
    ngo: { label: 'NGO / Charity', badgeClass: 'bg-[#d8e2ff] text-[#001a42]' },
    volunteer: { label: 'Volunteer', badgeClass: 'bg-[#ffdbce] text-[#370e00]' },
    admin: { label: 'Admin', badgeClass: 'bg-[#dae2fd] text-[#131b2e]' },
  };

  const navLinks = [
    { id: 'landing', label: 'Home', icon: 'home' },
    { id: 'nearby', label: 'Explore Lots', icon: 'near_me' },
    { id: 'activity', label: 'Courier Missions', icon: 'assignment', badge: '1 Live' },
    { id: 'impact', label: 'Impact & Audits', icon: 'insights' },
    { id: 'admin', label: 'Admin Portal', icon: 'admin_panel_settings' },
  ];

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-[#faf8ff]/90 backdrop-blur-xl pt-safe shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-[#eaedff]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand + Role Switcher */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={() => onTabChange('landing')}
            className="flex items-center gap-2.5 text-left cursor-pointer group"
          >
            <img
              alt="NourishLink Brand Mark"
              className="h-8 w-auto object-contain flex-shrink-0 group-hover:scale-105 transition-transform"
              src="https://lh3.googleusercontent.com/aida/AEtjO1W1VAt5Ktkx-NqTB_3yxr9kogOQ9WYyrjK7ShdX3G6aXv3qvn6FehfdB0F4qYhKE7bRIjtYwjqDO3L0QB-SLKD38wOA79XakR-9agGLLeE6qJURA9nVyEzKRNZBt0csQapi6jsjh_b-wMrIq-zn9LgyAPltYGmccdf4DF9BerVWYXy1YzGwStpRtAfkCBRILl3pApNVgOFY8xkvjIeMA9nPgDo5v0zw1lhdwJo7NWOX25gPh3tEMxEt7vk"
            />
            <div className="flex flex-col min-w-0">
              <span className="font-extrabold text-base text-[#131b2e] tracking-tight flex items-center gap-1">
                NourishLink
              </span>
              <span className="hidden sm:inline text-[10px] font-semibold text-[#006948] tracking-wide uppercase">
                Surplus Food Rescue Network
              </span>
            </div>
          </button>

          {/* Role Switcher Pill */}
          <div className="relative ml-1">
            <button
              type="button"
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              aria-expanded={roleMenuOpen}
              aria-label="Switch User Perspective"
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold text-xs ${roleLabels[currentRole].badgeClass} hover:opacity-90 active:scale-95 transition-all cursor-pointer shadow-2xs`}
            >
              <span className="truncate max-w-[85px] sm:max-w-none">{roleLabels[currentRole].label}</span>
              <span className="material-symbols-outlined text-[14px]">expand_more</span>
            </button>

            {roleMenuOpen && (
              <div className="absolute left-0 top-full mt-1.5 w-52 bg-white rounded-xl shadow-xl border border-[#dae2fd] p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#6d7a72]">
                  Switch Perspective
                </div>
                {(['donor', 'ngo', 'volunteer', 'admin'] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => {
                      onRoleChange(r);
                      setRoleMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                      currentRole === r
                        ? 'bg-[#eaedff] text-[#006948]'
                        : 'text-[#131b2e] hover:bg-[#f2f3ff]'
                    }`}
                  >
                    <span>{roleLabels[r].label}</span>
                    {currentRole === r && (
                      <span className="material-symbols-outlined text-[16px] text-[#006948]">check</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Center: Desktop Navigation Bar */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                type="button"
                onClick={() => onTabChange(link.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#006948] text-white shadow-sm'
                    : 'text-[#3d4a42] hover:text-[#131b2e] hover:bg-[#eaedff]'
                }`}
              >
                <span
                  className="material-symbols-outlined text-[18px]"
                  style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {link.icon}
                </span>
                <span>{link.label}</span>
                {link.badge && (
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ml-0.5 ${
                      isActive ? 'bg-white text-[#006948]' : 'bg-[#fd651e] text-white'
                    }`}
                  >
                    {link.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right: Primary CTAs & Profile Tools */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Post Surplus Button on Desktop */}
          <button
            type="button"
            onClick={() => onTabChange('donate')}
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#006948] hover:bg-[#00855d] text-white text-xs font-bold shadow-sm active:scale-95 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>Post Donation</span>
          </button>

          {/* View Mode Toggle: Desktop Full vs Phone Preview Frame */}
          <button
            type="button"
            onClick={onToggleFrame}
            title={isMobileFrame ? 'Switch to Full Website View' : 'Switch to Phone View'}
            className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#eaedff] hover:bg-[#dae2fd] text-[#131b2e] text-xs font-semibold transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">
              {isMobileFrame ? 'desktop_windows' : 'smartphone'}
            </span>
            <span className="text-[11px]">{isMobileFrame ? 'Desktop' : 'Phone'}</span>
          </button>

          {/* Notifications Button */}
          <button
            type="button"
            aria-label="Notifications"
            onClick={onOpenNotifications}
            className="relative w-10 h-10 flex items-center justify-center rounded-full text-[#3d4a42] hover:text-[#131b2e] hover:bg-[#eaedff] active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-[#fd651e] border-2 border-[#faf8ff] animate-pulse" />
            )}
          </button>

          {/* Profile Trigger */}
          <button
            type="button"
            aria-label="Profile and settings"
            onClick={onOpenProfile}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:opacity-90 active:scale-95 transition-all"
          >
            <img
              alt="Profile avatar"
              className="w-8 h-8 rounded-full object-cover ring-2 ring-[#006948]/20"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCfMwNhRscp3--tcshlA3J3e_6U2-lDj1ipX6rdA-jzWCBRSQ-7DAFkfkc1C7afbwhF7kV_naBufMXZ5HY_t_Ss2Y6187vTaYOMoxpB2dfBwM6DHrHI4Oe13fVS7l3MIqS0atmd1vxko1_kUS2Gqc-70ZLOle0b2_oL6CP9RoRk3Ej4aBOfKAm12TM0bfvXyBZTOwCu5VMHsmRDw7dVRUVGrDxz3KW8FY9-HDp2flUtPgX_jUKo5rTQ"
            />
          </button>
        </div>
      </div>
    </header>
  );
};
