import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Article, User } from '@/types/models';
import { ShareIcon, BookmarkIcon, HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

interface ArticleFooterProps {
    article: Article & {
        author: Pick<User, 'id' | 'name'>;
    };
}

export default function ArticleFooter({ article }: ArticleFooterProps) {
    const [isLiked, setIsLiked] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [showShareOptions, setShowShareOptions] = useState(false);

    const handleShare = async (platform?: string) => {
        const url = window.location.href;
        const title = article.title;
        const text = article.excerpt;

        try {
            if (navigator.share) {
                await navigator.share({
                    title,
                    text,
                    url,
                });
            } else if (platform === 'twitter') {
                window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
            } else if (platform === 'facebook') {
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
            } else if (platform === 'linkedin') {
                window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
            } else if (platform === 'copy') {
                await navigator.clipboard.writeText(url);
                alert('Link copied to clipboard!');
            }
            setShowShareOptions(false);
        } catch (err) {
            console.error('Error sharing:', err);
        }
    };

    const toggleLike = () => {
        setIsLiked(!isLiked);
        // TODO: Implement actual like functionality with API call
    };

    const toggleBookmark = () => {
        setIsBookmarked(!isBookmarked);
        // TODO: Implement actual bookmark functionality with API call
    };

    return (
        <>
            <Head>
                <script 
                    async 
                    src="https://platform.twitter.com/widgets.js" 
                    charSet="utf-8"
                />
            </Head>
            
            <footer className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-8">
                    {article.tags?.map((tag) => (
                        <Link
                            key={tag.id}
                            href={`/tags/${tag.slug}`}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                            {tag.name}
                        </Link>
                    ))}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between border-t border-b border-gray-200 dark:border-gray-700 py-4">
                    <div className="flex items-center space-x-4">
                        <button
                            type="button"
                            onClick={toggleLike}
                            className="flex items-center space-x-1 text-gray-500 hover:text-amber-600 dark:text-gray-400 dark:hover:text-amber-400 transition-colors"
                            aria-label={isLiked ? 'Unlike' : 'Like'}
                        >
                            {isLiked ? (
                                <HeartIconSolid className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                            ) : (
                                <HeartIcon className="h-5 w-5" />
                            )}
                            <span>{isLiked ? 'Liked' : 'Like'}</span>
                        </button>

                        <button
                            type="button"
                            onClick={toggleBookmark}
                            className="flex items-center space-x-1 text-gray-500 hover:text-amber-600 dark:text-gray-400 dark:hover:text-amber-400 transition-colors"
                            aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark'}
                        >
                            <BookmarkIcon className={`h-5 w-5 ${isBookmarked ? 'text-amber-600 dark:text-amber-400 fill-current' : ''}`} />
                            <span>{isBookmarked ? 'Saved' : 'Save'}</span>
                        </button>
                    </div>

                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setShowShareOptions(!showShareOptions)}
                            className="flex items-center space-x-1 text-gray-500 hover:text-amber-600 dark:text-gray-400 dark:hover:text-amber-400 transition-colors"
                            aria-label="Share"
                        >
                            <ShareIcon className="h-5 w-5" />
                            <span>Share</span>
                        </button>

                        {showShareOptions && (
                            <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-10">
                                <div className="py-1" role="menu" aria-orientation="vertical">
                                    <button
                                        onClick={() => handleShare('twitter')}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                                        role="menuitem"
                                    >
                                        Share on Twitter
                                    </button>
                                    <button
                                        onClick={() => handleShare('facebook')}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                                        role="menuitem"
                                    >
                                        Share on Facebook
                                    </button>
                                    <button
                                        onClick={() => handleShare('linkedin')}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                                        role="menuitem"
                                    >
                                        Share on LinkedIn
                                    </button>
                                    <button
                                        onClick={() => handleShare('copy')}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                                        role="menuitem"
                                    >
                                        Copy link
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Author Bio */}
                <div className="mt-8 flex">
                    <div className="flex-shrink-0">
                        <Link href={`/authors/${article.author.id}`}>
                            <img
                                className="h-16 w-16 rounded-full object-cover"
                                src={article.author.profile_photo_url}
                                alt={article.author.name}
                            />
                        </Link>
                    </div>
                    <div className="ml-4">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                            <Link 
                                href={`/authors/${article.author.id}`}
                                className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                            >
                                {article.author.name}
                            </Link>
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {article.author.bio || 'Author at Islamic Center'}
                        </p>
                        <div className="mt-2 flex space-x-4">
                            {/* Add social links if available */}
                            {article.author.twitter_username && (
                                <a 
                                    href={`https://twitter.com/${article.author.twitter_username}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-gray-400 hover:text-amber-500 dark:hover:text-amber-400 transition-colors"
                                    aria-label="Twitter"
                                >
                                    <span className="sr-only">Twitter</span>
                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                                    </svg>
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <div className="mt-12 flex justify-between">
                    {article.previous_article && (
                        <Link 
                            href={`/articles/${article.previous_article.slug}`}
                            className="group flex items-center text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 transition-colors"
                        >
                            <svg className="h-5 w-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            <div>
                                <span className="text-sm font-medium">Previous</span>
                                <p className="font-medium">{article.previous_article.title}</p>
                            </div>
                        </Link>
                    )}
                    
                    {article.next_article && (
                        <Link 
                            href={`/articles/${article.next_article.slug}`}
                            className="group ml-auto text-right text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 transition-colors"
                        >
                            <div>
                                <span className="text-sm font-medium">Next</span>
                                <p className="font-medium">{article.next_article.title}</p>
                            </div>
                            <svg className="h-5 w-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    )}
                </div>
            </footer>
        </>
    );
}
