import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error("Erreur récupération session :", error.message);
        }

        if (mounted) {
          setUser(data?.session?.user ?? null);
        }
      } catch (error) {
        console.error("Erreur initialisation Auth :", error.message);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    // Vérifier les données avant d'appeler Supabase
    if (typeof email !== "string" || typeof password !== "string") {
      return {
        data: null,
        error: new Error("L'e-mail ou le mot de passe est invalide."),
      };
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      return {
        data: null,
        error: new Error("Veuillez saisir votre e-mail et votre mot de passe."),
      };
    }

    try {
      console.log("🔐 Tentative de connexion Supabase...");

      const { data, error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });

      if (error) {
        console.error("❌ Erreur de connexion :", error.message);
        return { data: null, error };
      }

      console.log("✅ Connexion réussie :", data.user?.id);

      setUser(data.user);

      return { data, error: null };
    } catch (error) {
      console.error("❌ Erreur inattendue :", error.message);
      return { data: null, error };
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Erreur déconnexion :", error.message);
      throw error;
    }

    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
