import React from 'react';
import { UserRole } from '../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  currentRole,
  onRoleChange,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#131b2e]/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#dae2fd] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#006948] to-[#00855d] p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              alt="User Avatar"
              className="w-12 h-12 rounded-full border-2 border-white object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCfMwNhRscp3--tcshlA3J3e_6U2-lDj1ipX6rdA-jzWCBRSQ-7DAFkfkc1C7afbwhF7kV_naBufMXZ5HY_t_Ss2Y6187vTaYOMoxpB2dfBwM6DHrHI4Oe13fVS7l3MIqS0atmd1vxko1_kUS2Gqc-70ZLOle0b2_oL6CP9RoRk3Ej4aBOfKAm12TM0bfvXyBZTOwCu5VMHsmRDw7dVRUVGrDxz3KW8FY9-HDp2flUtPgX_jUKo5rTQ"
            />
            <div>
              <h3 className="font-bold text-base leading-tight">Ananya Deshmukh</h3>
              <p className="text-xs text-[#85f8c4] flex items-center gap-1 mt-0.5">
                <span className="material-symbols-outlined text-[14px]">verified</span>
                Verified Redistribution Officer
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col gap-4">
          {/* Active Organization */}
          <div className="bg-[#faf8ff] p-3 rounded-xl border border-[#eaedff]">
            <span className="text-[11px] font-bold text-[#6d7a72] uppercase tracking-wider block">
              Organization Context
            </span>
            <div className="flex items-center justify-between mt-1">
              <div>
                <p className="font-bold text-sm text-[#131b2e]">NourishLink Core Network</p>
                <p className="text-xs text-[#3d4a42]">Bengaluru & Hyderabad Metro Hubs</p>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#85f8c4] text-[#002114] text-[10px] font-bold">
                Tier 1 Verified
              </span>
            </div>
          </div>

          {/* Perspective Quick Switch */}
          <div>
            <label className="text-xs font-bold text-[#131b2e] mb-2 block">
              Active User Perspective
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { role: 'donor' as UserRole, label: 'Donor (Kitchen/Hotel)', icon: 'restaurant' },
                { role: 'ngo' as UserRole, label: 'NGO / Charity', icon: 'foundation' },
                { role: 'volunteer' as UserRole, label: 'Volunteer Courier', icon: 'two_wheeler' },
                { role: 'admin' as UserRole, label: 'Admin / Auditor', icon: 'shield_person' },
              ].map((item) => (
                <button
                  key={item.role}
                  type="button"
                  onClick={() => onRoleChange(item.role)}
                  className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all ${
                    currentRole === item.role
                      ? 'border-[#006948] bg-[#f5fff7] text-[#006948] font-bold ring-2 ring-[#006948]/20'
                      : 'border-[#eaedff] bg-white text-[#3d4a42] hover:bg-[#faf8ff]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                  <span className="text-xs">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Legal Protection Card */}
          <div className="p-3 rounded-xl bg-[#faf8ff] border border-[#eaedff] flex items-start gap-2.5">
            <span className="material-symbols-outlined text-[#006948] text-[20px] mt-0.5">
              gavel
            </span>
            <div className="text-xs">
              <span className="font-bold text-[#131b2e] block">Good Samaritan Food Act</span>
              <p className="text-[#3d4a42] text-[11px] mt-0.5">
                All certified food donations and volunteer handlers are legally protected against civil liability when acting in good faith.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 bg-[#eaedff] hover:bg-[#dae2fd] text-[#131b2e] font-bold text-xs rounded-xl transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
