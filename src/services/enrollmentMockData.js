/**
 * Mock enrollment data for the Enrolled Events feature.
 *
 * Each enrollment references an event by eventId (from mockEvents/mockFeaturedEvents).
 * The UI resolves full event details from the existing event data.
 *
 * Status values: 'registered' | 'attended' | 'cancelled'
 * attended: true if the user actually participated (only meaningful for past events)
 *
 * Mock user: 'student-demo-123' (matches authService mock login)
 */

export const MOCK_USER_ID = 'student-demo-123';

export const mockEnrollments = [
  // ── Upcoming events (dates in the future) ──────────────────────
  {
    enrollmentId: 'enr-001',
    userId: MOCK_USER_ID,
    eventId: 'evt-107',          // Mega Blood Donation Drive — Sep 02, 2026
    enrolledAt: '2026-08-20T09:30:00Z',
    status: 'registered',
    attended: false,
    ticketId: 'TKT-MRU-20260902-001',
  },
  {
    enrollmentId: 'enr-002',
    userId: MOCK_USER_ID,
    eventId: 'evt-108',          // Research & Innovation Conclave — Sep 05, 2026
    enrolledAt: '2026-08-22T14:15:00Z',
    status: 'registered',
    attended: false,
    ticketId: 'TKT-MRU-20260905-002',
  },
  {
    enrollmentId: 'enr-003',
    userId: MOCK_USER_ID,
    eventId: 'feat-2',           // Annual Campus Spring Music Fest — Aug 28, 2026
    enrolledAt: '2026-08-18T11:00:00Z',
    status: 'registered',
    attended: false,
    ticketId: 'TKT-MRU-20260828-003',
  },

  // ── Past events (dates in the past) ────────────────────────────
  {
    enrollmentId: 'enr-004',
    userId: MOCK_USER_ID,
    eventId: 'evt-101',          // AI & Machine Learning Bootcamp — Aug 15, 2026
    enrolledAt: '2026-08-10T08:00:00Z',
    status: 'attended',
    attended: true,
    ticketId: 'TKT-MRU-20260815-004',
  },
  {
    enrollmentId: 'enr-005',
    userId: MOCK_USER_ID,
    eventId: 'evt-102',          // Inter-College Esports Championship — Aug 18, 2026
    enrolledAt: '2026-08-12T16:45:00Z',
    status: 'attended',
    attended: true,
    ticketId: 'TKT-MRU-20260818-005',
  },
  {
    enrollmentId: 'enr-006',
    userId: MOCK_USER_ID,
    eventId: 'evt-103',          // UI/UX Design Masterclass — Aug 20, 2026
    enrolledAt: '2026-08-14T10:30:00Z',
    status: 'cancelled',
    attended: false,
    ticketId: null,
  },
  {
    enrollmentId: 'enr-007',
    userId: MOCK_USER_ID,
    eventId: 'evt-104',          // Campus Basketball League Opening — Aug 22, 2026
    enrolledAt: '2026-08-15T13:00:00Z',
    status: 'registered',        // Registered but didn't attend → not shown as "participated"
    attended: false,
    ticketId: 'TKT-MRU-20260822-007',
  },
  {
    enrollmentId: 'enr-008',
    userId: MOCK_USER_ID,
    eventId: 'feat-1',           // HackMRU 2026 — Aug 15, 2026
    enrolledAt: '2026-08-08T07:00:00Z',
    status: 'attended',
    attended: true,
    ticketId: 'TKT-MRU-20260815-008',
  },
];
