import React from 'react';

/**
 * Baseline Modal component for dialogs and auth prompts.
 */
export function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#080811]/80 backdrop-blur-md">
      {/* Clickable backdrop */}
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />
      <div className="bg-gradient-to-b from-[#18142A] to-[#12101F] border border-purple-500/25 rounded-2xl p-6 max-w-md w-full shadow-2xl shadow-purple-950/40 relative z-10 animate-fade-in">
        {title && <h3 className="text-xl font-extrabold text-[#F1F0F5] mb-4 tracking-tight">{title}</h3>}
        {children}
      </div>
    </div>
  );
}
