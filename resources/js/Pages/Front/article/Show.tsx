import { Head } from '@inertiajs/react';
import MainLayout from '@/components/layout/MainLayout';
import { format } from 'date-fns';
import ShareButtons from '@/components/shared/ShareButtons';
import RelatedArticles from '@/components/article/RelatedArticles';

interface ArticleProps {
  article: {
    id: number;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    featured_image?: string;
    category?: {
      name: string;
      slug: string;
    };
    subcategory?: {
      name: string;
      slug: string;
    };
    author?: {
      name: string;
      bio?: string;
      avatar?: string;
    };
    published_at: string;
    updated_at: string;
    read_time?: number;
    tags?: Array<{
      name: string;
      slug: string;
    }>;
    related_articles?: Array<{
      id: number;
      title: string;
      slug: string;
      excerpt: string;
      featured_image?: string;
      published_at: string;
      read_time?: number;
    }>;
  };
}

export default function ArticlePage({ article }: ArticleProps) {
  const publishedDate = new Date(article.published_at);
  const updatedDate = new Date(article.updated_at);
  const isUpdated = updatedDate > publishedDate;

  return (
    <MainLayout>
      <Head title={article.title}>
        <meta name="description" content={article.excerpt} />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.excerpt} />
        {article.featured_image && (
          <meta property="og:image" content={article.featured_image} />
        )}
      </Head>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-8">
          {article.category && (
            <div className="text-sm font-medium text-primary mb-2">
              <a href={`/category/${article.category.slug}`} className="hover:underline">
                {article.category.name}
              </a>
              {article.subcategory && (
                <>
                  <span className="mx-2">/</span>
                  <a href={`/category/${article.category.slug}/${article.subcategory.slug}`} className="hover:underline">
                    {article.subcategory.name}
                  </a>
                </>
              )}
            </div>
          )}
          
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl md:text-5xl mb-4">
            {article.title}
          </h1>
          
          <div className="flex items-center text-sm text-gray-500 mb-6">
            <div className="flex-shrink-0">
              {article.author?.avatar ? (
                <img 
                  className="h-10 w-10 rounded-full" 
                  src={article.author.avatar} 
                  alt={article.author.name} 
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                  {article.author?.name?.charAt(0) || 'A'}
                </div>
              )}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">
                {article.author?.name || 'Admin'}
              </p>
              <div className="flex space-x-1 text-sm text-gray-500">
                <time dateTime={article.published_at}>
                  {format(publishedDate, 'MMMM d, yyyy')}
                </time>
                {isUpdated && (
                  <span title={`Updated on ${format(updatedDate, 'MMMM d, yyyy')}`}>
                    (Updated)
                  </span>
                )}
                {article.read_time && (
                  <>
                    <span aria-hidden="true">&middot;</span>
                    <span>{article.read_time} min read</span>
                  </>
                )}
              </div>
            </div>
          </div>
          
          {article.featured_image && (
            <div className="mt-6 mb-8">
              <img
                className="w-full h-auto rounded-lg shadow-lg"
                src={article.featured_image}
                alt={article.title}
              />
              {article.featured_image_caption && (
                <p className="mt-2 text-sm text-center text-gray-500">
                  {article.featured_image_caption}
                </p>
              )}
            </div>
          )}
        </header>
        
        <div className="prose prose-lg max-w-none">
          <div dangerouslySetInnerHTML={{ __html: article.content }} />
        </div>
        
        {article.tags && article.tags.length > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <a
                  key={tag.slug}
                  href={`/tag/${tag.slug}`}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20"
                >
                  {tag.name}
                </a>
              ))}
            </div>
          </div>
        )}
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <ShareButtons 
            url={typeof window !== 'undefined' ? window.location.href : ''}
            title={article.title}
            description={article.excerpt}
          />
        </div>
        
        {article.related_articles && article.related_articles.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h2>
            <RelatedArticles articles={article.related_articles} />
          </div>
        )}
      </article>
    </MainLayout>
  );
}

// This function is called on the server-side to fetch data for the page
export async function getServerSideProps({ params }: { params: { slug: string } }) {
  // In a real app, you would fetch data from your API here
  // For now, we'll return mock data
  const mockArticle = {
    id: 1,
    title: 'The Importance of Seeking Knowledge in Islam',
    slug: params.slug,
    excerpt: 'Seeking knowledge is an obligation upon every Muslim. Learn about the virtues and manners of seeking knowledge in Islam.',
    content: `
      <p>In the name of Allah, the Most Gracious, the Most Merciful.</p>
      
      <h2>The Virtue of Knowledge</h2>
      <p>Allah says in the Quran:</p>
      <blockquote>
        "Allah will raise those who have believed among you and those who were given knowledge, by degrees." (Quran 58:11)
      </blockquote>
      
      <p>The Prophet Muhammad (peace be upon him) said:</p>
      <blockquote>
        "Whoever follows a path in the pursuit of knowledge, Allah will make a path to Paradise easy for him." (Bukhari)
      </blockquote>
      
      <h2>The Obligation of Seeking Knowledge</h2>
      <p>Seeking knowledge is an obligation upon every Muslim. The Prophet (peace be upon him) said:</p>
      <blockquote>
        "Seeking knowledge is obligatory upon every Muslim." (Ibn Majah)
      </blockquote>
      
      <h2>The Manners of Seeking Knowledge</h2>
      <p>When seeking knowledge, one should observe the following manners:</p>
      <ul>
        <li>Sincerity in intention</li>
        <li>Purification of the heart</li>
        <li>Acting upon the knowledge</li>
        <li>Respecting the scholars</li>
        <li>Being patient and persistent</li>
      </ul>
      
      <p>May Allah grant us beneficial knowledge and make us of those who act upon it. Ameen.</p>
    `,
    featured_image: '/images/featured-article.jpg',
    category: {
      name: 'Aqeeda',
      slug: 'aqeeda'
    },
    author: {
      name: 'Shaykh Abdullah',
      bio: 'A scholar of Islamic studies with over 20 years of experience in teaching and research.',
    },
    published_at: '2023-05-15T10:00:00Z',
    updated_at: '2023-05-20T14:30:00Z',
    read_time: 8,
    tags: [
      { name: 'Knowledge', slug: 'knowledge' },
      { name: 'Sunnah', slug: 'sunnah' },
      { name: 'Education', slug: 'education' },
    ],
    related_articles: [
      {
        id: 2,
        title: 'The Etiquette of the Student of Knowledge',
        slug: 'etiquette-student-knowledge',
        excerpt: 'Learn the proper manners and etiquette that every student of knowledge should observe.',
        published_at: '2023-04-10T08:00:00Z',
        read_time: 6,
      },
      {
        id: 3,
        title: 'The Importance of Memorizing the Quran',
        slug: 'importance-memorizing-quran',
        excerpt: 'Discover the virtues and benefits of memorizing the Quran in Islam.',
        published_at: '2023-03-22T15:45:00Z',
        read_time: 5,
      },
    ],
  };

  return {
    props: {
      article: mockArticle,
    },
  };
}
