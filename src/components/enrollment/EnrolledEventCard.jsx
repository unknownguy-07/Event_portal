import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Ticket, Eye } from 'lucide-react';

export function EnrolledEventCard({ event, enrollment, variant, onViewTicket }) {
  const isHistory = variant === 'history';

  const status = enrollment?.status?.toLowerCase() || 'registered';

  const getStatusBadge = () => {
    switch (status) {
      case 'attended':
        return 'bg-[#4FD1A5]/15 text-[#4FD1A5] border border-[#4FD1A5]/30 shadow-sm shadow-[#4FD1A5]/10';
      case 'cancelled':
        return 'bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30';
      case 'confirmed':
        return 'bg-[#4FD1A5]/15 text-[#4FD1A5] border border-[#4FD1A5]/30 shadow-sm shadow-[#4FD1A5]/10';
      default:
        return 'bg-gradient-to-r from-[#8B4DFF] to-[#6E2FF0] text-white border border-purple-400/30 shadow-md shadow-purple-600/30';
    }
  };

  const handleTicketClick = () => {
    if (onViewTicket) {
      onViewTicket(enrollment, event);
    }
  };

  return (
    <div
      className={`group flex flex-col rounded-2xl overflow-hidden bg-gradient-to-b from-[#141124] to-[#100E1C] border border-purple-500/15 hover:border-purple-500/40 hover:shadow-[0_10px_30px_rgba(139,77,255,0.12)] transition-all duration-300 hover:-translate-y-1 ${
        isHistory ? 'opacity-85 hover:opacity-100' : ''
      }`}
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#080811]">
        <img
          src={event?.thumbnail || event?.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80'}
          alt={event?.name || event?.title || 'Event thumbnail'}
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#100E1C] via-transparent to-[#080811]/30 opacity-70 group-hover:opacity-50 transition-opacity" />
        <div
          className={`absolute top-3 right-3 px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase rounded-full ${getStatusBadge()}`}
        >
          {status}
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow gap-3">
        <h3 className="font-extrabold text-[#F1F0F5] text-base line-clamp-2 group-hover:text-white transition-colors leading-snug">
          {event?.name || event?.title}
        </h3>

        <div className="flex flex-wrap gap-1.5">
          {event?.category && (
            <span className="bg-[#080811]/80 backdrop-blur-md text-[#C084FC] text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full border border-purple-400/30">
              {event.category}
            </span>
          )}
          {event?.organizer && (
            <span className="bg-[#18142A]/85 backdrop-blur-md text-[#F1F0F5] text-[10px] font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-full border border-purple-500/20">
              {event.organizer}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1.5 mt-auto text-xs text-[#9CA3B5]">
          <div className="flex items-center gap-2">
            <Calendar size={13} className="text-[#9B5CFF]" />
            <span>{event?.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={13} className="text-[#9B5CFF]" />
            <span className="truncate">{event?.venue}</span>
          </div>
        </div>

        {/* Ticket ID Tag */}
        {enrollment?.ticketId && (
          <div className="flex items-center justify-between text-[11px] pt-1">
            <span className="text-[#9CA3B5]">Ticket Ref:</span>
            <span className="font-mono text-[#C084FC] font-semibold bg-[#080811] px-2 py-0.5 rounded border border-purple-500/20">
              {enrollment.ticketId}
            </span>
          </div>
        )}

        <div className="flex justify-between items-center pt-3 mt-1 border-t border-purple-500/10">
          <Link
            to={`/events/${event?.id}`}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#C084FC] hover:text-white transition-colors"
          >
            <Eye size={14} /> View Event
          </Link>

          {enrollment?.ticketId && (
            <button
              onClick={handleTicketClick}
              className="flex items-center gap-1.5 text-xs px-3.5 py-1.5 rounded-full font-bold bg-gradient-to-r from-[#8B4DFF] to-[#6E2FF0] hover:from-[#9B5CFF] hover:to-[#8B4DFF] text-white shadow-md shadow-purple-600/30 border border-purple-400/30 transition-all duration-200 hover:scale-[1.02] cursor-pointer"
            >
              <Ticket size={14} /> View Ticket
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
