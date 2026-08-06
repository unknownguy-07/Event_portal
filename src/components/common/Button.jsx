import React from 'react';

/**
 * Reusable Button component with clean baseline styling.
 */
export function Button({ children, variant = 'primary', className = '', ...props }) {
  return (
    <button
      className={`px-4 py-2 rounded-full font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
