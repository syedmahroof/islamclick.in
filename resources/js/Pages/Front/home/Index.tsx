import MainLayout from '@/components/layout/MainLayout';
import ArticleCard from '@/components/shared/ArticleCard';
import WhatsAppShare from '@/components/WhatsAppShare';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowRightIcon, BookOpenIcon, SparklesIcon, UsersIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  body: string;
  featured_image_url?: string;
  category: {
    id: number;
    name: string;
    slug: string;
  };
  author: {
    id: number;
    name: string;
  };
  published_at: string;
  views: number;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  articles_count: number;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  order: number;
}

interface HomeProps {
  featuredArticles: Article[];
  recentArticles: Article[];
  categories: Category[];
  navigationCategories: Category[];
}

export default function Home({ featuredArticles, recentArticles, categories, navigationCategories }: HomeProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.get('/articles', { search: searchQuery.trim() });
    }
  };

  return (
    <MainLayout categories={navigationCategories}>
      <Head title="Home" />
      
      {/* Hero Section */}
      <div className="relative bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center">
            {/* Logo */}
            <div className="flex justify-center mb-12">
              <div className="p-4 bg-primary rounded-2xl shadow-lg">
                <BookOpenIcon className="h-16 w-16 text-primary-foreground" />
              </div>
            </div>
            
            {/* Main Heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-primary mb-8 leading-tight">
              IslamClick
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl sm:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              Discover authentic Islamic knowledge through carefully curated articles, 
              written by renowned scholars and experts to strengthen your faith and deepen your understanding.
            </p>
            
            {/* Search Bar */}
            <div className="mb-12">
              <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-6 w-6 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search articles, topics, or scholars..."
                    className="block w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-primary shadow-lg"
                  />
                  <button
                    type="submit"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                  >
                    <div className="px-6 py-2 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-secondary transition-colors">
                      Search
                    </div>
                  </button>
                </div>
              </form>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Link
                href="#featured"
                className="inline-flex items-center px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-secondary transition-colors shadow-lg hover:shadow-xl"
              >
                <BookOpenIcon className="h-5 w-5 mr-2" />
                Explore Articles
                <ArrowRightIcon className="h-5 w-5 ml-2" />
              </Link>
              
              <Link
                href="/about"
                className="inline-flex items-center px-8 py-4 border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <UsersIcon className="h-5 w-5 mr-2" />
                About Us
              </Link>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center p-6 bg-gray-50 rounded-xl">
                <div className="text-3xl font-bold text-primary mb-2">500+</div>
                <div className="text-gray-600 font-medium">Articles</div>
              </div>
              <div className="text-center p-6 bg-gray-50 rounded-xl">
                <div className="text-3xl font-bold text-primary mb-2">50+</div>
                <div className="text-gray-600 font-medium">Scholars</div>
              </div>
              <div className="text-center p-6 bg-gray-50 rounded-xl">
                <div className="text-3xl font-bold text-primary mb-2">10K+</div>
                <div className="text-gray-600 font-medium">Readers</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Articles */}
      {featuredArticles.length > 0 && (
        <div id="featured" className="bg-gray-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-primary mb-4">
                Featured Articles
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our most important and insightful articles, carefully selected by our editorial team
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Link
                href="/articles"
                className="inline-flex items-center px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-secondary transition-colors shadow-lg"
              >
                <BookOpenIcon className="h-5 w-5 mr-2" />
                View All Articles
                <ArrowRightIcon className="h-5 w-5 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Recent Articles */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-4">
              Latest Articles
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Stay updated with our newest publications covering various aspects of Islamic knowledge
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentArticles.length > 0 ? (
              recentArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))
            ) : (
              <div className="col-span-full text-center py-20">
                <div className="p-12 bg-gray-50 rounded-xl max-w-lg mx-auto">
                  <BookOpenIcon className="h-16 w-16 text-primary mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-primary mb-4">Coming Soon</h3>
                  <p className="text-gray-600 text-lg">
                    We're preparing amazing content for you. Check back soon for new articles!
                  </p>
                </div>
              </div>
            )}
          </div>
          
          {recentArticles.length > 0 && (
            <div className="text-center mt-12">
              <Link
                href="/articles"
                className="inline-flex items-center px-8 py-4 bg-secondary text-primary-foreground font-semibold rounded-lg hover:bg-primary transition-colors shadow-lg"
              >
                <BookOpenIcon className="h-5 w-5 mr-2" />
                Browse All Articles
                <ArrowRightIcon className="h-5 w-5 ml-2" />
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Categories Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-4">
              Browse by Category
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore our comprehensive collection of articles organized by Islamic topics
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.length > 0 ? (
              categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/category/${category.slug}`}
                  className="group p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary text-primary-foreground font-bold text-lg">
                      {category.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-primary group-hover:text-secondary transition-colors mb-2">
                        {category.name}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {category.articles_count} {category.articles_count === 1 ? 'article' : 'articles'}
                      </p>
                    </div>
                    <ArrowRightIcon className="h-5 w-5 text-gray-400 group-hover:text-secondary group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center py-20">
                <div className="p-12 bg-white rounded-xl max-w-lg mx-auto shadow-lg">
                  <UsersIcon className="h-16 w-16 text-primary mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-primary mb-4">Categories Coming Soon</h3>
                  <p className="text-gray-600 text-lg">
                    We're organizing our content into beautiful categories. Stay tuned!
                  </p>
                </div>
              </div>
            )}
          </div>
          
          {categories.length > 0 && (
            <div className="text-center mt-12">
              <Link
                href="/categories"
                className="inline-flex items-center px-8 py-4 bg-tertiary text-primary font-semibold rounded-lg hover:bg-secondary hover:text-primary-foreground transition-colors shadow-lg"
              >
                <UsersIcon className="h-5 w-5 mr-2" />
                View All Categories
                <ArrowRightIcon className="h-5 w-5 ml-2" />
              </Link>
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
