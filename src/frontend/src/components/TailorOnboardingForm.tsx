import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, Plus, X } from "lucide-react";
import React, { useState } from "react";
import { useLanguage } from "../hooks/useLanguage";
import { useRequestApproval } from "../hooks/useQueries";
import { useTailors } from "../hooks/useTailors";
import type { TailorProfile } from "../types/tailor";
import { LuxuryButton } from "./LuxuryButton";

const SPECIALTY_OPTIONS = [
  "Shirts",
  "Kurtas",
  "Suits",
  "Sherwanis",
  "Trousers",
  "Lehengas",
  "Saree Blouses",
  "Anarkalis",
];

interface TailorOnboardingFormProps {
  existing?: TailorProfile;
  onSuccess?: () => void;
}

export function TailorOnboardingForm({
  existing,
  onSuccess,
}: TailorOnboardingFormProps) {
  const { t } = useLanguage();
  const { createTailorProfile, updateTailorProfile } = useTailors();
  const requestApproval = useRequestApproval();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    shopName: existing?.shopName ?? "",
    city: existing?.city ?? "",
    bio: existing?.bio ?? "",
    turnaroundDays: existing?.turnaroundDays ?? 14,
    basePricing: existing?.basePricing ?? 2000,
    specialties: existing?.specialties ?? ([] as string[]),
    portfolioUrls: existing?.portfolioUrls ?? [""],
  });

  const toggleSpecialty = (s: string) => {
    setForm((prev) => ({
      ...prev,
      specialties: prev.specialties.includes(s)
        ? prev.specialties.filter((x) => x !== s)
        : [...prev.specialties, s],
    }));
  };

  const setPortfolioUrl = (idx: number, val: string) => {
    const urls = [...form.portfolioUrls];
    urls[idx] = val;
    setForm((prev) => ({ ...prev, portfolioUrls: urls }));
  };

  const handleSubmit = async () => {
    if (!form.shopName.trim()) return;
    setLoading(true);
    try {
      if (existing) {
        updateTailorProfile(existing.id, form);
      } else {
        createTailorProfile(form);
        await requestApproval.mutateAsync();
      }
      setSubmitted(true);
      onSuccess?.();
    } finally {
      setLoading(false);
    }
  };

  if (submitted && !existing) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="h-12 w-12 text-primary mx-auto mb-3" />
        <h3 className="font-serif text-xl font-semibold mb-2">
          Profile Submitted!
        </h3>
        <p className="text-muted-foreground text-sm">
          {t("tailor.pendingApproval")}
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-5">
      <div className="grid gap-1.5">
        <Label>{t("tailor.shopName")} *</Label>
        <Input
          value={form.shopName}
          onChange={(e) => setForm((p) => ({ ...p, shopName: e.target.value }))}
          placeholder="Your shop name"
        />
      </div>

      <div className="grid gap-1.5">
        <Label>{t("tailor.city")} *</Label>
        <Input
          value={form.city}
          onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))}
          placeholder="Mumbai, Delhi, Jaipur..."
        />
      </div>

      <div className="grid gap-1.5">
        <Label>{t("tailor.bio")}</Label>
        <Textarea
          value={form.bio}
          onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))}
          placeholder="Tell customers about your expertise..."
          rows={3}
        />
      </div>

      <div className="grid gap-2">
        <Label>{t("tailor.specialties")}</Label>
        <div className="flex flex-wrap gap-2">
          {SPECIALTY_OPTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => toggleSpecialty(s)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                form.specialties.includes(s)
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-muted-foreground hover:border-primary hover:text-primary"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-1.5">
          <Label>{t("tailor.turnaround")}</Label>
          <Input
            type="number"
            min="1"
            value={form.turnaroundDays}
            onChange={(e) =>
              setForm((p) => ({
                ...p,
                turnaroundDays: Number.parseInt(e.target.value) || 14,
              }))
            }
          />
        </div>
        <div className="grid gap-1.5">
          <Label>{t("tailor.basePricing")}</Label>
          <Input
            type="number"
            min="0"
            value={form.basePricing}
            onChange={(e) =>
              setForm((p) => ({
                ...p,
                basePricing: Number.parseInt(e.target.value) || 0,
              }))
            }
          />
        </div>
      </div>

      <div className="grid gap-2">
        <Label>{t("tailor.portfolio")}</Label>
        {form.portfolioUrls.map((url, idx) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: ordered list managed by index
          <div key={idx} className="flex gap-2">
            <Input
              value={url}
              onChange={(e) => setPortfolioUrl(idx, e.target.value)}
              placeholder="https://..."
            />
            {form.portfolioUrls.length > 1 && (
              <button
                type="button"
                onClick={() =>
                  setForm((p) => ({
                    ...p,
                    portfolioUrls: p.portfolioUrls.filter((_, i) => i !== idx),
                  }))
                }
                className="p-2 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            setForm((p) => ({ ...p, portfolioUrls: [...p.portfolioUrls, ""] }))
          }
          className="flex items-center gap-1 text-sm text-primary hover:underline w-fit"
        >
          <Plus className="h-3.5 w-3.5" /> Add another URL
        </button>
      </div>

      <LuxuryButton
        variant="primary"
        size="lg"
        onClick={handleSubmit}
        loading={loading}
        disabled={!form.shopName.trim() || !form.city.trim()}
        className="w-full"
      >
        {existing ? t("common.save") : t("tailor.onboard")}
      </LuxuryButton>
    </div>
  );
}
