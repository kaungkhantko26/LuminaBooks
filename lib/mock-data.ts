import type { Book } from "@/lib/types";

export const mockBooks: Book[] = [
  {
    id: "stillness-architecture",
    title: "The Architecture of Stillness",
    author: "Julian Valenti",
    description:
      "A meditative design volume about silence, restraint, and spatial storytelling across modern libraries and galleries.",
    cover_url:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=80",
    file_url: "#",
    category: "Design",
    tags: ["Editorial", "Architecture", "Minimalism"],
    language: "English",
    pages: 312,
    format: "PDF",
    featured_label: "Editor's Pick",
    rating: 4.9,
    is_published: true,
    created_at: "2026-03-28T10:30:00.000Z"
  },
  {
    id: "digital-mind",
    title: "The Digital Mind",
    author: "Marcus Thorne",
    description:
      "A clear-eyed exploration of how curation, interfaces, and machine assistance reshape the way people learn from books.",
    cover_url:
      "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=900&q=80",
    file_url: "#",
    category: "Technology",
    tags: ["AI", "Product", "Culture"],
    language: "English",
    pages: 284,
    format: "PDF",
    featured_label: "Trending",
    rating: 4.7,
    is_published: true,
    created_at: "2026-03-25T09:00:00.000Z"
  },
  {
    id: "beyond-the-horizon",
    title: "Beyond the Horizon",
    author: "Dr. Elena Vance",
    description:
      "Speculative philosophy for the curator era, focused on ethics, consciousness, and the responsibility of shaping digital archives.",
    cover_url:
      "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=900&q=80",
    file_url: "#",
    category: "Philosophy",
    tags: ["Futurism", "Ethics", "Culture"],
    language: "English",
    pages: 342,
    format: "PDF, ePUB",
    featured_label: "New Arrival",
    rating: 4.9,
    is_published: true,
    created_at: "2026-03-22T13:15:00.000Z"
  },
  {
    id: "silent-patient-patterns",
    title: "Patterns of Quiet Systems",
    author: "Sarah Chen",
    description:
      "A calm systems-thinking handbook for teams who want elegant workflows instead of sprawling operational noise.",
    cover_url:
      "https://images.unsplash.com/photo-1519682577862-22b62b24e493?auto=format&fit=crop&w=900&q=80",
    file_url: "#",
    category: "Business",
    tags: ["Leadership", "Systems", "Operations"],
    language: "English",
    pages: 226,
    format: "PDF",
    featured_label: "Bestseller",
    rating: 4.6,
    is_published: true,
    created_at: "2026-03-18T08:20:00.000Z"
  },
  {
    id: "private-proof-copy",
    title: "Private Proof Copy",
    author: "Archive Team",
    description: "An unpublished internal review title used to validate preview and admin states.",
    cover_url:
      "https://images.unsplash.com/photo-1496104679561-38b05db517af?auto=format&fit=crop&w=900&q=80",
    file_url: "#",
    category: "Internal",
    tags: ["Preview"],
    language: "English",
    pages: 140,
    format: "PDF",
    featured_label: null,
    rating: 0,
    is_published: false,
    created_at: "2026-03-29T15:05:00.000Z"
  }
];
