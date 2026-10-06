import React, { useState } from 'react';
import { VerificationAuditItem } from '../types';

interface ImpactMetricsProps {
  verifications: VerificationAuditItem[];
  onApproveItem: (item: VerificationAuditItem) => void;
  onOpenDocReview: (item: VerificationAuditItem) => void;
  onExploreStories?: () => void;
}

export const ImpactMetrics: React.FC<ImpactMetricsProps> = ({
  verifications,
  onApproveItem,
  onOpenDocReview,
}) => {
  const [activeSegment, setActiveSegment] = useState<'impact' | 'verification'>('impact');
  const [showStoryModal, setShowStoryModal] = useState(false);

  // Filter pending verifications
  const pendingVerifications = verifications.filter((v) => v.status !== 'APPROVED');

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-28 pt-2">
      {/* Interactive Segmented View Control */}
      <div className="bg-[#e2e7ff] p-1 rounded-full flex items-center justify-between shadow-sm border border-[#dae2fd] max-w-md mx-auto mb-5">
        <button
          type="button"
          onClick={() => setActiveSegment('impact')}
          className={`flex-1 py-2 px-3 rounded-full text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSegment === 'impact'
              ? 'bg-white text-[#006948] shadow-sm'
              : 'text-[#3d4a42] hover:text-[#131b2e]'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">insights</span>
          <span>Live Impact</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSegment('verification')}
          className={`flex-1 py-2 px-3 rounded-full text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSegment === 'verification'
              ? 'bg-white text-[#006948] shadow-sm'
              : 'text-[#3d4a42] hover:text-[#131b2e]'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">verified_user</span>
          <span>Verification</span>
          {pendingVerifications.length > 0 && (
            <span className="inline-flex items-center justify-center px-1.5 py-0.2 rounded-full bg-[#fd651e] text-white text-[10px] font-bold">
              {pendingVerifications.length}
            </span>
          )}
        </button>
      </div>

      {/* Live Pulse Ticker Banner */}
      <div className="bg-[#f2f3ff] rounded-xl p-3 flex items-center gap-2.5 overflow-hidden shadow-sm border border-[#dae2fd] mb-6">
        <div className="relative flex items-center justify-center w-7 h-7 rounded-full bg-[#85f8c4] text-[#002114] flex-shrink-0">
          <span className="material-symbols-outlined text-[16px]">sensors</span>
          <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#006948] opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#006948]" />
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold text-[#006948] uppercase tracking-wider">
              Live Redistribution Feed
            </p>
            <span className="text-[10px] text-[#6d7a72]">4m ago</span>
          </div>
          <p className="text-xs text-[#131b2e] truncate">
            <strong className="font-bold">Robin Hood Army</strong> claimed{' '}
            <span className="text-[#006948] font-bold">30 kg</span> from Paradise Bakery
          </p>
        </div>
      </div>

      {/* SECTION 1: LIVE IMPACT METRICS */}
      {activeSegment === 'impact' && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-200">
          {/* KPI Metric Cards Grid - 4 Columns on Desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Metric 1: Total Food Rescued */}
            <div className="sm:col-span-2 lg:col-span-2 bg-white p-5 rounded-xl shadow-sm border border-[#eaedff] relative overflow-hidden flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[11px] font-bold text-[#6d7a72] uppercase tracking-wider block">
                    Total Food Rescued
                  </span>
                  <div className="flex items-baseline gap-1.5 mt-1.5">
                    <span className="font-extrabold text-4xl text-[#131b2e] tracking-tight">
                      18,420
                    </span>
                    <span className="font-bold text-lg text-[#006948]">kg</span>
                  </div>
                </div>

                <div className="w-14 h-14 rounded-full bg-[#85f8c4] flex items-center justify-center text-[#002114] shadow-xs">
                  <span className="material-symbols-outlined text-[30px]">eco</span>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <span className="inline-flex items-center gap-0.5 px-2.5 py-0.5 rounded-full bg-[#85f8c4]/60 text-[#002114] text-xs font-bold">
                  <span className="material-symbols-outlined text-[14px]">trending_up</span>
                  +340 kg today
                </span>
                <span className="text-xs text-[#6d7a72]">vs. 280 kg yesterday</span>
              </div>
            </div>

            {/* Metric 2: Meals Served */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-[#eaedff] flex flex-col justify-between">
              <div className="w-10 h-10 rounded-full bg-[#ffdbce] flex items-center justify-center text-[#370e00] mb-2">
                <span className="material-symbols-outlined text-[22px]">restaurant</span>
              </div>
              <div>
                <span className="text-[11px] font-semibold text-[#6d7a72] block truncate">
                  Meals Served
                </span>
                <span className="font-bold text-2xl text-[#131b2e] block mt-1">
                  46,050
                </span>
                <span className="text-xs text-[#fd651e] font-semibold block mt-0.5">
                  Dignified rations
                </span>
              </div>
            </div>

            {/* Metric 3: Carbon Offset */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-[#eaedff] flex flex-col justify-between">
              <div className="w-10 h-10 rounded-full bg-[#d8e2ff] flex items-center justify-center text-[#001a42] mb-2">
                <span className="material-symbols-outlined text-[22px]">cloud_off</span>
              </div>
              <div>
                <span className="text-[11px] font-semibold text-[#6d7a72] block truncate">
                  CO₂e Diverted
                </span>
                <span className="font-bold text-2xl text-[#131b2e] block mt-1">
                  42.3 t
                </span>
                <span className="text-xs text-[#0058be] font-semibold block mt-0.5">
                  Methane avoided
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Two-Column Split: Charts + Community Story */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT: Category Breakdown & Network Stats */}
            <div className="lg:col-span-7 flex flex-col gap-5">
              {/* Impact by Surplus Category */}
              <div className="bg-white p-5 rounded-xl shadow-sm border border-[#eaedff] flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-bold text-base text-[#131b2e]">
                      Impact by Surplus Category
                    </h2>
                    <p className="text-xs text-[#6d7a72]">Nutritional volume distribution</p>
                  </div>
                  <span className="material-symbols-outlined text-[#6d7a72] text-[22px]">
                    pie_chart
                  </span>
                </div>

                {/* Segmented Bar Visualization */}
                <div className="h-3.5 w-full rounded-full bg-[#f2f3ff] flex overflow-hidden gap-0.5 mt-1 border border-[#dae2fd]">
                  <div className="bg-[#006948] h-full" style={{ width: '58%' }} title="Cooked Meals 58%" />
                  <div className="bg-[#fd651e] h-full" style={{ width: '22%' }} title="Bakery 22%" />
                  <div className="bg-[#2170e4] h-full" style={{ width: '15%' }} title="Produce 15%" />
                  <div className="bg-[#006c4a] h-full" style={{ width: '5%' }} title="Packaged 5%" />
                </div>

                {/* Legend items */}
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <div className="flex items-center justify-between p-2.5 bg-[#f2f3ff] rounded-lg">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#006948] flex-shrink-0" />
                      <span className="text-xs text-[#131b2e] truncate font-medium">Cooked Meals</span>
                    </div>
                    <span className="text-xs font-bold text-[#131b2e]">58%</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-[#f2f3ff] rounded-lg">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#fd651e] flex-shrink-0" />
                      <span className="text-xs text-[#131b2e] truncate font-medium">Bakery / Bread</span>
                    </div>
                    <span className="text-xs font-bold text-[#131b2e]">22%</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-[#f2f3ff] rounded-lg">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#2170e4] flex-shrink-0" />
                      <span className="text-xs text-[#131b2e] truncate font-medium">Fresh Produce</span>
                    </div>
                    <span className="text-xs font-bold text-[#131b2e]">15%</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-[#f2f3ff] rounded-lg">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#006c4a] flex-shrink-0" />
                      <span className="text-xs text-[#131b2e] truncate font-medium">Dry Packaged</span>
                    </div>
                    <span className="text-xs font-bold text-[#131b2e]">5%</span>
                  </div>
                </div>
              </div>

              {/* Active Network Footprint */}
              <div className="bg-[#eaedff]/70 p-5 rounded-xl shadow-sm border border-[#dae2fd] flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-bold text-[#131b2e]">
                      Active Mobilization Network
                    </span>
                    <p className="text-xs text-[#3d4a42]">Verified partners on duty across the city</p>
                  </div>
                  <span className="material-symbols-outlined text-[#006948] text-[22px]">hub</span>
                </div>

                <div className="grid grid-cols-3 gap-3 mt-1">
                  <div className="bg-white p-3 rounded-xl text-center shadow-2xs border border-[#dae2fd]">
                    <span className="font-extrabold text-xl text-[#006948] block">84</span>
                    <span className="text-xs font-semibold text-[#3d4a42]">Donors</span>
                  </div>

                  <div className="bg-white p-3 rounded-xl text-center shadow-2xs border border-[#dae2fd]">
                    <span className="font-extrabold text-xl text-[#0058be] block">38</span>
                    <span className="text-xs font-semibold text-[#3d4a42]">NGOs</span>
                  </div>

                  <div className="bg-white p-3 rounded-xl text-center shadow-2xs border border-[#dae2fd]">
                    <span className="font-extrabold text-xl text-[#fd651e] block">112</span>
                    <span className="text-xs font-semibold text-[#3d4a42]">Couriers</span>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: Featured Community Story */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="relative bg-white rounded-xl overflow-hidden shadow-sm border border-[#eaedff] flex flex-col">
                <div className="h-56 sm:h-64 w-full overflow-hidden relative">
                  <img
                    alt="Community volunteers packing food"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCF42bLGXg_Xa9uwrwva2OsflvR4o9jF95iNsYOGBiHXTWVI_yVS7F0RflLfvmHHLxDzal0xFAAvyiz1sTGltbkHfZWrl59ebdmqu26XtDxddUEUUWLTVYEvbl0RWxLSbAFN6Yui5q-dBAbNJ2nVv9pOBVaG8FBHYVLQiHjTaCnGLMkkZzKLiC__70ADAR_wrSvITshoHNxWNzP6uB9JB4wzRTgQtyKRFa9JUVDSnQYLzQN-IupCWwQ"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#283044]/90 via-transparent to-transparent flex items-end p-4">
                    <span className="text-xs font-bold text-white uppercase tracking-wider bg-[#006948] px-3 py-1 rounded-full shadow-xs">
                      Community Spotlight
                    </span>
                  </div>
                </div>

                <div className="p-5 flex flex-col gap-3">
                  <div>
                    <h3 className="font-bold text-base text-[#131b2e]">
                      Dharavi Shelter Redistribution Hub
                    </h3>
                    <p className="text-xs text-[#6d7a72] mt-0.5">Cleared 480 banquet portions within 42 minutes</p>
                  </div>

                  <p className="text-xs text-[#3d4a42] leading-relaxed">
                    When high-capacity wedding events conclude, our coordinated rapid response pairs refrigerated vans with volunteer drivers to transport banquet cuisine at safe temperatures directly to family distribution lines.
                  </p>

                  <button
                    type="button"
                    onClick={() => setShowStoryModal(true)}
                    className="w-full py-2.5 bg-[#f2f3ff] hover:bg-[#eaedff] text-[#006948] font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Read Full Dispatch Report</span>
                    <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: VERIFICATION QUEUE VIEW (Responsive 3-Column Grid) */}
      {activeSegment === 'verification' && (
        <div className="flex flex-col gap-5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-[#eaedff] shadow-2xs">
            <div>
              <h2 className="font-bold text-base text-[#131b2e]">Verification Queue</h2>
              <p className="text-xs text-[#6d7a72]">Food safety standards compliance & certificate auditing</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#ffdbce] text-[#370e00] font-bold text-xs">
              {pendingVerifications.length} Pending Audit
            </span>
          </div>

          {pendingVerifications.length === 0 ? (
            <div className="bg-white p-12 rounded-xl text-center border border-[#eaedff] flex flex-col items-center gap-3">
              <span className="material-symbols-outlined text-[48px] text-[#006948]">
                verified
              </span>
              <p className="font-bold text-base text-[#131b2e]">All organizations audited!</p>
              <p className="text-xs text-[#6d7a72]">
                No pending verification documents in queue. New submissions will appear here automatically.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {pendingVerifications.map((item) => (
                <div
                  key={item.id}
                  id={`card-${item.id}`}
                  className="bg-white rounded-xl p-5 shadow-sm border border-[#eaedff] flex flex-col justify-between gap-4 transition-all duration-200 hover:shadow-md"
                >
                  <div className="flex flex-col gap-3">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-12 h-12 rounded-lg bg-[#e2e7ff] overflow-hidden flex-shrink-0 flex items-center justify-center text-[#006948]">
                          {item.imageUrl ? (
                            <img
                              alt={item.name}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                              src={item.imageUrl}
                            />
                          ) : (
                            <span className="material-symbols-outlined text-[26px]">storefront</span>
                          )}
                        </div>

                        <div className="min-w-0">
                          <h3 className="font-bold text-sm text-[#131b2e] truncate">{item.name}</h3>
                          <p className="text-xs text-[#6d7a72] flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px] text-[#0058be]">
                              {item.type === 'NGO' ? 'foundation' : 'hotel'}
                            </span>
                            <span>{item.typeLabel}</span>
                          </p>
                        </div>
                      </div>

                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold flex-shrink-0 ${
                          item.status === 'AWAITING_ACTION'
                            ? 'bg-[#ffdbce] text-[#370e00]'
                            : item.status === 'DOCS_REUPLOADED'
                            ? 'bg-[#e2e7ff] text-[#0058be]'
                            : 'bg-[#f2f3ff] text-[#3d4a42]'
                        }`}
                      >
                        {item.status === 'AWAITING_ACTION'
                          ? 'Awaiting'
                          : item.status === 'DOCS_REUPLOADED'
                          ? 'Re-Uploaded'
                          : 'Pending'}
                      </span>
                    </div>

                    {/* Attached Credentials */}
                    <div className="bg-[#f2f3ff] p-3 rounded-lg flex flex-col gap-1.5 border border-[#dae2fd]">
                      <span className="text-[10px] font-bold text-[#6d7a72] uppercase tracking-wider">
                        Attached Compliance Credentials:
                      </span>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {item.credentials.map((cred, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white text-[#131b2e] text-[11px] font-bold shadow-2xs border border-[#dae2fd]/60"
                          >
                            <span className="material-symbols-outlined text-[13px] text-[#006948]">
                              verified
                            </span>
                            {cred}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Detail checklist */}
                    <div className="flex items-center justify-between text-xs text-[#6d7a72] pt-1 border-t border-[#eaedff]">
                      {item.coldStorageCapacity && (
                        <span>
                          Storage: <strong className="text-[#131b2e]">{item.coldStorageCapacity}</strong>
                        </span>
                      )}
                      {item.dailySurplus && (
                        <span>
                          Daily: <strong className="text-[#131b2e]">{item.dailySurplus}</strong>
                        </span>
                      )}
                      {item.coldChainLog && (
                        <span>
                          Log: <strong className="text-[#131b2e]">{item.coldChainLog}</strong>
                        </span>
                      )}
                      <span>
                        Age: <strong className="text-[#131b2e]">{item.submittedAgo}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 pt-2 border-t border-[#eaedff]">
                    <button
                      type="button"
                      onClick={() => onApproveItem(item)}
                      className="flex-1 h-11 bg-[#006948] hover:bg-[#00855d] text-white rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">check_circle</span>
                      <span>
                        {item.type === 'NGO'
                          ? 'Approve NGO'
                          : item.id === 'VER-02'
                          ? 'Grant Clearance'
                          : 'Approve'}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onOpenDocReview(item)}
                      className="h-11 px-3.5 bg-[#f2f3ff] hover:bg-[#eaedff] text-[#131b2e] rounded-lg font-bold text-xs flex items-center justify-center gap-1 active:scale-95 transition-all cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">visibility</span>
                      <span>Docs</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Community Story Detail Modal */}
      {showStoryModal && (
        <div className="fixed inset-0 z-50 bg-[#131b2e]/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#dae2fd] flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#006948] bg-[#85f8c4]/40 px-2.5 py-0.5 rounded-full">
                Featured Redistribution Story
              </span>
              <button
                type="button"
                onClick={() => setShowStoryModal(false)}
                className="w-7 h-7 rounded-full bg-[#eaedff] flex items-center justify-center text-[#3d4a42]"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <h3 className="font-bold text-base text-[#131b2e]">
              Dharavi Shelter Redistribution Hub
            </h3>
            <p className="text-xs text-[#3d4a42] leading-relaxed">
              When the Grand Hyatt Banquet had an unexpected cancellation leaving 480 freshly prepared portions of Biryani and Dal Makhani, NourishLink's emergency protocol dispatched 2 refrigerated vans in 12 minutes. The food was temperature-checked, sealed, and handed over to Sister Clara at the shelter within 42 minutes total.
            </p>
            <div className="bg-[#f2f3ff] p-3 rounded-xl border border-[#dae2fd] flex items-center justify-between text-xs">
              <span className="text-[#6d7a72]">Zero food safety incidents recorded</span>
              <span className="font-bold text-[#006948]">100% Quality Audited</span>
            </div>
            <button
              type="button"
              onClick={() => setShowStoryModal(false)}
              className="w-full py-2.5 bg-[#006948] text-white text-xs font-bold rounded-xl"
            >
              Close Story
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
