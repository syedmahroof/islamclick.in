import { useEffect } from 'react';
import { Head } from '@inertiajs/react';

interface ArticleContentProps {
    content: string;
}

export default function ArticleContent({ content }: ArticleContentProps) {
    useEffect(() => {
        // Add any client-side processing for the article content here
        // For example, syntax highlighting, image lazy loading, etc.
        
        // Example: Add a class to all images for styling
        const images = document.querySelectorAll('.article-content img');
        images.forEach(img => {
            img.classList.add('rounded-lg', 'shadow-md', 'my-4', 'w-full', 'h-auto');
        });
        
        // Example: Add a class to all blockquotes for styling
        const blockquotes = document.querySelectorAll('.article-content blockquote');
        blockquotes.forEach(blockquote => {
            blockquote.classList.add('border-l-4', 'border-amber-500', 'pl-4', 'py-2', 'my-4', 'text-gray-600', 'dark:text-gray-300');
        });
        
        // Example: Add a class to all code blocks for styling
        const codeBlocks = document.querySelectorAll('.article-content pre');
        codeBlocks.forEach(block => {
            block.classList.add('bg-gray-100', 'dark:bg-gray-800', 'p-4', 'rounded-lg', 'overflow-x-auto', 'my-4');
        });
        
        // Example: Add a class to all tables for better styling
        const tables = document.querySelectorAll('.article-content table');
        tables.forEach(table => {
            table.classList.add('min-w-full', 'divide-y', 'divide-gray-200', 'dark:divide-gray-700', 'my-4');
            
            // Add a wrapper for horizontal scrolling on mobile
            const wrapper = document.createElement('div');
            wrapper.className = 'overflow-x-auto';
            table.parentNode?.insertBefore(wrapper, table);
            wrapper.appendChild(table);
        });
        
        // Example: Add a class to all headings for better styling
        const headings = document.querySelectorAll('.article-content h1, .article-content h2, .article-content h3, .article-content h4, .article-content h5, .article-content h6');
        headings.forEach((heading, index) => {
            const level = parseInt(heading.tagName[1]);
            const classes = [
                'font-bold',
                'mt-8',
                'mb-4',
                'text-gray-900',
                'dark:text-white'
            ];
            
            // Add different sizes based on heading level
            if (level === 1) classes.push('text-3xl', 'md:text-4xl');
            else if (level === 2) classes.push('text-2xl', 'md:text-3xl');
            else if (level === 3) classes.push('text-xl', 'md:text-2xl');
            else if (level === 4) classes.push('text-lg', 'md:text-xl');
            else if (level === 5) classes.push('text-base', 'md:text-lg');
            else classes.push('text-base');
            
            heading.className = classes.join(' ');
        });
        
        return () => {
            // Cleanup if needed
        };
    }, [content]);
    
    return (
        <>
            <Head>
                <style>{`
                    .article-content {
                        line-height: 1.7;
                        color: #374151; /* gray-700 */
                    }
                    
                    .dark .article-content {
                        color: #e5e7eb; /* gray-200 */
                    }
                    
                    .article-content p {
                        margin-bottom: 1.25rem;
                    }
                    
                    .article-content a {
                        color: #b45309; /* amber-700 */
                        text-decoration: underline;
                        transition: color 0.2s;
                    }
                    
                    .article-content a:hover {
                        color: #92400e; /* amber-800 */
                    }
                    
                    .dark .article-content a {
                        color: #f59e0b; /* amber-500 */
                    }
                    
                    .dark .article-content a:hover {
                        color: #fbbf24; /* amber-400 */
                    }
                    
                    .article-content ul, 
                    .article-content ol {
                        margin-bottom: 1.25rem;
                        padding-left: 1.5rem;
                    }
                    
                    .article-content ul {
                        list-style-type: disc;
                    }
                    
                    .article-content ol {
                        list-style-type: decimal;
                    }
                    
                    .article-content li {
                        margin-bottom: 0.5rem;
                    }
                    
                    .article-content img {
                        max-width: 100%;
                        height: auto;
                        margin: 1.5rem 0;
                    }
                    
                    .article-content table {
                        border-collapse: collapse;
                        width: 100%;
                    }
                    
                    .article-content th,
                    .article-content td {
                        padding: 0.5rem 1rem;
                        border: 1px solid #e5e7eb; /* gray-200 */
                        text-align: left;
                    }
                    
                    .dark .article-content th,
                    .dark .article-content td {
                        border-color: #374151; /* gray-700 */
                    }
                    
                    .article-content th {
                        background-color: #f9fafb; /* gray-50 */
                        font-weight: 600;
                    }
                    
                    .dark .article-content th {
                        background-color: #1f2937; /* gray-800 */
                    }
                    
                    .article-content pre {
                        white-space: pre-wrap;
                        word-wrap: break-word;
                        font-family: 'Fira Code', 'Fira Mono', Menlo, Monaco, Consolas, 'Courier New', monospace;
                        font-size: 0.875rem;
                        line-height: 1.5;
                    }
                    
                    .article-content code {
                        font-family: 'Fira Code', 'Fira Mono', Menlo, Monaco, Consolas, 'Courier New', monospace;
                        font-size: 0.875rem;
                        background-color: rgba(0, 0, 0, 0.05);
                        padding: 0.2em 0.4em;
                        border-radius: 0.25rem;
                    }
                    
                    .dark .article-content code {
                        background-color: rgba(255, 255, 255, 0.1);
                    }
                `}</style>
            </Head>
            <div 
                className="article-content prose dark:prose-invert prose-headings:font-bold prose-headings:mt-8 prose-headings:mb-4 prose-p:mb-4 prose-ul:my-4 prose-ol:my-4 prose-li:my-1 prose-a:text-amber-600 dark:prose-a:text-amber-400 hover:prose-a:text-amber-700 dark:hover:prose-a:text-amber-300 prose-img:rounded-lg prose-img:shadow-md prose-blockquote:border-amber-500 prose-blockquote:not-italic"
                dangerouslySetInnerHTML={{ __html: content }} 
            />
        </>
    );
}
