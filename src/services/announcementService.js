import { supabase } from "../lib/supabase";

// ======================================
// Récupérer toutes les annonces (ADMIN)
// ======================================

export const getAnnouncements = async () => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw userError;
  if (!user) throw new Error("Utilisateur non connecté.");

  const { data, error } = await supabase
    .from("announcements")
    .select("*")
    .order("published_at", { ascending: false });

  if (error) throw error;

  return data || [];
};

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

  const { data: announcements, error } = await supabase
    .from("announcements")
    .select("*")
    .eq("is_published", true)
    .or(`audience.eq.ALL,audience.eq.${audience}`)
    .order("published_at", { ascending: false });

  if (error) throw error;

  if (!announcements?.length) return [];

  const { data: reads, error: readsError } = await supabase
    .from("announcement_reads")
    .select("announcement_id")
    .eq("user_id", user.id);

  if (readsError) throw readsError;

  const readIds = new Set((reads || []).map((item) => item.announcement_id));

  return announcements.map((item) => ({
    ...item,
    isRead: readIds.has(item.id),
  }));
};

// ======================================
// Créer et publier une annonce (ADMIN)
// ======================================

export const createAnnouncement = async ({
  title,
  message,
  audience,
  category,
  isImportant,
}) => {
  try {
    // Récupérer l'utilisateur connecté
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error("Utilisateur non authentifié.");
    }

    // Créer l'annonce
    const { data, error } = await supabase
      .from("announcements")
      .insert([
        {
          title: title.trim(),
          message: message.trim(),
          audience,
          category,
          is_important: isImportant,
          is_published: true,
          published_at: new Date().toISOString(),
          created_by: user.id, // IMPORTANT : obligatoire selon ta policy
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error("Erreur création annonce :", error);
    return { data: null, error };
  }
};

// ======================================
// Supprimer une annonce (ADMIN)
// ======================================

export const deleteAnnouncement = async (announcementId) => {
  if (!announcementId) {
    throw new Error("Identifiant de l'annonce invalide.");
  }

  const { error } = await supabase
    .from("announcements")
    .delete()
    .eq("id", announcementId);

  if (error) throw error;

  return true;
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

  const { error } = await supabase.from("announcement_reads").upsert(
    {
      announcement_id: announcementId,
      user_id: user.id,
    },
    {
      onConflict: "announcement_id,user_id",
      ignoreDuplicates: true,
    },
  );

  if (error) throw error;

  return true;
};
