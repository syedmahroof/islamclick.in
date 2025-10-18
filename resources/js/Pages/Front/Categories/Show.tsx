import { Head } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import MainLayout from '@/components/layout/MainLayout';
import ArticleCard from '@/components/shared/ArticleCard';
import WhatsAppShare from '@/components/WhatsAppShare';
import { Pagination } from '@/components/ui/pagination';

interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  featured_image: string | null;
  featured_image_url: string | null;
  published_at: string;
  read_time: number;
  author: {
    id: number;
    name: string;
  };
  category: {
    id: number;
    name: string;
    slug: string;
  };
}

interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

interface Props {
  category: Category;
  articles: Article[];
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    links: Array<{
      url: string | null;
      label: string;
      active: boolean;
    }>;
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
  links: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
  navigationCategories: {
    id: number;
    name: string;
    slug: string;
    order: number;
  }[];
}

export default function CategoryShow({ category, articles, meta, navigationCategories }: Props) {
  return (
    <MainLayout categories={navigationCategories}>
      <Head title={`${category.name} - Islamic Articles`} />
      
      {/* Category Header */}
      <div className="bg-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-primary sm:text-5xl md:text-6xl">
              {category.name}
            </h1>
            {category.description && (
              <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-600">
                {category.description}
              </p>
            )}
            <p className="mt-4 text-gray-600">
              {meta.total} {meta.total === 1 ? 'article' : 'articles'}
            </p>
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-primary">
              Latest Articles in {category.name}
            </h2>
            <Link 
              href="/categories" 
              className="inline-flex items-center text-primary hover:text-secondary font-medium"
            >
              View All Categories
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          
          {articles.length > 0 ? (
            <>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {articles.map((article) => {
                  const articleData = {
                    id: article.id,
                    title: article.title,
                    slug: article.slug,
                    excerpt: article.excerpt,
                    featured_image: article.featured_image_url || '/images/placeholder-article.jpg',
                    category: article.category,
                    author: article.author,
                    published_at: article.published_at,
                    read_time: article.read_time
                  };
                  
                  return <ArticleCard key={article.id} article={articleData} />;
                })}
              </div>
              
              {/* Pagination */}
              {meta.last_page > 1 && (
                <div className="mt-12">
                  <Pagination 
                    links={meta.links}
                    className="justify-center"
                  />
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-primary">No articles found in this category</h3>
              <p className="mt-2 text-gray-600">Check back later for new content.</p>
              <div className="mt-6">
                <Link 
                  href="/categories" 
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Browse All Categories
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* WhatsApp Chat Button */}
      <WhatsAppShare 
        mode="chat"
        phoneNumber="9946911916"
        defaultMessage="Welcome to IslamicClick"
      />
    </MainLayout>
  );
}
