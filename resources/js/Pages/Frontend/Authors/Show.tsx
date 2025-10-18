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
    category: {
        name: string;
        slug: string;
    };
}

interface Author {
    id: number;
    name: string;
    username: string;
    bio?: string;
    avatar_url?: string;
    articles: {
        data: Article[];
        links: any[];
    };
}

interface AuthorShowProps {
    author: Author;
}

export default function AuthorShow({ author }: AuthorShowProps) {
    return (
        <>
            <Head title={author.name} />
            
            <div className="bg-white">
                <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
                    {/* Author Header */}
                    <div className="text-center">
                        <div className="flex justify-center">
                            {author.avatar_url ? (
                                <img 
                                    className="h-32 w-32 rounded-full" 
                                    src={author.avatar_url} 
                                    alt={author.name}
                                />
                            ) : (
                                <div className="h-32 w-32 rounded-full bg-indigo-100 flex items-center justify-center text-4xl font-medium text-indigo-600">
                                    {author.name.charAt(0)}
                                </div>
                            )}
                        </div>
                        <h1 className="mt-6 text-3xl font-extrabold text-gray-900">
                            {author.name}
                        </h1>
                        <p className="mt-2 text-lg text-gray-500">
                            {author.articles.data.length} articles published
                        </p>
                        {author.bio && (
                            <p className="mt-4 max-w-2xl mx-auto text-base text-gray-500">
                                {author.bio}
                            </p>
                        )}
                    </div>

                    {/* Author's Articles */}
                    <div className="mt-16">
                        <h2 className="text-2xl font-bold text-gray-900 mb-8">Latest Articles</h2>
                        <div className="space-y-8">
                            {author.articles.data.map((article) => (
                                <ArticleCard key={article.id} article={article} />
                            ))}
                        </div>

                        <div className="mt-8">
                            <Pagination links={author.articles.links} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

// @ts-ignore
AuthorShow.layout = (page: React.ReactNode) => <FrontendLayout>{page}</FrontendLayout>;

function ArticleCard({ article }: { article: any }) {
    return (
        <article className="pt-8 first:pt-0 border-t border-gray-200 first:border-t-0">
            <div className="md:flex md:items-center md:justify-between">
                <div className="flex-1">
                    <div className="flex items-center text-sm">
                        <time dateTime={article.published_at} className="text-gray-500">
                            {new Date(article.published_at).toLocaleDateString()}
                        </time>
                        <span className="mx-2 text-gray-400">•</span>
                        <span className="text-gray-500">{article.reading_time} min read</span>
                        <span className="mx-2 text-gray-400">•</span>
                        <a 
                            href={`/categories/${article.category.slug}`}
                            className="text-indigo-600 hover:text-indigo-800"
                        >
                            {article.category.name}
                        </a>
                    </div>
                    <a href={`/articles/${article.slug}`} className="block mt-2">
                        <h3 className="text-xl font-semibold text-gray-900 hover:text-indigo-600">
                            {article.title}
                        </h3>
                        <p className="mt-3 text-base text-gray-600">
                            {article.excerpt}
                        </p>
                    </a>
                    <div className="mt-3">
                        <a 
                            href={`/articles/${article.slug}`}
                            className="text-base font-semibold text-indigo-600 hover:text-indigo-500"
                        >
                            Read full story
                        </a>
                    </div>
                </div>
                <div className="mt-4 md:mt-0 md:ml-6">
                    <div className="h-32 w-48 bg-gray-200 rounded-md flex items-center justify-center text-gray-500">
                        Featured Image
                    </div>
                </div>
            </div>
        </article>
    );
}
