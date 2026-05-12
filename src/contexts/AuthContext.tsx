import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "../lib/supabase";
import { Session, User } from "@supabase/supabase-js";

interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  phone?: string;
  role?: string;
  addresses?: Address[];
}

export interface Address {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  houseNo: string;
  street: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userProfile: UserProfile | null;
  isLoading: boolean;
  isInitialized: Promise<void>;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  loginWithGoogle: () => Promise<void>;
  signUpWithEmail: (email: string, password: string, displayName: string) => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (profile: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

let resolveIsInitialized: () => void;
const isInitialized = new Promise<void>((resolve) => {
  resolveIsInitialized = resolve;
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    // Safety timeout - if session check hangs for more than 5 seconds, force it to finish
    const fallbackTimeout = setTimeout(() => {
      if (isMounted) {
        console.warn("Auth check timed out. Forcing isLoading to false.");
        setIsLoading(false);
        if (resolveIsInitialized) resolveIsInitialized();
      }
    }, 5000);

    // Check initial session
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        if (data.session && isMounted) {
          setSession(data.session);
          setUser(data.session.user);
          // Fetch profile in the background without blocking app load
          fetchUserProfile(data.session.user.id).catch(console.error);
        }
      } catch (err) {
        console.error("Error checking session:", err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
          clearTimeout(fallbackTimeout);
          if (resolveIsInitialized) resolveIsInitialized();
        }
      }
    };

    checkSession();

    // Listen to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        console.log("Auth state changed:", _event);
        setSession(session);
        
        if (session?.user) {
          setUser(session.user);
          fetchUserProfile(session.user.id).catch(console.error);
        } else {
          setUser(null);
          setUserProfile(null);
        }
      }
    );

    return () => {
      isMounted = false;
      clearTimeout(fallbackTimeout);
      subscription?.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Error fetching profile:", error);
        return;
      }

      if (data) {
        setUserProfile({
          uid: data.id,
          email: data.email,
          displayName: data.display_name,
          photoURL: data.photo_url,
          role: data.role,
        });
      } else {
        // Create profile if it doesn't exist
        await createUserProfile(userId);
      }
    } catch (err) {
      console.error("Error in fetchUserProfile:", err);
    }
  };

  const createUserProfile = async (userId: string) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      const newProfile = {
        id: userId,
        email: userData.user.email,
        display_name: userData.user.user_metadata?.full_name || "User",
        photo_url: userData.user.user_metadata?.avatar_url || null,
        role: "customer",
      };

      const { error } = await supabase.from("profiles").insert(newProfile);

      if (!error) {
        setUserProfile({
          uid: newProfile.id,
          email: newProfile.email,
          displayName: newProfile.display_name,
          photoURL: newProfile.photo_url,
          role: newProfile.role,
        });
      } else {
        console.error("Error creating profile:", error);
      }
    } catch (err) {
      console.error("Error in createUserProfile:", err);
    }
  };

  const loginWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
      });
      if (error) throw error;
    } catch (error) {
      console.error("Google sign-in error:", error);
      throw error;
    }
  };

  const signUpWithEmail = async (email: string, password: string, displayName: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: displayName,
          },
        },
      });
      if (error) throw error;
      setIsAuthModalOpen(false);
    } catch (error) {
      console.error("Sign-up error:", error);
      throw error;
    }
  };

  const loginWithEmail = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      setIsAuthModalOpen(false);
    } catch (error) {
      console.error("Email login error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log("Starting logout...");
      
      // Clear state immediately so UI updates instantly
      setUser(null);
      setSession(null);
      setUserProfile(null);

      // Attempt to sign out from Supabase server
      // We don't await this so the page can reload immediately
      supabase.auth.signOut({ scope: 'local' }).catch(console.error);
      
      // Clear Supabase local storage just in case
      for (const key in localStorage) {
        if (key.startsWith('sb-')) {
          localStorage.removeItem(key);
        }
      }

      window.location.href = "/";
    } catch (error) {
      console.error("Logout catch error:", error);
      window.location.href = "/";
    }
  };

  const updateUserProfile = async (profile: Partial<UserProfile>) => {
    if (!user) throw new Error("No user logged in");

    try {
      const updateData: any = {};
      if (profile.displayName) updateData.display_name = profile.displayName;
      if (profile.photoURL) updateData.photo_url = profile.photoURL;
      if (profile.phone) updateData.phone = profile.phone;
      if (profile.role) updateData.role = profile.role;

      const { error } = await supabase
        .from("profiles")
        .update(updateData)
        .eq("id", user.id);
      
      if (error) throw error;

      setUserProfile((prev) => (prev ? { ...prev, ...profile } : null));
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    session,
    userProfile,
    isLoading,
    isInitialized,
    isAuthModalOpen,
    setIsAuthModalOpen,
    loginWithGoogle,
    signUpWithEmail,
    loginWithEmail,
    logout,
    updateUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
