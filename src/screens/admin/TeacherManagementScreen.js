import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { supabase } from "../../lib/supabase";
import { confirmAction, notify } from "../../utils/dialogs";

const COLORS = {
  primary: "#F52F46",
  background: "#FFF8F6",
  text: "#292524",
  muted: "#78716C",
  white: "#FFFFFF",
  border: "#F1E5E2",
  green: "#15803D",
  red: "#B91C1C",
};

const FILTERS = [
  { key: "PENDING", label: "قيد المراجعة" },
  { key: "APPROVED", label: "مقبول" },
  { key: "REJECTED", label: "مرفوض" },
];

const STATUS_LABELS = {
  PENDING: "قيد المراجعة",
  APPROVED: "مقبول",
  REJECTED: "مرفوض",
};

export default function TeacherManagementScreen() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [filter, setFilter] = useState("PENDING");

  const loadTeachers = useCallback(async () => {
    try {
      const { data: profiles, error } = await supabase
        .from("teacher_profiles")
        .select(
          "user_id, address, birth_date, diploma, experience_years, status, created_at",
        )
        .order("created_at", { ascending: false });

      if (error) throw error;

      if (!profiles?.length) {
        setTeachers([]);
        return;
      }

      const userIds = profiles.map((profile) => profile.user_id);

      const { data: users, error: usersError } = await supabase
        .from("users")
        .select("id, first_name, last_name, email, phone")
        .in("id", userIds);

      if (usersError) throw usersError;

      const userById = Object.fromEntries(
        (users || []).map((user) => [user.id, user]),
      );

      setTeachers(
        profiles.map((profile) => ({
          ...profile,
          user: userById[profile.user_id] || null,
        })),
      );
    } catch (error) {
      console.error("Erreur chargement animatrices :", error);
      notify("خطأ", "تعذر تحميل الطلبات. تحقق من الاتصال ومن صلاحيات الوصول.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadTeachers();
    }, [loadTeachers]),
  );

  const counts = useMemo(() => {
    const result = { PENDING: 0, APPROVED: 0, REJECTED: 0 };

    teachers.forEach((teacher) => {
      const status = teacher.status || "PENDING";
      if (result[status] !== undefined) result[status] += 1;
    });

    return result;
  }, [teachers]);

  const visibleTeachers = useMemo(
    () =>
      teachers.filter((teacher) => (teacher.status || "PENDING") === filter),
    [teachers, filter],
  );

  const changeStatus = async (teacher, newStatus) => {
    const isApproved = newStatus === "APPROVED";

    const confirmed = await confirmAction({
      title: isApproved ? "قبول الطلب" : "رفض الطلب",
      message: isApproved
        ? "هل تريد قبول طلب هذه المنشّطة؟ سيتم تفعيل حسابها."
        : "هل تريد رفض طلب هذه المنشّطة؟",
      confirmText: isApproved ? "قبول" : "رفض",
      destructive: !isApproved,
    });

    if (!confirmed) return;

    setUpdatingId(teacher.user_id);

    try {
      // Met à jour teacher_profiles.status ET users.status (réservé aux admins)
      const { error } = await supabase.rpc("review_teacher", {
        p_user_id: teacher.user_id,
        p_status: newStatus,
      });

      if (error) throw error;

      setTeachers((current) =>
        current.map((item) =>
          item.user_id === teacher.user_id
            ? { ...item, status: newStatus }
            : item,
        ),
      );

      notify(
        "تم",
        isApproved ? "تم قبول طلب المنشّطة." : "تم رفض طلب المنشّطة.",
      );
    } catch (error) {
      console.error("Erreur changement statut :", error);
      notify("خطأ", "تعذر تعديل حالة الطلب. تأكد من أنك مسجل الدخول كمسؤول.");
    } finally {
      setUpdatingId(null);
    }
  };

  const renderTeacher = ({ item }) => {
    const name = item.user
      ? `${item.user.first_name || ""} ${item.user.last_name || ""}`.trim()
      : "";

    const status = item.status || "PENDING";
    const pending = status === "PENDING";
    const busy = updatingId === item.user_id;

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={25} color={COLORS.primary} />
          </View>

          <View style={styles.identity}>
            <Text style={styles.name}>{name || "منشّطة بدون اسم"}</Text>
            <Text style={styles.email}>
              {item.user?.email || "البريد الإلكتروني غير متوفر"}
            </Text>
            <Text style={styles.phone}>
              {item.user?.phone || "رقم الهاتف غير متوفر"}
            </Text>
          </View>
        </View>

        <View style={styles.separator} />

        <Info label="العنوان" value={item.address} />
        <Info label="الشهادة" value={item.diploma} />
        <Info label="سنوات الخبرة" value={`${item.experience_years ?? 0}`} />
        <Info label="تاريخ الميلاد" value={item.birth_date} />

        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>حالة الطلب</Text>
          <Text
            style={[
              styles.status,
              status === "APPROVED" && styles.approved,
              status === "REJECTED" && styles.rejected,
              pending && styles.pending,
            ]}
          >
            {STATUS_LABELS[status] || STATUS_LABELS.PENDING}
          </Text>
        </View>

        {pending && (
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.actionButton, styles.rejectButton]}
              disabled={busy}
              onPress={() => changeStatus(item, "REJECTED")}
            >
              <Text style={styles.rejectText}>رفض</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.approveButton]}
              disabled={busy}
              onPress={() => changeStatus(item, "APPROVED")}
            >
              {busy ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.approveText}>قبول الطلب</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>جارٍ تحميل الطلبات...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Filtres */}
      <View style={styles.chipsRow}>
        {FILTERS.map((item) => {
          const active = filter === item.key;

          return (
            <TouchableOpacity
              key={item.key}
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => setFilter(item.key)}
              activeOpacity={0.8}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {item.label} ({counts[item.key]})
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <FlatList
        data={visibleTeachers}
        keyExtractor={(item) => item.user_id}
        renderItem={renderTeacher}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              loadTeachers();
            }}
            tintColor={COLORS.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="people-outline" size={50} color={COLORS.muted} />
            <Text style={styles.emptyTitle}>لا توجد طلبات في هذه الفئة</Text>
            <Text style={styles.emptyText}>
              ستظهر هنا ملفات المنشّطات عند إرسال طلباتها.
            </Text>
          </View>
        }
      />
    </View>
  );
}

