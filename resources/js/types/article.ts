export type Article = {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  status: 'draft' | 'published' | 'archived';
  featured_image?: string | null;
  published_at?: string | null;
  created_at: string;
  updated_at: string;
  category_id?: number | null;
  category?: {
    id: number;
    name: string;
  } | null;
  author_id?: number | null;
  author?: {
    id: number;
    name: string;
  } | null;
  tags?: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
};
