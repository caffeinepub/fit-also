import { useCallback, useState } from "react";
import type { MeasurementProfile } from "../types/measurements";
import { useInternetIdentity } from "./useInternetIdentity";

function getMeasKey(principalId: string) {
  return `fitAlso_measurements_${principalId}`;
}

export function useMeasurements() {
  const { identity } = useInternetIdentity();
  const principalId = identity?.getPrincipal().toString() ?? "anonymous";

  const load = useCallback((): MeasurementProfile[] => {
    try {
      const raw = localStorage.getItem(getMeasKey(principalId));
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }, [principalId]);

  const [profiles, setProfiles] = useState<MeasurementProfile[]>(load);

  const save = useCallback(
    (updated: MeasurementProfile[]) => {
      setProfiles(updated);
      try {
        localStorage.setItem(getMeasKey(principalId), JSON.stringify(updated));
      } catch {}
    },
    [principalId],
  );

  const addProfile = useCallback(
    (profile: Omit<MeasurementProfile, "id" | "createdAt">) => {
      const newProfile: MeasurementProfile = {
        ...profile,
        id: `meas-${Date.now()}`,
        createdAt: Date.now(),
      };
      save([...profiles, newProfile]);
      return newProfile;
    },
    [profiles, save],
  );

  const updateProfile = useCallback(
    (id: string, updates: Partial<MeasurementProfile>) => {
      save(profiles.map((p) => (p.id === id ? { ...p, ...updates } : p)));
    },
    [profiles, save],
  );

  const deleteProfile = useCallback(
    (id: string) => {
      save(profiles.filter((p) => p.id !== id));
    },
    [profiles, save],
  );

  return { profiles, addProfile, updateProfile, deleteProfile };
}
