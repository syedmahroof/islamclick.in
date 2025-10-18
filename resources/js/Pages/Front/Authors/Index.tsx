import { Head } from '@inertiajs/react';
import MainLayout from '@/components/layout/MainLayout';

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
    articles_count: number;
}

interface AuthorsIndexProps {
    authors: Author[];
    navigationCategories: {
        id: number;
        name: string;
        slug: string;
        order: number;
    }[];
}

export default function AuthorsIndex({ authors, navigationCategories }: AuthorsIndexProps) {
    return (
        <MainLayout categories={navigationCategories}>
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
                        {authors.length > 0 ? (
                            authors.map((author) => (
                                <div key={author.id} className="bg-white overflow-hidden shadow rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
                                    <div className="px-4 py-5 sm:p-6">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0">
                                                {author.profile_image_url ? (
                                                    <img 
                                                        className="h-16 w-16 rounded-full" 
                                                        src={author.profile_image_url} 
                                                        alt={author.name} 
                                                    />
                                                ) : (
                                                    <div className="h-16 w-16 rounded-full bg-amber-100 flex items-center justify-center text-2xl font-medium text-amber-600">
                                                        {author.name.charAt(0)}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="ml-4">
                                                <h3 className="text-lg font-medium text-gray-900">
                                                    <a href={`/authors/${author.slug}`} className="hover:text-amber-600">
                                                        {author.name}
                                                    </a>
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    {author.articles_count} {author.articles_count === 1 ? 'article' : 'articles'}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        {author.bio && (
                                            <p className="mt-4 text-sm text-gray-600 line-clamp-3">
                                                {author.bio}
                                            </p>
                                        )}

                                        <div className="mt-6">
                                            <a 
                                                href={`/authors/${author.slug}`}
                                                className="inline-flex items-center text-sm font-medium text-amber-600 hover:text-amber-500"
                                            >
                                                View all articles
                                                <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-12">
                                <p className="text-gray-500 text-lg">No authors available at the moment.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
