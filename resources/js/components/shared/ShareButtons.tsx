import { useEffect, useState } from 'react';
import { Facebook, Twitter, MessageCircle, Link as LinkIcon, Mail } from 'react-feather';

interface ShareButtonsProps {
  url: string;
  title: string;
  description?: string;
  className?: string;
}

export default function ShareButtons({ 
  url, 
  title, 
  description = '',
  className = '' 
}: ShareButtonsProps) {
  const [currentUrl, setCurrentUrl] = useState('');
  
  useEffect(() => {
    // Set the current URL if not provided
    if (!url && typeof window !== 'undefined') {
      setCurrentUrl(window.location.href);
    } else {
      setCurrentUrl(url);
    }
  }, [url]);

  const shareLinks = [
    {
      name: 'Facebook',
      icon: <Facebook size={18} />,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
      color: 'text-blue-600 hover:bg-blue-50',
    },
    {
      name: 'Twitter',
      icon: <Twitter size={18} />,
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(title)}`,
      color: 'text-blue-400 hover:bg-blue-50',
    },
    {
      name: 'WhatsApp',
      icon: <MessageCircle size={18} />,
      url: `https://wa.me/?text=${encodeURIComponent(`${title} - ${currentUrl}`)}`,
      color: 'text-green-500 hover:bg-green-50',
    },
    {
      name: 'Email',
      icon: <Mail size={18} />,
      url: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${title}\n\n${description}\n\n${currentUrl}`)}`,
      color: 'text-gray-600 hover:bg-gray-50',
    },
  ];

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      alert('Link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <span className="text-sm font-medium text-gray-700">Share:</span>
      <div className="flex space-x-2">
        {shareLinks.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${link.color} transition-colors duration-200`}
            aria-label={`Share on ${link.name}`}
            title={`Share on ${link.name}`}
          >
            {link.icon}
          </a>
        ))}
        <button
          onClick={copyToClipboard}
          className="inline-flex items-center justify-center w-8 h-8 rounded-full text-gray-600 hover:bg-gray-100 transition-colors duration-200"
          aria-label="Copy link to clipboard"
          title="Copy link"
        >
          <LinkIcon size={18} />
        </button>
      </div>
    </div>
  );
}
