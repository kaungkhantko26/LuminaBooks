export type Book = {
  id: string;
  title: string;
  author: string;
  description: string;
  cover_url: string;
  file_url: string;
  category: string;
  tags: string[];
  language: string;
  pages: number;
  format: string;
  featured_label: string | null;
  rating: number;
  is_published: boolean;
  created_at: string;
};

export type BookFormValues = {
  title: string;
  author: string;
  description: string;
  category: string;
  tags: string;
  language: string;
  pages: number;
  format: string;
  featured_label: string;
  cover_url: string;
  file_url: string;
  is_published: boolean;
};
