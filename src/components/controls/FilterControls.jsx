import React from 'react';
import { Filter, Building2 } from 'lucide-react';
import { useEvents } from '@/hooks/useEvents';

/**
 * FilterControls Component
 * Provides interactive filters for Registration Type (Free/Paid) and Organizing Body (IEEE, IIC, DSW, etc.)
 */
export function FilterControls() {
  const {
    registrationTypeFilter,
    setRegistrationTypeFilter,
    organizerFilter,
    setOrganizerFilter,
    organizers,
  } = useEvents();

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Registration Type Filter Chips */}
      <div className="flex items-center gap-1 bg-[#12101F] border border-purple-500/15 rounded-xl p-1 text-xs shadow-sm">
        <span className="text-[#9CA3B5] font-semibold px-2 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
          <Filter className="w-3 h-3 text-[#9B5CFF]" />
          <span>Fee:</span>
        </span>
        <button
          onClick={() => setRegistrationTypeFilter('all')}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all duration-200 ${
            registrationTypeFilter === 'all'
              ? 'bg-gradient-to-r from-[#8B4DFF] to-[#6E2FF0] text-white shadow-sm shadow-purple-600/30 border border-purple-400/30'
              : 'text-[#9CA3B5] hover:text-[#F1F0F5] hover:bg-[#18152A]'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setRegistrationTypeFilter('free')}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all duration-200 ${
            registrationTypeFilter === 'free'
              ? 'bg-[#4FD1A5]/20 text-[#4FD1A5] border border-[#4FD1A5]/40 shadow-sm shadow-[#4FD1A5]/20'
              : 'text-[#9CA3B5] hover:text-[#4FD1A5] hover:bg-[#18152A]'
          }`}
        >
          Free
        </button>
        <button
          onClick={() => setRegistrationTypeFilter('paid')}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all duration-200 ${
            registrationTypeFilter === 'paid'
              ? 'bg-[#8B4DFF]/25 text-[#C084FC] border border-[#8B4DFF]/40 shadow-sm shadow-purple-600/30'
              : 'text-[#9CA3B5] hover:text-[#C084FC] hover:bg-[#18152A]'
          }`}
        >
          Paid
        </button>
      </div>

      {/* Organizing Body Dropdown Filter */}
      <div className="inline-flex items-center gap-1.5 bg-[#12101F] border border-purple-500/15 rounded-xl px-3 py-1.5 shadow-sm focus-within:border-purple-500/40 transition-colors">
        <Building2 className="w-3.5 h-3.5 text-[#C084FC] shrink-0" />
        <label htmlFor="organizer-select" className="text-[11px] font-semibold text-[#9CA3B5] uppercase tracking-wider shrink-0">
          Organizer:
        </label>
        <select
          id="organizer-select"
          value={organizerFilter}
          onChange={(e) => setOrganizerFilter(e.target.value)}
          className="bg-transparent text-xs font-semibold text-[#F1F0F5] focus:outline-none cursor-pointer"
        >
          <option value="all" className="bg-[#12101F] text-[#F1F0F5]">All Bodies</option>
          {organizers.map((org) => (
            <option key={org} value={org} className="bg-[#12101F] text-[#F1F0F5]">
              {org}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
