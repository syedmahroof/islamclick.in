import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/components/layout/MainLayout';
import ArticleCard from '@/components/shared/ArticleCard';
import WhatsAppShare from '@/components/WhatsAppShare';

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
    articles_count: number;
}

interface Tag {
    id: number;
    name: string;
    slug: string;
    articles_count: number;
}

interface ArticlesIndexProps {
    articles: {
        data: Article[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
    };
    filters: {
        search?: string;
        category?: string;
        tag?: string;
    };
    categories: Category[];
    popularTags: Tag[];
    navigationCategories: {
        id: number;
        name: string;
        slug: string;
        order: number;
    }[];
}

export default function ArticlesIndex({ articles, filters, categories, popularTags, navigationCategories }: ArticlesIndexProps) {
    return (
        <MainLayout categories={navigationCategories}>
            <Head title="Articles" />
            
            <div className="bg-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-primary sm:text-5xl">
                            Islamic Articles
                        </h1>
                        <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-600 sm:mt-4">
                            Discover authentic Islamic knowledge and insights from our collection of articles
                        </p>
                    </div>

                    <div className="lg:grid lg:grid-cols-4 lg:gap-8">
                        {/* Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="space-y-8">
                                {/* Search */}
                                <div className="bg-gray-50 p-6 rounded-lg">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Search Articles</h3>
                                    <form method="GET" action="/articles">
                                        <div className="flex">
                                            <input
                                                type="text"
                                                name="search"
                                                defaultValue={filters.search}
                                                placeholder="Search articles..."
                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                            />
                                            <button
                                                type="submit"
                                                className="px-4 py-2 bg-primary text-primary-foreground rounded-r-md hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary"
                                            >
                                                Search
                                            </button>
                                        </div>
                                    </form>
                                </div>

                                {/* Categories */}
                                <div className="bg-gray-50 p-6 rounded-lg">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Categories</h3>
                                    <div className="space-y-2">
                                        <Link
                                            href="/articles"
                                            className={`block px-3 py-2 rounded-md text-sm font-medium ${
                                                !filters.category
                                                    ? 'bg-primary/10 text-primary'
                                                    : 'text-gray-600 hover:bg-gray-100'
                                            }`}
                                        >
                                            All Categories
                                        </Link>
                                        {categories.map((category) => (
                                            <Link
                                                key={category.id}
                                                href={`/articles?category=${category.slug}`}
                                                className={`block px-3 py-2 rounded-md text-sm font-medium ${
                                                    filters.category === category.slug
                                                        ? 'bg-primary/10 text-primary'
                                                        : 'text-gray-600 hover:bg-gray-100'
                                                }`}
                                            >
                                                {category.name} ({category.articles_count})
                                            </Link>
                                        ))}
                                    </div>
                                </div>

                                {/* Popular Tags */}
                                <div className="bg-gray-50 p-6 rounded-lg">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Popular Tags</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {popularTags.map((tag) => (
                                            <Link
                                                key={tag.id}
                                                href={`/articles?tag=${tag.slug}`}
                                                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                                    filters.tag === tag.slug
                                                        ? 'bg-primary/10 text-primary'
                                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                }`}
                                            >
                                                {tag.name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="lg:col-span-3">
                            {/* Results Header */}
                            <div className="mb-8">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-bold text-gray-900">
                                        {filters.search && `Search results for "${filters.search}"`}
                                        {filters.category && !filters.search && `Articles in ${filters.category}`}
                                        {filters.tag && !filters.search && !filters.category && `Articles tagged "${filters.tag}"`}
                                        {!filters.search && !filters.category && !filters.tag && 'All Articles'}
                                    </h2>
                                    <p className="text-gray-600">
                                        {articles.total} {articles.total === 1 ? 'article' : 'articles'} found
                                    </p>
                                </div>
                            </div>

                            {/* Articles Grid */}
                            {articles.data.length > 0 ? (
                                <>
                                    <div className="grid gap-8 md:grid-cols-2">
                                        {articles.data.map((article) => (
                                            <ArticleCard key={article.id} article={article} />
                                        ))}
                                    </div>

                                    {/* Pagination */}
                                    {articles.last_page > 1 && (
                                        <div className="mt-12 flex justify-center">
                                            <nav className="flex items-center space-x-2">
                                                {articles.current_page > 1 && (
                                                    <Link
                                                        href={`/articles?page=${articles.current_page - 1}${filters.search ? `&search=${filters.search}` : ''}${filters.category ? `&category=${filters.category}` : ''}${filters.tag ? `&tag=${filters.tag}` : ''}`}
                                                        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                                                    >
                                                        Previous
                                                    </Link>
                                                )}
                                                
                                                <span className="px-3 py-2 text-sm text-gray-700">
                                                    Page {articles.current_page} of {articles.last_page}
                                                </span>
                                                
                                                {articles.current_page < articles.last_page && (
                                                    <Link
                                                        href={`/articles?page=${articles.current_page + 1}${filters.search ? `&search=${filters.search}` : ''}${filters.category ? `&category=${filters.category}` : ''}${filters.tag ? `&tag=${filters.tag}` : ''}`}
                                                        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                                                    >
                                                        Next
                                                    </Link>
                                                )}
                                            </nav>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="text-center py-12">
                                    <h3 className="text-lg font-medium text-gray-900">No articles found</h3>
                                    <p className="mt-2 text-gray-600">
                                        {filters.search || filters.category || filters.tag
                                            ? 'Try adjusting your search criteria or browse all articles.'
                                            : 'Check back later for new content.'}
                                    </p>
                                    {(filters.search || filters.category || filters.tag) && (
                                        <div className="mt-6">
                                            <Link
                                                href="/articles"
                                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                                            >
                                                View All Articles
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
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
