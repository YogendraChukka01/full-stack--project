import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { DonationItem } from '../types';

interface NearbyExploreProps {
  donations: DonationItem[];
  onOpenClaimModal: (donation: DonationItem) => void;
  onPostNewDonation: () => void;
  onCallContact: (name: string, phone: string) => void;
}

export const NearbyExplore: React.FC<NearbyExploreProps> = ({
  donations,
  onOpenClaimModal,
  onPostNewDonation,
  onCallContact,
}) => {
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [radiusFilter, setRadiusFilter] = useState<number>(5); // 3, 5, 15
  const [urgencyFilter, setUrgencyFilter] = useState<'all' | 'urgent' | 'today'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'urgency' | 'distance' | 'quantity'>('urgency');
  const [selectedPinId, setSelectedPinId] = useState<string | null>(null);
  const [infoModalItem, setInfoModalItem] = useState<DonationItem | null>(null);

  // Filter & sort
  const filteredDonations = useMemo(() => {
    return donations
      .filter((item) => item.status === 'AVAILABLE')
      .filter((item) => {
        if (radiusFilter === 3 && item.distanceKm > 3.0) return false;
        if (radiusFilter === 5 && item.distanceKm > 5.0) return false;
        if (radiusFilter === 15 && item.distanceKm > 15.0) return false;

        if (urgencyFilter === 'urgent' && !item.isUrgent) return false;
        if (categoryFilter !== 'all' && item.category !== categoryFilter) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'urgency') {
          if (a.isUrgent && !b.isUrgent) return -1;
          if (!a.isUrgent && b.isUrgent) return 1;
          return a.distanceKm - b.distanceKm;
        }
        if (sortBy === 'distance') {
          return a.distanceKm - b.distanceKm;
        }
        if (sortBy === 'quantity') {
          return b.quantityKg - a.quantityKg;
        }
        return 0;
      });
  }, [donations, radiusFilter, urgencyFilter, categoryFilter, sortBy]);

  const totalSurplusKg = useMemo(() => {
    return filteredDonations.reduce((sum, d) => sum + d.quantityKg, 0);
  }, [filteredDonations]);

  const handleShare = (item: DonationItem) => {
    if (navigator.share) {
      navigator.share({
        title: `Surplus Food Alert: ${item.donorOrg.name}`,
        text: `Urgent rescue available: ${item.title} at ${item.donorOrg.name} (${item.distanceKm} km away). Feeds ~${item.servings} people.`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(
        `Surplus Food Alert: ${item.title} at ${item.donorOrg.name} (${item.distanceKm}km). Feeds ~${item.servings}.`
      );
      alert('Listing link copied to clipboard for dispatch team!');
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-28 pt-2">
      {/* Desktop & Mobile Responsive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN (Desktop: Map, Radius, Standby Alert - sticky) */}
        <div className="lg:col-span-5 flex flex-col gap-4 lg:sticky lg:top-20">
          {/* Live Pulse Stats Ticker */}
          <div className="w-full bg-[#e2e7ff] rounded-xl p-3 flex items-center justify-between shadow-sm border border-[#dae2fd]">
            <div className="flex items-center gap-2 min-w-0">
              <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#fd651e] opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#fd651e]" />
              </span>
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-xs text-[#131b2e] truncate">
                  {totalSurplusKg} kg surplus available nearby
                </span>
                <span className="text-[11px] text-[#3d4a42] truncate">
                  3 NGO claims in progress around you
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-full shadow-sm flex-shrink-0 border border-[#bccac0]/30">
              <span
                className="material-symbols-outlined text-[16px] text-[#006948]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                eco
              </span>
              <span className="font-bold text-[11px] text-[#006948]">Live Sync</span>
            </div>
          </div>

          {/* Interactive Map & Mode Toggle Banner */}
          <div className="w-full bg-white rounded-xl shadow-sm border border-[#eaedff] overflow-hidden flex flex-col">
            {/* Map Canvas with Hotspot Pins */}
            <div
              className="relative w-full h-56 sm:h-64 lg:h-72 bg-[#d2d9f4] overflow-hidden"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAUY15kX1pnMTxCDTezh2kJ4b39My9cO-g54usZFEjGhRGR44epwWs-Z5t_t0oZFeulJmEK6yesC6HgHeDW0boYVg8H3EdMg4Loa5XijI0QvVDqj1xNozZtOrp6KXVe79fsmJwH4UIlViNa7rXEToCi4u7O-H9hY1CEalJFIIz95RwbLlrkyBDpKoPnNOdbL6vNrx0vZGYjCcn6bLlz_J2scHExQJ7JBh4xg3lxCr67YalyxS8bS54E')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              {/* Gradient overlay for readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#283044]/80 via-[#283044]/20 to-transparent pointer-events-none" />

              {/* Controls on Map */}
              <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-auto z-10">
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/95 backdrop-blur-md rounded-full shadow-md text-xs font-semibold text-[#131b2e] border border-[#bccac0]/40">
                  <span className="material-symbols-outlined text-[16px] text-[#006948]">my_location</span>
                  <span>Bengaluru East • {radiusFilter} km radius</span>
                </div>

                <div className="inline-flex rounded-lg bg-white/95 backdrop-blur-md p-0.5 shadow-md border border-[#bccac0]/40">
                  <button
                    type="button"
                    onClick={() => setViewMode('map')}
                    className={`px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1 transition-all ${
                      viewMode === 'map'
                        ? 'bg-[#006948] text-white shadow-sm'
                        : 'text-[#3d4a42] hover:text-[#131b2e]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[14px]">map</span> Map
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('list')}
                    className={`px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1 transition-all ${
                      viewMode === 'list'
                        ? 'bg-[#006948] text-white shadow-sm'
                        : 'text-[#3d4a42] hover:text-[#131b2e]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[14px]">list</span> List
                  </button>
                </div>
              </div>

              {/* Simulated Interactive Pulsing Surplus Pins on Map */}
              {/* Pin 1: Urgent Cooked (Green Garden) */}
              <button
                type="button"
                onClick={() => {
                  setSelectedPinId('DON-101');
                  const el = document.getElementById('card-DON-101');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="absolute top-20 left-1/4 -translate-x-1/2 flex flex-col items-center cursor-pointer group focus:outline-none z-10"
              >
                <div className="relative flex items-center justify-center">
                  <span className="animate-ping absolute h-8 w-8 rounded-full bg-[#fd651e] opacity-60" />
                  <div
                    className={`h-7 w-7 rounded-full bg-[#fd651e] text-white flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-125 ${
                      selectedPinId === 'DON-101' ? 'ring-2 ring-white scale-125' : ''
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">soup_kitchen</span>
                  </div>
                </div>
                <div className="mt-1 px-1.5 py-0.5 rounded bg-[#283044]/90 text-white font-bold text-[10px] shadow backdrop-blur-sm whitespace-nowrap">
                  Green Garden (1.8 km)
                </div>
              </button>

              {/* Pin 2: Bakery (Artisan) */}
              <button
                type="button"
                onClick={() => {
                  setSelectedPinId('DON-102');
                  const el = document.getElementById('card-DON-102');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="absolute top-14 right-1/4 flex flex-col items-center cursor-pointer group focus:outline-none z-10"
              >
                <div
                  className={`h-6 w-6 rounded-full bg-[#006948] text-white flex items-center justify-center shadow-md transform transition-transform group-hover:scale-125 ${
                    selectedPinId === 'DON-102' ? 'ring-2 ring-white scale-125' : ''
                  }`}
                >
                  <span className="material-symbols-outlined text-[14px]">bakery_dining</span>
                </div>
                <div className="mt-1 px-1.5 py-0.5 rounded bg-[#283044]/90 text-white font-bold text-[10px] shadow backdrop-blur-sm whitespace-nowrap">
                  Artisan Bakery (3.2 km)
                </div>
              </button>

              {/* Pin 3: FreshMart */}
              <button
                type="button"
                onClick={() => {
                  setSelectedPinId('DON-103');
                  const el = document.getElementById('card-DON-103');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="absolute bottom-5 left-1/2 -translate-x-1/2 flex flex-col items-center cursor-pointer group focus:outline-none z-10"
              >
                <div
                  className={`h-6 w-6 rounded-full bg-[#2170e4] text-white flex items-center justify-center shadow-md transform transition-transform group-hover:scale-125 ${
                    selectedPinId === 'DON-103' ? 'ring-2 ring-white scale-125' : ''
                  }`}
                >
                  <span className="material-symbols-outlined text-[14px]">nutrition</span>
                </div>
                <div className="mt-1 px-1.5 py-0.5 rounded bg-[#283044]/90 text-white font-bold text-[10px] shadow backdrop-blur-sm whitespace-nowrap">
                  FreshMart (4.5 km)
                </div>
              </button>
            </div>
          </div>

          {/* Filter Hub & Selectors */}
          <div className="bg-white p-3.5 rounded-xl border border-[#eaedff] shadow-2xs flex flex-col gap-2.5">
            {/* Distance Radius Selector */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#3d4a42] flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">near_me</span> Radius
              </span>
              <div className="inline-flex bg-[#e2e7ff] rounded-full p-0.5 border border-[#dae2fd]">
                <button
                  type="button"
                  onClick={() => setRadiusFilter(3)}
                  className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all ${
                    radiusFilter === 3
                      ? 'bg-[#006948] text-white shadow-sm'
                      : 'text-[#3d4a42] hover:text-[#131b2e]'
                  }`}
                >
                  &lt; 3 km
                </button>
                <button
                  type="button"
                  onClick={() => setRadiusFilter(5)}
                  className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all ${
                    radiusFilter === 5
                      ? 'bg-[#006948] text-white shadow-sm'
                      : 'text-[#3d4a42] hover:text-[#131b2e]'
                  }`}
                >
                  &lt; 5 km
                </button>
                <button
                  type="button"
                  onClick={() => setRadiusFilter(15)}
                  className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all ${
                    radiusFilter === 15
                      ? 'bg-[#006948] text-white shadow-sm'
                      : 'text-[#3d4a42] hover:text-[#131b2e]'
                  }`}
                >
                  All 15 km
                </button>
              </div>
            </div>

            {/* Urgency Horizontal Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 no-scrollbar">
              <button
                type="button"
                onClick={() => setUrgencyFilter(urgencyFilter === 'urgent' ? 'all' : 'urgent')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap shadow-sm active:scale-95 transition-all ${
                  urgencyFilter === 'urgent'
                    ? 'bg-[#fd651e] text-white ring-2 ring-[#fd651e]/30'
                    : 'bg-[#ffdbce] text-[#370e00]'
                }`}
              >
                <span className="material-symbols-outlined text-[14px]">timer</span>
                &lt; 2 hrs left
                <span className="w-1.5 h-1.5 rounded-full bg-[#a73a00] ml-0.5" />
              </button>

              <button
                type="button"
                onClick={() => setUrgencyFilter('all')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap active:scale-95 transition-all ${
                  urgencyFilter === 'all'
                    ? 'bg-[#eaedff] text-[#006948]'
                    : 'bg-[#e2e7ff] text-[#3d4a42]'
                }`}
              >
                All Urgencies
              </button>

              <button
                type="button"
                onClick={() => setUrgencyFilter('today')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap active:scale-95 transition-all ${
                  urgencyFilter === 'today'
                    ? 'bg-[#eaedff] text-[#006948]'
                    : 'bg-[#e2e7ff] text-[#3d4a42]'
                }`}
              >
                Today
              </button>
            </div>
          </div>

          {/* NGO Volunteer Dispatch Notice Banner */}
          <div className="w-full bg-[#85f8c4]/30 rounded-xl p-3.5 flex items-center gap-3 shadow-sm border border-[#85f8c4]/60">
            <div className="w-10 h-10 rounded-full bg-[#006948] text-white flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-[22px]">volunteer_activism</span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-xs text-[#002114] truncate">
                Volunteer Couriers Ready
              </h3>
              <p className="text-[11px] text-[#005137] leading-relaxed">
                4 verified community drivers are on standby within your radius to assist with cold transport.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (Desktop: Feed Header, Category Tabs, Cards Grid) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* Feed Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white p-3.5 rounded-xl border border-[#eaedff] shadow-2xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-base text-[#131b2e]">Available Surplus Lots</span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#dae2fd] text-[#0058be] font-bold text-xs">
                {filteredDonations.length} Active
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-[#6d7a72]">Sort by:</span>
              <div className="inline-flex bg-[#f2f3ff] rounded-lg p-0.5 border border-[#dae2fd]">
                {(['urgency', 'distance', 'quantity'] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSortBy(s)}
                    className={`px-2.5 py-1 rounded text-xs font-bold capitalize transition-all ${
                      sortBy === s
                        ? 'bg-white text-[#006948] shadow-xs'
                        : 'text-[#3d4a42] hover:text-[#131b2e]'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {[
              { id: 'all', label: 'All Lots', icon: 'grid_view' },
              { id: 'Cooked Meal', label: 'Cooked Meals', icon: 'restaurant' },
              { id: 'Bakery', label: 'Bakery & Bread', icon: 'bakery_dining' },
              { id: 'Raw Produce', label: 'Raw Produce', icon: 'egg_alt' },
              { id: 'Packaged', label: 'Packaged', icon: 'inventory_2' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategoryFilter(categoryFilter === cat.id ? 'all' : cat.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1 shadow-sm ${
                  categoryFilter === cat.id
                    ? 'bg-[#85f8c4] text-[#002114]'
                    : 'bg-[#f2f3ff] text-[#3d4a42] hover:bg-[#eaedff]'
                }`}
              >
                <span className="material-symbols-outlined text-[14px]">{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>

          {/* DONATION CARDS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
            {filteredDonations.length === 0 ? (
              <div className="sm:col-span-2 bg-white rounded-xl p-8 text-center border border-[#eaedff] flex flex-col items-center gap-2">
                <span className="material-symbols-outlined text-[36px] text-[#6d7a72]">search_off</span>
                <p className="font-bold text-sm text-[#131b2e]">No surplus matches your filters</p>
                <p className="text-xs text-[#3d4a42]">
                  Try widening your radius or clearing category filters.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setRadiusFilter(15);
                    setUrgencyFilter('all');
                    setCategoryFilter('all');
                  }}
                  className="mt-2 px-3 py-1.5 bg-[#eaedff] text-[#006948] text-xs font-bold rounded-lg"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              filteredDonations.map((item, index) => (
                <motion.article
                  key={item.id}
                  id={`card-${item.id}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: Math.min(index * 0.05, 0.3) }}
                  whileHover={{ y: -4 }}
                  className={`bg-white rounded-2xl shadow-sm p-4 sm:p-5 flex flex-col justify-between gap-3 relative overflow-hidden transition-shadow hover:shadow-lg border ${
                    selectedPinId === item.id ? 'border-[#006948] ring-2 ring-[#006948]/20' : 'border-[#eaedff]'
                  }`}
                >
                  {/* Top Urgency Strip if urgent */}
                  {item.isUrgent && (
                    <div className="absolute top-0 inset-x-0 h-1.5 bg-[#fd651e]" />
                  )}

                  <div className="flex flex-col gap-2.5">
                    {/* Metadata Row */}
                    <div className="flex items-start justify-between gap-2 pt-0.5">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${
                            item.isUrgent
                              ? 'bg-[#ffdad6] text-[#93000a]'
                              : 'bg-[#eaedff] text-[#131b2e]'
                          }`}
                        >
                          <span
                            className={`material-symbols-outlined text-[14px] ${
                              item.isUrgent ? 'animate-pulse text-[#ba1a1a]' : 'text-[#006948]'
                            }`}
                          >
                            {item.isUrgent ? 'alarm' : 'schedule'}
                          </span>
                          {item.expiresInText}
                        </span>

                        {item.donorOrg.verifiedKitchen && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#85f8c4] text-[#002114] text-xs font-bold">
                            <span
                              className="material-symbols-outlined text-[14px]"
                              style={{ fontVariationSettings: "'FILL' 1" }}
                            >
                              verified
                            </span>
                            Verified
                          </span>
                        )}
                      </div>

                      <span className="text-xs text-[#3d4a42] font-semibold flex items-center gap-0.5 flex-shrink-0">
                        <span className="material-symbols-outlined text-[15px] text-[#006948]">navigation</span>
                        {item.distanceKm} km
                      </span>
                    </div>

                    {/* Title & Description Zone with Visual Thumbnail */}
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <h2 className="font-bold text-sm text-[#131b2e] truncate">
                          {item.donorOrg.name}
                        </h2>
                        <p className="font-bold text-base text-[#006948] mt-0.5">
                          {item.title}
                        </p>
                        <p className="text-xs text-[#3d4a42] line-clamp-2 mt-0.5 leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      {item.images.length > 0 && (
                        <img
                          alt={item.title}
                          referrerPolicy="no-referrer"
                          className="w-18 h-18 sm:w-20 sm:h-20 rounded-lg object-cover flex-shrink-0 bg-[#eaedff] border border-[#dae2fd]"
                          src={item.images[0]}
                        />
                      )}
                    </div>

                    {/* Safety & Logistics Specification Chips */}
                    <div className="flex flex-wrap gap-1.5 bg-[#f2f3ff] p-2 rounded-lg border border-[#dae2fd]/50">
                      <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-white text-[#131b2e] text-[11px] font-semibold shadow-2xs">
                        <span className="material-symbols-outlined text-[13px] text-[#fd651e]">
                          thermostat
                        </span>
                        {item.storageType}
                      </div>

                      <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-white text-[#131b2e] text-[11px] font-semibold shadow-2xs">
                        <span className="material-symbols-outlined text-[13px] text-[#0058be]">
                          inventory
                        </span>
                        {item.logisticsNote}
                      </div>

                      {item.dietaryTags.slice(0, 2).map((tag, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-1 px-2 py-0.5 rounded bg-white text-[#131b2e] text-[11px] font-semibold shadow-2xs"
                        >
                          <span className="material-symbols-outlined text-[13px] text-[#006948]">
                            eco
                          </span>
                          {tag}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Bar */}
                  <div className="flex items-center gap-2 pt-1 border-t border-[#eaedff]">
                    <button
                      type="button"
                      onClick={() => onOpenClaimModal(item)}
                      className="flex-1 h-11 rounded-lg bg-[#006948] hover:bg-[#00855d] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-[0.98] transition-all cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">assignment_turned_in</span>
                      <span>Claim for My NGO</span>
                    </button>

                    <button
                      type="button"
                      aria-label="Call donor"
                      onClick={() => onCallContact(item.donorOrg.name, item.donorOrg.phone)}
                      className="w-11 h-11 rounded-lg bg-[#e2e7ff] hover:bg-[#dae2fd] text-[#131b2e] flex items-center justify-center active:scale-95 transition-all"
                    >
                      <span className="material-symbols-outlined text-[18px]">call</span>
                    </button>

                    <button
                      type="button"
                      aria-label="Share listing"
                      onClick={() => handleShare(item)}
                      className="w-11 h-11 rounded-lg bg-[#f2f3ff] hover:bg-[#eaedff] text-[#3d4a42] flex items-center justify-center active:scale-95 transition-all"
                    >
                      <span className="material-symbols-outlined text-[18px]">share</span>
                    </button>
                  </div>
                </motion.article>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
