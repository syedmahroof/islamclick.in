import { Head, Link } from '@inertiajs/react';
import FrontendLayout from '@/layouts/FrontendLayout';
import { Pagination } from '@/components/ui/pagination';

interface Article {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    published_at: string;
    reading_time: string;
    author: {
        name: string;
        username: string;
    };
}

interface Category {
    id: number;
    name: string;
    description?: string;
    articles: {
        data: Article[];
        links: any[];
    };
}

interface CategoryShowProps {
    category: Category;
}

export default function CategoryShow({ category }: CategoryShowProps) {
    return (
        <>
            <Head title={category.name} />
            
            <div className="bg-white">
                <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                            {category.name}
                        </h1>
                        {category.description && (
                            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
                                {category.description}
                            </p>
                        )}
                    </div>

                    <div className="mt-12 max-w-lg mx-auto grid gap-5 lg:grid-cols-3 lg:max-w-none">
                        {category.articles.data.map((article) => (
                            <ArticleCard key={article.id} article={article} />
                        ))}
                    </div>

                    <div className="mt-8">
                        <Pagination links={category.articles.links} />
                    </div>
                </div>
            </div>
        </>
    );
}

// @ts-ignore
CategoryShow.layout = (page: React.ReactNode) => <FrontendLayout>{page}</FrontendLayout>;

function ArticleCard({ article }: { article: any }) {
    return (
        <div className="flex flex-col rounded-lg shadow-lg overflow-hidden">
            <div className="flex-shrink-0">
                <div className="h-48 w-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">Featured Image</span>
                </div>
            </div>
            <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-indigo-600">
                        <Link href={`/authors/${article.author.username}`} className="hover:underline">
                            {article.author.name}
                        </Link>
                    </p>
                    <Link href={`/articles/${article.slug}`} className="block mt-2">
                        <h3 className="text-xl font-semibold text-gray-900">
                            {article.title}
                        </h3>
                        <p className="mt-3 text-base text-gray-500">
                            {article.excerpt}
                        </p>
                    </Link>
                </div>
                <div className="mt-6 flex items-center">
                    <div className="flex-shrink-0">
                        <span className="sr-only">{article.author.name}</span>
                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                            {article.author.name.charAt(0)}
                        </div>
                    </div>
                    <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                            <Link href={`/authors/${article.author.username}`} className="hover:underline">
                                {article.author.name}
                            </Link>
                        </p>
                        <div className="flex space-x-1 text-sm text-gray-500">
                            <time dateTime={article.published_at}>
                                {new Date(article.published_at).toLocaleDateString()}
                            </time>
                            <span aria-hidden="true">&middot;</span>
                            <span>{article.reading_time} min read</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
