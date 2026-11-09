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
    title: "إدارة المنشط",
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
    title: "إدارة الإعلانات والرسائل",
    description: "إرسال الأخبار والإعلانات للأولياء والمنشّطات",
    icon: "megaphone-outline",
    screen: "AdminAnnouncements",
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

  // ====================================
  // Demandes d'animatrices en attente
  // ====================================

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

          return {
            id: row.user_id,
            name: name || "منشّطة جديدة",
          };
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

  // ====================================
  // Déconnexion
  // ====================================

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

  // ====================================
  // Navigation vers une rubrique
  // ====================================

  const handleNavigation = (screen) => {
    navigation.navigate(screen);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
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

          <Text style={styles.welcomeTitle}>مرحباً بك، مدير الروضة</Text>

          <Text style={styles.welcomeText}>
            يمكنك إدارة الدروس ومتابعة طلبات التسجيل من هنا.
          </Text>
        </View>

        {/* Demandes d'inscription */}

        <TouchableOpacity
          style={styles.requestsCard}
          activeOpacity={0.85}
          onPress={() => handleNavigation("TeacherManagement")}
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
              onPress={() => handleNavigation(item.screen)}
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

// ======================================
// Styles
// ======================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  content: {
    padding: 16,
    paddingBottom: 30,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  headerTitle: {
    flex: 1,
  },

  headerText: {
    fontSize: 23,
    fontWeight: "800",
    color: COLORS.text,
    textAlign: "right",
  },

  headerSubtitle: {
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 4,
    textAlign: "right",
  },

  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEE2E2",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 5,
  },

  logoutText: {
    fontSize: 12,
    color: COLORS.danger,
    fontWeight: "700",
  },

  welcome: {
    backgroundColor: COLORS.primary,
    borderRadius: 18,
    padding: 20,
    alignItems: "center",
    marginBottom: 20,
  },

  avatar: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },

  welcomeTitle: {
    fontSize: 18,
    color: COLORS.white,
    fontWeight: "800",
    textAlign: "center",
  },

  welcomeText: {
    fontSize: 12,
    color: COLORS.white,
    opacity: 0.9,
    marginTop: 7,
    textAlign: "center",
  },

  requestsCard: {
    backgroundColor: "#FFFBEB",
    borderWidth: 1,
    borderColor: "#FDE68A",
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },

  requestsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  requestsBadge: {
    minWidth: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#F59E0B",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 7,
  },

  requestsBadgeEmpty: {
    backgroundColor: "#D1D5DB",
  },

  requestsBadgeText: {
    color: COLORS.white,
    fontWeight: "800",
  },

  requestsTitle: {
    fontSize: 15,
    color: "#92400E",
    fontWeight: "800",
  },

  requestsEmpty: {
    color: COLORS.muted,
    fontSize: 12,
    textAlign: "right",
  },

  requestRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 8,
    paddingVertical: 5,
  },

  requestName: {
    color: COLORS.text,
    fontSize: 13,
  },

  requestsMore: {
    textAlign: "right",
    color: "#92400E",
    fontSize: 12,
    marginTop: 5,
  },

  requestsLink: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: "800",
    textAlign: "right",
    marginTop: 12,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: COLORS.text,
    textAlign: "right",
    marginBottom: 13,
  },

  card: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 12,
  },

  iconBox: {
    width: 50,
    height: 50,
    backgroundColor: "#FFF0F1",
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  menuBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: COLORS.danger,
    minWidth: 19,
    height: 19,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  menuBadgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: "800",
  },

  cardText: {
    flex: 1,
  },

  cardTitle: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "800",
    textAlign: "right",
  },

  cardDescription: {
    color: COLORS.muted,
    fontSize: 11,
    marginTop: 5,
    textAlign: "right",
  },
});
