
import { supabase } from "../lib/supabase";

// ======================================
// Récupérer les annonces selon le rôle
// ======================================

export const getAnnouncementsForUser = async (audience) => {
  if (!["PARENT", "TEACHER"].includes(audience)) {
    throw new Error("Rôle utilisateur invalide.");
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw userError;
  if (!user) throw new Error("Utilisateur non connecté.");

  // Récupérer uniquement les annonces publiées
  // destinées à cet utilisateur ou à tout le monde.

  const { data: announcements, error } = await supabase
    .from("announcements")
    .select("*")
    .eq("is_published", true)
    .or(`audience.eq.ALL,audience.eq.${audience}`)
    .order("published_at", { ascending: false });

  if (error) throw error;

  if (!announcements?.length) {
    return [];
  }

  // Récupérer les annonces déjà consultées
  const { data: reads, error: readsError } = await supabase
    .from("announcement_reads")
    .select("announcement_id")
    .eq("user_id", user.id);

  if (readsError) throw readsError;

  const readIds = new Set(
    (reads || []).map((item) => item.announcement_id)
  );

  return announcements.map((item) => ({
    ...item,
    isRead: readIds.has(item.id),
  }));
};

// ======================================
// Marquer une annonce comme consultée
// ======================================

export const markAnnouncementAsRead = async (announcementId) => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw userError;
  if (!user) throw new Error("Utilisateur non connecté.");

  const { error } = await supabase
    .from("announcement_reads")
    .upsert(
      {
        announcement_id: announcementId,
        user_id: user.id,
      },
      {
        onConflict: "announcement_id,user_id",
        ignoreDuplicates: true,
      }
    );

  if (error) throw error;

  return true;
};
