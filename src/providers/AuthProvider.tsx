import React from "react";
import type { Session, AuthChangeEvent } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import type { Database } from "../lib/database.types";

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

type AuthContextValue = {
  session: Session | null;
  profile: ProfileRow | null;
  role: ProfileRow["role"] | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
};

const AuthContext = React.createContext<AuthContextValue | undefined>(
  undefined
);

async function fetchProfile(userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("Failed to load profile:", error);
    return null;
  }

  return data;
}

type AuthProviderProps = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = React.useState<Session | null>(null);
  const [profile, setProfile] = React.useState<ProfileRow | null>(null);
  const [loading, setLoading] = React.useState(true);

  const loadProfile = React.useCallback(async () => {
    if (!session?.user?.id) {
      setProfile(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    const data = await fetchProfile(session.user.id);
    setProfile(data);
    setLoading(false);
  }, [session?.user?.id]);

  React.useEffect(() => {
    let isMounted = true;

    const initialise = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Failed to get session:", error);
        }
        if (!isMounted) return;
        const nextSession = data?.session ?? null;
        setSession(nextSession);
        if (nextSession?.user?.id) {
          const profileData = await fetchProfile(nextSession.user.id);
          if (!isMounted) return;
          setProfile(profileData);
        } else {
          setProfile(null);
        }
      } catch (err) {
        console.error("Auth session initialisation error:", err);
        if (!isMounted) return;
        setSession(null);
        setProfile(null);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initialise();

    const {
      data: authSubscription,
    } = supabase.auth.onAuthStateChange(
      async (_event: AuthChangeEvent, currentSession) => {
        try {
          if (!isMounted) return;
          setLoading(true);
          setSession(currentSession);
          if (currentSession?.user?.id) {
            const profileData = await fetchProfile(currentSession.user.id);
            if (!isMounted) return;
            setProfile(profileData);
          } else {
            setProfile(null);
          }
        } catch (err) {
          console.error("Auth state change error:", err);
        } finally {
          if (isMounted) {
            setLoading(false);
          }
        }
      }
    );

    return () => {
      isMounted = false;
      authSubscription?.subscription?.unsubscribe();
    };
  }, []);

  const value = React.useMemo(
    () => ({
      session,
      profile,
      role: profile?.role ?? null,
      loading,
      refreshProfile: loadProfile,
    }),
    [session, profile, loading, loadProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return ctx;
}
