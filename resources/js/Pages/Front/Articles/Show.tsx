import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/components/layout/MainLayout';
import ArticleCard from '@/components/shared/ArticleCard';
import WhatsAppShare from '@/components/WhatsAppShare';
import { ChevronRightIcon, EyeIcon, CalendarIcon, UserIcon, TagIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';

interface Article {
    id: number;
    title: string;
    slug: string;
    body: string;
    excerpt?: string;
    featured_image_url?: string;
    category: {
        id: number;
        name: string;
        slug: string;
    };
    author: {
        id: number;
        name: string;
        profile_photo_path?: string;
    };
    tags: Array<{
        id: number;
        name: string;
        slug: string;
    }>;
    comments: Array<{
        id: number;
        content: string;
        created_at: string;
        user: {
            id: number;
            name: string;
            profile_photo_path?: string;
        };
    }>;
    references: Array<{
        id: number;
        title: string;
        link: string;
        description?: string;
        order: number;
    }>;
    published_at: string;
    views: number;
}

interface RelatedArticle {
    id: number;
    title: string;
    slug: string;
    excerpt?: string;
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

interface ArticleShowProps {
    article: Article;
    relatedArticles?: RelatedArticle[];
    navigationCategories: {
        id: number;
        name: string;
        slug: string;
        order: number;
    }[];
}

export default function ArticleShow({ article, relatedArticles, navigationCategories }: ArticleShowProps) {
    return (
        <MainLayout categories={navigationCategories}>
            <Head title={article.title}>
                <meta name="description" content={article.excerpt || article.body.substring(0, 160)} />
                <meta property="og:title" content={article.title} />
                <meta property="og:description" content={article.excerpt || article.body.substring(0, 160)} />
                {article.featured_image_url && (
                    <meta property="og:image" content={article.featured_image_url} />
                )}
                <meta name="twitter:card" content="summary_large_image" />
            </Head>
            
            <div className="bg-white">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {/* Breadcrumb */}
                    <nav className="flex mb-12 animate-slide-up" aria-label="Breadcrumb">
                        <ol className="flex items-center space-x-2">
                            <li>
                                <Link href="/" className="text-tertiary hover:text-secondary transition-smooth flex items-center">
                                    <span>Home</span>
                                </Link>
                            </li>
                            <li>
                                <ChevronRightIcon className="h-4 w-4 text-gray-400" />
                            </li>
                            <li>
                                <Link href="/articles" className="text-tertiary hover:text-secondary transition-smooth">
                                    Articles
                                </Link>
                            </li>
                            <li>
                                <ChevronRightIcon className="h-4 w-4 text-gray-400" />
                            </li>
                            <li>
                                <Link href={`/category/${article.category.slug}`} className="text-tertiary hover:text-secondary transition-smooth">
                                    {article.category.name}
                                </Link>
                            </li>
                            <li>
                                <ChevronRightIcon className="h-4 w-4 text-gray-400" />
                            </li>
                            <li>
                                <span className="text-primary font-medium truncate max-w-xs">
                                    {article.title}
                                </span>
                            </li>
                        </ol>
                    </nav>

                    {/* Article Header */}
                    <header className="mb-12 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                        <div className="mb-6">
                            <Link
                                href={`/category/${article.category.slug}`}
                                className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-tertiary text-primary hover:bg-secondary hover:text-primary-foreground transition-smooth tag-hover"
                            >
                                {article.category.name}
                            </Link>
                        </div>
                        
                        <h1 className="text-4xl font-bold text-primary sm:text-5xl lg:text-6xl mb-8 leading-tight">
                            {article.title}
                        </h1>
                        
                        {article.excerpt && (
                            <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-4xl">
                                {article.excerpt}
                            </p>
                        )}

                        <div className="flex flex-wrap items-center gap-6 text-sm">
                            <div className="flex items-center space-x-3">
                                <div className="flex items-center">
                                    {article.author.profile_photo_path ? (
                                        <img
                                            className="h-10 w-10 rounded-full border-2 border-tertiary"
                                            src={article.author.profile_photo_path}
                                            alt={article.author.name}
                                        />
                                    ) : (
                                        <div className="h-10 w-10 rounded-full bg-gradient-secondary flex items-center justify-center text-primary-foreground font-medium border-2 border-tertiary">
                                            {article.author.name.charAt(0)}
                                        </div>
                                    )}
                                    <div className="ml-3">
                                        <span className="text-gray-500">By</span>
                                        <Link href={`/authors/${article.author.id}`} className="ml-1 font-semibold text-primary hover:text-secondary transition-smooth">
                                            {article.author.name}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex items-center space-x-2 text-gray-500">
                                <CalendarIcon className="h-4 w-4" />
                                <time dateTime={article.published_at}>
                                    {new Date(article.published_at).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </time>
                            </div>
                            
                            <div className="flex items-center space-x-2 text-gray-500">
                                <EyeIcon className="h-4 w-4" />
                                <span>{article.views} views</span>
                            </div>
                        </div>
                    </header>

                    {/* Featured Image */}
                    {article.featured_image_url && (
                        <div className="mb-12 animate-scale-in" style={{ animationDelay: '0.4s' }}>
                            <div className="relative overflow-hidden rounded-2xl shadow-professional-xl">
                                <img
                                    src={article.featured_image_url}
                                    alt={article.title}
                                    className="w-full h-auto transition-smooth hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                            </div>
                        </div>
                    )}

                    {/* Article Content */}
                    <article className="prose prose-lg max-w-none mb-16 animate-slide-up" style={{ animationDelay: '0.6s' }}>
                        <div 
                            className="text-gray-700 leading-relaxed prose-headings:text-primary prose-a:text-secondary prose-a:no-underline hover:prose-a:underline prose-strong:text-primary prose-blockquote:border-l-secondary-custom prose-blockquote:bg-tertiary prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-lg"
                            dangerouslySetInnerHTML={{ __html: article.body }}
                        />
                    </article>

                    {/* Tags */}
                    {article.tags && article.tags.length > 0 && (
                        <div className="mb-16 pt-8 border-t border-gray-200 animate-slide-up" style={{ animationDelay: '0.8s' }}>
                            <div className="flex items-center space-x-2 mb-6">
                                <TagIcon className="h-5 w-5 text-secondary" />
                                <h3 className="text-lg font-semibold text-primary">Tags</h3>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {article.tags.map((tag, index) => (
                                    <Link
                                        key={tag.id}
                                        href={`/articles?tag=${tag.slug}`}
                                        className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-tertiary text-primary hover:bg-secondary hover:text-primary-foreground transition-smooth tag-hover"
                                        style={{ animationDelay: `${index * 0.1}s` }}
                                    >
                                        {tag.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* References Section */}
                    {article.references && article.references.length > 0 && (
                        <div className="mb-16 pt-8 border-t border-gray-200 animate-slide-up" style={{ animationDelay: '0.9s' }}>
                            <div className="flex items-center space-x-2 mb-6">
                                <svg className="h-5 w-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                </svg>
                                <h3 className="text-lg font-semibold text-primary">References</h3>
                            </div>
                            <div className="space-y-4">
                                {article.references.map((reference, index) => (
                                    <div key={reference.id} className="p-4 bg-gray-50 rounded-lg hover:bg-tertiary transition-smooth" style={{ animationDelay: `${index * 0.1}s` }}>
                                        <div className="flex items-start space-x-3">
                                            <span className="flex-shrink-0 w-6 h-6 bg-secondary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                                                {index + 1}
                                            </span>
                                            <div className="flex-1">
                                                <a 
                                                    href={reference.link} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="text-primary hover:text-secondary font-medium transition-smooth"
                                                >
                                                    {reference.title}
                                                </a>
                                                {reference.description && (
                                                    <p className="text-gray-600 text-sm mt-1">
                                                        {reference.description}
                                                    </p>
                                                )}
                                                <p className="text-xs text-gray-500 mt-1 break-all">
                                                    {reference.link}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Comments Section */}
                    {article.comments && article.comments.length > 0 && (
                        <div className="mb-16 pt-8 border-t border-gray-200 animate-slide-up" style={{ animationDelay: '1s' }}>
                            <div className="flex items-center space-x-2 mb-8">
                                <ChatBubbleLeftIcon className="h-6 w-6 text-secondary" />
                                <h3 className="text-2xl font-bold text-primary">
                                    Comments ({article.comments?.length || 0})
                                </h3>
                            </div>
                            <div className="space-y-8">
                                {article.comments.map((comment, index) => (
                                    <div key={comment.id} className="flex space-x-4 p-6 bg-gray-50 rounded-xl hover:bg-tertiary transition-smooth comment-hover" style={{ animationDelay: `${index * 0.1}s` }}>
                                        <div className="flex-shrink-0">
                                            {comment.user.profile_photo_path ? (
                                                <img
                                                    className="h-12 w-12 rounded-full border-2 border-tertiary"
                                                    src={comment.user.profile_photo_path}
                                                    alt={comment.user.name}
                                                />
                                            ) : (
                                                <div className="h-12 w-12 rounded-full bg-gradient-secondary flex items-center justify-center text-primary-foreground font-medium border-2 border-tertiary">
                                                    {comment.user.name.charAt(0)}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-3 mb-2">
                                                <h4 className="text-base font-semibold text-primary">
                                                    {comment.user.name}
                                                </h4>
                                                <time className="text-sm text-gray-500">
                                                    {new Date(comment.created_at).toLocaleDateString()}
                                                </time>
                                            </div>
                                            <p className="text-gray-700 leading-relaxed">
                                                {comment.content}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Related Articles */}
                    {relatedArticles && relatedArticles.length > 0 && (
                        <div className="pt-12 border-t border-gray-200 animate-slide-up" style={{ animationDelay: '1.2s' }}>
                            <div className="text-center mb-12">
                                <h3 className="text-3xl font-bold text-primary mb-4">
                                    You may also like
                                </h3>
                                <p className="text-gray-600">Discover more insightful articles</p>
                            </div>
                            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                                {relatedArticles.map((relatedArticle, index) => (
                                    <div key={relatedArticle.id} style={{ animationDelay: `${index * 0.1}s` }}>
                                        <ArticleCard article={relatedArticle} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
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
