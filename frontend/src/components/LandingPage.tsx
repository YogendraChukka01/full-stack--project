import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DonationItem, UserRole } from '../types';
import confetti from 'canvas-confetti';

interface LandingPageProps {
  donations: DonationItem[];
  onLaunchApp: (tab?: string) => void;
  onSelectRole: (role: UserRole) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  donations,
  onLaunchApp,
  onSelectRole,
}) => {
  const [activeAudience, setActiveAudience] = useState<'donors' | 'ngos' | 'volunteers'>('donors');
  const [calculatorMeals, setCalculatorMeals] = useState<number>(250);

  // Computed impact values for interactive calculator
  const computedKgRescued = Math.round(calculatorMeals * 0.42);
  const computedCo2Offset = (computedKgRescued * 2.6).toFixed(1);
  const computedPeopleFed = Math.round(calculatorMeals * 0.95);

  const handleCelebrate = () => {
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#006948', '#85f8c4', '#fd651e', '#2170e4'],
    });
  };

  return (
    <div className="w-full min-h-screen bg-[#faf8ff] text-[#131b2e] overflow-x-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative pt-6 sm:pt-12 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Subtle decorative background glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-br from-[#85f8c4]/25 via-[#dae2fd]/30 to-transparent blur-3xl pointer-events-none -z-10" />

        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Live Status Pill */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#e2e7ff] text-[#006948] text-xs font-bold border border-[#dae2fd] shadow-xs mb-6 cursor-pointer hover:bg-[#d4ddff] transition-colors"
            onClick={() => onLaunchApp('nearby')}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#fd651e] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#fd651e]" />
            </span>
            <span>Live Dispatch Network Active • 3 Urgent Lots Within 5 km</span>
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#131b2e] leading-[1.12]"
          >
            Rescue surplus food{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#006948] via-[#00855d] to-[#2170e4]">
              before it becomes waste
            </span>
          </motion.h1>

          {/* Subhead */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-base sm:text-xl text-[#3d4a42] max-w-2xl leading-relaxed"
          >
            The real-time logistics bridge connecting commercial kitchens, banquets, and supermarkets with verified hunger relief shelters. List in 90 seconds, dispatch in minutes.
          </motion.p>

          {/* Primary Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto"
          >
            <button
              type="button"
              onClick={() => onLaunchApp('nearby')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#006948] hover:bg-[#00855d] text-white font-bold text-sm shadow-md hover:shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer group"
            >
              <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">
                explore
              </span>
              <span>Explore Live Surplus Map</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onSelectRole('donor');
                onLaunchApp('donate');
              }}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white hover:bg-[#f2f3ff] text-[#006948] font-bold text-sm border-2 border-[#006948]/30 hover:border-[#006948] shadow-xs active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">add_circle</span>
              <span>Post Food Donation</span>
            </button>

            <button
              type="button"
              onClick={() => onLaunchApp('activity')}
              className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-[#e2e7ff] hover:bg-[#dae2fd] text-[#131b2e] font-semibold text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px] text-[#2170e4]">directions_bike</span>
              <span>Courier Mission</span>
            </button>
          </motion.div>

          {/* Key Metric Counters */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-12 sm:mt-16 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 w-full"
          >
            {[
              {
                icon: 'scale',
                value: '14,850 kg',
                label: 'Surplus Rescued',
                sub: '+320 kg this week',
                color: 'text-[#006948]',
                bg: 'bg-[#85f8c4]/25',
              },
              {
                icon: 'restaurant',
                value: '37,125',
                label: 'Nutritious Meals Served',
                sub: 'To verified shelters',
                color: 'text-[#2170e4]',
                bg: 'bg-[#dae2fd]',
              },
              {
                icon: 'cloud_done',
                value: '38.6 Tons',
                label: 'CO₂e Emissions Diverted',
                sub: 'From landfills',
                color: 'text-[#00855d]',
                bg: 'bg-[#85f8c4]/25',
              },
              {
                icon: 'timer',
                value: '34 Mins',
                label: 'Avg. Pickup Dispatch',
                sub: 'Well within safety SLA',
                color: 'text-[#fd651e]',
                bg: 'bg-[#ffdad6]',
              },
            ].map((kpi, idx) => (
              <div
                key={idx}
                className="bg-white p-4 sm:p-5 rounded-2xl border border-[#eaedff] shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center"
              >
                <div className={`w-10 h-10 rounded-xl ${kpi.bg} flex items-center justify-center mb-2.5`}>
                  <span className={`material-symbols-outlined text-[20px] ${kpi.color}`}>
                    {kpi.icon}
                  </span>
                </div>
                <span className="text-xl sm:text-2xl font-extrabold text-[#131b2e] tracking-tight">
                  {kpi.value}
                </span>
                <span className="text-xs font-semibold text-[#3d4a42] mt-0.5">{kpi.label}</span>
                <span className="text-[10px] text-[#6d7a72] mt-1">{kpi.sub}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 2. LIVE TEASER: AVAILABLE FOOD LOTS */}
      <section className="py-12 bg-white border-y border-[#eaedff]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#ffdbce] text-[#a73a00] text-xs font-bold uppercase tracking-wider">
                  Live Feed
                </span>
                <span className="text-xs text-[#6d7a72]">Updated 2 mins ago</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#131b2e] mt-1">
                Active Surplus Lots Ready For Rescue
              </h2>
            </div>

            <button
              type="button"
              onClick={() => onLaunchApp('nearby')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#006948] hover:text-[#00855d] cursor-pointer self-start sm:self-auto group"
            >
              <span>View All Lots on Map</span>
              <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {donations.slice(0, 3).map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="bg-[#faf8ff] rounded-2xl border border-[#eaedff] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col"
              >
                <div className="relative h-44 w-full overflow-hidden bg-slate-200">
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#fd651e] text-white shadow-sm flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px]">timer</span>
                      {item.expiresInText}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-[11px] font-medium text-white/90 block">
                      {item.donorOrg.name}
                    </span>
                    <h3 className="font-bold text-sm truncate">{item.title}</h3>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-[#3d4a42]">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[15px] text-[#006948]">
                          restaurant
                        </span>
                        {item.servings} Servings ({item.quantityKg} kg)
                      </span>
                      <span className="font-semibold text-[#006948] bg-[#85f8c4]/30 px-2 py-0.5 rounded-full">
                        {item.distanceKm} km away
                      </span>
                    </div>

                    <p className="text-xs text-[#6d7a72] line-clamp-2">{item.description}</p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-[#eaedff] flex items-center justify-between">
                    <span className="text-[11px] text-[#6d7a72] flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px] text-[#006948]">eco</span>
                      {item.co2SavedKg} kg CO₂ saved
                    </span>

                    <button
                      type="button"
                      onClick={() => onLaunchApp('nearby')}
                      className="px-3 py-1.5 rounded-lg bg-[#006948] hover:bg-[#00855d] text-white text-xs font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
                    >
                      Claim Lot
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS: 3-STEP RESCUE ENGINE */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold text-[#006948] uppercase tracking-wider bg-[#85f8c4]/30 px-3 py-1 rounded-full">
            Under 2 Minutes
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#131b2e] mt-3">
            How The NourishLink Engine Works
          </h2>
          <p className="text-sm sm:text-base text-[#3d4a42] mt-2">
            Engineered to remove friction: no endless phone calls, no WhatsApp coordination, and 100% transparent food safety audits.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {[
            {
              step: '01',
              title: 'Post Surplus in 90 Seconds',
              desc: 'Select food category, tap auto-preset (Buffet, Bakery, Produce), and enter estimated servings. CO₂ offset and safety limits are automatically calculated.',
              icon: 'add_task',
              color: 'text-[#006948]',
              bg: 'bg-[#85f8c4]/30',
              highlight: 'Protected by Good Samaritan Act',
            },
            {
              step: '02',
              title: 'Real-Time Match & Courier Dispatch',
              desc: 'Nearby verified NGOs and volunteer drivers receive instant push notifications with allergen notes, storage guidelines, and turn-by-turn map directions.',
              icon: 'near_me',
              color: 'text-[#2170e4]',
              bg: 'bg-[#dae2fd]',
              highlight: 'Live ETA & Temperature Verification',
            },
            {
              step: '03',
              title: 'OTP Handover & Proof of Delivery',
              desc: 'Safe delivery confirmed through 4-digit recipient OTP, handover photos, and digital sign-off. Instant tax/CSR receipts and impact analytics are minted.',
              icon: 'verified',
              color: 'text-[#00855d]',
              bg: 'bg-[#85f8c4]/30',
              highlight: 'Audited Chain of Custody',
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -6 }}
              className="bg-white p-6 sm:p-8 rounded-3xl border border-[#eaedff] shadow-sm flex flex-col justify-between relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-6">
                <div className={`w-14 h-14 rounded-2xl ${item.bg} flex items-center justify-center`}>
                  <span className={`material-symbols-outlined text-[30px] ${item.color}`}>
                    {item.icon}
                  </span>
                </div>
                <span className="font-extrabold text-3xl text-[#eaedff] tracking-tight">
                  {item.step}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#131b2e] mb-2">{item.title}</h3>
                <p className="text-xs sm:text-sm text-[#3d4a42] leading-relaxed mb-4">
                  {item.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-[#eaedff]">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#006948]">
                  <span className="material-symbols-outlined text-[14px]">check_circle</span>
                  {item.highlight}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. AUDIENCE SPOTLIGHT: FOR DONORS, NGOS & VOLUNTEERS */}
      <section className="py-16 bg-[#f2f3ff] border-y border-[#dae2fd]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-3xl font-extrabold text-[#131b2e]">
              Built For Every Hero in the Rescue Chain
            </h2>
            <p className="text-sm text-[#3d4a42] mt-2">
              Select your perspective to explore specialized capabilities crafted for your operational needs.
            </p>

            {/* Segmented control */}
            <div className="mt-6 inline-flex p-1 bg-white rounded-2xl shadow-xs border border-[#dae2fd]">
              {(['donors', 'ngos', 'volunteers'] as const).map((aud) => (
                <button
                  key={aud}
                  type="button"
                  onClick={() => setActiveAudience(aud)}
                  className={`px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm font-bold capitalize transition-all cursor-pointer ${
                    activeAudience === aud
                      ? 'bg-[#006948] text-white shadow-sm'
                      : 'text-[#3d4a42] hover:text-[#131b2e]'
                  }`}
                >
                  For {aud}
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {activeAudience === 'donors' && (
              <motion.div
                key="donors"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-3xl p-6 sm:p-10 border border-[#eaedff] shadow-sm grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
              >
                <div>
                  <span className="px-3 py-1 rounded-full bg-[#85f8c4]/30 text-[#006948] text-xs font-bold uppercase">
                    Commercial Donors
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-[#131b2e] mt-3">
                    Restaurants, Hotels, Caterers & Supermarkets
                  </h3>
                  <p className="text-sm text-[#3d4a42] mt-3 leading-relaxed">
                    Eliminate food disposal costs while transforming evening surpluses into tangible brand goodwill and verified CSR milestones.
                  </p>

                  <ul className="mt-6 space-y-3">
                    {[
                      'Good Samaritan Act Immunity: Zero legal liability for good faith donations.',
                      '1-Tap Repeat Presets: Save buffet configurations for recurring events.',
                      'CO₂ Emissions Audit Ledger: Download ESG compliance summaries for board reports.',
                      'Reliable Dispatches: Pre-verified NGOs arrive within allocated pickup windows.',
                    ].map((point, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#131b2e]">
                        <span className="material-symbols-outlined text-[18px] text-[#006948] flex-shrink-0 mt-0.5">
                          check_circle
                        </span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    type="button"
                    onClick={() => {
                      onSelectRole('donor');
                      onLaunchApp('donate');
                    }}
                    className="mt-8 px-6 py-3 rounded-xl bg-[#006948] hover:bg-[#00855d] text-white font-bold text-xs sm:text-sm shadow-sm active:scale-95 transition-all inline-flex items-center gap-2 cursor-pointer"
                  >
                    <span>Post Surplus Now</span>
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </button>
                </div>

                <div className="relative rounded-2xl overflow-hidden shadow-lg border border-[#dae2fd]">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDIj51-yOq1Z7wFfO0Q0d6K6m4f6z6w6g7h8j9k0l1m2n3o4p5q6r7s8t9u0v1w2x3y4z5a6b7c8d9e0f1g2h3i4j5k6l7m8n9o0p1q2r3s4t5u6v7w8x9y0z1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z"
                    alt="Donor Kitchen Staff"
                    onError={(e) => {
                      // Fallback image if needed
                      (e.target as HTMLImageElement).src =
                        'https://lh3.googleusercontent.com/aida-public/AB6AXuCeQUBac-Ksll3oNpipVXeG00YKVpAWlRhEOz3OQGBgb0u_wPvvSMwiZkgd68M7Z_VZw8hSmdAEv3FtvOzmz7WSWNnLnqCrqjuIfRVCnPGiOtWO7aJ7nnihAtdl30iGBZZFL-iY6-ZdPQrsFjRbwougDQuEkbnVWf1NrEvh1Rj1mnDN1ZeX_M8jskddGH1bhsekcCC2Y01s5j94bByfF-XjJO0kbpGscksp1YDlSgxLI2OY2a-M2e-q';
                    }}
                    className="w-full h-80 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
                    <span className="font-bold text-sm">Royal Grand Caterers</span>
                    <p className="text-xs text-white/80">
                      "We diverted 2,800 kg of banquet food in 3 months. The couriers arrive like clockwork."
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeAudience === 'ngos' && (
              <motion.div
                key="ngos"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-3xl p-6 sm:p-10 border border-[#eaedff] shadow-sm grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
              >
                <div>
                  <span className="px-3 py-1 rounded-full bg-[#dae2fd] text-[#001a42] text-xs font-bold uppercase">
                    Verified NGOs & Shelters
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-[#131b2e] mt-3">
                    Charities, Orphanages & Community Pantries
                  </h3>
                  <p className="text-sm text-[#3d4a42] mt-3 leading-relaxed">
                    Source fresh, wholesome, high-protein meals daily at zero procurement cost to nourish the communities under your care.
                  </p>

                  <ul className="mt-6 space-y-3">
                    {[
                      'Geofenced Distance Filtering: Discover surplus within 3 km, 5 km, or 15 km.',
                      'Allergen & Diet Flags: Clearly labeled Vegetarian, Jain, Halal, or Nut-free.',
                      'Automated Courier Mobilization: Have our volunteer network deliver to your doorstep.',
                      'Distribution Record Keeping: Keep clean audit logs for donor grant reports.',
                    ].map((point, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#131b2e]">
                        <span className="material-symbols-outlined text-[18px] text-[#2170e4] flex-shrink-0 mt-0.5">
                          check_circle
                        </span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    type="button"
                    onClick={() => {
                      onSelectRole('ngo');
                      onLaunchApp('nearby');
                    }}
                    className="mt-8 px-6 py-3 rounded-xl bg-[#2170e4] hover:bg-[#1a5bc0] text-white font-bold text-xs sm:text-sm shadow-sm active:scale-95 transition-all inline-flex items-center gap-2 cursor-pointer"
                  >
                    <span>Browse Nearby Surplus</span>
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </button>
                </div>

                <div className="relative rounded-2xl overflow-hidden shadow-lg border border-[#dae2fd]">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAUY15kX1pnMTxCDTezh2kJ4b39My9cO-g54usZFEjGhRGR44epwWs-Z5t_t0oZFeulJmEK6yesC6HgHeDW0boYVg8H3EdMg4Loa5XijI0QvVDqj1xNozZtOrp6KXVe79fsmJwH4UIlViNa7rXEToCi4u7O-H9hY1CEalJFIIz95RwbLlrkyBDpKoPnNOdbL6vNrx0vZGYjCcn6bLlz_J2scHExQJ7JBh4xg3lxCr67YalyxS8bS54E"
                    alt="Shelter Beneficiaries"
                    className="w-full h-80 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
                    <span className="font-bold text-sm">Annapurna Seva Trust</span>
                    <p className="text-xs text-white/80">
                      "Reliable hot food deliveries have let us redirect our budget towards children's education."
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeAudience === 'volunteers' && (
              <motion.div
                key="volunteers"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-3xl p-6 sm:p-10 border border-[#eaedff] shadow-sm grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
              >
                <div>
                  <span className="px-3 py-1 rounded-full bg-[#ffdbce] text-[#370e00] text-xs font-bold uppercase">
                    Volunteer Drivers & Couriers
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-[#131b2e] mt-3">
                    The Food Rescue Wheels on the Ground
                  </h3>
                  <p className="text-sm text-[#3d4a42] mt-3 leading-relaxed">
                    Pick up rescue missions on your commute or during free hours. Transform a 15-minute detour into 80 hot meals saved.
                  </p>

                  <ul className="mt-6 space-y-3">
                    {[
                      'Turn-by-turn Navigation: One-tap Google Maps origin & destination routing.',
                      'Clear Handling Instructions: Insulated bag requirements and hot/cold temp thresholds.',
                      'Digital Proof of Delivery: In-app camera, 4-digit OTP, and recipient e-signature.',
                      'Volunteer Badge of Honor: Track your kg rescued and missions completed.',
                    ].map((point, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#131b2e]">
                        <span className="material-symbols-outlined text-[18px] text-[#fd651e] flex-shrink-0 mt-0.5">
                          check_circle
                        </span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    type="button"
                    onClick={() => {
                      onSelectRole('volunteer');
                      onLaunchApp('activity');
                    }}
                    className="mt-8 px-6 py-3 rounded-xl bg-[#fd651e] hover:bg-[#e0500e] text-white font-bold text-xs sm:text-sm shadow-sm active:scale-95 transition-all inline-flex items-center gap-2 cursor-pointer"
                  >
                    <span>View Active Courier Missions</span>
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </button>
                </div>

                <div className="relative rounded-2xl overflow-hidden shadow-lg border border-[#dae2fd]">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD34F1A5o-e_R-1K9M1Q1p1q1r1s1t1u1v1w1x1y1z1a1b1c1d1e1f1g1h1i1j1k1l1m1n1o1p1q1r1s1t1u1v1w1x1y1z"
                    alt="Volunteer Courier Handover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://lh3.googleusercontent.com/aida-public/AB6AXuAUY15kX1pnMTxCDTezh2kJ4b39My9cO-g54usZFEjGhRGR44epwWs-Z5t_t0oZFeulJmEK6yesC6HgHeDW0boYVg8H3EdMg4Loa5XijI0QvVDqj1xNozZtOrp6KXVe79fsmJwH4UIlViNa7rXEToCi4u7O-H9hY1CEalJFIIz95RwbLlrkyBDpKoPnNOdbL6vNrx0vZGYjCcn6bLlz_J2scHExQJ7JBh4xg3lxCr67YalyxS8bS54E';
                    }}
                    className="w-full h-80 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
                    <span className="font-bold text-sm">Priya Sharma • Volunteer Driver</span>
                    <p className="text-xs text-white/80">
                      "I completed 14 missions after work. Handing hot food to the shelter staff is the best part of my week."
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* 5. INTERACTIVE SURPLUS IMPACT CALCULATOR */}
      <section className="py-16 sm:py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#006948] to-[#004d34] rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-[#85f8c4]/10 pointer-events-none" />

          <div className="max-w-2xl">
            <span className="px-3 py-1 rounded-full bg-[#85f8c4]/20 text-[#85f8c4] text-xs font-bold uppercase tracking-wider">
              Impact Simulator
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold mt-3">
              Calculate Your Facility's Monthly Rescue Potential
            </h2>
            <p className="text-sm text-white/80 mt-2">
              Drag the slider below to see how many meals, kilograms, and carbon credits your restaurant or banquet hall can salvage.
            </p>
          </div>

          <div className="mt-8 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-semibold text-white/90">
                Average unserved meals per week:
              </span>
              <span className="text-2xl font-extrabold text-[#85f8c4]">
                {calculatorMeals} meals
              </span>
            </div>

            <input
              type="range"
              min="50"
              max="1500"
              step="50"
              value={calculatorMeals}
              onChange={(e) => {
                setCalculatorMeals(parseInt(e.target.value));
                if (parseInt(e.target.value) % 300 === 0) handleCelebrate();
              }}
              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#85f8c4]"
            />

            <div className="flex justify-between text-[11px] text-white/60 mt-1">
              <span>50 (Small Cafe)</span>
              <span>500 (Restaurant)</span>
              <span>1500 (Hotel / Convention)</span>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="bg-white/10 rounded-xl p-4 border border-white/15">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#85f8c4] block">
                {computedKgRescued} kg
              </span>
              <span className="text-xs text-white/80">Monthly Food Saved</span>
            </div>

            <div className="bg-white/10 rounded-xl p-4 border border-white/15">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#85f8c4] block">
                {computedPeopleFed}
              </span>
              <span className="text-xs text-white/80">People Fed Monthly</span>
            </div>

            <div className="bg-white/10 rounded-xl p-4 border border-white/15">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#85f8c4] block">
                {computedCo2Offset} kg
              </span>
              <span className="text-xs text-white/80">CO₂e Emissions Cut</span>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={() => {
                handleCelebrate();
                onLaunchApp('donate');
              }}
              className="px-8 py-3.5 rounded-xl bg-[#85f8c4] hover:bg-[#6ee6b0] text-[#002114] font-extrabold text-sm shadow-md active:scale-95 transition-all cursor-pointer flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[20px]">celebration</span>
              <span>Start Rescuing This Food Today</span>
            </button>
          </div>
        </div>
      </section>

      {/* 6. GOOD SAMARITAN & FOOD SAFETY COMMITMENT */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#eaedff] shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#e2e7ff] text-[#006948] flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-[36px]">gavel</span>
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-[#131b2e]">
                100% Legal & Safe Under Good Samaritan Protection
              </h3>
              <p className="text-xs sm:text-sm text-[#3d4a42] mt-1 max-w-xl">
                Commercial food donors acting in good faith are protected from civil and criminal liability. NourishLink enforces strict 2-hour food safety thresholds, temperature logging, and FSSAI guidelines on every lot.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="px-4 py-2 rounded-xl bg-[#85f8c4]/20 border border-[#85f8c4]/40 text-center">
              <span className="font-bold text-xs text-[#006948] block">FSSAI Aligned</span>
              <span className="text-[10px] text-[#3d4a42]">Safety Audited</span>
            </div>
            <div className="px-4 py-2 rounded-xl bg-[#dae2fd] border border-[#bccac0]/30 text-center">
              <span className="font-bold text-xs text-[#001a42] block">80G Tax Ready</span>
              <span className="text-[10px] text-[#3d4a42]">Receipt Minting</span>
            </div>
          </div>
        </div>
      </section>

      {/* 7. BOTTOM CTA & FOOTER */}
      <footer className="bg-[#131b2e] text-white pt-16 pb-12 mt-12 border-t border-[#283044]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-12 border-b border-white/10 text-center md:text-left">
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2.5">
                <img
                  alt="NourishLink Brand Mark"
                  className="h-8 w-auto object-contain"
                  src="https://lh3.googleusercontent.com/aida/AEtjO1W1VAt5Ktkx-NqTB_3yxr9kogOQ9WYyrjK7ShdX3G6aXv3qvn6FehfdB0F4qYhKE7bRIjtYwjqDO3L0QB-SLKD38wOA79XakR-9agGLLeE6qJURA9nVyEzKRNZBt0csQapi6jsjh_b-wMrIq-zn9LgyAPltYGmccdf4DF9BerVWYXy1YzGwStpRtAfkCBRILl3pApNVgOFY8xkvjIeMA9nPgDo5v0zw1lhdwJo7NWOX25gPh3tEMxEt7vk"
                />
                <span className="font-extrabold text-xl tracking-tight text-white">NourishLink</span>
              </div>
              <p className="text-xs text-white/70 mt-2 max-w-sm">
                Empowering zero food waste cities through real-time community mobilization and audited safe redistribution.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => onLaunchApp('nearby')}
                className="px-6 py-3 rounded-xl bg-[#006948] hover:bg-[#00855d] text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                Launch Map & Explore
              </button>
              <button
                type="button"
                onClick={() => {
                  onSelectRole('donor');
                  onLaunchApp('donate');
                }}
                className="px-6 py-3 rounded-xl bg-white hover:bg-slate-100 text-[#131b2e] font-bold text-xs shadow-sm transition-all cursor-pointer"
              >
                Post Food Surplus
              </button>
              <button
                type="button"
                onClick={() => onLaunchApp('admin')}
                className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all cursor-pointer"
              >
                Admin Console
              </button>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-white/60 gap-4">
            <p>© 2026 NourishLink Surplus Food Network. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <span className="hover:text-white cursor-pointer">Good Samaritan Terms</span>
              <span className="hover:text-white cursor-pointer">Food Safety Protocol</span>
              <span className="hover:text-white cursor-pointer">FSSAI Compliance</span>
              <span className="hover:text-white cursor-pointer">CSR Receipts</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
