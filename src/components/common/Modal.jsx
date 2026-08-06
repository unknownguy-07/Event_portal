import React from 'react';

/**
 * Baseline Modal component for dialogs and auth prompts.
 */
export function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl relative">
        {title && <h3 className="text-xl font-bold text-white mb-4">{title}</h3>}
        {children}
      </div>
    </div>
  );
}
