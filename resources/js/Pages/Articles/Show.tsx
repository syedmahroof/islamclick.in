import { Head, Link, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Article, Category, User } from '@/types/models';
import AppLayout from '@/Layouts/AppLayout';
import ArticleContent from '@/components/Article/ArticleContent';
import ArticleHeader from '@/components/Article/ArticleHeader';
import ArticleSidebar from '@/components/Article/ArticleSidebar';
import ArticleFooter from '@/components/Article/ArticleFooter';
import ArticleCard from '@/components/shared/ArticleCard';

interface ArticleShowProps extends PageProps {
    article: Article & {
        author: Pick<User, 'id' | 'name' | 'profile_photo_url'>;
        category: Pick<Category, 'id' | 'name' | 'slug'>;
        tags: Array<{ id: number; name: string; slug: string }>;
        comments: Array<{
            id: number;
            content: string;
            created_at: string;
            user: Pick<User, 'id' | 'name' | 'profile_photo_url'>;
        }>;
        featured_image_url?: string;
        published_date: string;
        read_time: string;
    };
    relatedArticles: Array<{
        id: number;
        title: string;
        slug: string;
        excerpt: string;
        featured_image_url?: string;
        published_at: string;
        read_time: string;
        author: Pick<User, 'id' | 'name' | 'profile_photo_url'>;
        category: Pick<Category, 'id' | 'name' | 'slug'>;
    }>;
}

export default function Show({ article, relatedArticles }: ArticleShowProps) {
    const { auth } = usePage().props;
    
    return (
        <AppLayout>
            <Head title={article.title}>
                <meta name="description" content={article.excerpt} />
                <meta property="og:title" content={article.title} />
                <meta property="og:description" content={article.excerpt} />
                {article.featured_image_url && (
                    <meta property="og:image" content={article.featured_image_url} />
                )}
                <meta name="twitter:card" content="summary_large_image" />
            </Head>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="lg:flex gap-8">
                    <article className="lg:w-2/3">
                        <ArticleHeader 
                            title={article.title}
                            author={article.author}
                            category={article.category}
                            publishedDate={article.published_date}
                            readTime={article.read_time}
                        />

                        <div className="mt-8">
                            {article.featured_image_url && (
                                <img 
                                    src={article.featured_image_url} 
                                    alt={article.title}
                                    className="w-full h-auto rounded-lg shadow-lg mb-8"
                                />
                            )}
                            
                            <ArticleContent content={article.content} />
                            
                            {article.tags.length > 0 && (
                                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                                    <div className="flex flex-wrap gap-2">
                                        {article.tags.map((tag) => (
                                            <Link
                                                key={tag.id}
                                                href={`/tags/${tag.slug}`}
                                                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100 hover:bg-amber-200 dark:hover:bg-amber-800 transition-colors"
                                            >
                                                {tag.name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <ArticleFooter article={article} />
                    </article>

                    <aside className="lg:w-1/3 mt-12 lg:mt-0">
                        <ArticleSidebar 
                            author={article.author}
                            category={article.category}
                            tags={article.tags}
                        />
                    </aside>
                </div>

                {relatedArticles.length > 0 && (
                    <div className="mt-16 border-t border-gray-200 dark:border-gray-700 pt-12">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
                            You may also like
                        </h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {relatedArticles.map((relatedArticle) => (
                                <ArticleCard 
                                    key={relatedArticle.id}
                                    article={{
                                        ...relatedArticle,
                                        author: relatedArticle.author,
                                        category: relatedArticle.category,
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
