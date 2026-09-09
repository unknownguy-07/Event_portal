import React, { useState } from 'react';

export const CategoryPill = ({ label, isActive, onClick, icon: Icon }) => {
  const [isHovered, setIsHovered] = useState(false);

  const backgroundColor = isActive
    ? 'var(--accent)'
    : isHovered
    ? 'var(--bg-hover)'
    : 'var(--bg-card)';
  
  const color = isActive ? 'var(--text-inverse)' : 'var(--text-secondary)';

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="flex items-center justify-center gap-1.5 px-4 rounded-full text-sm font-medium whitespace-nowrap cursor-pointer transition-colors duration-150"
      style={{
        minHeight: '36px',
        backgroundColor,
        color,
        border: 'none',
      }}
      aria-pressed={isActive}
    >
      {Icon && <Icon size={16} />}
      {label}
    </button>
  );
};
