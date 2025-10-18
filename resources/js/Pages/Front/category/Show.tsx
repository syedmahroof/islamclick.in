import { Head } from '@inertiajs/react';
import MainLayout from '@/components/layout/MainLayout';
import ArticleCard from '@/components/shared/ArticleCard';
import Pagination from '@/components/shared/Pagination';

interface CategoryProps {
  category: {
    id: number;
    name: string;
    description?: string;
    slug: string;
  };
  articles: {
    data: Array<{
      id: number;
      title: string;
      slug: string;
      excerpt: string;
      featured_image?: string;
      author?: {
        name: string;
      };
      published_at: string;
      read_time?: number;
    }>;
    meta: {
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
    };
  };
}

export default function CategoryPage({ category, articles }: CategoryProps) {
  return (
    <MainLayout>
      <Head title={category.name}>
        <meta name="description" content={category.description || `Articles about ${category.name}`} />
      </Head>

      <div className="bg-white pt-16 pb-20 px-4 sm:px-6 lg:pt-24 lg:pb-28 lg:px-8">
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl tracking-tight font-extrabold text-gray-900 sm:text-4xl">
              {category.name}
            </h1>
            {category.description && (
              <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
                {category.description}
              </p>
            )}
          </div>

          <div className="mt-12 max-w-lg mx-auto grid gap-5 lg:grid-cols-3 lg:max-w-none">
            {articles.data.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>

          {/* Pagination */}
          {articles.meta.last_page > 1 && (
            <div className="mt-12">
              <Pagination
                currentPage={articles.meta.current_page}
                totalPages={articles.meta.last_page}
                baseUrl={`/category/${category.slug}`}
              />
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

// This function is called on the server-side to fetch data for the page
export async function getServerSideProps({ params }: { params: { slug: string } }) {
  // In a real app, you would fetch data from your API here
  // For now, we'll return mock data
  const mockCategory = {
    id: 1,
    name: params.slug.charAt(0).toUpperCase() + params.slug.slice(1),
    description: `Articles about ${params.slug} in Islam`,
    slug: params.slug,
  };

  // Mock articles data - replace with actual API call
  const mockArticles = {
    data: Array.from({ length: 6 }, (_, i) => ({
      id: i + 1,
      title: `Article about ${params.slug} ${i + 1}`,
      slug: `article-about-${params.slug}-${i + 1}`,
      excerpt: `This is a sample article about ${params.slug}. It contains valuable information about this important topic in Islam.`,
      featured_image: `/images/${params.slug}-${(i % 3) + 1}.jpg`,
      author: {
        name: `Author ${i + 1}`,
      },
      published_at: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
      read_time: Math.floor(Math.random() * 10) + 5,
    })),
    meta: {
      current_page: 1,
      last_page: 3,
      per_page: 6,
      total: 18,
    },
  };

  return {
    props: {
      category: mockCategory,
      articles: mockArticles,
    },
  };
}
