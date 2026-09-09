import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { CollegeInfoBlock } from './CollegeInfoBlock';

/**
 * Mobile Navigation Drawer for secondary controls and mobile views.
 */
export function MobileMenu({ isOpen, onClose, collegeInfo, children }) {
  // Prevent body scrolling when mobile drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#080811]/85 backdrop-blur-md transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="relative w-full max-w-xs bg-[#0D0B18] border-l border-purple-500/20 h-full p-6 flex flex-col justify-between shadow-2xl shadow-purple-950/50 z-10 overflow-y-auto">
        <div>
          <div className="flex items-center justify-between pb-6 border-b border-purple-500/15">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#9B5CFF] to-[#6E2FF0] flex items-center justify-center font-bold text-white text-xs shadow-md shadow-purple-600/30">
                E
              </div>
              <span className="font-extrabold text-[#F1F0F5] text-base">
                Event<span className="bg-gradient-to-r from-[#9B5CFF] to-[#C084FC] bg-clip-text text-transparent">Portal</span>
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-[#9CA3B5] hover:text-[#F1F0F5] hover:bg-[#161324] rounded-lg transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="py-6 flex flex-col gap-6">
            {collegeInfo && (
              <div className="p-4 bg-[#12101F] border border-purple-500/15 rounded-xl">
                <span className="text-[10px] font-semibold text-[#C084FC] uppercase tracking-wider block mb-1">
                  Campus Location
                </span>
                <CollegeInfoBlock
                  name={collegeInfo.name}
                  address={collegeInfo.address}
                  mapsQueryUrl={collegeInfo.mapsQueryUrl}
                />
              </div>
            )}
            <div className="flex flex-col gap-3">{children}</div>
          </div>
        </div>

        <div className="pt-6 border-t border-purple-500/15 text-center text-[11px] text-[#6B6882]">
          University Event Portal • Mobile Navigation
        </div>
      </div>
    </div>
  );
}
