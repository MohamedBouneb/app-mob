import { supabase } from "../lib/supabase";

export async function testSupabase() {
  const { data, error } = await supabase.from("age_groups").select("*");

  console.log("SUPABASE DATA :", data);
  console.log("SUPABASE ERROR :", error);
}