function Info({ label, value }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoValue}>{String(value || "—")}</Text>
      <Text style={styles.infoLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },

  chipsRow: {
    flexDirection: "row-reverse",
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 14,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipText: { fontSize: 12, color: COLORS.muted, fontWeight: "600" },
  chipTextActive: { color: COLORS.white },

  list: { padding: 16, paddingBottom: 30, flexGrow: 1 },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 17,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardHeader: { flexDirection: "row-reverse", alignItems: "center" },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: "#FFF0F1",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },
  identity: { flex: 1, alignItems: "flex-end" },
  name: { fontSize: 17, fontWeight: "bold", color: COLORS.text },
  email: { fontSize: 13, color: COLORS.muted, marginTop: 4 },
  phone: { fontSize: 13, color: COLORS.muted, marginTop: 3 },
  separator: { height: 1, backgroundColor: COLORS.border, marginVertical: 15 },
  infoRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    marginBottom: 11,
    gap: 12,
  },
  infoLabel: { color: COLORS.muted, fontSize: 13 },
  infoValue: {
    flex: 1,
    textAlign: "left",
    color: COLORS.text,
    fontSize: 13,
  },
  statusRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 7,
  },
  statusLabel: { fontWeight: "600", color: COLORS.text },
  status: {
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 9,
    overflow: "hidden",
  },
  pending: { color: "#92400E", backgroundColor: "#FEF3C7" },
  approved: { color: COLORS.green, backgroundColor: "#DCFCE7" },
  rejected: { color: COLORS.red, backgroundColor: "#FEE2E2" },
  actions: { flexDirection: "row", gap: 10, marginTop: 17 },
  actionButton: {
    flex: 1,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
  },
  approveButton: { backgroundColor: COLORS.primary },
  rejectButton: { backgroundColor: "#FEE2E2" },
  approveText: { color: "#FFFFFF", fontWeight: "bold" },
  rejectText: { color: COLORS.red, fontWeight: "bold" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 12, color: COLORS.muted },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: "bold",
    marginTop: 15,
    color: COLORS.text,
  },
  emptyText: {
    color: COLORS.muted,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 22,
  },
});
