import { Link } from '@inertiajs/react';
import { Category, User } from '@/types/models';

interface ArticleHeaderProps {
    title: string;
    author: Pick<User, 'id' | 'name' | 'profile_photo_url'>;
    category: Pick<Category, 'id' | 'name' | 'slug'>;
    publishedDate: string;
    readTime: string;
}

export default function ArticleHeader({ 
    title, 
    author, 
    category, 
    publishedDate, 
    readTime 
}: ArticleHeaderProps) {
    return (
        <header className="mb-8">
            <Link
                href={`/categories/${category.slug}`}
                className="inline-block mb-4 text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 text-sm font-medium transition-colors"
            >
                {category.name}
            </Link>
            
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {title}
            </h1>
            
            <div className="flex items-center mt-6">
                <div className="flex-shrink-0">
                    <img 
                        className="h-10 w-10 rounded-full" 
                        src={author.profile_photo_url} 
                        alt={author.name} 
                    />
                </div>
                <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {author.name}
                    </p>
                    <div className="flex space-x-1 text-sm text-gray-500 dark:text-gray-400">
                        <time dateTime={publishedDate}>
                            {publishedDate}
                        </time>
                        <span>•</span>
                        <span>{readTime}</span>
                    </div>
                </div>
            </div>
        </header>
    );
}
