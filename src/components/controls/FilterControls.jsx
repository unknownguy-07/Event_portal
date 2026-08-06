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
      <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs">
        <span className="text-slate-500 font-semibold px-2 flex items-center gap-1">
          <Filter className="w-3 h-3" />
          <span>Fee:</span>
        </span>
        <button
          onClick={() => setRegistrationTypeFilter('all')}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
            registrationTypeFilter === 'all'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setRegistrationTypeFilter('free')}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
            registrationTypeFilter === 'free'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Free
        </button>
        <button
          onClick={() => setRegistrationTypeFilter('paid')}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
            registrationTypeFilter === 'paid'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Paid
        </button>
      </div>

      {/* Organizing Body Dropdown Filter */}
      <div className="inline-flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5">
        <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <label htmlFor="organizer-select" className="text-xs font-semibold text-slate-400 shrink-0">
          Organizer:
        </label>
        <select
          id="organizer-select"
          value={organizerFilter}
          onChange={(e) => setOrganizerFilter(e.target.value)}
          className="bg-transparent text-xs font-semibold text-slate-200 focus:outline-none cursor-pointer"
        >
          <option value="all" className="bg-slate-900">All Bodies</option>
          {organizers.map((org) => (
            <option key={org} value={org} className="bg-slate-900">
              {org}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
