import { Head } from '@inertiajs/react';
import FrontendLayout from '@/layouts/FrontendLayout';

interface Author {
    id: number;
    name: string;
    username: string;
    bio?: string;
    avatar_url?: string;
    articles_count: number;
    latest_article?: {
        title: string;
        slug: string;
        published_at: string;
    };
}

interface AuthorsIndexProps {
    authors: Author[];
}

export default function AuthorsIndex({ authors }: AuthorsIndexProps) {
    return (
        <>
            <Head title="Our Authors" />
            
            <div className="bg-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                            Our Authors
                        </h1>
                        <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
                            Meet the talented writers sharing their knowledge and insights
                        </p>
                    </div>

                    <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                        {authors.map((author) => (
                            <div key={author.id} className="bg-white overflow-hidden shadow rounded-lg">
                                <div className="px-4 py-5 sm:p-6">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            {author.avatar_url ? (
                                                <img 
                                                    className="h-16 w-16 rounded-full" 
                                                    src={author.avatar_url} 
                                                    alt={author.name} 
                                                />
                                            ) : (
                                                <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center text-2xl font-medium text-indigo-600">
                                                    {author.name.charAt(0)}
                                                </div>
                                            )}
                                        </div>
                                        <div className="ml-4">
                                            <h3 className="text-lg font-medium text-gray-900">
                                                <a href={`/authors/${author.username}`} className="hover:text-indigo-600">
                                                    {author.name}
                                                </a>
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                {author.articles_count} articles
                                            </p>
                                        </div>
                                    </div>
                                    
                                    {author.bio && (
                                        <p className="mt-4 text-sm text-gray-600 line-clamp-3">
                                            {author.bio}
                                        </p>
                                    )}

                                    {author.latest_article && (
                                        <div className="mt-4 pt-4 border-t border-gray-200">
                                            <p className="text-sm font-medium text-gray-500">Latest Article</p>
                                            <a 
                                                href={`/articles/${author.latest_article.slug}`} 
                                                className="mt-1 text-sm font-medium text-indigo-600 hover:text-indigo-500 line-clamp-2"
                                            >
                                                {author.latest_article.title}
                                            </a>
                                            <p className="mt-1 text-xs text-gray-500">
                                                {new Date(author.latest_article.published_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    )}

                                    <div className="mt-6">
                                        <a 
                                            href={`/authors/${author.username}`}
                                            className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
                                        >
                                            View all articles
                                            <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

// @ts-ignore
AuthorsIndex.layout = (page: React.ReactNode) => <FrontendLayout>{page}</FrontendLayout>;
