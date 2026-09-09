import React from 'react';

/**
 * Reusable Button component with clean baseline styling.
 */
export function Button({ children, variant = 'primary', className = '', ...props }) {
  const variantStyles = {
    primary:
      'bg-gradient-to-r from-[#8B4DFF] via-[#9B5CFF] to-[#6E2FF0] hover:from-[#9B5CFF] hover:to-[#8B4DFF] text-white shadow-lg shadow-purple-600/30 border border-purple-400/30 hover:shadow-purple-500/50',
    secondary:
      'bg-[#161324] hover:bg-[#1E1932] text-[#F1F0F5] border border-purple-500/20 hover:border-purple-500/40',
    outline:
      'bg-transparent hover:bg-purple-500/10 text-[#C084FC] border border-purple-500/30 hover:border-purple-500/60',
  };

  const currentVariant = variantStyles[variant] || variantStyles.primary;

  return (
    <button
      className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#9B5CFF]/40 ${currentVariant} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
