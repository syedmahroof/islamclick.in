import { Link } from '@inertiajs/react';
import { Category, User } from '@/types/models';

interface ArticleSidebarProps {
    author: Pick<User, 'id' | 'name' | 'profile_photo_url'>;
    category: Pick<Category, 'id' | 'name' | 'slug'>;
    tags: Array<{ id: number; name: string; slug: string }>;
}

export default function ArticleSidebar({ author, category, tags }: ArticleSidebarProps) {
    return (
        <div className="space-y-8">
            {/* Author Info */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">About the Author</h3>
                <div className="flex items-center">
                    <img 
                        className="h-16 w-16 rounded-full object-cover" 
                        src={author.profile_photo_url} 
                        alt={author.name} 
                    />
                    <div className="ml-4">
                        <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                            <Link 
                                href={`/authors/${author.id}`}
                                className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                            >
                                {author.name}
                            </Link>
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Author at Islamic Center
                        </p>
                    </div>
                </div>
                <div className="mt-4">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                        {author.bio || 'No bio available.'}
                    </p>
                </div>
            </div>

            {/* Category */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Category</h3>
                <div>
                    <Link 
                        href={`/categories/${category.slug}`}
                        className="inline-flex items-center px-4 py-2 bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100 rounded-full text-sm font-medium hover:bg-amber-200 dark:hover:bg-amber-800 transition-colors"
                    >
                        {category.name}
                    </Link>
                </div>
            </div>

            {/* Tags */}
            {tags.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                        {tags.map((tag) => (
                            <Link
                                key={tag.id}
                                href={`/tags/${tag.slug}`}
                                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            >
                                {tag.name}
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Newsletter Signup */}
            <div className="bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30 rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Subscribe to our newsletter</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    Get the latest articles and resources sent straight to your inbox.
                </p>
                <form className="space-y-3">
                    <div>
                        <label htmlFor="email" className="sr-only">Email address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            placeholder="Enter your email"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 dark:bg-amber-700 dark:hover:bg-amber-600"
                    >
                        Subscribe
                    </button>
                </form>
            </div>
        </div>
    );
}
