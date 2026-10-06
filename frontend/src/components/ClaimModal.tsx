import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'motion/react';
import { DonationItem } from '../types';

interface ClaimModalProps {
  donation: DonationItem | null;
  onClose: () => void;
  onConfirmClaim: (donation: DonationItem, transportNotes: string) => void | Promise<void>;
}

export const ClaimModal: React.FC<ClaimModalProps> = ({
  donation,
  onClose,
  onConfirmClaim,
}) => {
  const [safetyChecked, setSafetyChecked] = useState(true);
  const [assignedVehicle, setAssignedVehicle] = useState('Seva Outreach Van #2 (Insulated)');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!donation) return null;

  const handleConfirm = () => {
    if (!safetyChecked) {
      alert('Please confirm the food safety and distribution guideline commitment.');
      return;
    }
    setIsSubmitting(true);
    void (async () => {
      try {
        try {
          confetti({
            particleCount: 75,
            spread: 60,
            origin: { y: 0.6 },
            colors: ['#006948', '#85f8c4', '#2170e4', '#fd651e'],
          });
        } catch {}
        await onConfirmClaim(donation, assignedVehicle);
        onClose();
      } catch {
        return;
      } finally {
        setIsSubmitting(false);
      }
    })();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#283044]/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl p-6 flex flex-col gap-4 shadow-2xl border border-[#dae2fd]"
      >
        {/* Drag Handle on Mobile */}
        <div className="w-12 h-1.5 bg-[#bccac0]/60 rounded-full mx-auto -mt-2 sm:hidden" />

        {/* Modal Header */}
        <div className="flex items-start justify-between">
          <div>
            <span className="px-2 py-0.5 rounded-full bg-[#85f8c4] text-[#002114] font-bold text-xs">
              Confirm NGO Pickup
            </span>
            <h2 className="text-xl font-bold text-[#131b2e] mt-1 tracking-tight">
              {donation.donorOrg.name}
            </h2>
            <p className="text-sm text-[#3d4a42] font-medium">
              {donation.title}
            </p>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#eaedff] flex items-center justify-center text-[#3d4a42] hover:text-[#131b2e] active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Transport Details Confirmation Card */}
        <div className="bg-[#f2f3ff] rounded-xl p-3.5 flex flex-col gap-2.5 border border-[#dae2fd]/60">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#3d4a42]">Pickup Window</span>
            <span className="font-bold text-[#a73a00] flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">timer</span>
              {donation.expiresInText}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-[#3d4a42]">Distance from your Hub</span>
            <span className="font-semibold text-[#131b2e]">
              {donation.distanceKm} km (approx {Math.round(donation.distanceKm * 4)} mins)
            </span>
          </div>

          <div className="flex items-center justify-between text-xs pt-1 border-t border-[#dae2fd]">
            <span className="text-[#3d4a42]">Dispatch Assigned To</span>
            <select
              value={assignedVehicle}
              onChange={(e) => setAssignedVehicle(e.target.value)}
              className="font-bold text-[#006948] bg-white border border-[#bccac0] rounded px-2 py-1 text-xs focus:outline-none"
            >
              <option value="Seva Outreach Van #2 (Insulated)">Seva Outreach Van #2 (Insulated)</option>
              <option value="Community Volunteer Bike Courier #1">Community Volunteer Courier #1</option>
              <option value="Direct Hub Pickup (Self Drive)">Direct Hub Pickup (Self Drive)</option>
            </select>
          </div>
        </div>

        {/* Safety Commitment Checkbox */}
        <label className="flex items-start gap-2.5 cursor-pointer select-none bg-[#faf8ff] p-2.5 rounded-lg border border-[#eaedff]">
          <input
            type="checkbox"
            checked={safetyChecked}
            onChange={(e) => setSafetyChecked(e.target.checked)}
            className="mt-0.5 w-4 h-4 accent-[#006948] rounded cursor-pointer"
          />
          <span className="text-xs text-[#3d4a42] leading-relaxed">
            I confirm our NGO has food-grade insulated transport ready and will strictly follow the 2-hour rapid distribution guideline under safe temperatures.
          </span>
        </label>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 pt-1">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleConfirm}
            className="w-full h-12 rounded-lg bg-[#006948] hover:bg-[#00855d] text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <span className="material-symbols-outlined text-[20px] animate-spin">progress_activity</span>
                <span>Locking Pickup Slot...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[20px]">lock_clock</span>
                <span>Confirm Instant Claim & Route</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full h-10 rounded-lg text-[#3d4a42] hover:text-[#131b2e] font-semibold text-xs"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );
};
