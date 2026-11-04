import { createContext, useContext, useEffect, useState } from "react";

import { supabase } from "../lib/supabase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authUser, setAuthUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Initialiser la session Supabase
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) throw error;

        if (mounted) {
          setAuthUser(data.session?.user ?? null);
        }
      } catch (error) {
        console.error("Erreur récupération session :", error.message);

        if (mounted) {
          setAuthUser(null);
          setLoading(false);
        }
      }
    };

    // Écouter les changements d'authentification
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setAuthUser(session?.user ?? null);
      }
    });

    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // 2. Récupérer le profil complet depuis public.users
  useEffect(() => {
    let active = true;

    const loadUserProfile = async () => {
      if (!authUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const { data: profile, error } = await supabase
          .from("users")
          .select("id, first_name, last_name, email, role, status")
          .eq("id", authUser.id)
          .single();

        if (error) throw error;

        if (!profile) {
          throw new Error("Profil utilisateur introuvable.");
        }

        const authenticatedUser = {
          ...authUser,
          ...profile,
        };

        if (active) {
          setUser(authenticatedUser);

          console.log("Utilisateur chargé :", authenticatedUser.id);
          console.log("Rôle :", authenticatedUser.role);
        }
      } catch (error) {
        console.error("Erreur récupération profil :", error.message);

        if (active) {
          setUser(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadUserProfile();

    return () => {
      active = false;
    };
  }, [authUser]);

  // 3. Connexion
  const login = async (email, password) => {
    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      return {
        data: null,
        error: new Error("Veuillez saisir votre e-mail et votre mot de passe."),
      };
    }

    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) throw error;

      return {
        data,
        error: null,
      };
    } catch (error) {
      console.error("Erreur connexion :", error.message);

      setLoading(false);

      return {
        data: null,
        error,
      };
    }
  };

  // 4. Déconnexion
  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) throw error;

      setUser(null);
      setAuthUser(null);

      console.log("Déconnexion réussie");
    } catch (error) {
      console.error("Erreur déconnexion :", error.message);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// 5. Hook personnalisé
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth doit être utilisé dans un AuthProvider.");
  }

  return context;
}
