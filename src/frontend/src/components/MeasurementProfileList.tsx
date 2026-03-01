import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Pencil, Plus, Ruler, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { useLanguage } from "../hooks/useLanguage";
import { useMeasurements } from "../hooks/useMeasurements";
import type { MeasurementProfile } from "../types/measurements";
import { LuxuryButton } from "./LuxuryButton";
import { LuxuryCard } from "./LuxuryCard";
import { MeasurementProfileForm } from "./MeasurementProfileForm";

export function MeasurementProfileList() {
  const { t } = useLanguage();
  const { profiles, addProfile, updateProfile, deleteProfile } =
    useMeasurements();
  const [showForm, setShowForm] = useState(false);
  const [editingProfile, setEditingProfile] =
    useState<MeasurementProfile | null>(null);

  const handleSave = (data: Omit<MeasurementProfile, "id" | "createdAt">) => {
    if (editingProfile) {
      updateProfile(editingProfile.id, data);
    } else {
      addProfile(data);
    }
    setShowForm(false);
    setEditingProfile(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-lg font-semibold">{t("meas.title")}</h3>
        <LuxuryButton
          variant="outline"
          size="sm"
          onClick={() => {
            setEditingProfile(null);
            setShowForm(true);
          }}
        >
          <Plus className="h-4 w-4" />
          {t("meas.add")}
        </LuxuryButton>
      </div>

      {profiles.length === 0 ? (
        <LuxuryCard className="p-8 text-center">
          <Ruler className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">
            No measurement profiles yet. Add one to get started.
          </p>
        </LuxuryCard>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {profiles.map((profile) => (
            <LuxuryCard key={profile.id} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-foreground">
                    {profile.name}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {new Date(profile.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingProfile(profile);
                      setShowForm(true);
                    }}
                    className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteProfile(profile.id)}
                    className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2 text-xs">
                {[
                  { label: "Chest", val: profile.chest },
                  { label: "Waist", val: profile.waist },
                  { label: "Hips", val: profile.hips },
                  { label: "Height", val: profile.height },
                ].map((m) => (
                  <div
                    key={m.label}
                    className="text-center p-1.5 bg-muted rounded-md"
                  >
                    <div className="font-semibold text-foreground">{m.val}</div>
                    <div className="text-muted-foreground">{m.label}</div>
                  </div>
                ))}
              </div>
            </LuxuryCard>
          ))}
        </div>
      )}

      <Dialog
        open={showForm}
        onOpenChange={(open) => {
          if (!open) {
            setShowForm(false);
            setEditingProfile(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-serif">
              {editingProfile ? t("meas.edit") : t("meas.add")}
            </DialogTitle>
          </DialogHeader>
          <MeasurementProfileForm
            initial={editingProfile ?? undefined}
            onSave={handleSave}
            onCancel={() => {
              setShowForm(false);
              setEditingProfile(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
