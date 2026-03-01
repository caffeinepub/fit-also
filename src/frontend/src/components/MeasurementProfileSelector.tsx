import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";
import { useLanguage } from "../hooks/useLanguage";
import { useMeasurements } from "../hooks/useMeasurements";
import type { MeasurementProfile } from "../types/measurements";

interface MeasurementProfileSelectorProps {
  value: string;
  onChange: (profileId: string) => void;
}

export function MeasurementProfileSelector({
  value,
  onChange,
}: MeasurementProfileSelectorProps) {
  const { t } = useLanguage();
  const { profiles } = useMeasurements();

  return (
    <div className="grid gap-1.5">
      <Label>{t("checkout.selectMeasurement")}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder={t("checkout.selectMeasurement")} />
        </SelectTrigger>
        <SelectContent>
          {profiles.map((p) => (
            <SelectItem key={p.id} value={p.id}>
              {p.name} — Chest: {p.chest}cm, Waist: {p.waist}cm
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {profiles.length === 0 && (
        <p className="text-xs text-muted-foreground">
          No measurement profiles found. Please add one in your dashboard.
        </p>
      )}
    </div>
  );
}
