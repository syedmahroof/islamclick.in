import { useState, useEffect } from 'react';
import { Link, router } from '@inertiajs/react';
import { Bars3Icon, XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface Category {
  id: number;
  name: string;
  slug: string;
  order: number;
}

interface HeaderProps {
  categories?: Category[];
}

export default function Header({ categories = [] }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Create navigation array with Home and dynamic categories
  const navigation = [
    { name: 'Home', href: '/', current: route().current('home') },
    ...categories.map(category => ({
      name: category.name,
      href: `/category/${category.slug}`,
      current: route().current('category.show', category.slug)
    }))
  ];

  return (
    <>
      <header className={`bg-white shadow-lg transition-all duration-300 ${isSticky ? 'fixed top-0 left-0 right-0 z-50 shadow-xl' : 'relative'}`}>
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex w-full items-center justify-between py-4">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-4">
              <div className=" p-3 rounded-xl">
                <img 
                  src="/logs/islamclick_logo.svg" 
                  alt="IslamClick Logo" 
                  className="h-12 w-auto logo-glow"
                />
              </div>
              
            </Link>
            
            <div className="ml-12 hidden space-x-8 lg:block">
              {navigation.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-base font-medium transition-colors ${
                    link.current 
                      ? 'text-primary' 
                      : 'text-gray-600 hover:text-secondary'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link
              href="/articles"
              className="hidden sm:inline-flex items-center px-6 py-2.5 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-secondary transition-colors"
            >
              Browse Articles
            </Link>
          </div>
          
          <div className="ml-4 flex items-center lg:hidden">
            <button
              type="button"
              className="p-2 text-gray-600 hover:text-secondary transition-colors"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open menu</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        <div className={`lg:hidden ${mobileMenuOpen ? 'block' : 'hidden'}`}>
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 animate-fade-in" />
          <div className="fixed inset-0 z-50 flex items-start overflow-y-auto">
            <div className="w-full max-w-sm bg-white shadow-professional-xl animate-slide-in-left">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <Link href="/" className="flex items-center space-x-4" onClick={() => setMobileMenuOpen(false)}>
                    <div className="logo-container p-2 rounded-lg">
                      <img 
                        src="/logs/islamclick_logo.svg" 
                        alt="IslamClick Logo" 
                        className="h-10 w-auto logo-glow"
                      />
                    </div>
                    <span className="text-2xl font-bold text-primary">
                      Islam<span className="text-secondary">Click</span>
                    </span>
                  </Link>
                  <button
                    type="button"
                    className="p-2 text-gray-400 hover:text-secondary hover:bg-tertiary rounded-lg transition-smooth"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="sr-only">Close menu</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                
                <div className="space-y-2">
                  {navigation.map((link, index) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={`block rounded-lg px-4 py-3 text-base font-medium transition-smooth ${
                        link.current 
                          ? 'bg-tertiary text-primary' 
                          : 'text-gray-700 hover:bg-tertiary hover:text-primary'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <Link
                    href="/articles"
                    className="block w-full text-center px-4 py-3 bg-gradient-secondary text-primary-foreground font-medium rounded-lg hover:shadow-professional-lg transition-smooth"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Browse Articles
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
    
    {/* Spacer for sticky header */}
    {isSticky && <div className="h-20"></div>}
    </>
  );
}
