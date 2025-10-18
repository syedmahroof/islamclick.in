import { ReactNode } from 'react';
import { Head, Link } from '@inertiajs/react';
import Header from './Header';
import Footer from './Footer';

interface Category {
  id: number;
  name: string;
  slug: string;
  order: number;
}

interface MainLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  categories?: Category[];
}

export default function MainLayout({ children, title = 'IslamClick', description = 'Discover the beauty of Islamic knowledge through our carefully curated articles', categories = [] }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#3a3025" />
        <link rel="apple-touch-icon" href="/logs/islamclick_favicon.png" />
      </Head>
      
      {/* Top colored line with logo colors */}
      <div className="h-1 bg-gradient-to-r from-primary via-secondary to-tertiary"></div>
      
      <Header categories={categories} />
      
      <main className="flex-grow">
        <div className="animate-fade-in">
          {children}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
