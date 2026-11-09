import { supabase } from "../lib/supabase";

// ======================================
// Récupérer toutes les annonces
// ======================================

export const getAnnouncements = async () => {
  const { data, error } = await supabase
    .from("announcements")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data || [];
};

// ======================================
// Créer et publier une annonce
// ======================================

export const createAnnouncement = async ({
  title,
  message,
  category,
  audience,
  isImportant,
}) => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw userError;

  if (!user) {
    throw new Error("Utilisateur non connecté.");
  }

  const { data, error } = await supabase
    .from("announcements")
    .insert({
      title: title.trim(),
      message: message.trim(),
      category,
      audience,
      is_important: isImportant,
      is_published: true,
      created_by: user.id,
      published_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;

  return data;
};

// ======================================
// Modifier une annonce
// ======================================

export const updateAnnouncement = async (id, updates) => {
  const { data, error } = await supabase
    .from("announcements")
    .update({
      title: updates.title.trim(),
      message: updates.message.trim(),
      category: updates.category,
      audience: updates.audience,
      is_important: updates.isImportant,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data;
};

// ======================================
// Supprimer une annonce
// ======================================

export const deleteAnnouncement = async (id) => {
  const { error } = await supabase.from("announcements").delete().eq("id", id);

  if (error) throw error;

  return true;
};
