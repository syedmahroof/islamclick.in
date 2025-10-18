import { Head } from '@inertiajs/react';
import MainLayout from '@/components/layout/MainLayout';
import WhatsAppShare from '@/components/WhatsAppShare';
import { Link } from '@inertiajs/react';

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  articles_count: number;
}

interface IndexProps {
  categories: Category[];
  navigationCategories: {
    id: number;
    name: string;
    slug: string;
    order: number;
  }[];
}

export default function CategoriesIndex({ categories, navigationCategories }: IndexProps) {
  // Sort categories by article count (descending)
  const sortedCategories = [...categories].sort((a, b) => b.articles_count - a.articles_count);
  return (
    <MainLayout categories={navigationCategories}>
      <Head title="Categories" />
      
      {/* Hero Section */}
      <div className="bg-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-primary sm:text-5xl md:text-6xl">
            Browse by Category
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-600 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Explore our collection of articles organized by topic to find exactly what you're looking for.
          </p>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-primary mb-4">
              Categories
            </h1>
            <p className="text-xl text-gray-600">
              Browse articles by category
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {sortedCategories.map((category) => (
              <div 
                key={category.id}
                className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-transparent hover:border-primary/20"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-primary">
                    <Link 
                      href={`/categories/${category.slug}`} 
                      className="hover:text-secondary transition-colors"
                    >
                      {category.name}
                    </Link>
                  </h2>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
                    {category.articles_count} {category.articles_count === 1 ? 'Article' : 'Articles'}
                  </span>
                </div>
                {category.description && (
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {category.description}
                  </p>
                )}
                <Link 
                  href={`/categories/${category.slug}`}
                  className="inline-flex items-center text-primary hover:text-secondary font-medium transition-colors group"
                >
                  View all articles
                  <svg 
                    className="ml-2 w-4 h-4 transform transition-transform group-hover:translate-x-1" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            ))}
          </div>
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
