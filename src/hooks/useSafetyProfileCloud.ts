import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { UserSafetyProfile } from "@/types";

const LOCAL_KEY = "user_safety_profile";

function loadLocal(): UserSafetyProfile | null {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveLocal(profile: UserSafetyProfile) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(profile));
}

function rowToProfile(row: any): UserSafetyProfile {
  return {
    id: row.id,
    medications: row.medications ?? [],
    conditions: row.conditions ?? [],
    allergies: row.allergies ?? [],
    isPregnant: !!row.is_pregnant,
    age: row.age ?? 30,
    lastUpdated: row.updated_at ? new Date(row.updated_at).getTime() : Date.now(),
  };
}

/**
 * Cloud-backed safety profile hook.
 * - Authed users: read/write public.safety_profiles (single row per user).
 * - Anonymous users: fall back to localStorage so the page still works.
 */
export function useSafetyProfileCloud(): {
  profile: UserSafetyProfile | null;
  setProfile: (p: UserSafetyProfile) => Promise<void>;
  loading: boolean;
} {
  const { user } = useAuth();
  const [profile, setProfileState] = useState<UserSafetyProfile | null>(loadLocal);
  const [loading, setLoading] = useState(false);

  // Fetch from cloud when authed; migrate local → cloud on first load if cloud is empty
  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!user?.id) return;
      setLoading(true);
      const { data, error } = await supabase
        .from("safety_profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      if (cancelled) return;

      if (!error && data) {
        const p = rowToProfile(data);
        setProfileState(p);
        saveLocal(p);
      } else if (!error && !data) {
        // Cloud empty — migrate local profile if present
        const local = loadLocal();
        if (local && (local.medications?.length || local.conditions?.length || local.allergies?.length)) {
          const { error: upErr } = await supabase
            .from("safety_profiles")
            .upsert({
              user_id: user.id,
              medications: local.medications,
              conditions: local.conditions,
              allergies: local.allergies,
              is_pregnant: local.isPregnant,
              age: local.age,
            }, { onConflict: "user_id" });
          if (!upErr) {
            setProfileState({ ...local, lastUpdated: Date.now() });
          }
        }
      }
      setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, [user?.id]);

  const setProfile = useCallback(async (next: UserSafetyProfile) => {
    const stamped = { ...next, lastUpdated: Date.now() };
    setProfileState(stamped);
    saveLocal(stamped);
    if (!user?.id) return;
    const { error } = await supabase
      .from("safety_profiles")
      .upsert({
        user_id: user.id,
        medications: stamped.medications,
        conditions: stamped.conditions,
        allergies: stamped.allergies,
        is_pregnant: stamped.isPregnant,
        age: stamped.age,
      }, { onConflict: "user_id" });
    if (error) console.error("[safety_profiles] save error", error);
  }, [user?.id]);

  return { profile, setProfile, loading };
}
