import React from 'react';

/**
 * Responsive Mobile Menu drawer component stub.
 */
export function MobileMenu({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 bg-slate-950/90 backdrop-blur-md md:hidden p-6 pt-20">
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  );
}
