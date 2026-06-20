import { useState, useCallback, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { UserSafetyProfile, SafetyCheckResult, Peptide } from "@/types";

const STORAGE_KEY = "user_safety_profile";

const defaultProfile: UserSafetyProfile = {
  id: "user-safety-1",
  medications: [],
  conditions: [],
  allergies: [],
  isPregnant: false,
  age: 30,
  lastUpdated: Date.now(),
};

function loadProfile(): UserSafetyProfile | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // ignore parse errors
  }
  return null;
}

function saveProfile(profile: UserSafetyProfile): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...profile, lastUpdated: Date.now() }));
}

// Simulated peptide database for safety checks
const KNOWN_CONTRAINDICATIONS: Record<string, string[]> = {
  "growth-hormone-releasing-peptide": ["pregnancy", "active-cancer", "diabetic-retinopathy"],
  "bpc-157": ["pregnancy"],
  "tb-500": ["pregnancy", "active-cancer"],
  "melanotan-ii": ["pregnancy", "history-of-melanoma"],
  "pt-141": ["cardiovascular-disease", "uncontrolled-hypertension"],
  "cjc-1295": ["pregnancy", "active-cancer"],
  "ipamorelin": ["pregnancy", "active-cancer"],
  "semaglutide": ["medullary-thyroid-carcinoma", "multyple-endocrine-neoplasia"],
  "tirzepatide": ["medullary-thyroid-carcinoma", "multyple-endocrine-neoplasia"],
};

const KNOWN_INTERACTIONS: Record<string, string[]> = {
  "growth-hormone-releasing-peptide": ["insulin", "corticosteroids"],
  "bpc-157": ["blood-thinners", "nsaids"],
  "tb-500": ["blood-thinners"],
  "melanotan-ii": ["sun-sensitizing-medications"],
  "pt-141": ["nitrates", "antihypertensives"],
  "cjc-1295": ["corticosteroids"],
  "ipamorelin": ["corticosteroids"],
  "semaglutide": ["sulfonylureas", "insulin"],
  "tirzepatide": ["sulfonylureas", "insulin"],
};

function performSafetyCheck(
  peptideId: string,
  peptideName: string,
  profile: UserSafetyProfile | null
): SafetyCheckResult {
  if (!profile) {
    return {
      peptideId,
      peptideName,
      status: "unknown",
      warnings: ["No safety profile found. Please complete your safety profile."],
      contraindications: [],
      severity: "info",
    };
  }

  const warnings: string[] = [];
  const contraindications: string[] = [];
  let severity: "info" | "warning" | "danger" = "info";

  // Check age-related concerns
  if (profile.age < 18) {
    contraindications.push("Not recommended for individuals under 18");
    severity = "danger";
  }
  if (profile.age > 65) {
    warnings.push("Use with caution in individuals over 65 - consider lower starting doses");
    severity = severity === "info" ? "warning" : severity;
  }

  // Check pregnancy
  if (profile.isPregnant) {
    const contraList = KNOWN_CONTRAINDICATIONS[peptideId] || [];
    if (contraList.includes("pregnancy")) {
      contraindications.push("Contraindicated during pregnancy");
      severity = "danger";
    } else {
      warnings.push("No safety data available during pregnancy - use with extreme caution");
      severity = severity === "info" ? "warning" : severity;
    }
  }

  // Check medical conditions
  const conditionsLower = profile.conditions.map((c) => c.toLowerCase());
  for (const condition of conditionsLower) {
    const contraList = KNOWN_CONTRAINDICATIONS[peptideId] || [];
    if (contraList.includes(condition)) {
      contraindications.push(`Contraindicated with condition: ${condition}`);
      severity = "danger";
    }
  }

  // Check medication interactions
  const medicationsLower = profile.medications.map((m) => m.toLowerCase());
  const interactions = KNOWN_INTERACTIONS[peptideId] || [];
  for (const med of medicationsLower) {
    if (interactions.includes(med)) {
      warnings.push(`Potential interaction with ${med}`);
      severity = severity === "info" ? "warning" : severity;
    }
  }

  // Check allergies
  for (const allergy of profile.allergies) {
    if (peptideName.toLowerCase().includes(allergy.toLowerCase())) {
      contraindications.push(`Allergy match: ${allergy}`);
      severity = "danger";
    }
  }

  // Determine status
  let status: SafetyCheckResult["status"] = "safe";
  if (contraindications.length > 0) {
    status = "contraindicated";
  } else if (warnings.length > 0) {
    status = "caution";
  }

  return {
    peptideId,
    peptideName,
    status,
    warnings,
    contraindications,
    severity,
  };
}

// ---- React Query keys ----
const safetyKeys = {
  all: ["safety"] as const,
  profile: () => [...safetyKeys.all, "profile"] as const,
  check: (peptideId: string) => [...safetyKeys.all, "check", peptideId] as const,
};

/**
 * Hook: useSafetyProfile
 * Returns the user's safety profile and a function to update it.
 * Persists to localStorage, caches via React Query.
 */
export function useSafetyProfile(): [UserSafetyProfile | null, (profile: UserSafetyProfile) => void] {
  const queryClient = useQueryClient();

  const { data: profile } = useQuery({
    queryKey: safetyKeys.profile(),
    queryFn: () => loadProfile(),
    staleTime: Infinity,
  });

  const setProfile = useCallback(
    (newProfile: UserSafetyProfile) => {
      saveProfile(newProfile);
      queryClient.setQueryData(safetyKeys.profile(), newProfile);
      // Invalidate all safety checks since profile changed
      queryClient.invalidateQueries({ queryKey: safetyKeys.all });
    },
    [queryClient]
  );

  return [profile ?? null, setProfile];
}

/**
 * Hook: useSafetyCheck
 * Performs a safety check for a specific peptide against the user's profile.
 * Results are cached in React Query.
 */
export function useSafetyCheck(peptideId: string): SafetyCheckResult {
  const [profile] = useSafetyProfile();

  // Derive peptide name from id for the check
  const peptideName = useMemo(() => {
    return peptideId
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  }, [peptideId]);

  const { data: result } = useQuery({
    queryKey: safetyKeys.check(peptideId),
    queryFn: () => performSafetyCheck(peptideId, peptideName, profile ?? null),
    enabled: !!peptideId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return (
    result ?? {
      peptideId,
      peptideName,
      status: "unknown",
      warnings: [],
      contraindications: [],
      severity: "info",
    }
  );
}
