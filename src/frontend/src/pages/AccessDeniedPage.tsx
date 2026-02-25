import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useLanguage } from '../hooks/useLanguage';
import { LuxuryCard } from '../components/LuxuryCard';
import { LuxuryButton } from '../components/LuxuryButton';
import { ShieldX } from 'lucide-react';

export function AccessDeniedPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-20 flex items-center justify-center">
      <LuxuryCard className="p-12 text-center max-w-md">
        <ShieldX className="h-16 w-16 text-destructive mx-auto mb-4" />
        <h1 className="font-serif text-2xl font-bold text-foreground mb-2">{t('auth.accessDenied')}</h1>
        <p className="text-muted-foreground mb-6">
          You don't have permission to access this page.
        </p>
        <LuxuryButton variant="primary" size="lg" onClick={() => navigate({ to: '/' })}>
          {t('auth.goHome')}
        </LuxuryButton>
      </LuxuryCard>
    </div>
  );
}
