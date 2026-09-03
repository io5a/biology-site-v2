export type AnnouncementType = {
  author_id: string | null;
  content: string
  created_at: string
  date: string
  slug: string
  title: string
  type: string
};

export type Article = {
  slug: string
  title: string
  excerpt: string
  category: string
  date: string
  readTime: string
  content: string
}
