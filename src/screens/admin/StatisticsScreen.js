import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";

import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { supabase } from "../../lib/supabase";
async function testCourses() {
  try {
    const { data, error, count, status } = await supabase
      .from("courses")
      .select("id", { count: "exact" });

    console.log("========== TEST COURSES ==========");
    console.log("Data :", data);
    console.log("Count :", count);
    console.log("Status :", status);
    console.log("Error :", error);

    if (error) {
      console.log("Message :", error.message);
      console.log("Code :", error.code);
      console.log("Details :", error.details);
      console.log("Hint :", error.hint);
    }

    console.log("==================================");
  } catch (err) {
    console.log("EXCEPTION COURSES :", err);
    console.log("Exception message :", String(err));
    console.log("Stack :", err?.stack);
  }
}

async function testAdminRole() {
  const { data: sessionData } = await supabase.auth.getSession();

  console.log("Utilisateur connecté :", sessionData.session?.user?.id);

  const { data, error } = await supabase.rpc("get_my_role");

  console.log("Rôle Supabase :", data);
  console.log("Erreur rôle :", error);
}

export default function StatisticsScreen() {
  const [stats, setStats] = useState({
    parents: 0,
    teachers: 0,
    pending: 0,
    courses: 0,
    children: 0,
    exercises: 0,
  });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Charger les statistiques depuis Supabase
  const loadStats = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      }

      const queries = [
        {
          name: "Parents",
          request: supabase
            .from("parents")
            .select("id", { count: "exact", head: true }),
        },
        {
          name: "Enseignantes",
          request: supabase
            .from("teachers")
            .select("id", { count: "exact", head: true }),
        },
        {
          name: "Demandes en attente",
          request: supabase
            .from("teacher_profiles")
            .select("id", { count: "exact", head: true })
            .eq("status", "PENDING"),
        },
        {
          name: "Cours",
          request: supabase
            .from("courses")
            .select("id", { count: "exact", head: true }),
        },
        {
          name: "Enfants",
          request: supabase
            .from("children")
            .select("id", { count: "exact", head: true }),
        },
        {
          name: "Exercices",
          request: supabase
            .from("exercises")
            .select("id", { count: "exact", head: true }),
        },
      ];

      // Exécuter les requêtes
      const results = await Promise.all(
        queries.map(async (query) => ({
          name: query.name,
          result: await query.request,
        })),
      );

      // Vérifier les erreurs
      results.forEach(({ name, result }) => {
        if (result.error) {
          console.error(`Erreur ${name}:`, {
            message: result.error.message,
            code: result.error.code,
            details: result.error.details,
            hint: result.error.hint,
          });
        } else {
          console.log(`${name}: ${result.count}`);
        }
      });

      const failed = results.find(({ result }) => result.error);

      if (failed) {
        throw failed.result.error;
      }

      // Mettre à jour les statistiques
      setStats({
        parents: results[0].result.count ?? 0,
        teachers: results[1].result.count ?? 0,
        pending: results[2].result.count ?? 0,
        courses: results[3].result.count ?? 0,
        children: results[4].result.count ?? 0,
        exercises: results[5].result.count ?? 0,
      });
    } catch (error) {
      console.error("Erreur statistiques :", error);

      Alert.alert("خطأ", "تعذر تحميل الإحصائيات. يرجى المحاولة مرة أخرى.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Recharger à chaque ouverture de l'écran
  useFocusEffect(
    useCallback(() => {
      testCourses();
      loadStats();
    }, [loadStats]),
  );

  // Chargement
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#F52F46" />
        <Text style={styles.muted}>جارٍ تحميل الإحصائيات...</Text>
      </View>
    );
  }

  // Cartes statistiques
  const items = [
    {
      label: "أولياء الأمور",
      value: stats.parents,
      icon: "people-outline",
      color: "#2563EB",
      background: "#EFF6FF",
    },
    {
      label: "ملفات المنشّطات",
      value: stats.teachers,
      icon: "school-outline",
      color: "#7C3AED",
      background: "#F5F3FF",
    },
    {
      label: "طلبات قيد المراجعة",
      value: stats.pending,
      icon: "time-outline",
      color: "#D97706",
      background: "#FFFBEB",
    },
    {
      label: "الدروس",
      value: stats.courses,
      icon: "book-outline",
      color: "#15803D",
      background: "#F0FDF4",
    },
    {
      label: "الأطفال المسجلون",
      value: stats.children,
      icon: "happy-outline",
      color: "#DB2777",
      background: "#FDF2F8",
    },
    {
      label: "التمارين",
      value: stats.exercises,
      icon: "extension-puzzle-outline",
      color: "#0891B2",
      background: "#ECFEFF",
    },
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => loadStats(true)}
          colors={["#F52F46"]}
        />
      }
    >
      <Text style={styles.heading}>ملخص نشاط الروضة</Text>

      <Text style={styles.subtitle}>
        الأرقام الحالية المسجلة في قاعدة البيانات
      </Text>

      <View style={styles.grid}>
        {items.map((item) => (
          <View style={styles.card} key={item.label}>
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: item.background },
              ]}
            >
              <Ionicons name={item.icon} size={27} color={item.color} />
            </View>

            <Text style={styles.value}>{item.value}</Text>

            <Text style={styles.label}>{item.label}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.footer}>
        آخر تحديث عند فتح الصفحة أو السحب للأسفل
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8F6",
  },

  content: {
    padding: 18,
    paddingBottom: 35,
  },

  heading: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "right",
    color: "#292524",
  },

  subtitle: {
    textAlign: "right",
    color: "#78716C",
    marginTop: 8,
    marginBottom: 22,
    fontSize: 13,
  },

  grid: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    gap: 12,
  },

  card: {
    width: "47%",
    flexGrow: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#F1E5E2",
    padding: 17,
    alignItems: "flex-end",
    minHeight: 155,
  },

  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },

  value: {
    fontSize: 29,
    fontWeight: "bold",
    color: "#292524",
    marginTop: 12,
  },

  label: {
    fontSize: 13,
    color: "#78716C",
    marginTop: 6,
    textAlign: "right",
  },

  footer: {
    textAlign: "center",
    color: "#A8A29E",
    fontSize: 11,
    marginTop: 25,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF8F6",
  },

  muted: {
    marginTop: 12,
    color: "#78716C",
  },
});
