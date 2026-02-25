import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useLanguage } from '../hooks/useLanguage';
import type { ProductListing, CustomizationOptions, NeckStyle, SleeveStyle, FabricType, ColorPattern, WorkType } from '../types/catalog';

interface CustomizationSelectorProps {
  listing: ProductListing;
  value: CustomizationOptions;
  onChange: (options: CustomizationOptions) => void;
}

export function CustomizationSelector({ listing, value, onChange }: CustomizationSelectorProps) {
  const { t } = useLanguage();

  const update = <K extends keyof CustomizationOptions>(key: K, val: CustomizationOptions[K]) => {
    onChange({ ...value, [key]: val });
  };

  return (
    <div className="grid gap-4">
      <div className="grid gap-1.5">
        <Label>{t('listing.neckStyle')}</Label>
        <Select value={value.neckStyle} onValueChange={v => update('neckStyle', v as NeckStyle)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {listing.availableNeckStyles.map(s => (
              <SelectItem key={s} value={s}>{t(`neck.${s}` as any)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-1.5">
        <Label>{t('listing.sleeveStyle')}</Label>
        <Select value={value.sleeveStyle} onValueChange={v => update('sleeveStyle', v as SleeveStyle)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {listing.availableSleeveStyles.map(s => (
              <SelectItem key={s} value={s}>{t(`sleeve.${s}` as any)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-1.5">
        <Label>{t('listing.fabric')}</Label>
        <Select value={value.fabricType} onValueChange={v => update('fabricType', v as FabricType)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {listing.availableFabrics.map(f => (
              <SelectItem key={f} value={f}>{t(`fabric.${f}` as any)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-1.5">
        <Label>{t('listing.color')}</Label>
        <Select value={value.colorPattern} onValueChange={v => update('colorPattern', v as ColorPattern)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {listing.availableColors.map(c => (
              <SelectItem key={c} value={c}>{t(`color.${c}` as any)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-1.5">
        <Label>{t('listing.workType')}</Label>
        <Select value={value.workType} onValueChange={v => update('workType', v as WorkType)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {listing.availableWorkTypes.map(w => (
              <SelectItem key={w} value={w}>{t(`work.${w}` as any)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
