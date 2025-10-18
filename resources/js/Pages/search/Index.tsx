import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import ArticleCard from '@/components/shared/ArticleCard';
import SearchBar from '@/components/shared/SearchBar';
import Pagination from '@/components/shared/Pagination';

interface SearchResult {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  featured_image?: string;
  published_at: string;
  read_time?: number;
  category?: {
    name: string;
    slug: string;
  };
  author?: {
    name: string;
  };
}

interface SearchPageProps {
  q: string;
  results: {
    data: SearchResult[];
    meta: {
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
    };
  };
}

export default function SearchPage({ q: initialQuery, results }: SearchPageProps) {
  const [query, setQuery] = useState(initialQuery || '');
  const { url } = usePage();
  const searchParams = new URLSearchParams(url.split('?')[1]);
  const category = searchParams.get('category');
  const tag = searchParams.get('tag');
  const author = searchParams.get('author');

  useEffect(() => {
    setQuery(initialQuery || '');
  }, [initialQuery]);

  const handleSearch = (searchQuery: string) => {
    const params = new URLSearchParams();
    if (searchQuery) params.append('q', searchQuery);
    if (category) params.append('category', category);
    if (tag) params.append('tag', tag);
    if (author) params.append('author', author);
    
    router.get(`/search?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (category) params.append('category', category);
    if (tag) params.append('tag', tag);
    if (author) params.append('author', author);
    params.append('page', page.toString());
    
    router.get(`/search?${params.toString()}`);
  };

  const getSearchTitle = () => {
    if (category) return `in "${category}"`;
    if (tag) return `tagged with "${tag}"`;
    if (author) return `by ${author}`;
    return '';
  };

  return (
    <MainLayout>
      <Head title={`Search Results for "${query}"`}>
        <meta name="description" content={`Search results for "${query}"`} />
      </Head>

      <div className="bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">
              Search {getSearchTitle()}
            </h1>
            
            <div className="mb-8">
              <SearchBar 
                defaultValue={query}
                placeholder="Search articles..."
                onSearch={handleSearch}
                autoFocus
              />
            </div>

            {query || category || tag || author ? (
              <div className="mb-6">
                <p className="text-sm text-gray-500">
                  {results.meta.total > 0 ? (
                    <span>Found {results.meta.total} {results.meta.total === 1 ? 'result' : 'results'}</span>
                  ) : (
                    <span>No results found</span>
                  )}
                  {query && (
                    <span> for "<span className="font-medium">{query}</span>"</span>
                  )}
                </p>
              </div>
            ) : null}

            {results.meta.total > 0 ? (
              <>
                <div className="space-y-6">
                  {results.data.map((article) => (
                    <ArticleCard 
                      key={article.id} 
                      article={article}
                      className="flex flex-col sm:flex-row"
                    />
                  ))}
                </div>

                {results.meta.last_page > 1 && (
                  <div className="mt-8">
                    <Pagination
                      currentPage={results.meta.current_page}
                      totalPages={results.meta.last_page}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <h3 className="mt-2 text-lg font-medium text-gray-900">No results found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  We couldn't find any articles matching your search. Try different keywords.
                </p>
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={() => router.get('/')}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                  >
                    Return Home
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

// This function is called on the server-side to fetch data for the page
export async function getServerSideProps({ query }: { query: { q?: string; page?: string } }) {
  // In a real app, you would fetch search results from your API here
  // For now, we'll return mock data
  const searchQuery = query.q || '';
  const currentPage = parseInt(query.page || '1', 10);
  
  // Mock search results
  const mockResults = {
    data: Array.from({ length: 5 }, (_, i) => ({
      id: i + 1,
      title: `Search Result ${i + 1} for "${searchQuery}"`,
      slug: `search-result-${i + 1}`,
      excerpt: `This is a sample search result for "${searchQuery}". It shows a brief excerpt of the article content.`,
      published_at: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
      read_time: Math.floor(Math.random() * 10) + 3,
      category: {
        name: 'Search',
        slug: 'search',
      },
      author: {
        name: 'Admin',
      },
    })),
    meta: {
      current_page: currentPage,
      last_page: 3,
      per_page: 5,
      total: 15,
    },
  };

  return {
    props: {
      q: searchQuery,
      results: mockResults,
    },
  };
}
