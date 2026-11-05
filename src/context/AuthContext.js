import { createContext, useContext, useEffect, useState } from "react";

import { supabase } from "../lib/supabase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authUser, setAuthUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accountNotice, setAccountNotice] = useState(null); // "PENDING" | "REJECTED" | null

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
        setAccountNotice(null);
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        // 1. Récupérer le profil utilisateur
        const { data: profile, error } = await supabase
          .from("users")
          .select("id, first_name, last_name, email, role, status")
          .eq("id", authUser.id)
          .single();

        if (error) throw error;

        if (!profile) {
          throw new Error("Profil utilisateur introuvable.");
        }

        // 2. Vérifier le statut du compte
        const accountStatus = String(profile.status || "").toUpperCase();

        // 3. Vérifier si le compte est en attente ou rejeté
        if (accountStatus === "PENDING" || accountStatus === "REJECTED") {
          if (active) {
            setAccountNotice(accountStatus);

            setUser({
              ...authUser,
              ...profile,
            });
          }

          return; // Ne pas déconnecter l'utilisateur
        }

        // 4. Vérifier les comptes désactivés
        const BLOCKED_STATUSES = ["BLOCKED", "SUSPENDED", "INACTIVE"];

        if (BLOCKED_STATUSES.includes(accountStatus)) {
          throw new Error("Compte désactivé.");
        }

        // 5. Utilisateur autorisé
        const authenticatedUser = {
          ...authUser,
          ...profile,
        };

        if (active) {
          setUser(authenticatedUser);
          setAccountNotice(null);

          console.log("Utilisateur chargé :", authenticatedUser.id);
          console.log("Rôle :", authenticatedUser.role);
          console.log("Statut :", accountStatus);
        }
      } catch (error) {
        console.error("Erreur récupération profil :", error.message);

        if (active) {
          setUser(null);
          setAccountNotice(null);
        }

        await supabase.auth.signOut();
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
  // Pas de setLoading global ici : LoginScreen gère son propre "loading".
  // Le loading global est géré par l'effet de chargement du profil.
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
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        // TEMPORAIRE : à retirer une fois le test terminé
        console.log(
          "Supabase login error:",
          error.status,
          error.code,
          error.message,
        );

        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      console.error("Erreur connexion :", error.message);

      return { data: null, error };
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
  const clearAccountNotice = () => setAccountNotice(null);
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        accountNotice,
        clearAccountNotice,
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
