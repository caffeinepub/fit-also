import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LuxuryButton } from './LuxuryButton';
import { useLanguage } from '../hooks/useLanguage';
import { useGetCallerUserProfile, useSaveCallerUserProfile } from '../hooks/useQueries';
import type { LocalUserProfile } from '../hooks/useQueries';
import { CheckCircle } from 'lucide-react';

export function ProfileSettingsForm() {
  const { t } = useLanguage();
  const { data: profile } = useGetCallerUserProfile();
  const saveProfile = useSaveCallerUserProfile();
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState<LocalUserProfile>({
    name: '',
    phone: '',
    city: '',
    preferredLanguage: 'en',
    role: 'customer',
  });

  useEffect(() => {
    if (profile) {
      setForm(profile);
    }
  }, [profile]);

  const handleSave = async () => {
    await saveProfile.mutateAsync(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="grid gap-4">
      <div className="grid gap-1.5">
        <Label>{t('auth.name')}</Label>
        <Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
      </div>
      <div className="grid gap-1.5">
        <Label>{t('auth.phone')}</Label>
        <Input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
      </div>
      <div className="grid gap-1.5">
        <Label>{t('tailor.city')}</Label>
        <Input value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))} />
      </div>
      <div className="grid gap-1.5">
        <Label>{t('auth.language')}</Label>
        <Select value={form.preferredLanguage} onValueChange={v => setForm(p => ({ ...p, preferredLanguage: v as 'en' | 'hi' }))}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="hi">हिंदी</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-1.5">
        <Label>Role</Label>
        <Input value={form.role} disabled className="capitalize" />
      </div>
      <div className="flex items-center gap-3 pt-2">
        <LuxuryButton
          variant="primary"
          size="md"
          onClick={handleSave}
          loading={saveProfile.isPending}
          disabled={!form.name.trim()}
        >
          {t('common.save')}
        </LuxuryButton>
        {saved && (
          <div className="flex items-center gap-1.5 text-sm text-primary">
            <CheckCircle className="h-4 w-4" />
            Saved!
          </div>
        )}
      </div>
    </div>
  );
}
