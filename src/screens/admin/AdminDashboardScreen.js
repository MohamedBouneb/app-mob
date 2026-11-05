import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase";
import { confirmAction, notify } from "../../utils/dialogs";

const COLORS = {
  primary: "#F52F46",
  background: "#FFF8F6",
  text: "#292524",
  muted: "#78716C",
  white: "#FFFFFF",
  border: "#F1E5E2",
  danger: "#DC2626",
};

const MENU = [
  {
    title: "إدارة المنشّطات",
    description: "مراجعة طلبات التسجيل وقبول المنشّطات",
    icon: "people-outline",
    screen: "TeacherManagement",
  },
  {
    title: "إدارة الدروس",
    description: "إضافة الدروس وتعديلها وتنظيمها",
    icon: "book-outline",
    screen: "CourseManagement",
  },
  {
    title: "الإحصائيات والتقارير",
    description: "متابعة نشاط التطبيق",
    icon: "stats-chart-outline",
    screen: "Statistics",
  },
];

export default function AdminDashboardScreen({ navigation }) {
  const { logout } = useAuth();

  const [pendingCount, setPendingCount] = useState(0);
  const [latestRequests, setLatestRequests] = useState([]);

  // Demandes d'animatrices en attente
  const loadPending = useCallback(async () => {
    try {
      const { data, count, error } = await supabase
        .from("teacher_profiles")
        .select("user_id", { count: "exact" })
        .eq("status", "PENDING")
        .order("created_at", { ascending: false })
        .limit(3);

      if (error) throw error;

      setPendingCount(count ?? 0);

      if (!data?.length) {
        setLatestRequests([]);
        return;
      }

      const { data: users, error: usersError } = await supabase
        .from("users")
        .select("id, first_name, last_name")
        .in(
          "id",
          data.map((row) => row.user_id),
        );

      if (usersError) throw usersError;

      const userById = Object.fromEntries(
        (users || []).map((user) => [user.id, user]),
      );

      setLatestRequests(
        data.map((row) => {
          const user = userById[row.user_id];
          const name = user
            ? `${user.first_name || ""} ${user.last_name || ""}`.trim()
            : "";

          return { id: row.user_id, name: name || "منشّطة جديدة" };
        }),
      );
    } catch (error) {
      console.error("Erreur chargement demandes :", error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadPending();
    }, [loadPending]),
  );

  const handleLogout = async () => {
    const confirmed = await confirmAction({
      title: "تسجيل الخروج",
      message: "هل أنت متأكد أنك تريد تسجيل الخروج؟",
      confirmText: "تسجيل الخروج",
      destructive: true,
    });

    if (!confirmed) return;

    try {
      await logout();
    } catch (error) {
      console.error("Erreur logout :", error.message);
      notify("خطأ", "تعذر تسجيل الخروج");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* En-tête */}
        <View style={styles.header}>
          <View style={styles.headerTitle}>
            <Text style={styles.headerText}>لوحة الإدارة</Text>
            <Text style={styles.headerSubtitle}>روضة الياسمين بمساكن</Text>
          </View>

          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <Ionicons name="log-out-outline" size={21} color={COLORS.danger} />
            <Text style={styles.logoutText}>تسجيل الخروج</Text>
          </TouchableOpacity>
        </View>

        {/* Welcome */}
        <View style={styles.welcome}>
          <View style={styles.avatar}>
            <Ionicons name="shield-checkmark" size={32} color="#FFFFFF" />
          </View>

          <Text style={styles.welcomeTitle}>مرحباً بك، مدير الروضة 👋</Text>

          <Text style={styles.welcomeText}>
            يمكنك إدارة الدروس ومتابعة طلبات التسجيل من هنا.
          </Text>
        </View>

        {/* Demandes d'inscription */}
        <TouchableOpacity
          style={styles.requestsCard}
          activeOpacity={0.85}
          onPress={() => navigation.navigate("TeacherManagement")}
        >
          <View style={styles.requestsHeader}>
            <View
              style={[
                styles.requestsBadge,
                pendingCount === 0 && styles.requestsBadgeEmpty,
              ]}
            >
              <Text style={styles.requestsBadgeText}>{pendingCount}</Text>
            </View>

            <Text style={styles.requestsTitle}>طلبات تسجيل المنشّطات</Text>
          </View>

          {pendingCount === 0 ? (
            <Text style={styles.requestsEmpty}>
              لا توجد طلبات جديدة حالياً.
            </Text>
          ) : (
            <>
              {latestRequests.map((request) => (
                <View key={request.id} style={styles.requestRow}>
                  <Ionicons name="time-outline" size={16} color="#92400E" />
                  <Text style={styles.requestName}>{request.name}</Text>
                </View>
              ))}

              {pendingCount > latestRequests.length ? (
                <Text style={styles.requestsMore}>
                  و{pendingCount - latestRequests.length} طلبات أخرى
                </Text>
              ) : null}
            </>
          )}

          <Text style={styles.requestsLink}>عرض الطلبات ومراجعتها</Text>
        </TouchableOpacity>

        {/* Menu */}
        <Text style={styles.sectionTitle}>إدارة التطبيق</Text>

        {MENU.map((item) => {
          const badge = item.screen === "TeacherManagement" ? pendingCount : 0;

          return (
            <TouchableOpacity
              key={item.screen}
              style={styles.card}
              activeOpacity={0.8}
              onPress={() => navigation.navigate(item.screen)}
            >
              <View style={styles.iconBox}>
                <Ionicons name={item.icon} size={27} color={COLORS.primary} />

                {badge > 0 ? (
                  <View style={styles.menuBadge}>
                    <Text style={styles.menuBadgeText}>{badge}</Text>
                  </View>
                ) : null}
              </View>

              <View style={styles.cardText}>
                <Text style={styles.cardTitle}>{item.title}</Text>

                <Text style={styles.cardDescription}>{item.description}</Text>
              </View>

              <Ionicons name="chevron-back" size={22} color={COLORS.muted} />
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  content: {
    padding: 20,
    paddingBottom: 35,
  },

  header: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 22,
  },

  headerTitle: {
    alignItems: "flex-end",
  },

  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.text,
  },

  headerSubtitle: {
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 4,
  },

  logoutButton: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: "#FEECEC",
    borderWidth: 1,
    borderColor: "#FECACA",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },

  logoutText: {
    color: COLORS.danger,
    fontSize: 13,
    fontWeight: "bold",
  },

  welcome: {
    backgroundColor: COLORS.primary,
    borderRadius: 22,
    padding: 22,
    alignItems: "flex-end",
    marginBottom: 22,
  },

  avatar: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },

  welcomeTitle: {
    color: COLORS.white,
    fontSize: 21,
    fontWeight: "bold",
    textAlign: "right",
    marginBottom: 8,
  },

  welcomeText: {
    color: COLORS.white,
    fontSize: 14,
    lineHeight: 23,
    textAlign: "right",
  },

  // Demandes d'inscription
  requestsCard: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 16,
    marginBottom: 26,
    borderWidth: 1,
    borderColor: "#FDE68A",
  },

  requestsHeader: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  requestsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.text,
    textAlign: "right",
  },

  requestsBadge: {
    minWidth: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },

  requestsBadgeEmpty: {
    backgroundColor: "#D6D3D1",
  },

  requestsBadgeText: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: 14,
  },

  requestsEmpty: {
    color: COLORS.muted,
    fontSize: 13,
    textAlign: "right",
    marginBottom: 10,
  },

  requestRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FEF3C7",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    marginBottom: 8,
  },

  requestName: {
    flex: 1,
    color: "#92400E",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "right",
  },

  requestsMore: {
    color: COLORS.muted,
    fontSize: 12,
    textAlign: "right",
    marginBottom: 8,
  },

  requestsLink: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: "bold",
    textAlign: "right",
    marginTop: 4,
  },

  sectionTitle: {
    color: COLORS.text,
    fontSize: 19,
    fontWeight: "bold",
    textAlign: "right",
    marginBottom: 14,
  },

  card: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 16,
    marginBottom: 13,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 15,
    backgroundColor: "#FFF0F1",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 13,
  },

  menuBadge: {
    position: "absolute",
    top: -6,
    right: -6,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
    borderWidth: 2,
    borderColor: COLORS.white,
  },

  menuBadgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: "bold",
  },

  cardText: {
    flex: 1,
    alignItems: "flex-end",
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.text,
    textAlign: "right",
    marginBottom: 5,
  },

  cardDescription: {
    fontSize: 12,
    color: COLORS.muted,
    textAlign: "right",
    lineHeight: 19,
  },
});
