import { Head } from '@inertiajs/react';
import FrontendLayout from '@/layouts/FrontendLayout';

interface Category {
    id: number;
    name: string;
    slug: string;
    description?: string;
    articles_count: number;
    latest_article?: {
        title: string;
        slug: string;
        published_at: string;
    };
}

interface CategoriesIndexProps {
    categories: Category[];
}

export default function CategoriesIndex({ categories }: CategoriesIndexProps) {
    return (
        <>
            <Head title="Categories" />
            
            <div className="bg-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                            Browse by Category
                        </h1>
                        <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
                            Explore our collection of articles organized by category
                        </p>
                    </div>

                    <div className="mt-12 grid gap-5 max-w-lg mx-auto lg:grid-cols-3 lg:max-w-none">
                        {categories.map((category) => (
                            <div key={category.id} className="flex flex-col rounded-lg shadow-lg overflow-hidden">
                                <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-indigo-600">
                                            <a href={`/categories/${category.slug}`} className="hover:underline">
                                                {category.articles_count} articles
                                            </a>
                                        </p>
                                        <a href={`/categories/${category.slug}`} className="block mt-2">
                                            <h3 className="text-xl font-semibold text-gray-900">
                                                {category.name}
                                            </h3>
                                            {category.description && (
                                                <p className="mt-3 text-base text-gray-500">
                                                    {category.description}
                                                </p>
                                            )}
                                        </a>
                                    </div>
                                    {category.latest_article && (
                                        <div className="mt-6">
                                            <div className="flex">
                                                <div className="flex-shrink-0">
                                                    <span className="sr-only">Latest Article</span>
                                                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <div className="ml-3 flex-1">
                                                    <p className="text-sm font-medium text-gray-900">
                                                        <a href={`/articles/${category.latest_article.slug}`} className="hover:underline">
                                                            {category.latest_article.title}
                                                        </a>
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {new Date(category.latest_article.published_at).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
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
CategoriesIndex.layout = (page: React.ReactNode) => <FrontendLayout>{page}</FrontendLayout>;
