import React from 'react';
import { Facebook, Instagram, Twitter, Linkedin, Youtube, Phone, Send, MessageCircle, Mail } from 'lucide-react';
import { QuackPage } from '../types';

interface SocialLinksProps {
  page: QuackPage;
  iconColor: string;
}

export const SocialLinks: React.FC<SocialLinksProps> = ({ page, iconColor }) => {
  const icons = [
    { key: 'instagram', icon: Instagram, url: page.instagram, prefix: 'https://instagram.com/' },
    { key: 'facebook', icon: Facebook, url: page.facebook, prefix: '' },
    { key: 'whatsapp', icon: MessageCircle, url: page.whatsapp, prefix: 'https://wa.me/' },
    { key: 'twitter', icon: Twitter, url: page.twitter, prefix: 'https://twitter.com/' },
    { key: 'youtube', icon: Youtube, url: page.youtube, prefix: '' },
    { key: 'linkedin', icon: Linkedin, url: page.linkedin, prefix: '' },
    { key: 'telegram', icon: Send, url: page.telegram, prefix: 'https://t.me/' },
  ];

  const activeLinks = icons.filter(item => !!item.url);

  if (activeLinks.length === 0) return null;

  return (
    <div className="flex flex-wrap justify-center gap-6 py-4">
      {activeLinks.map((item) => {
        const Icon = item.icon;
        let href = item.url || '#';
        if (item.prefix && !href.startsWith('http')) {
            href = `${item.prefix}${href.replace('@', '')}`;
        }
        
        return (
          <a
            key={item.key}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-transform hover:scale-110 p-2 rounded-full hover:bg-black/5"
            style={{ color: iconColor }}
          >
            <Icon size={28} strokeWidth={1.5} />
          </a>
        );
      })}
    </div>
  );
};
