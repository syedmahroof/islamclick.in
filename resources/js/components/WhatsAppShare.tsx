import React from 'react';
import { MessageCircle } from 'lucide-react';

interface WhatsAppShareProps {
  url?: string;
  title?: string;
  text?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'floating' | 'inline';
  phoneNumber?: string;
  mode?: 'share' | 'chat';
  defaultMessage?: string;
}

export default function WhatsAppShare({ 
  url = window.location.href, 
  title = '', 
  text = '', 
  className = '',
  size = 'md',
  variant = 'floating',
  phoneNumber = '9946911916',
  mode = 'chat',
  defaultMessage = 'Welcome to IslamicClick'
}: WhatsAppShareProps) {
  const handleWhatsAppShare = () => {
    if (mode === 'chat') {
      // WhatsApp Me functionality - open chat with specific number and default message
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`;
      window.open(whatsappUrl, '_blank', 'width=600,height=400');
    } else {
      // Original share functionality
      const shareText = text || title || 'Check out this article!';
      const shareUrl = url;
      
      // Create WhatsApp share URL
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`;
      
      // Open WhatsApp in new window
      window.open(whatsappUrl, '_blank', 'width=600,height=400');
    }
  };

  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-12 h-12',
    lg: 'w-14 h-14'
  };

  const iconSizes = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-7 h-7'
  };

  const baseClasses = `
    fixed bottom-6 right-6 z-50
    bg-green-500 hover:bg-green-600 
    text-white rounded-full shadow-lg
    flex items-center justify-center
    transition-all duration-300 ease-in-out
    hover:scale-110 hover:shadow-xl
    ${sizeClasses[size]}
    ${className}
  `;

  const inlineClasses = `
    inline-flex items-center justify-center
    bg-green-500 hover:bg-green-600 
    text-white rounded-lg shadow-md
    transition-all duration-300 ease-in-out
    hover:scale-105 hover:shadow-lg
    ${sizeClasses[size]}
    ${className}
  `;

  return (
    <button
      onClick={handleWhatsAppShare}
      className={variant === 'floating' ? baseClasses : inlineClasses}
      title={mode === 'chat' ? "Chat with us on WhatsApp" : "Share on WhatsApp"}
      aria-label={mode === 'chat' ? "Chat with us on WhatsApp" : "Share on WhatsApp"}
    >
      <MessageCircle className={`${iconSizes[size]} fill-current`} />
    </button>
  );
}


