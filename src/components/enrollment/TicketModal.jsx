import React from 'react';
import { Calendar, MapPin, Building2, User, QrCode, CheckCircle2, Printer } from 'lucide-react';
import { Modal } from '@/components/common/Modal';

export function TicketModal({ isOpen, onClose, ticketData }) {
  if (!ticketData) return null;
  const { event, enrollment, user } = ticketData;

  const attendeeName =
    enrollment?.userName ||
    user?.displayName ||
    'University Student';
  const attendeeEmail =
    enrollment?.userEmail ||
    user?.email ||
    'student@mru.edu.in';

  const ticketId = enrollment?.ticketId || enrollment?.enrollmentId || 'MRU-EVT-PASS';
  const status = enrollment?.status || 'Confirmed';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Digital Event Pass">
      <div className="space-y-5 text-[#F1F0F5]">
        {/* Ticket Card with cyber aesthetic */}
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-b from-[#18142A] to-[#0F0D1B] border border-purple-500/25 p-5 shadow-2xl shadow-purple-950/40">
          {/* Header & Status */}
          <div className="flex items-start justify-between gap-3 border-b border-purple-500/15 pb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#C084FC]">
                Manav Rachna University
              </span>
              <h3 className="text-base font-extrabold text-[#F1F0F5] mt-0.5 leading-snug">
                {event?.name || event?.title || 'Campus Event'}
              </h3>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#4FD1A5]/15 border border-[#4FD1A5]/30 text-[#4FD1A5] text-[11px] font-bold shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span className="capitalize">{status}</span>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3 py-4 text-xs">
            <div>
              <span className="text-[10px] font-semibold text-[#9CA3B5] uppercase tracking-wider block mb-1">
                Attendee
              </span>
              <div className="flex items-center gap-1.5 font-semibold text-[#F1F0F5]">
                <User className="w-3.5 h-3.5 text-[#9B5CFF] shrink-0" />
                <span className="truncate">{attendeeName}</span>
              </div>
              <span className="text-[11px] text-[#9CA3B5] truncate block mt-0.5">
                {attendeeEmail}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-semibold text-[#9CA3B5] uppercase tracking-wider block mb-1">
                Ticket ID
              </span>
              <span className="font-mono text-xs font-bold text-[#C084FC] bg-[#080811] px-2 py-1 rounded-lg border border-purple-500/20 inline-block">
                {ticketId}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-semibold text-[#9CA3B5] uppercase tracking-wider block mb-1">
                Date & Time
              </span>
              <div className="flex items-center gap-1.5 font-medium text-[#F1F0F5]">
                <Calendar className="w-3.5 h-3.5 text-[#9B5CFF] shrink-0" />
                <span>{event?.date}</span>
              </div>
            </div>

            <div>
              <span className="text-[10px] font-semibold text-[#9CA3B5] uppercase tracking-wider block mb-1">
                Venue
              </span>
              <div className="flex items-center gap-1.5 font-medium text-[#F1F0F5]">
                <MapPin className="w-3.5 h-3.5 text-[#9B5CFF] shrink-0" />
                <span className="truncate">{event?.venue || 'Campus Auditorium'}</span>
              </div>
            </div>
          </div>

          {/* Organizer */}
          {event?.organizer && (
            <div className="border-t border-purple-500/10 pt-3 flex items-center gap-2 text-xs text-[#9CA3B5]">
              <Building2 className="w-3.5 h-3.5 text-[#C084FC]" />
              <span>Organized by <strong className="text-[#F1F0F5]">{event.organizer}</strong></span>
            </div>
          )}

          {/* Cyber barcode / QR placeholder */}
          <div className="mt-4 pt-4 border-t border-dashed border-purple-500/25 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white p-1 flex items-center justify-center shadow-md">
                <QrCode className="w-10 h-10 text-black" />
              </div>
              <div className="text-[10px] text-[#9CA3B5]">
                <p className="font-mono text-[#F1F0F5] font-semibold">VALID CAMPUS PASS</p>
                <p>Present at registration desk</p>
              </div>
            </div>
            <div className="text-right font-mono text-[9px] text-[#6B6882] tracking-widest hidden sm:block">
              ||||| | |||| ||| |||||
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-full bg-[#12101F] text-[#9CA3B5] hover:text-[#F1F0F5] border border-purple-500/20 hover:border-purple-500/40 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Pass</span>
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold rounded-full bg-gradient-to-r from-[#8B4DFF] via-[#9B5CFF] to-[#6E2FF0] text-white hover:from-[#9B5CFF] hover:to-[#8B4DFF] shadow-lg shadow-purple-600/35 border border-purple-400/30 transition-all duration-200 cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </Modal>
  );
}
