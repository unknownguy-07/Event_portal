/**
 * Mock dataset for University Event Portal Landing Page.
 * Used for development and standalone execution when Firebase is unconfigured.
 */

export const mockCollegeInfo = {
  name: "Stanford University",
  address: "450 Jane Stanford Way, Stanford, CA 94305",
  mapsQueryUrl: "https://www.google.com/maps/search/?api=1&query=Stanford+University+450+Jane+Stanford+Way+Stanford+CA+94305",
};

export const mockCategories = [
  { id: "all", name: "All" },
  { id: "tech", name: "Tech & Hackathons" },
  { id: "cultural", name: "Cultural & Arts" },
  { id: "sports", name: "Sports & Fitness" },
  { id: "workshops", name: "Workshops & Seminars" },
  { id: "gaming", name: "Gaming & Esports" },
  { id: "entrepreneurship", name: "Entrepreneurship" },
];

export const mockFeaturedEvents = [
  {
    id: "feat-1",
    title: "HackStan 2026: AI & Future Tech",
    tagline: "Build cutting-edge AI applications with $10,000 in prizes",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80",
    detailUrl: "/events/feat-1",
  },
  {
    id: "feat-2",
    title: "Annual Campus Spring Music Fest",
    tagline: "Live performances by top indie bands and guest DJs",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80",
    detailUrl: "/events/feat-2",
  },
  {
    id: "feat-3",
    title: "Venture Pitch Competition 2026",
    tagline: "Pitch your startup idea to Silicon Valley angel investors",
    image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80",
    detailUrl: "/events/feat-3",
  },
];

export const mockEvents = [
  {
    id: "evt-101",
    name: "AI & Machine Learning Bootcamp",
    category: "Tech & Hackathons",
    categoryId: "tech",
    date: "Aug 15, 2026",
    fee: "Free",
    rawFee: 0,
    createdAt: "2026-08-01T10:00:00Z",
    thumbnail: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "evt-102",
    name: "Inter-College Esports Championship",
    category: "Gaming & Esports",
    categoryId: "gaming",
    date: "Aug 18, 2026",
    fee: "$10",
    rawFee: 10,
    createdAt: "2026-08-03T14:30:00Z",
    thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "evt-103",
    name: "UI/UX Design Masterclass",
    category: "Workshops & Seminars",
    categoryId: "workshops",
    date: "Aug 20, 2026",
    fee: "$5",
    rawFee: 5,
    createdAt: "2026-08-05T09:15:00Z",
    thumbnail: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "evt-104",
    name: "Campus Basketball League Opening",
    category: "Sports & Fitness",
    categoryId: "sports",
    date: "Aug 22, 2026",
    fee: "Free",
    rawFee: 0,
    createdAt: "2026-07-28T16:00:00Z",
    thumbnail: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "evt-105",
    name: "Startup Founders Night",
    category: "Entrepreneurship",
    categoryId: "entrepreneurship",
    date: "Aug 25, 2026",
    fee: "$15",
    rawFee: 15,
    createdAt: "2026-08-04T18:00:00Z",
    thumbnail: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "evt-106",
    name: "Acoustic Sunset Concert",
    category: "Cultural & Arts",
    categoryId: "cultural",
    date: "Aug 28, 2026",
    fee: "Free",
    rawFee: 0,
    createdAt: "2026-08-02T11:45:00Z",
    thumbnail: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
  },
];
