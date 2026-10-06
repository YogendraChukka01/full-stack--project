import React from 'react';
import confetti from 'canvas-confetti';
import { motion } from 'motion/react';
import { VerificationAuditItem } from '../types';

interface DocReviewModalProps {
  item: VerificationAuditItem | null;
  onClose: () => void;
  onApprove: (item: VerificationAuditItem) => void;
}

export const DocReviewModal: React.FC<DocReviewModalProps> = ({
  item,
  onClose,
  onApprove,
}) => {
  if (!item) return null;

  const handleApproveWithCelebration = () => {
    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#006948', '#85f8c4', '#2170e4'],
      });
    } catch {}
    onApprove(item);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#131b2e]/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-6 flex flex-col gap-4 shadow-2xl border border-[#dae2fd]"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#006948] text-[24px]">verified</span>
            <div>
              <h3 className="font-bold text-base text-[#131b2e] leading-snug">
                {item.name} Audit
              </h3>
              <p className="text-xs text-[#3d4a42]">{item.typeLabel}</p>
            </div>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#eaedff] flex items-center justify-center text-[#3d4a42] hover:text-[#131b2e] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Audit Details */}
        <div className="bg-[#f2f3ff] rounded-xl p-4 flex flex-col gap-3 border border-[#dae2fd]">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#3d4a42] font-medium">Compliance License Reg:</span>
            <span className="font-mono font-bold text-[#131b2e]">
              #{item.fssaiNumber}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-[#3d4a42] font-medium">Verification Status:</span>
            <span className="px-2 py-0.5 rounded-full bg-[#85f8c4] text-[#002114] font-bold text-[11px] inline-flex items-center gap-1">
              <span className="material-symbols-outlined text-[12px]">check_circle</span>
              Active & Valid
            </span>
          </div>

          {/* Cryptographic File Preview Card */}
          <div className="h-32 bg-white rounded-lg border border-[#dae2fd] flex flex-col items-center justify-center gap-1.5 p-3 text-center shadow-inner">
            <span className="material-symbols-outlined text-[36px] text-[#6d7a72]">picture_as_pdf</span>
            <span className="text-xs font-bold text-[#131b2e] truncate max-w-full">
              {item.docFileName}
            </span>
            <span className="text-[11px] font-semibold text-[#006948]">
              {item.docFileSize}
            </span>
          </div>
        </div>

        {/* Credentials Tags */}
        <div className="flex flex-wrap gap-1.5">
          {item.credentials.map((cred, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#eaedff] text-[#131b2e] text-xs font-semibold"
            >
              <span className="material-symbols-outlined text-[14px] text-[#006948]">verified</span>
              {cred}
            </span>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex gap-2 pt-1">
          <button
            type="button"
            onClick={handleApproveWithCelebration}
            className="flex-1 h-12 bg-[#006948] hover:bg-[#00855d] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">verified</span>
            <span>Confirm Audit Pass & Authorize</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
