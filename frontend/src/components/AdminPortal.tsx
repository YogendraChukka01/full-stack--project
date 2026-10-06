import React, { useState } from 'react';
import { DonationItem, RescueMissionTask, VerificationAuditItem } from '../types';

interface AdminPortalProps {
  donations: DonationItem[];
  task: RescueMissionTask;
  verifications: VerificationAuditItem[];
  onResetData: () => void;
  onSimulateNewDonation: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  donations,
  task,
  verifications,
  onResetData,
  onSimulateNewDonation,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'donations' | 'system'>('overview');

  return (
    <div className="flex flex-col w-full px-4 sm:px-6 lg:px-8 gap-6 pb-28 pt-2 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-[#131b2e] text-white p-5 rounded-2xl shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#85f8c4]/20 text-[#85f8c4] flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-[28px]">shield_person</span>
          </div>
          <div>
            <h1 className="font-bold text-lg sm:text-xl tracking-tight">Platform Operations Console</h1>
            <p className="text-xs text-[#85f8c4]">Central Safe Food & Dispatch Governance • Live Network Monitor</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-[#006948] text-white font-mono text-xs font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#85f8c4] animate-pulse" />
            NODE HEALTHY
          </span>
          <span className="text-xs text-white/70 hidden md:inline">Region: asia-south1</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-[#e2e7ff] p-1 rounded-xl gap-1 max-w-md">
        {[
          { id: 'overview' as const, label: 'Audit KPI & Live Tasks' },
          { id: 'donations' as const, label: `All Lots (${donations.length})` },
          { id: 'system' as const, label: 'Data & Sandbox' },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActiveTab(t.id)}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === t.id
                ? 'bg-white text-[#006948] shadow-xs'
                : 'text-[#3d4a42] hover:text-[#131b2e]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Overview */}
      {activeTab === 'overview' && (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-[#eaedff] shadow-sm flex flex-col justify-between">
              <span className="text-xs font-semibold text-[#6d7a72]">Verified Compliance Rate</span>
              <span className="text-3xl font-extrabold text-[#006948] my-2">98.4%</span>
              <span className="text-xs text-[#3d4a42] flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-[#006948]">verified</span>
                FSSAI / 80G Certified
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#eaedff] shadow-sm flex flex-col justify-between">
              <span className="text-xs font-semibold text-[#6d7a72]">Active Dispatches</span>
              <span className="text-3xl font-extrabold text-[#2170e4] my-2">1 Live</span>
              <span className="text-xs text-[#3d4a42]">Task #{task.id} (Courier En Route)</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#eaedff] shadow-sm flex flex-col justify-between">
              <span className="text-xs font-semibold text-[#6d7a72]">Pending Entity Audits</span>
              <span className="text-3xl font-extrabold text-[#fd651e] my-2">
                {verifications.filter((v) => v.status !== 'APPROVED').length}
              </span>
              <span className="text-xs text-[#3d4a42]">Requires document review</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#eaedff] shadow-sm flex flex-col justify-between">
              <span className="text-xs font-semibold text-[#6d7a72]">Average Handover Time</span>
              <span className="text-3xl font-extrabold text-[#131b2e] my-2">34 mins</span>
              <span className="text-xs text-[#006948] flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">bolt</span>
                Target: &lt; 90 mins
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-5 rounded-2xl border border-[#eaedff] shadow-sm flex flex-col gap-3">
              <h3 className="font-bold text-sm text-[#131b2e] flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-[#006948]">directions_bike</span>
                Active Mission Monitor: #{task.id}
              </h3>
              <div className="p-4 bg-[#f2f3ff] rounded-xl text-xs space-y-2.5">
                <div className="flex justify-between items-center pb-2 border-b border-[#dae2fd]">
                  <span className="text-[#6d7a72]">Donor Kitchen:</span>
                  <span className="font-bold text-[#131b2e]">{task.donorName}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-[#dae2fd]">
                  <span className="text-[#6d7a72]">Recipient NGO:</span>
                  <span className="font-bold text-[#131b2e]">{task.recipientOrg}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-[#dae2fd]">
                  <span className="text-[#6d7a72]">Current Dispatch Status:</span>
                  <span className="font-bold text-[#006948] bg-[#85f8c4]/40 px-2.5 py-0.5 rounded-full">{task.status}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#6d7a72]">Pickup Temp Verified:</span>
                  <span className="font-bold text-[#006948]">{task.pickupCompleted ? 'Yes (64°C Safe Hot)' : 'Pending Handover'}</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#eaedff] shadow-sm flex flex-col gap-3">
              <h3 className="font-bold text-sm text-[#131b2e] flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-[#2170e4]">security</span>
                Safety Governance Check
              </h3>
              <p className="text-xs text-[#3d4a42] leading-relaxed">
                NourishLink operates under Good Samaritan Surplus Food Protection rules. All donor kitchens must verify food safety temperature logs prior to dispatch release.
              </p>
              <div className="flex items-center gap-2 p-3 bg-[#e2e7ff] rounded-xl text-xs text-[#006948] font-semibold mt-auto">
                <span className="material-symbols-outlined text-[18px]">verified_user</span>
                Zero critical food safety violations recorded this quarter.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Donations Table/Cards */}
      {activeTab === 'donations' && (
        <div className="bg-white rounded-2xl border border-[#eaedff] shadow-sm overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-[#eaedff] flex items-center justify-between">
            <div>
              <h2 className="font-bold text-sm sm:text-base text-[#131b2e]">All Registered Food Donations</h2>
              <p className="text-xs text-[#6d7a72]">Real-time audit log of surplus entries across partner organizations</p>
            </div>
            <span className="text-xs font-bold text-[#006948] bg-[#85f8c4]/30 px-3 py-1 rounded-full">
              {donations.length} Active Records
            </span>
          </div>

          <div className="divide-y divide-[#eaedff]">
            {donations.map((d) => (
              <div
                key={d.id}
                className="p-4 sm:p-5 hover:bg-[#faf8ff] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-[#e2e7ff] text-[#006948] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-[20px]">restaurant</span>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-[#131b2e]">{d.donorOrg.name}</span>
                      <span className="text-xs text-[#6d7a72]">({d.id})</span>
                    </div>
                    <p className="text-xs text-[#3d4a42] font-medium mt-0.5">{d.title}</p>
                    <div className="flex items-center gap-3 text-xs text-[#6d7a72] mt-1 flex-wrap">
                      <span>Category: <strong className="text-[#131b2e]">{d.category}</strong></span>
                      <span>Weight: <strong className="text-[#131b2e]">{d.quantityKg} kg</strong></span>
                      <span>Servings: <strong className="text-[#131b2e]">~{d.servings}</strong></span>
                      <span>{d.expiresInText}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center flex-shrink-0">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      d.status === 'AVAILABLE'
                        ? 'bg-[#85f8c4] text-[#002114]'
                        : 'bg-[#dae2fd] text-[#0058be]'
                    }`}
                  >
                    {d.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* System Actions & Sandbox */}
      {activeTab === 'system' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-[#eaedff] shadow-sm flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#e2e7ff] text-[#006948] flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px]">developer_board</span>
              </div>
              <div>
                <h3 className="font-bold text-sm text-[#131b2e]">Simulate Dispatch Events</h3>
                <p className="text-xs text-[#6d7a72]">Inject mock real-time events to test platform responses</p>
              </div>
            </div>

            <p className="text-xs text-[#3d4a42] leading-relaxed">
              Injecting a simulated banquet donation triggers urgent notifications, adds pins to the nearby map, and tests donor notifications.
            </p>

            <button
              type="button"
              onClick={onSimulateNewDonation}
              className="mt-auto w-full py-3 bg-[#006948] hover:bg-[#00855d] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 active:scale-98 transition-all shadow-sm cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">add_alert</span>
              Simulate New High-Urgency Banquet Lot
            </button>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#eaedff] shadow-sm flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#ffdad6] text-[#93000a] flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px]">restart_alt</span>
              </div>
              <div>
                <h3 className="font-bold text-sm text-[#131b2e]">Reset Sandbox State</h3>
                <p className="text-xs text-[#6d7a72]">Restore sample donations, tasks, and audit documents</p>
              </div>
            </div>

            <p className="text-xs text-[#3d4a42] leading-relaxed">
              Clears local changes and re-seeds original mock records for demonstrations and testing runs.
            </p>

            <button
              type="button"
              onClick={onResetData}
              className="mt-auto w-full py-3 bg-[#ffdad6] hover:bg-[#ffb599] text-[#93000a] font-bold text-xs rounded-xl flex items-center justify-center gap-2 active:scale-98 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">restart_alt</span>
              Reset Demo Data to Initial State
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
