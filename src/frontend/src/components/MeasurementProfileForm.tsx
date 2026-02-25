import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LuxuryButton } from './LuxuryButton';
import { useLanguage } from '../hooks/useLanguage';
import type { MeasurementProfile } from '../types/measurements';

interface MeasurementProfileFormProps {
  initial?: Partial<MeasurementProfile>;
  onSave: (data: Omit<MeasurementProfile, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
  loading?: boolean;
}

export function MeasurementProfileForm({ initial, onSave, onCancel, loading }: MeasurementProfileFormProps) {
  const { t } = useLanguage();
  const [form, setForm] = useState({
    name: initial?.name ?? '',
    chest: initial?.chest ?? 0,
    waist: initial?.waist ?? 0,
    hips: initial?.hips ?? 0,
    shoulderWidth: initial?.shoulderWidth ?? 0,
    sleeveLength: initial?.sleeveLength ?? 0,
    inseam: initial?.inseam ?? 0,
    neckCircumference: initial?.neckCircumference ?? 0,
    height: initial?.height ?? 0,
  });

  const setField = (key: string, val: string) => {
    setForm(prev => ({ ...prev, [key]: key === 'name' ? val : parseFloat(val) || 0 }));
  };

  const fields: { key: string; label: string }[] = [
    { key: 'chest', label: t('meas.chest') },
    { key: 'waist', label: t('meas.waist') },
    { key: 'hips', label: t('meas.hips') },
    { key: 'shoulderWidth', label: t('meas.shoulder') },
    { key: 'sleeveLength', label: t('meas.sleeve') },
    { key: 'inseam', label: t('meas.inseam') },
    { key: 'neckCircumference', label: t('meas.neck') },
    { key: 'height', label: t('meas.height') },
  ];

  return (
    <div className="grid gap-4">
      <div className="grid gap-1.5">
        <Label>{t('meas.profileName')} *</Label>
        <Input value={form.name} onChange={e => setField('name', e.target.value)} placeholder="e.g. Formal, Casual" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        {fields.map(f => (
          <div key={f.key} className="grid gap-1.5">
            <Label className="text-xs">{f.label}</Label>
            <Input
              type="number"
              min="0"
              value={form[f.key as keyof typeof form] || ''}
              onChange={e => setField(f.key, e.target.value)}
              placeholder="0"
            />
          </div>
        ))}
      </div>
      <div className="flex gap-2 pt-2">
        <LuxuryButton variant="ghost" size="sm" onClick={onCancel}>{t('common.cancel')}</LuxuryButton>
        <LuxuryButton
          variant="primary"
          size="md"
          className="flex-1"
          onClick={() => onSave(form)}
          loading={loading}
          disabled={!form.name.trim()}
        >
          {t('meas.save')}
        </LuxuryButton>
      </div>
    </div>
  );
}
