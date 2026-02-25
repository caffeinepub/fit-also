import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LuxuryButton } from './LuxuryButton';
import { useLanguage } from '../hooks/useLanguage';
import { useSaveCallerUserProfile } from '../hooks/useQueries';
import type { LocalUserProfile } from '../hooks/useQueries';
import { User, Scissors, ShieldCheck } from 'lucide-react';

interface RoleSelectionModalProps {
  open: boolean;
}

type Step = 'role' | 'profile';

export function RoleSelectionModal({ open }: RoleSelectionModalProps) {
  const { t } = useLanguage();
  const saveProfile = useSaveCallerUserProfile();
  const [step, setStep] = useState<Step>('role');
  const [role, setRole] = useState<LocalUserProfile['role']>('customer');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [lang, setLang] = useState<'en' | 'hi'>('en');

  const handleRoleSelect = (r: LocalUserProfile['role']) => {
    setRole(r);
    setStep('profile');
  };

  const handleSave = async () => {
    if (!name.trim()) return;
    await saveProfile.mutateAsync({ name, phone, city, preferredLanguage: lang, role });
  };

  const roles = [
    { id: 'customer' as const, label: t('auth.customer'), icon: User, desc: 'Browse and order custom garments' },
    { id: 'tailor' as const, label: t('auth.tailor'), icon: Scissors, desc: 'List your services and manage orders' },
    { id: 'admin' as const, label: t('auth.admin'), icon: ShieldCheck, desc: 'Manage the platform' },
  ];

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md" onInteractOutside={e => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">
            {step === 'role' ? t('auth.selectRole') : t('auth.completeProfile')}
          </DialogTitle>
          <DialogDescription>
            {step === 'role' ? 'Choose how you want to use Fit Also' : 'Tell us a bit about yourself'}
          </DialogDescription>
        </DialogHeader>

        {step === 'role' ? (
          <div className="grid gap-3 py-2">
            {roles.map(({ id, label, icon: Icon, desc }) => (
              <button
                key={id}
                onClick={() => handleRoleSelect(id)}
                className="flex items-center gap-4 p-4 rounded-xl border-2 border-border hover:border-primary hover:bg-muted transition-all text-left group"
              >
                <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold text-foreground">{label}</div>
                  <div className="text-sm text-muted-foreground">{desc}</div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 py-2">
            <div className="grid gap-1.5">
              <Label htmlFor="name">{t('auth.name')} *</Label>
              <Input id="name" value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="phone">{t('auth.phone')}</Label>
              <Input id="phone" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 98765 43210" />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="city">{t('tailor.city')}</Label>
              <Input id="city" value={city} onChange={e => setCity(e.target.value)} placeholder="Mumbai, Delhi..." />
            </div>
            <div className="grid gap-1.5">
              <Label>{t('auth.language')}</Label>
              <Select value={lang} onValueChange={v => setLang(v as 'en' | 'hi')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="hi">हिंदी</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 pt-2">
              <LuxuryButton variant="ghost" size="sm" onClick={() => setStep('role')}>
                {t('common.back')}
              </LuxuryButton>
              <LuxuryButton
                variant="primary"
                size="md"
                className="flex-1"
                onClick={handleSave}
                loading={saveProfile.isPending}
                disabled={!name.trim()}
              >
                {t('auth.save')}
              </LuxuryButton>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
