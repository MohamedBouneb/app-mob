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

export default function StatisticsScreen() {
  const [stats, setStats] = useState({
    parents: 0,
    teachers: 0,
    pending: 0,
    courses: 0,
  });
  const [loading, setLoading] = useState(true);

  const loadStats = useCallback(async () => {
    try {
      const [parentsResult, teachersResult, pendingResult, coursesResult] =
        await Promise.all([
          supabase
            .from("users")
            .select("id", { count: "exact", head: true })
            .eq("role", "PARENT"),

          supabase
            .from("teacher_profiles")
            .select("user_id", { count: "exact", head: true }),

          supabase
            .from("teacher_profiles")
            .select("user_id", { count: "exact", head: true })
            .eq("status", "PENDING"),

          supabase.from("courses").select("id", { count: "exact", head: true }),
        ]);

      const results = [
        parentsResult,
        teachersResult,
        pendingResult,
        coursesResult,
      ];

      const failed = results.find((result) => result.error);
      if (failed) throw failed.error;

      setStats({
        parents: parentsResult.count ?? 0,
        teachers: teachersResult.count ?? 0,
        pending: pendingResult.count ?? 0,
        courses: coursesResult.count ?? 0,
      });
    } catch (error) {
      console.error("Erreur chargement statistiques :", error);
      Alert.alert("Erreur", "Impossible de charger les statistiques.");
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadStats();
    }, [loadStats]),
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#F52F46" />
        <Text style={styles.muted}>جارٍ تحميل الإحصائيات...</Text>
      </View>
    );
  }

  const items = [
    {
      label: "أولياء الأمور",
      value: stats.parents,
      icon: "people-outline",
      color: "#2563EB",
    },
    {
      label: "ملفات المنشّطات",
      value: stats.teachers,
      icon: "school-outline",
      color: "#7C3AED",
    },
    {
      label: "طلبات قيد المراجعة",
      value: stats.pending,
      icon: "time-outline",
      color: "#D97706",
    },
    {
      label: "الدروس",
      value: stats.courses,
      icon: "book-outline",
      color: "#15803D",
    },
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={false} onRefresh={loadStats} />
      }
    >
      <Text style={styles.heading}>ملخص نشاط الروضة</Text>
      <Text style={styles.subtitle}>
        الأرقام الحالية المسجلة في قاعدة البيانات
      </Text>

      <View style={styles.grid}>
        {items.map((item) => (
          <View style={styles.card} key={item.label}>
            <Ionicons name={item.icon} size={30} color={item.color} />
            <Text style={styles.value}>{item.value}</Text>
            <Text style={styles.label}>{item.label}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF8F6" },
  content: { padding: 18 },
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
  },
  grid: { flexDirection: "row-reverse", flexWrap: "wrap", gap: 12 },
  card: {
    width: "48%",
    flexGrow: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#F1E5E2",
    padding: 18,
    alignItems: "flex-end",
    minHeight: 145,
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
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  muted: { marginTop: 12, color: "#78716C" },
});
