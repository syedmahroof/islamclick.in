import ArticleCard from '@/components/shared/ArticleCard';

interface RelatedArticlesProps {
  articles: Array<{
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    featured_image?: string;
    published_at: string;
    read_time?: number;
  }>;
}

export default function RelatedArticles({ articles }: RelatedArticlesProps) {
  if (!articles || articles.length === 0) return null;

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {articles.map((article) => (
        <ArticleCard 
          key={article.id} 
          article={{
            ...article,
            author: { name: 'Admin' }, // Default author
            category: { name: 'Related', slug: 'related' },
          }} 
          className="h-full"
        />
      ))}
    </div>
  );
}
