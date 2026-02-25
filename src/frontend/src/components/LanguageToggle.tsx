import React from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { cn } from '@/lib/utils';

export function LanguageToggle({ className }: { className?: string }) {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className={cn(
        'flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border text-sm font-medium transition-colors hover:bg-muted',
        className
      )}
      title="Toggle Language"
    >
      <span className={language === 'en' ? 'text-primary font-semibold' : 'text-muted-foreground'}>EN</span>
      <span className="text-muted-foreground">/</span>
      <span className={language === 'hi' ? 'text-primary font-semibold' : 'text-muted-foreground'}>हिं</span>
    </button>
  );
}
