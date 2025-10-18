import { Head } from '@inertiajs/react';
import MainLayout from '@/components/layout/MainLayout';
import ArticleCard from '@/components/shared/ArticleCard';

interface Author {
    id: number;
    name: string;
    slug: string;
    bio?: string;
    email?: string;
    website?: string;
    twitter_handle?: string;
    facebook_username?: string;
    linkedin_profile?: string;
    profile_image_url?: string;
}

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
    published_at: string;
    views: number;
}

interface AuthorShowProps {
    author: Author;
    articles: Article[];
    meta: {
        current_page: number;
        from: number;
        last_page: number;
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

export default function AuthorShow({ author, articles, meta, links, navigationCategories }: AuthorShowProps) {
    return (
        <MainLayout categories={navigationCategories}>
            <Head title={`${author.name} - Author`} />
            
            <div className="bg-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Author Header */}
                    <div className="text-center mb-12">
                        <div className="flex justify-center mb-6">
                            {author.profile_image_url ? (
                                <img 
                                    className="h-32 w-32 rounded-full" 
                                    src={author.profile_image_url} 
                                    alt={author.name} 
                                />
                            ) : (
                                <div className="h-32 w-32 rounded-full bg-amber-100 flex items-center justify-center text-4xl font-medium text-amber-600">
                                    {author.name.charAt(0)}
                                </div>
                            )}
                        </div>
                        
                        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                            {author.name}
                        </h1>
                        
                        {author.bio && (
                            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
                                {author.bio}
                            </p>
                        )}

                        {/* Social Links */}
                        <div className="mt-6 flex justify-center space-x-4">
                            {author.website && (
                                <a 
                                    href={author.website} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-gray-400 hover:text-amber-600"
                                >
                                    <span className="sr-only">Website</span>
                                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                    </svg>
                                </a>
                            )}
                            {author.twitter_handle && (
                                <a 
                                    href={`https://twitter.com/${author.twitter_handle}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-gray-400 hover:text-amber-600"
                                >
                                    <span className="sr-only">Twitter</span>
                                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                                    </svg>
                                </a>
                            )}
                            {author.facebook_username && (
                                <a 
                                    href={`https://facebook.com/${author.facebook_username}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-gray-400 hover:text-amber-600"
                                >
                                    <span className="sr-only">Facebook</span>
                                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                    </svg>
                                </a>
                            )}
                            {author.linkedin_profile && (
                                <a 
                                    href={`https://linkedin.com/in/${author.linkedin_profile}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-gray-400 hover:text-amber-600"
                                >
                                    <span className="sr-only">LinkedIn</span>
                                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                    </svg>
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Articles Section */}
                    <div className="border-t border-gray-200 pt-12">
                        <h2 className="text-2xl font-bold text-gray-900 mb-8">
                            Articles by {author.name}
                        </h2>
                        
                        {articles.length > 0 ? (
                            <>
                                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                                    {articles.map((article) => (
                                        <ArticleCard key={article.id} article={article} />
                                    ))}
                                </div>

                                {/* Pagination */}
                                {meta.last_page > 1 && (
                                    <div className="mt-12 flex justify-center">
                                        <nav className="flex items-center space-x-2">
                                            {links.prev && (
                                                <a
                                                    href={links.prev}
                                                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                                                >
                                                    Previous
                                                </a>
                                            )}
                                            
                                            <span className="px-3 py-2 text-sm text-gray-700">
                                                Page {meta.current_page} of {meta.last_page}
                                            </span>
                                            
                                            {links.next && (
                                                <a
                                                    href={links.next}
                                                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                                                >
                                                    Next
                                                </a>
                                            )}
                                        </nav>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-gray-500 text-lg">No articles found for this author.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
