import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
  className?: string;
}

export function Pagination({ links, className = '', ...props }: PaginationProps) {
  if (!links || links.length <= 1) return null;

  return (
    <nav
      className={`flex items-center justify-between border-t border-gray-200 dark:border-gray-700 px-4 sm:px-0 ${className}`}
      {...props}
    >
      <div className="-mt-px flex w-0 flex-1">
        {links[0]?.url && (
          <Link
            href={links[0].url || '#'}
            className={`inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium ${
              links[0].url 
                ? 'text-gray-500 hover:border-amber-300 hover:text-amber-600 dark:text-gray-400 dark:hover:text-amber-400' 
                : 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
            }`}
            preserveScroll
            onClick={!links[0].url ? (e) => e.preventDefault() : undefined}
          >
            <ChevronLeft className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
            Previous
          </Link>
        )}
      </div>

      <div className="hidden md:-mt-px md:flex">
        {links.map((link, index) => {
          if (index === 0 || index === links.length - 1) return null;
          
          return link.url ? (
            <Link
              key={index}
              href={link.url}
              className={`inline-flex items-center border-t-2 px-4 pt-4 text-sm font-medium ${
                link.active
                  ? 'border-amber-500 text-amber-600 dark:text-amber-400 dark:border-amber-400'
                  : 'border-transparent text-gray-500 hover:border-amber-300 hover:text-amber-600 dark:text-gray-400 dark:hover:text-amber-400'
              }`}
              preserveScroll
            >
              {link.label}
            </Link>
          ) : (
            <span
              key={index}
              className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-300 dark:text-gray-600"
            >
              {link.label}
            </span>
          );
        })}
      </div>

      <div className="-mt-px flex w-0 flex-1 justify-end">
        {links[links.length - 1]?.url && (
          <Link
            href={links[links.length - 1].url || '#'}
            className={`inline-flex items-center border-t-2 border-transparent pl-1 pt-4 text-sm font-medium ${
              links[links.length - 1].url 
                ? 'text-gray-500 hover:border-amber-300 hover:text-amber-600 dark:text-gray-400 dark:hover:text-amber-400' 
                : 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
            }`}
            preserveScroll
            onClick={!links[links.length - 1].url ? (e) => e.preventDefault() : undefined}
          >
            Next
            <ChevronRight className="ml-3 h-5 w-5 text-gray-400" aria-hidden="true" />
          </Link>
        )}
      </div>
    </nav>
  );
}
