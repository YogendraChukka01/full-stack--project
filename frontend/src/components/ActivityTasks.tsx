import React, { useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { RescueMissionTask } from '../types';

interface ActivityTasksProps {
  task: RescueMissionTask;
  onUpdateTask: (task: RescueMissionTask) => void;
  onCallContact: (name: string, phone: string) => void;
  onCompleteDelivery: (task: RescueMissionTask) => void;
}

export const ActivityTasks: React.FC<ActivityTasksProps> = ({
  task,
  onUpdateTask,
  onCallContact,
  onCompleteDelivery,
}) => {
  // Step 1: Pickup states
  const [pickupDone, setPickupDone] = useState(task.pickupCompleted);
  const [showDonorNotes, setShowDonorNotes] = useState(false);

  // Step 2: Dropoff states
  const [otp, setOtp] = useState<string[]>(['', '', '', '']);
  const [photoTaken, setPhotoTaken] = useState(!!task.podPhotoUrl);
  const [photoUrl, setPhotoUrl] = useState(
    task.podPhotoUrl ||
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAelP5na5NovY5FghgBc6gcZdXolHYnp_q-DiSgEBGkvl1J_3abzQppdOpHAZAi1N-Sfa4I7KldcQmfop3RS4wcaJSrRi5NfCA6oMJOd_PAPsxUSYbeUFu-IYlBkkr56NfXeJDHkO1AERfV1kxBbAK00lg0S5Gtfd9JBAr1CEp_rLE3NU5MmBscymT6Y14tYOfNEkEoEFzyhgyLtcGWbksHsAyk_g01cywqawSJ1UHctSE1dEnWKUl2'
  );
  const [hasSigned, setHasSigned] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);

  // Signature canvas
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);

  // OTP inputs refs
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.strokeStyle = '#006948';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) {
      val = val.slice(-1);
    }
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    // Auto-focus next input
    if (val && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Canvas drawing handlers
  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    isDrawingRef.current = true;
    setHasSigned(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    isDrawingRef.current = false;
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSigned(false);
  };

  const handleMarkPickup = () => {
    setPickupDone(true);
    onUpdateTask({
      ...task,
      pickupCompleted: true,
      pickupTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'EN_ROUTE_DELIVERY',
    });
  };

  const handleFinalSubmit = () => {
    const fullOtp = otp.join('');
    if (fullOtp.length < 4) {
      alert('Please enter the 4-digit handover OTP from the recipient.');
      return;
    }
    if (!photoTaken) {
      alert('Please capture a drop-off verification photo of the delivered food.');
      return;
    }
    if (!hasSigned) {
      alert('Please collect recipient signature on the digital pad.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const updated: RescueMissionTask = {
        ...task,
        status: 'COMPLETED',
        podOtp: fullOtp,
        podPhotoUrl: photoUrl,
        podSignature: 'verified_sig_token',
        completedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setIsSubmitting(false);
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#006948', '#85f8c4', '#fd651e', '#2170e4'],
        });
      } catch {}
      onCompleteDelivery(updated);
    }, 1200);
  };

  const openInGoogleMaps = () => {
    const url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
      task.donorAddress
    )}&destination=${encodeURIComponent(task.recipientAddress)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-28 pt-2">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Mission Header, Map & Pickup Instructions */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          {/* Active Task Banner Card */}
          <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-[#eaedff] relative overflow-hidden">
            <div className="absolute -right-6 -bottom-6 w-28 h-28 rounded-full bg-[#85f8c4]/20 pointer-events-none" />

            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="text-[11px] font-bold text-[#6d7a72] tracking-wider uppercase">
                Active Rescue Mission
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#006948] text-white text-xs font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#85f8c4] animate-pulse" />
                Live Route
              </span>
            </div>

            <div className="flex items-baseline justify-between">
              <h1 className="text-2xl font-bold text-[#131b2e] tracking-tight">
                Task #{task.id}
              </h1>
              <span className="text-sm font-bold text-[#006948]">
                {task.distanceTotalKm} km total
              </span>
            </div>

            {/* Micro Status Bar */}
            <div className="mt-3 bg-[#f2f3ff] rounded-lg p-3 flex items-center justify-between border border-[#dae2fd]">
              <div className="flex items-center gap-2">
                <span
                  className="material-symbols-outlined text-[20px] text-[#006948]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  {task.status === 'COMPLETED' ? 'check_circle' : 'directions_car'}
                </span>
                <span className="text-xs font-bold text-[#131b2e] truncate">
                  {task.status === 'COMPLETED'
                    ? 'Mission Completed & Distributed'
                    : pickupDone
                    ? 'En Route to Shelter Drop-off'
                    : 'En Route to Donor Pickup'}
                </span>
              </div>
              <span className="text-xs font-bold text-[#fd651e]">
                {task.status === 'COMPLETED' ? 'Done' : `ETA ${task.etaMinutes} mins`}
              </span>
            </div>
          </div>

          {/* Map & Route Waypoints Overview Card */}
          <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-[#eaedff] flex flex-col">
            <div
              className="relative w-full h-52 sm:h-60 bg-[#e2e7ff] overflow-hidden"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAUY15kX1pnMTxCDTezh2kJ4b39My9cO-g54usZFEjGhRGR44epwWs-Z5t_t0oZFeulJmEK6yesC6HgHeDW0boYVg8H3EdMg4Loa5XijI0QvVDqj1xNozZtOrp6KXVe79fsmJwH4UIlViNa7rXEToCi4u7O-H9hY1CEalJFIIz95RwbLlrkyBDpKoPnNOdbL6vNrx0vZGYjCcn6bLlz_J2scHExQJ7JBh4xg3lxCr67YalyxS8bS54E')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-black/20 pointer-events-none" />

              {/* Live Route HUD Badges */}
              <div className="absolute top-2.5 left-2.5 z-10 flex gap-2">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[#131b2e] text-xs font-bold shadow-md border border-[#bccac0]/40">
                  <span className="material-symbols-outlined text-[14px] text-[#006948]">navigation</span>
                  <span>1.2 km to Pickup</span>
                </span>
              </div>

              <button
                type="button"
                onClick={openInGoogleMaps}
                className="absolute bottom-2.5 right-2.5 z-10 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#006948] hover:bg-[#00855d] text-white text-xs font-bold shadow-md active:scale-95 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">map</span>
                <span>Open in Maps</span>
              </button>
            </div>

            {/* Waypoint Sequence Track */}
            <div className="p-4 sm:p-5 flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-7 h-7 rounded-full bg-[#006948] text-white flex items-center justify-center text-xs shadow-xs">
                    <span className="material-symbols-outlined text-[16px]">restaurant</span>
                  </div>
                  <div className="w-0.5 h-8 bg-[#006948]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-sm text-[#131b2e] truncate">{task.donorName}</p>
                    <span className="text-xs text-[#006948] font-bold">Waypoint 1</span>
                  </div>
                  <p className="text-xs text-[#3d4a42] truncate">{task.donorAddress}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-7 h-7 rounded-full bg-[#e2e7ff] text-[#3d4a42] flex items-center justify-center text-xs">
                    <span className="material-symbols-outlined text-[16px]">apartment</span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-sm text-[#131b2e] truncate">{task.recipientOrg}</p>
                    <span className="text-xs text-[#6d7a72] font-semibold">Waypoint 2</span>
                  </div>
                  <p className="text-xs text-[#3d4a42] truncate">{task.recipientAddress}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Step 1: Donor Pickup Details Card */}
          <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-[#eaedff] flex flex-col gap-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#85f8c4] text-[#002114] font-bold text-xs">
                  1
                </span>
                <h2 className="font-bold text-sm text-[#131b2e]">Pickup Instructions</h2>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#68dba9]/30 text-[#005137] text-xs font-bold">
                {pickupDone ? 'VERIFIED' : 'READY NOW'}
              </span>
            </div>

            {/* Quick Action Contacts */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onCallContact('Chef Mohan', task.donorPhone)}
                className="h-11 px-3 rounded-lg bg-[#f2f3ff] hover:bg-[#eaedff] flex items-center justify-center gap-1.5 text-[#131b2e] active:scale-95 transition-all text-xs font-bold"
              >
                <span className="material-symbols-outlined text-[18px] text-[#006948]">call</span>
                <span className="truncate">Call Chef Mohan</span>
              </button>

              <button
                type="button"
                onClick={() => setShowDonorNotes(!showDonorNotes)}
                className="h-11 px-3 rounded-lg bg-[#f2f3ff] hover:bg-[#eaedff] flex items-center justify-center gap-1.5 text-[#131b2e] active:scale-95 transition-all text-xs font-bold"
              >
                <span className="material-symbols-outlined text-[18px] text-[#0058be]">chat</span>
                <span className="truncate">Donor Notes</span>
              </button>
            </div>

            {showDonorNotes && (
              <div className="p-3 bg-[#e2e7ff]/60 rounded-lg text-xs text-[#131b2e] border border-[#dae2fd]">
                <span className="font-bold block mb-0.5">Chef's Entry Instructions:</span>
                {task.donorNotes}
              </div>
            )}

            {/* Cargo Manifest Details */}
            <div className="bg-[#f2f3ff] rounded-lg p-3 flex flex-col gap-1.5 border border-[#dae2fd]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#131b2e]">Manifest Checklist</span>
                <span className="text-xs font-bold text-[#006948]">{task.weightKg} kg total</span>
              </div>

              <div className="flex items-center gap-1.5 text-[#3d4a42] text-xs">
                <span className="material-symbols-outlined text-[16px] text-[#fd651e]">inventory_2</span>
                <span>{task.manifestDescription}</span>
              </div>

              <div className="flex items-center gap-1.5 text-[#3d4a42] text-xs">
                <span className="material-symbols-outlined text-[16px] text-[#006948]">thermostat</span>
                <span>{task.storageSpecs}</span>
              </div>
            </div>

            {/* Pickup Action Trigger */}
            {!pickupDone ? (
              <button
                type="button"
                onClick={handleMarkPickup}
                className="w-full h-12 rounded-lg bg-[#006948] hover:bg-[#00855d] text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 active:scale-98 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">photo_camera</span>
                <span>Mark Food Picked Up (Photo Verify)</span>
              </button>
            ) : (
              <div className="bg-[#85f8c4]/30 rounded-lg p-3 flex items-center justify-between border border-[#85f8c4]">
                <div className="flex items-center gap-2">
                  <span
                    className="material-symbols-outlined text-[18px] text-[#006948]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    check_circle
                  </span>
                  <span className="font-bold text-xs text-[#005137]">
                    Pickup Verified & Secured
                  </span>
                </div>
                <span className="text-[11px] text-[#6d7a72] font-semibold">
                  {task.pickupTime || '12:34 PM'}
                </span>
              </div>
            )}
          </div>

          {/* Dispatch Support Help Card */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-[#eaedff] flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full bg-[#ffdbce] text-[#370e00] flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-[20px]">support_agent</span>
              </div>
              <div className="min-w-0">
                <p className="font-bold text-sm text-[#131b2e] truncate">Rescue Dispatch Support</p>
                <p className="text-xs text-[#3d4a42] truncate">Road issues, delays or quantity dispute</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowSupportModal(true)}
              className="px-3.5 py-2 rounded-lg bg-[#f2f3ff] hover:bg-[#eaedff] text-[#131b2e] text-xs font-bold active:scale-95 transition-all flex-shrink-0"
            >
              Help
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Recipient Drop-off & Proof of Delivery (PoD) */}
        <div className="lg:col-span-6 flex flex-col gap-4 lg:sticky lg:top-20">
          {/* Step 2: Recipient Drop-off Details Card */}
          <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-[#eaedff] flex flex-col gap-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#dae2fd] text-[#0058be] font-bold text-xs">
                  2
                </span>
                <h2 className="font-bold text-sm text-[#131b2e]">Recipient Drop-off</h2>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#f2f3ff] text-[#3d4a42] text-xs font-semibold">
                NEXT STOP
              </span>
            </div>

            {/* Shelter Coordinator Info */}
            <div className="bg-[#f2f3ff] rounded-lg p-3.5 flex items-center justify-between border border-[#dae2fd]">
              <div className="flex items-center gap-3 min-w-0">
                <img
                  alt="Sister Clara portrait"
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-full object-cover flex-shrink-0 border-2 border-white shadow-xs"
                  src={task.recipientPhotoUrl}
                />
                <div className="min-w-0">
                  <p className="font-bold text-sm text-[#131b2e] truncate">{task.recipientContact}</p>
                  <p className="text-xs text-[#3d4a42] truncate">Receiving Lead • Shelter Pantry</p>
                </div>
              </div>

              <button
                type="button"
                aria-label="Call receiving lead"
                onClick={() => onCallContact(task.recipientContact, task.recipientPhone)}
                className="w-10 h-10 rounded-full bg-[#e2e7ff] text-[#0058be] flex items-center justify-center active:scale-95 transition-all flex-shrink-0 hover:bg-[#dae2fd]"
              >
                <span className="material-symbols-outlined text-[20px]">call</span>
              </button>
            </div>

            {/* Access Code Card */}
            <div className="p-3.5 rounded-lg bg-[#faf8ff] border border-[#eaedff] flex items-start gap-3">
              <span className="material-symbols-outlined text-[20px] text-[#fd651e] mt-0.5">key</span>
              <div>
                <span className="text-[10px] font-bold text-[#131b2e] uppercase tracking-wider block">
                  Gate Access Code
                </span>
                <p className="font-mono text-lg font-bold text-[#fd651e] tracking-widest mt-0.5">
                  {task.gateAccessCode}
                </p>
                <p className="text-xs text-[#3d4a42] mt-0.5">{task.dropoffInstructions}</p>
              </div>
            </div>
          </div>

          {/* Proof of Delivery (PoD) Section */}
          <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-[#eaedff] flex flex-col gap-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className="material-symbols-outlined text-[22px] text-[#006948]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  verified
                </span>
                <h2 className="font-bold text-sm text-[#131b2e]">Proof of Delivery (PoD)</h2>
              </div>
              <span className="text-xs text-[#6d7a72] font-semibold">Mandatory</span>
            </div>

            {/* 1. 4-Digit Handover OTP Input */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#131b2e]">
                  Handover OTP from Recipient
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setOtp(['4', '9', '2', '0']);
                  }}
                  className="text-[11px] font-semibold text-[#006948] hover:underline"
                >
                  Fill Code (#4920)
                </button>
              </div>

              <div className="grid grid-cols-4 gap-2.5">
                {[0, 1, 2, 3].map((idx) => (
                  <input
                    key={idx}
                    ref={(el) => {
                      inputRefs.current[idx] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={otp[idx]}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    placeholder="•"
                    className="w-full h-12 text-center font-bold text-xl bg-[#f2f3ff] text-[#131b2e] rounded-lg border border-[#dae2fd] focus:bg-white focus:text-[#006948] focus:border-[#006948] focus:outline-none transition-colors"
                  />
                ))}
              </div>
            </div>

            {/* 2. Camera Upload Handover Photo */}
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-bold text-[#131b2e]">Drop-off Photo Documentation</span>

              {!photoTaken ? (
                <button
                  type="button"
                  onClick={() => setPhotoTaken(true)}
                  className="w-full h-24 rounded-lg bg-[#f2f3ff] border border-dashed border-[#bccac0] flex flex-col items-center justify-center gap-1 active:bg-[#eaedff] transition-colors"
                >
                  <span className="material-symbols-outlined text-[26px] text-[#006948]">add_a_photo</span>
                  <span className="text-xs font-bold text-[#131b2e]">Take Handover Photo</span>
                  <span className="text-[11px] text-[#3d4a42]">Capture food inside pantry or cold storage</span>
                </button>
              ) : (
                <div className="w-full h-32 rounded-lg overflow-hidden relative shadow-inner border border-[#dae2fd]">
                  <img
                    alt="Delivered food trays in pantry"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                    src={photoUrl}
                  />
                  <div className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-full bg-white/95 backdrop-blur-sm text-[#006948] text-xs font-bold flex items-center gap-1 shadow-sm">
                    <span className="material-symbols-outlined text-[14px]">check</span> Photo Captured
                  </div>
                  <button
                    type="button"
                    onClick={() => setPhotoTaken(false)}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center active:scale-95"
                  >
                    <span className="material-symbols-outlined text-[16px]">close</span>
                  </button>
                </div>
              )}
            </div>

            {/* 3. Digital Signature Pad */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#131b2e]">Recipient Signature</span>
                <button
                  type="button"
                  onClick={clearSignature}
                  className="text-xs font-semibold text-[#fd651e] hover:underline"
                >
                  Clear
                </button>
              </div>

              <div className="relative w-full h-28 rounded-lg bg-[#f2f3ff] border border-[#dae2fd] overflow-hidden flex items-center justify-center cursor-crosshair">
                <canvas
                  ref={canvasRef}
                  width={460}
                  height={112}
                  className="w-full h-full"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                />
                {!hasSigned && (
                  <span className="absolute pointer-events-none text-xs font-medium text-[#6d7a72] flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">draw</span> Sign on line with finger or mouse
                  </span>
                )}
              </div>
            </div>

            {/* Primary CTA */}
            <button
              type="button"
              disabled={isSubmitting || task.status === 'COMPLETED'}
              onClick={handleFinalSubmit}
              className="w-full h-14 rounded-lg bg-[#006948] hover:bg-[#00855d] text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 active:scale-98 transition-all disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <span className="material-symbols-outlined text-[20px] animate-spin">refresh</span>
                  <span>Verifying Handover...</span>
                </>
              ) : task.status === 'COMPLETED' ? (
                <>
                  <span className="material-symbols-outlined text-[20px]">check_circle</span>
                  <span>Rescue Mission Complete!</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[20px]">task_alt</span>
                  <span>Confirm Safe Handover & Close Task</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Support Modal */}
      {showSupportModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full shadow-2xl border border-[#dae2fd] flex flex-col gap-3">
            <div className="flex items-center gap-2 text-[#006948]">
              <span className="material-symbols-outlined text-[24px]">support_agent</span>
              <h3 className="font-bold text-base text-[#131b2e]">Central Rescue Dispatch</h3>
            </div>
            <p className="text-xs text-[#3d4a42]">
              Need immediate rerouting or dealing with unexpected volume changes?
            </p>
            <div className="bg-[#f2f3ff] p-3 rounded-lg text-xs font-mono font-bold text-[#131b2e]">
              Priority Helpline: 1800-NOURISH (Ext. 4)
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  alert('Connecting to on-duty rescue coordinator...');
                  setShowSupportModal(false);
                }}
                className="flex-1 py-2.5 bg-[#006948] text-white text-xs font-bold rounded-lg cursor-pointer"
              >
                Call Hotline
              </button>
              <button
                type="button"
                onClick={() => setShowSupportModal(false)}
                className="py-2.5 px-4 bg-[#eaedff] text-[#131b2e] text-xs font-semibold rounded-lg cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
