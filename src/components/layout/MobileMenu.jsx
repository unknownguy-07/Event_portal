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
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="relative w-full max-w-xs bg-slate-900 border-l border-slate-800 h-full p-6 flex flex-col justify-between shadow-2xl z-10 overflow-y-auto">
        <div>
          <div className="flex items-center justify-between pb-6 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white text-xs">
                E
              </div>
              <span className="font-bold text-white text-base">EventPortal</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="py-6 flex flex-col gap-6">
            {collegeInfo && (
              <div className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-xl">
                <span className="text-[10px] font-semibold text-indigo-400 uppercase tracking-wider block mb-1">
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

        <div className="pt-6 border-t border-slate-800 text-center text-[11px] text-slate-500">
          University Event Portal • Mobile Navigation
        </div>
      </div>
    </div>
  );
}
