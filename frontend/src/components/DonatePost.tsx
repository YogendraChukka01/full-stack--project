import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { DonationItem, DonationCategory } from '../types';

interface DonatePostProps {
  onPublishSuccess: (donation: DonationItem) => void | Promise<void>;
  onCancel: () => void;
}

const toLocalDateTimeValue = (date: Date) => {
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 16);
};

export const DonatePost: React.FC<DonatePostProps> = ({
  onPublishSuccess,
  onCancel,
}) => {
  const [step, setStep] = useState<1 | 2>(1);

  // Form states
  const [description, setDescription] = useState('Steamed Rice, Paneer Curry & Chapati');
  const [category, setCategory] = useState<DonationCategory>('Cooked Meal');
  const [weightKg, setWeightKg] = useState('24');
  const [servings, setServings] = useState('60');
  const [preparedTime, setPreparedTime] = useState(() => toLocalDateTimeValue(new Date(Date.now() - 60 * 60 * 1000)));
  const [consumeBeforeTime, setConsumeBeforeTime] = useState(() => toLocalDateTimeValue(new Date(Date.now() + 4 * 60 * 60 * 1000)));
  const [tags, setTags] = useState<string[]>([
    'Vegetarian',
    'Contains Dairy',
    'Nut-Free',
    'Food-Grade Foil Packed',
  ]);
  const [donorName, setDonorName] = useState('Spice Terrace Restaurant');
  const [pickupAddress, setPickupAddress] = useState('Jubilee Hills Rd 36, Hyderabad');
  const [pickupLatitude, setPickupLatitude] = useState(Number(import.meta.env.VITE_DEFAULT_LATITUDE ?? 12.9716));
  const [pickupLongitude, setPickupLongitude] = useState(Number(import.meta.env.VITE_DEFAULT_LONGITUDE ?? 77.5946));
  const [courierNote, setCourierNote] = useState('Rear kitchen entrance, ask for Chef Raghav');
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([
    'https://lh3.googleusercontent.com/aida-public/AB6AXuABZrng0qqPzf2-BVbPYSFEfcjTI5xYbVtMAKkGUin6fP53uk0XOz0YuGb-rlFtt6pVeITAxeyr-D_ZClFb7t1EksFu9HXnekxcRXFeDxFeQYG5Gqa2Iu6_5Iz49JkU_G4sG38tGRbP-8jlQcxTCr4Ue1xOrUF8qOufNd_D80J8jTNck1FoyX21Ibp7SVMuQGH_sH990dYbJRnwVgkxxK0_WkMdfczu0TmmDVAesdnE-iDPlvcFzoxN'
  ]);
  const [isLocating, setIsLocating] = useState(false);
  const [gpsStatus, setGpsStatus] = useState<string>('GPS Detect');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculated CO2e reduction (avg 2.6 kg CO2e saved per kg food diverted)
  const numericWeight = parseFloat(weightKg) || 0;
  const co2Equivalent = (numericWeight * 2.6).toFixed(1);

  const applyPreset = (type: 'buffet' | 'bakery' | 'packaged' | 'produce') => {
    if (type === 'buffet') {
      setDescription('Steamed Rice, Paneer Curry & Chapati');
      setCategory('Cooked Meal');
      setWeightKg('24');
      setServings('60');
      setTags(['Vegetarian', 'Contains Dairy', 'Nut-Free', 'Food-Grade Foil Packed']);
    } else if (type === 'bakery') {
      setDescription('Artisan Sourdough, Baguettes & Croissants');
      setCategory('Bakery');
      setWeightKg('14');
      setServings('35');
      setTags(['Contains Gluten', 'Vegetarian', 'Food-Grade Paper Wrapped']);
    } else if (type === 'packaged') {
      setDescription('Canned Pulses, Tetra Pack Milk & Dry Oats');
      setCategory('Packaged');
      setWeightKg('32');
      setServings('80');
      setTags(['Ambient Storage', 'Sealed Containers', 'Vegetarian']);
    } else if (type === 'produce') {
      setDescription('Farm Fresh Spinach, Tomatoes & Potatoes');
      setCategory('Raw Produce');
      setWeightKg('45');
      setServings('110');
      setTags(['100% Vegetarian', 'Raw Produce', 'Uncooked']);
    }
  };

  const toggleTag = (tagName: string) => {
    if (tags.includes(tagName)) {
      setTags(tags.filter((t) => t !== tagName));
    } else {
      setTags([...tags, tagName]);
    }
  };

  const handleGpsDetect = () => {
    setIsLocating(true);
    setGpsStatus('Locating...');

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setIsLocating(false);
          setGpsStatus('Accurate (5m)');
          setPickupLatitude(pos.coords.latitude);
          setPickupLongitude(pos.coords.longitude);
          setPickupAddress(`Detected GPS: (${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}) Indiranagar`);
        },
        () => {
          setIsLocating(false);
          setGpsStatus('Location unavailable');
        },
        { timeout: 4000 }
      );
    } else {
      setIsLocating(false);
      setGpsStatus('Location unavailable');
    }
  };

  const handleAddSamplePhoto = () => {
    const sample =
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCeQUBac-Ksll3oNpipVXeG00YKVpAWlRhEOz3OQGBgb0u_wPvvSMwiZkgd68M7Z_VZw8hSmdAEv3FtvOzmz7WSWNnLnqCrqjuIfRVCnPGiOtWO7aJ7nnihAtdl30iGBZZFL-iY6-ZdPQrsFjRbwougDQuEkbnVWf1NrEvh1Rj1mnDN1ZeX_M8jskddGH1bhsekcCC2Y01s5j94bByfF-XjJO0kbpGscksp1YDlSgxLI2OY2a-M2e-q';
    if (!uploadedPhotos.includes(sample)) {
      setUploadedPhotos([...uploadedPhotos, sample]);
    }
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      alert('Please provide a description of the surplus food.');
      return;
    }

    setIsSubmitting(true);
    try {
      const newDonation: DonationItem = {
        id: `DON-${Date.now().toString().slice(-4)}`,
        donorOrg: {
          id: `ORG-${Date.now().toString().slice(-3)}`,
          name: donorName,
          address: pickupAddress,
          phone: '+91 98450 11223',
          verifiedKitchen: true,
        },
        title: `${servings} Servings (approx. ${weightKg} kg)`,
        description,
        category,
        quantityKg: numericWeight,
        servings: parseInt(servings) || 40,
        co2SavedKg: parseFloat(co2Equivalent),
        preparedAt: preparedTime,
        bestBeforeAt: consumeBeforeTime,
        expiresInText: 'Expires in 4h 30m',
        isUrgent: true,
        distanceKm: 1.5,
        pickupAddress,
        pickupLatitude,
        pickupLongitude,
        storageType: category === 'Cooked Meal' ? 'Cooked Hot (Ready for pickup)' : 'Ambient Storage (Dry)',
        logisticsNote: 'Insulated Bags Recommended',
        dietaryTags: tags,
        status: 'AVAILABLE',
        images: uploadedPhotos,
        pickupNote: courierNote,
        createdAt: new Date().toISOString(),
      };

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#006948', '#85f8c4', '#fd651e', '#2170e4'],
        });
      } catch {}
      await onPublishSuccess(newDonation);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-28 pt-2">
      {/* 2-Step Progress Header */}
      <div className="flex flex-col gap-2 mb-6 max-w-3xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#006948] text-white font-bold text-xs">
              {step}
            </span>
            <span className="font-bold text-sm text-[#131b2e]">
              {step === 1 ? 'Step 1 of 2: Food & Quantity details' : 'Step 2 of 2: Logistics & Dispatch'}
            </span>
          </div>
          <span className="font-bold text-xs text-[#006948] bg-[#85f8c4]/40 px-2.5 py-0.5 rounded-full">
            {step === 1 ? '50% Complete' : '100% Ready'}
          </span>
        </div>

        <div className="w-full bg-[#e2e7ff] h-1.5 rounded-full overflow-hidden">
          <div
            className={`bg-[#006948] h-full rounded-full transition-all duration-300 ${
              step === 1 ? 'w-1/2' : 'w-full'
            }`}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Input Form */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* Quick Presets (1-Tap Fill) */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#3d4a42] flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-[#fd651e]">bolt</span>
                Quick Presets (1-Tap Fill)
              </span>
              <span className="text-xs text-[#006948] font-semibold">Tap to populate</span>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              <button
                type="button"
                onClick={() => applyPreset('buffet')}
                className="flex-shrink-0 flex items-center gap-1.5 py-2 px-3 rounded-xl bg-white shadow-xs border border-[#eaedff] active:scale-95 transition-all text-[#131b2e] hover:bg-[#f2f3ff]"
              >
                <span className="material-symbols-outlined text-[18px] text-[#006948]">restaurant</span>
                <span className="text-xs font-bold">Restaurant Buffet</span>
              </button>

              <button
                type="button"
                onClick={() => applyPreset('bakery')}
                className="flex-shrink-0 flex items-center gap-1.5 py-2 px-3 rounded-xl bg-white shadow-xs border border-[#eaedff] active:scale-95 transition-all text-[#131b2e] hover:bg-[#f2f3ff]"
              >
                <span className="material-symbols-outlined text-[18px] text-[#fd651e]">bakery_dining</span>
                <span className="text-xs font-bold">Bakery / Bread</span>
              </button>

              <button
                type="button"
                onClick={() => applyPreset('packaged')}
                className="flex-shrink-0 flex items-center gap-1.5 py-2 px-3 rounded-xl bg-white shadow-xs border border-[#eaedff] active:scale-95 transition-all text-[#131b2e] hover:bg-[#f2f3ff]"
              >
                <span className="material-symbols-outlined text-[18px] text-[#2170e4]">inventory_2</span>
                <span className="text-xs font-bold">Packaged Goods</span>
              </button>

              <button
                type="button"
                onClick={() => applyPreset('produce')}
                className="flex-shrink-0 flex items-center gap-1.5 py-2 px-3 rounded-xl bg-white shadow-xs border border-[#eaedff] active:scale-95 transition-all text-[#131b2e] hover:bg-[#f2f3ff]"
              >
                <span className="material-symbols-outlined text-[18px] text-[#00855d]">nutrition</span>
                <span className="text-xs font-bold">Raw Vegetables</span>
              </button>
            </div>
          </div>

          <form onSubmit={handlePublish} className="flex flex-col gap-3.5">
            {/* Surplus Description */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-[#eaedff] flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label htmlFor="surplus-desc" className="text-xs font-bold text-[#131b2e] flex items-center gap-1">
                  <span>Surplus Description</span>
                  <span className="text-[#fd651e]">*</span>
                </label>
                <span className="text-[11px] text-[#3d4a42]">
                  {description.length}/80
                </span>
              </div>

              <input
                id="surplus-desc"
                type="text"
                maxLength={80}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Steamed Rice, Paneer Curry & Chapati"
                className="w-full bg-[#f2f3ff] px-3.5 py-3 rounded-lg text-sm text-[#131b2e] font-medium border border-[#dae2fd] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006948]/20 transition-colors"
              />
            </div>

            {/* Food Category Selector */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-[#eaedff] flex flex-col gap-2.5">
              <label className="text-xs font-bold text-[#131b2e]">Food Category</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  {
                    id: 'Cooked Meal' as DonationCategory,
                    title: 'Cooked Meal',
                    desc: 'Hot / Freshly made',
                    icon: 'skillet',
                  },
                  {
                    id: 'Packaged' as DonationCategory,
                    title: 'Packaged',
                    desc: 'Sealed boxes/cans',
                    icon: 'takeout_dining',
                  },
                  {
                    id: 'Bakery' as DonationCategory,
                    title: 'Bakery',
                    desc: 'Breads, baked items',
                    icon: 'cookie',
                  },
                  {
                    id: 'Raw Produce' as DonationCategory,
                    title: 'Raw Produce',
                    desc: 'Uncooked greens/veg',
                    icon: 'eco',
                  },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`flex items-center gap-2 p-2.5 rounded-lg text-left transition-all ${
                      category === cat.id
                        ? 'bg-[#00855d] text-white shadow-sm ring-2 ring-[#85f8c4]'
                        : 'bg-[#f2f3ff] text-[#3d4a42] hover:bg-[#eaedff]'
                    }`}
                  >
                    <span
                      className="material-symbols-outlined text-[20px]"
                      style={{ fontVariationSettings: category === cat.id ? "'FILL' 1" : "'FILL' 0" }}
                    >
                      {cat.icon}
                    </span>
                    <div>
                      <div className="text-xs font-bold leading-tight">{cat.title}</div>
                      <div className="text-[10px] opacity-80">{cat.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity & Impact */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-[#eaedff] flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#131b2e]">Quantity & Impact</span>
                <span className="text-xs font-bold text-[#006948] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">volunteer_activism</span>
                  Feeds ~{servings} people
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] text-[#3d4a42] font-semibold">Total Weight</label>
                  <div className="relative flex items-center">
                    <input
                      type="number"
                      min="1"
                      required
                      value={weightKg}
                      onChange={(e) => {
                        const val = e.target.value;
                        setWeightKg(val);
                        const n = parseFloat(val) || 0;
                        setServings(Math.round(n * 2.5).toString());
                      }}
                      className="w-full bg-[#f2f3ff] px-3.5 py-2.5 rounded-lg text-[#131b2e] font-bold text-base border border-[#dae2fd] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006948]/20"
                    />
                    <span className="absolute right-3 text-xs font-bold text-[#3d4a42]">kg</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[11px] text-[#3d4a42] font-semibold">Estimated Servings</label>
                  <div className="relative flex items-center">
                    <input
                      type="number"
                      min="1"
                      required
                      value={servings}
                      onChange={(e) => setServings(e.target.value)}
                      className="w-full bg-[#f2f3ff] px-3.5 py-2.5 rounded-lg text-[#131b2e] font-bold text-base border border-[#dae2fd] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006948]/20"
                    />
                    <span className="absolute right-3 text-xs font-bold text-[#3d4a42]">meals</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[#f2f3ff] text-[#3d4a42] border border-[#dae2fd]/60">
                <span className="material-symbols-outlined text-[18px] text-[#006948]">eco</span>
                <span className="text-xs">
                  Reduces approx.{' '}
                  <strong className="text-[#131b2e] font-bold">{co2Equivalent} kg CO₂ equivalent</strong>{' '}
                  greenhouse emissions.
                </span>
              </div>
            </div>

            {/* Freshness & Time Window */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-[#eaedff] flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#131b2e]">Freshness & Time Window</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#ffdbce] text-[#370e00] text-xs font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#fd651e] animate-ping" />
                  Urgent Pickup
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] text-[#3d4a42] font-semibold">Prepared At</label>
                  <div className="flex items-center gap-1.5 bg-[#f2f3ff] px-3 py-2.5 rounded-lg text-[#131b2e] border border-[#dae2fd]">
                    <span className="material-symbols-outlined text-[18px] text-[#3d4a42]">schedule</span>
                    <input
                      type="datetime-local"
                      value={preparedTime}
                      onChange={(e) => setPreparedTime(e.target.value)}
                      className="bg-transparent text-xs font-bold text-[#131b2e] focus:outline-none w-full"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[11px] text-[#3d4a42] font-semibold">Consume Before</label>
                  <div className="flex items-center gap-1.5 bg-[#ffdbce]/50 px-3 py-2.5 rounded-lg text-[#370e00] border border-[#ffb599]">
                    <span className="material-symbols-outlined text-[18px] text-[#a73a00]">timelapse</span>
                    <input
                      type="datetime-local"
                      value={consumeBeforeTime}
                      onChange={(e) => setConsumeBeforeTime(e.target.value)}
                      className="bg-transparent text-xs font-bold text-[#a73a00] focus:outline-none w-full"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-lg bg-[#ffdbce]/30 text-[#7f2b00] border border-[#ffdbce]">
                <span className="material-symbols-outlined text-[20px] text-[#fd651e] flex-shrink-0 mt-0.5">
                  notification_important
                </span>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-[#131b2e]">
                    4h 30m Rescue Window Remaining
                  </span>
                  <span className="text-[11px] text-[#3d4a42]">
                    Couriers & shelters within 5km will prioritize immediate collection.
                  </span>
                </div>
              </div>
            </div>

            {/* Food Safety & Dietary Tags */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-[#eaedff] flex flex-col gap-2">
              <span className="text-xs font-bold text-[#131b2e]">Food Safety & Dietary Tags</span>
              <p className="text-[11px] text-[#3d4a42]">
                Helps shelters match food immediately to dietary restrictions.
              </p>

              <div className="flex flex-wrap gap-2 pt-1">
                {[
                  'Vegetarian',
                  'Contains Dairy',
                  'Nut-Free',
                  'Food-Grade Foil Packed',
                  'Gluten-Free',
                  'Halal Certified',
                  'Egg-Free',
                  'Insulated Crates',
                ].map((tag) => {
                  const active = tags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                        active
                          ? 'bg-[#85f8c4] text-[#002114] shadow-xs'
                          : 'bg-[#f2f3ff] text-[#3d4a42] hover:bg-[#eaedff]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {active ? 'check_circle' : 'add'}
                      </span>
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Pickup Address & Access */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-[#eaedff] flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#131b2e]">Pickup Address & Access</label>
                <button
                  type="button"
                  disabled={isLocating}
                  onClick={handleGpsDetect}
                  className="flex items-center gap-1 text-[#006948] text-xs font-bold active:scale-95 transition-all hover:underline"
                >
                  <span className={`material-symbols-outlined text-[16px] ${isLocating ? 'animate-spin' : ''}`}>
                    my_location
                  </span>
                  <span>{gpsStatus}</span>
                </button>
              </div>

              <div className="flex items-center gap-2 bg-[#f2f3ff] px-3.5 py-3 rounded-lg border border-[#dae2fd]">
                <span className="material-symbols-outlined text-[20px] text-[#006948] flex-shrink-0">
                  storefront
                </span>
                <div className="flex flex-col min-w-0 flex-1">
                  <input
                    type="text"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    className="text-xs font-bold text-[#131b2e] bg-transparent focus:outline-none truncate"
                    placeholder="Donor Kitchen / Restaurant Name"
                  />
                  <input
                    type="text"
                    value={pickupAddress}
                    onChange={(e) => setPickupAddress(e.target.value)}
                    className="text-[11px] text-[#3d4a42] bg-transparent focus:outline-none truncate mt-0.5"
                    placeholder="Full street address and landmark"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-[#3d4a42] font-semibold">Courier Pickup Note</label>
                <input
                  type="text"
                  value={courierNote}
                  onChange={(e) => setCourierNote(e.target.value)}
                  placeholder="e.g. Loading dock 2, ring bell"
                  className="w-full bg-[#f2f3ff] px-3.5 py-2.5 rounded-lg text-xs text-[#131b2e] font-medium border border-[#dae2fd] focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            {/* Photos of Food Containers */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-[#eaedff] flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#131b2e]">Photos of Food Containers</span>
                <span className="text-xs font-bold text-[#006948]">
                  {uploadedPhotos.length} Uploaded
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {uploadedPhotos.map((photo, idx) => (
                  <div key={idx} className="relative aspect-square rounded-lg overflow-hidden shadow-xs group border border-[#dae2fd]">
                    <img
                      alt="Packaged food"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                      src={photo}
                    />
                    <div className="absolute bottom-1 left-1 bg-white/90 px-1.5 py-0.5 rounded text-[10px] font-bold text-[#131b2e] flex items-center gap-0.5 shadow-xs">
                      <span className="material-symbols-outlined text-[12px] text-[#006948]">verified</span>
                      Ready
                    </div>
                    <button
                      type="button"
                      aria-label="Remove photo"
                      onClick={() => setUploadedPhotos(uploadedPhotos.filter((_, i) => i !== idx))}
                      className="absolute top-1 right-1 w-6 h-6 rounded-full bg-[#131b2e]/80 text-white flex items-center justify-center hover:bg-red-600"
                    >
                      <span className="material-symbols-outlined text-[14px]">close</span>
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={handleAddSamplePhoto}
                  className="aspect-square rounded-lg bg-[#f2f3ff] border border-dashed border-[#bccac0] flex flex-col items-center justify-center text-[#3d4a42] active:scale-95 transition-all hover:bg-[#eaedff]"
                >
                  <span className="material-symbols-outlined text-[24px] text-[#006948]">photo_camera</span>
                  <span className="text-xs font-bold mt-1">Add Photo</span>
                </button>

                <div className="aspect-square rounded-lg bg-[#f2f3ff] flex flex-col items-center justify-center p-2 text-center text-[#3d4a42]">
                  <span className="material-symbols-outlined text-[20px] text-[#006948]">verified_user</span>
                  <span className="text-[10px] leading-tight mt-1 text-[#3d4a42]">
                    Photos boost claim rate by 80%
                  </span>
                </div>
              </div>
            </div>

            {/* Action Trigger */}
            <div className="flex flex-col gap-2 pt-1">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-4 rounded-xl bg-[#006948] hover:bg-[#00855d] text-white shadow-lg shadow-[#006948]/20 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <span className="material-symbols-outlined text-[22px] animate-spin">progress_activity</span>
                    <span className="font-bold text-sm">Broadcasting Rescue to NGOs...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[22px]">rocket_launch</span>
                    <span className="font-bold text-sm">Publish Surplus Donation (Free Rescue)</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-center px-2">
                <span className="material-symbols-outlined text-[16px] text-[#006948]">notifications_active</span>
                <span className="text-xs text-[#3d4a42]">
                  Nearby verified NGOs will be alerted instantly via push notification
                </span>
              </div>
            </div>
          </form>
        </div>

        {/* RIGHT COLUMN (Desktop Live Preview Card + Legal Safeguards) */}
        <div className="lg:col-span-5 flex flex-col gap-4 lg:sticky lg:top-20">
          <div className="bg-white p-4 rounded-xl border border-[#eaedff] shadow-sm flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#131b2e] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-[#006948]">visibility</span>
                Live NGO Feed Preview
              </span>
              <span className="text-[10px] font-bold text-[#006948] bg-[#85f8c4]/40 px-2 py-0.5 rounded-full">
                Real-time
              </span>
            </div>

            {/* Simulated Live Feed Card */}
            <div className="bg-[#faf8ff] rounded-xl p-3.5 border border-[#dae2fd] flex flex-col gap-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="px-2 py-0.5 rounded-full bg-[#ffdad6] text-[#93000a] font-bold text-[10px] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px]">alarm</span>
                  Urgent Pickup
                </span>
                <span className="text-[#3d4a42] text-[11px] font-semibold flex items-center gap-0.5">
                  <span className="material-symbols-outlined text-[14px] text-[#006948]">navigation</span>
                  1.5 km away
                </span>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-xs text-[#131b2e] truncate">{donorName}</h4>
                  <p className="font-bold text-sm text-[#006948] mt-0.5">
                    {servings} Servings (~{weightKg} kg)
                  </p>
                  <p className="text-[11px] text-[#3d4a42] line-clamp-2 mt-0.5">
                    {description || 'Provide surplus description above...'}
                  </p>
                </div>
                {uploadedPhotos[0] && (
                  <img
                    alt="Preview"
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-lg object-cover border border-[#dae2fd]"
                    src={uploadedPhotos[0]}
                  />
                )}
              </div>

              <div className="flex flex-wrap gap-1">
                {tags.slice(0, 3).map((t, idx) => (
                  <span key={idx} className="text-[10px] px-2 py-0.5 bg-white rounded font-medium text-[#131b2e] border border-[#eaedff]">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Impact Projected Box */}
            <div className="bg-[#f2f3ff] p-3 rounded-lg border border-[#dae2fd] flex items-center justify-between text-xs">
              <div>
                <span className="text-[#6d7a72] block">Projected CO₂ Savings</span>
                <span className="font-extrabold text-base text-[#006948]">{co2Equivalent} kg</span>
              </div>
              <div className="text-right">
                <span className="text-[#6d7a72] block">Dignified Meals</span>
                <span className="font-extrabold text-base text-[#131b2e]">{servings} plates</span>
              </div>
            </div>
          </div>

          {/* Legal Protection Card */}
          <div className="p-4 rounded-xl bg-[#e2e7ff]/70 border border-[#dae2fd] flex items-start gap-3 shadow-2xs">
            <div className="w-10 h-10 rounded-full bg-[#85f8c4] flex items-center justify-center text-[#002114] flex-shrink-0">
              <span className="material-symbols-outlined text-[20px]">handshake</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-xs text-[#131b2e]">Protected by Good Samaritan Food Act</span>
              <span className="text-[11px] text-[#3d4a42] leading-relaxed mt-0.5">
                Food donors acting in good faith without gross negligence are legally shielded from civil or criminal liability.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
