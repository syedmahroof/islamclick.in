import { Link } from '@inertiajs/react';
import { CalendarIcon, ClockIcon, UserIcon } from '@heroicons/react/24/outline';

interface ArticleCardProps {
  article: {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    featured_image?: string;
    featured_image_url?: string;
    category?: {
      name: string;
      slug: string;
    };
    author?: {
      id: number;
      name: string;
    };
    published_at: string;
    read_time?: number;
  };
  className?: string;
}

export default function ArticleCard({ article, className = '' }: ArticleCardProps) {
  const imageUrl = article.featured_image_url || article.featured_image || '/images/placeholder-article.jpg';
  
  return (
    <div className={`group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${className}`}>
      <div className="relative overflow-hidden rounded-t-xl">
        <Link href={`/articles/${article.slug}`}>
          <img
            className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-300"
            src={imageUrl}
            alt={article.title}
          />
        </Link>
        
        {article.category && (
          <div className="absolute top-3 left-3">
            <Link 
              href={`/category/${article.category.slug}`}
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white text-primary hover:bg-secondary hover:text-primary-foreground transition-colors"
            >
              {article.category.name}
            </Link>
          </div>
        )}
      </div>
      
      <div className="p-6">
        <Link href={`/articles/${article.slug}`} className="block">
          <h3 className="text-xl font-bold text-primary group-hover:text-secondary transition-colors mb-3 line-clamp-2">
            {article.title}
          </h3>
          <p className="text-gray-600 line-clamp-3 mb-4">
            {article.excerpt}
          </p>
        </Link>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-medium text-sm">
              {article.author?.name?.charAt(0) || 'A'}
            </div>
            <div>
              <div className="text-sm font-medium text-primary">
                {article.author?.name || 'Anonymous'}
              </div>
              <div className="flex items-center space-x-3 text-xs text-gray-500">
                <span>{new Date(article.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                {article.read_time && (
                  <span>{article.read_time} min read</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
