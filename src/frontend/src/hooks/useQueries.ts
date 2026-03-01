import type { Principal } from "@icp-sdk/core/principal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  type ApprovalStatus,
  type PlatformConfig,
  UserRole,
  Variant_all_tailors_customers,
} from "../backend";
import { useActor } from "./useActor";
import { useInternetIdentity } from "./useInternetIdentity";

// ─── User Profile (backend-based with localStorage fallback for migration) ───

export interface LocalUserProfile {
  name: string;
  phone: string;
  city: string;
  preferredLanguage: "en" | "hi";
  role: "customer" | "tailor" | "admin";
  measurements?: Array<{ name: string; value: number }>;
}

const PROFILES_KEY = "fitAlso_profiles";

function getStoredProfiles(): Record<string, LocalUserProfile> {
  try {
    const raw = localStorage.getItem(PROFILES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveStoredProfile(principalId: string, profile: LocalUserProfile) {
  const profiles = getStoredProfiles();
  profiles[principalId] = profile;
  localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
}

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  const query = useQuery<LocalUserProfile | null>({
    queryKey: ["currentUserProfile", identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!identity || !actor) return null;

      try {
        // Try backend first
        const backendProfile = await actor.getUserProfile();
        if (backendProfile) {
          // Convert backend profile to local format
          return {
            name: backendProfile.name,
            phone: backendProfile.phoneNumber,
            city: backendProfile.city,
            preferredLanguage: backendProfile.preferredLanguage as "en" | "hi",
            role: "customer", // Default role, can be overridden by role check
            measurements: backendProfile.measurements,
          };
        }
      } catch (err) {
        console.warn("Backend profile fetch failed, using localStorage:", err);
      }

      // Fallback to localStorage for migration
      const principalId = identity.getPrincipal().toString();
      const profiles = getStoredProfiles();
      return profiles[principalId] ?? null;
    },
    enabled: !!actor && !actorFetching && !!identity,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: LocalUserProfile) => {
      if (!identity) throw new Error("Not authenticated");

      const principalId = identity.getPrincipal().toString();

      // Save to backend
      if (actor) {
        try {
          await actor.saveUserProfile({
            name: profile.name,
            phoneNumber: profile.phone,
            city: profile.city,
            preferredLanguage: profile.preferredLanguage,
            measurementsJson: JSON.stringify(profile.measurements || []),
            role: profile.role || "customer",
            measurements:
              profile.measurements?.map((m) => ({
                name: m.name,
                value: m.value,
              })) ?? [],
          });
        } catch (err) {
          console.error("Backend profile save failed:", err);
          // Still save to localStorage as fallback
          saveStoredProfile(principalId, profile);
          throw err;
        }
      }

      // Also save to localStorage for migration/caching
      saveStoredProfile(principalId, profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
    },
  });
}

// ─── Admin / Role checks ───

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<boolean>({
    queryKey: ["isCallerAdmin", identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useGetCallerUserRole() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<UserRole>({
    queryKey: ["callerUserRole", identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) return UserRole.guest;
      return actor.getCallerUserRole();
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useIsCallerApproved() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<boolean>({
    queryKey: ["isCallerApproved", identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerApproved();
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useListApprovals() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery({
    queryKey: ["listApprovals"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listApprovals();
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useSetApproval() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      user,
      status,
    }: { user: Principal; status: ApprovalStatus }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.setApproval(user, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listApprovals"] });
    },
  });
}

export function useRequestApproval() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.requestApproval();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["isCallerApproved"] });
    },
  });
}

export function useAssignUserRole() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ user, role }: { user: Principal; role: UserRole }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.assignCallerUserRole(user, role);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["callerUserRole"] });
    },
  });
}

// ─── Platform Config ───

export function useGetPlatformConfig() {
  const { actor, isFetching } = useActor();

  return useQuery<PlatformConfig | null>({
    queryKey: ["platformConfig"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getPlatformConfig();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdatePlatformConfig() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (config: PlatformConfig) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updatePlatformConfig(config);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["platformConfig"] });
    },
  });
}

// ─── Notifications ───

export function useGetNotifications(sinceTimestamp: bigint = BigInt(0)) {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery({
    queryKey: ["notifications", sinceTimestamp.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getNotifications(sinceTimestamp);
    },
    enabled: !!actor && !isFetching && !!identity,
    refetchInterval: 15000, // Poll every 15 seconds
  });
}

export function useCreateNotification() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notification: {
      title: string;
      body: string;
      targetAudience: "all" | "tailors" | "customers";
    }) => {
      if (!actor) throw new Error("Actor not available");

      // Convert string to enum
      const targetAudienceEnum =
        Variant_all_tailors_customers[notification.targetAudience];

      return actor.createNotification({
        id: crypto.randomUUID(),
        title: notification.title,
        body: notification.body,
        targetAudience: targetAudienceEnum,
        timestamp: BigInt(Date.now()),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}
