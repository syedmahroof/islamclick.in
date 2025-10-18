import { Head } from '@inertiajs/react';
import FrontendLayout from '@/layouts/FrontendLayout';

interface Article {
    id: number;
    title: string;
    excerpt: string;
    slug: string;
    published_at: string;
    category: {
        name: string;
        slug: string;
    };
    author: {
        name: string;
        username: string;
    };
}

interface HomeProps {
    featuredArticles: Article[];
    recentArticles: Article[];
    categories: Array<{
        id: number;
        name: string;
        slug: string;
        articles_count: number;
    }>;
}

export default function Home({ featuredArticles = [], recentArticles = [], categories = [] }: HomeProps) {
    return (
        <>
            <Head title="Welcome" />
            
            {/* Hero Section */}
            <div className="bg-white">
                <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                        <span className="block">Welcome to Islamic Content</span>
                        <span className="block text-indigo-600">Learn and Grow</span>
                    </h1>
                    <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                        Discover insightful articles, stories, and resources about Islam.
                    </p>
                </div>
            </div>

            {/* Featured Articles */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Featured Articles</h2>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {featuredArticles.map((article) => (
                        <ArticleCard key={article.id} article={article} />
                    ))}
                </div>
            </div>

            {/* Categories */}
            <div className="bg-gray-50 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-8">Browse by Category</h2>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {categories.map((category) => (
                            <CategoryCard key={category.id} category={category} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent Articles */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Recent Articles</h2>
                <div className="space-y-8">
                    {recentArticles.map((article) => (
                        <ArticleCard key={article.id} article={article} horizontal />
                    ))}
                </div>
            </div>
        </>
    );
}

// @ts-ignore
Home.layout = (page: React.ReactNode) => <FrontendLayout>{page}</FrontendLayout>;

// Helper Components
function ArticleCard({ article, horizontal = false }: { article: any; horizontal?: boolean }) {
    return (
        <div className={`${horizontal ? 'flex flex-col sm:flex-row' : 'flex flex-col'} bg-white rounded-lg shadow overflow-hidden`}>
            <div className={`${horizontal ? 'sm:w-48' : 'h-48'} bg-gray-200`}>
                {/* Placeholder for article image */}
                <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                    <span className="text-gray-500">Image</span>
                </div>
            </div>
            <div className="p-6 flex-1">
                <div className="flex items-center text-sm text-gray-500 mb-2">
                    <span>{new Date(article.published_at).toLocaleDateString()}</span>
                    <span className="mx-2">•</span>
                    <a href={`/categories/${article.category.slug}`} className="text-indigo-600 hover:text-indigo-800">
                        {article.category.name}
                    </a>
                </div>
                <a href={`/articles/${article.slug}`} className="block">
                    <h3 className="text-xl font-semibold text-gray-900 hover:text-indigo-600">
                        {article.title}
                    </h3>
                    <p className="mt-3 text-base text-gray-500">
                        {article.excerpt}
                    </p>
                </a>
                <div className="mt-4">
                    <a href={`/authors/${article.author.username}`} className="flex items-center">
                        <div className="flex-shrink-0">
                            <span className="inline-block h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                {article.author.name.charAt(0)}
                            </span>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">
                                {article.author.name}
                            </p>
                        </div>
                    </a>
                </div>
            </div>
        </div>
    );
}

function CategoryCard({ category }: { category: any }) {
    return (
        <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">
                    <a href={`/categories/${category.slug}`} className="hover:text-indigo-600">
                        {category.name}
                    </a>
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                    {category.articles_count} articles
                </p>
            </div>
        </div>
    );
}
