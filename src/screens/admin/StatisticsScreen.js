import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";

import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { supabase } from "../../lib/supabase";
import { notify } from "../../utils/dialogs";

export default function StatisticsScreen({ navigation }) {
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
          name: "Animatrices approuvées",
          request: supabase
            .from("teacher_profiles")
            .select("id", { count: "exact", head: true })
            .eq("status", "APPROVED"),
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

      const results = await Promise.all(
        queries.map(async (query) => ({
          name: query.name,
          result: await query.request,
        })),
      );

      const failed = results.find(({ result }) => result.error);

      if (failed) {
        console.error(`Erreur ${failed.name}:`, {
          message: failed.result.error.message,
          code: failed.result.error.code,
          details: failed.result.error.details,
          hint: failed.result.error.hint,
        });

        throw failed.result.error;
      }

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

      notify("خطأ", "تعذر تحميل الإحصائيات. يرجى المحاولة مرة أخرى.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Recharger à chaque ouverture de l'écran
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

  // Cartes statistiques (screen = écran ouvert au clic, absent = non cliquable)
  const items = [
    {
      label: "أولياء الأمور",
      value: stats.parents,
      icon: "people-outline",
      color: "#2563EB",
      background: "#EFF6FF",
      screen: "ParentManagement",
    },
    {
      label: "المنشّطات المعتمدات",
      value: stats.teachers,
      icon: "school-outline",
      color: "#7C3AED",
      background: "#F5F3FF",
      screen: "TeacherManagement",
      params: { initialFilter: "APPROVED" },
    },
    {
      label: "طلبات قيد المراجعة",
      value: stats.pending,
      icon: "time-outline",
      color: "#D97706",
      background: "#FFFBEB",
      screen: "TeacherManagement",
      params: { initialFilter: "PENDING" },
    },
    {
      label: "الدروس",
      value: stats.courses,
      icon: "book-outline",
      color: "#15803D",
      background: "#F0FDF4",
      screen: "CourseManagement",
    },
    {
      label: "الأطفال المسجلون",
      value: stats.children,
      icon: "happy-outline",
      color: "#DB2777",
      background: "#FDF2F8",
      screen: "ParentManagement",
      params: { expandAll: true },
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

      <Text style={styles.subtitle}>اضغط على أي بطاقة لعرض التفاصيل</Text>

      <View style={styles.grid}>
        {items.map((item) => {
          const clickable = !!item.screen;

          return (
            <TouchableOpacity
              key={item.label}
              style={styles.card}
              activeOpacity={clickable ? 0.8 : 1}
              disabled={!clickable}
              onPress={() => navigation.navigate(item.screen, item.params)}
            >
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

              {clickable ? (
                <View style={styles.detailsRow}>
                  <Text style={[styles.detailsText, { color: item.color }]}>
                    عرض التفاصيل
                  </Text>

                  <Ionicons name="chevron-back" size={14} color={item.color} />
                </View>
              ) : null}
            </TouchableOpacity>
          );
        })}
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

  detailsRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 2,
    marginTop: 10,
  },

  detailsText: {
    fontSize: 11,
    fontWeight: "bold",
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
