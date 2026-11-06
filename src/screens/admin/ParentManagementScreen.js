import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useMemo, useRef, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Linking,
    RefreshControl,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import { supabase } from "../../lib/supabase";
import { notify } from "../../utils/dialogs";

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

const USER_STATUS = {
  ACTIVE: { label: "نشط", color: "#15803D", background: "#DCFCE7" },
  PENDING: { label: "قيد التفعيل", color: "#92400E", background: "#FEF3C7" },
  REJECTED: { label: "مرفوض", color: "#B91C1C", background: "#FEE2E2" },
  INACTIVE: { label: "معطّل", color: "#57534E", background: "#E7E5E4" },
};

const COURSE_STATUS = {
  ENROLLED: { label: "مسجّل", color: "#1D4ED8", background: "#DBEAFE" },
  ONGOING: { label: "جارٍ", color: "#92400E", background: "#FEF3C7" },
  COMPLETED: { label: "مكتمل", color: "#15803D", background: "#DCFCE7" },
};

// PostgREST peut renvoyer un objet ou un tableau selon la relation
const one = (value) =>
  Array.isArray(value) ? (value[0] ?? null) : (value ?? null);

const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");

  return `${day}/${month}/${date.getFullYear()}`;
};

const getAgeLabel = (birthDate) => {
  if (!birthDate) return "—";

  const birth = new Date(birthDate);

  if (Number.isNaN(birth.getTime())) return "—";

  const today = new Date();

  let years = today.getFullYear() - birth.getFullYear();
  let months = today.getMonth() - birth.getMonth();

  if (today.getDate() < birth.getDate()) months -= 1;

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  if (years < 1) return months <= 0 ? "أقل من شهر" : `${months} أشهر`;
  if (years === 1) return "سنة واحدة";
  if (years === 2) return "سنتان";
  if (years <= 10) return `${years} سنوات`;

  return `${years} سنة`;
};

const openLink = async (url) => {
  try {
    await Linking.openURL(url);
  } catch (error) {
    console.error("Erreur ouverture lien :", error);
    notify("خطأ", "تعذر فتح الرابط على هذا الجهاز.");
  }
};

export default function ParentManagementScreen({ route }) {
  const [parents, setParents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState({});

  // Ouvre toutes les fiches au premier chargement si demandé
  const expandAllOnStart = useRef(route?.params?.expandAll === true);

  const loadParents = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("parents")
        .select(
          `
          id,
          address,
          created_at,
          user:users ( first_name, last_name, email, phone, status, created_at ),
          children (
            id,
            first_name,
            last_name,
            birth_date,
            age_group:age_groups ( name ),
            child_courses (
              status,
              course:courses ( title )
            )
          )
        `,
        )
        .order("created_at", { ascending: false });

      if (error) throw error;

      const rows = data || [];

      setParents(rows);

      if (expandAllOnStart.current) {
        setExpanded(Object.fromEntries(rows.map((row) => [row.id, true])));
        expandAllOnStart.current = false;
      }
    } catch (error) {
      console.error("Erreur chargement parents :", error);
      notify("خطأ", "تعذر تحميل بيانات أولياء الأمور. يرجى المحاولة مرة أخرى.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadParents();
    }, [loadParents]),
  );

  const totals = useMemo(
    () => ({
      parents: parents.length,
      children: parents.reduce(
        (sum, parent) => sum + (parent.children?.length || 0),
        0,
      ),
    }),
    [parents],
  );

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return parents;

    return parents.filter((parent) => {
      const user = one(parent.user);

      const haystack = [
        user?.first_name,
        user?.last_name,
        user?.email,
        user?.phone,
        parent.address,
        ...(parent.children || []).flatMap((child) => [
          child.first_name,
          child.last_name,
        ]),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [parents, search]);

  const allExpanded =
    filtered.length > 0 && filtered.every((parent) => expanded[parent.id]);

  const toggleAll = () => {
    setExpanded(
      allExpanded
        ? {}
        : Object.fromEntries(filtered.map((parent) => [parent.id, true])),
    );
  };

  const toggleOne = (id) => {
    setExpanded((current) => ({ ...current, [id]: !current[id] }));
  };

  const renderChild = (child) => {
    const ageGroup = one(child.age_group);
    const courses = child.child_courses || [];

    return (
      <View key={child.id} style={styles.childCard}>
        <View style={styles.childHeader}>
          <View style={styles.childAvatar}>
            <Ionicons name="happy-outline" size={20} color="#DB2777" />
          </View>

          <View style={styles.childIdentity}>
            <Text style={styles.childName}>
              {`${child.first_name || ""} ${child.last_name || ""}`.trim() ||
                "طفل بدون اسم"}
            </Text>

            <Text style={styles.childMeta}>
              {getAgeLabel(child.birth_date)}
              {ageGroup?.name ? `  •  ${ageGroup.name}` : ""}
            </Text>
          </View>
        </View>

        <Info label="تاريخ الميلاد" value={formatDate(child.birth_date)} />

        <Text style={styles.coursesTitle}>الدروس المسجّل بها</Text>

        {courses.length === 0 ? (
          <Text style={styles.noCourses}>غير مسجّل في أي درس بعد.</Text>
        ) : (
          courses.map((item, index) => {
            const course = one(item.course);
            const status = COURSE_STATUS[item.status] || COURSE_STATUS.ENROLLED;

            return (
              <View key={`${child.id}-${index}`} style={styles.courseRow}>
                <Text
                  style={[
                    styles.courseStatus,
                    { color: status.color, backgroundColor: status.background },
                  ]}
                >
                  {status.label}
                </Text>

                <Text style={styles.courseTitle} numberOfLines={1}>
                  {course?.title || "درس محذوف"}
                </Text>
              </View>
            );
          })
        )}
      </View>
    );
  };

  const renderParent = ({ item }) => {
    const user = one(item.user);
    const children = item.children || [];
    const isOpen = !!expanded[item.id];

    const name =
      `${user?.first_name || ""} ${user?.last_name || ""}`.trim() ||
      "ولي أمر بدون اسم";

    const status = USER_STATUS[user?.status] || USER_STATUS.ACTIVE;

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.avatar}>
            <Ionicons name="people" size={24} color="#2563EB" />
          </View>

          <View style={styles.identity}>
            <Text style={styles.name}>{name}</Text>

            <Text
              style={[
                styles.statusBadge,
                { color: status.color, backgroundColor: status.background },
              ]}
            >
              {status.label}
            </Text>
          </View>
        </View>

        <View style={styles.separator} />

        <Info
          label="البريد الإلكتروني"
          value={user?.email}
          onPress={user?.email ? () => openLink(`mailto:${user.email}`) : null}
        />

        <Info
          label="الهاتف"
          value={user?.phone}
          onPress={user?.phone ? () => openLink(`tel:${user.phone}`) : null}
        />

        <Info label="العنوان" value={item.address} />

        <Info
          label="تاريخ التسجيل"
          value={formatDate(user?.created_at || item.created_at)}
        />

        <TouchableOpacity
          style={styles.childrenToggle}
          onPress={() => toggleOne(item.id)}
          activeOpacity={0.8}
        >
          <Ionicons
            name={isOpen ? "chevron-up" : "chevron-down"}
            size={20}
            color={COLORS.primary}
          />

          <Text style={styles.childrenToggleText}>
            الأطفال ({children.length})
          </Text>
        </TouchableOpacity>

        {isOpen ? (
          children.length === 0 ? (
            <Text style={styles.noChildren}>
              لم يسجّل ولي الأمر أي طفل بعد.
            </Text>
          ) : (
            children.map(renderChild)
          )
        ) : null}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>جارٍ تحميل البيانات...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Résumé + recherche */}
      <View style={styles.topBar}>
        <View style={styles.summaryRow}>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryValue}>{totals.parents}</Text>
            <Text style={styles.summaryLabel}>أولياء الأمور</Text>
          </View>

          <View style={styles.summaryBox}>
            <Text style={styles.summaryValue}>{totals.children}</Text>
            <Text style={styles.summaryLabel}>الأطفال</Text>
          </View>
        </View>

        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={19} color={COLORS.muted} />

          <TextInput
            style={styles.searchInput}
            placeholder="ابحث بالاسم أو البريد أو الهاتف أو اسم الطفل"
            placeholderTextColor="#A8A29E"
            value={search}
            onChangeText={setSearch}
            textAlign="right"
            autoCapitalize="none"
          />

          {search ? (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Ionicons name="close-circle" size={19} color={COLORS.muted} />
            </TouchableOpacity>
          ) : null}
        </View>

        {filtered.length > 0 ? (
          <TouchableOpacity onPress={toggleAll} style={styles.toggleAll}>
            <Text style={styles.toggleAllText}>
              {allExpanded ? "طي الكل" : "عرض كل الأطفال"}
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderParent}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              loadParents();
            }}
            colors={[COLORS.primary]}
          />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="people-outline" size={50} color={COLORS.muted} />

            <Text style={styles.emptyTitle}>
              {search ? "لا توجد نتائج مطابقة" : "لا يوجد أولياء أمور بعد"}
            </Text>

            <Text style={styles.emptyText}>
              {search
                ? "جرّب كلمة بحث أخرى."
                : "ستظهر هنا حسابات أولياء الأمور عند تسجيلهم."}
            </Text>
          </View>
        }
      />
    </View>
  );
}

function Info({ label, value, onPress }) {
  return (
    <View style={styles.infoRow}>
      {onPress ? (
        <TouchableOpacity style={styles.infoValueWrapper} onPress={onPress}>
          <Text style={[styles.infoValue, styles.infoLink]}>
            {String(value)}
          </Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.infoValueWrapper}>
          <Text style={styles.infoValue}>{String(value || "—")}</Text>
        </View>
      )}

      <Text style={styles.infoLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },

  topBar: { paddingHorizontal: 16, paddingTop: 14 },

  summaryRow: { flexDirection: "row-reverse", gap: 10, marginBottom: 12 },
  summaryBox: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 12,
    alignItems: "center",
  },
  summaryValue: { fontSize: 22, fontWeight: "bold", color: COLORS.text },
  summaryLabel: { fontSize: 12, color: COLORS.muted, marginTop: 2 },

  searchBox: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
    height: 44,
    gap: 8,
  },
  searchInput: { flex: 1, fontSize: 13, color: COLORS.text, height: 44 },

  toggleAll: { alignSelf: "flex-start", paddingVertical: 8 },
  toggleAllText: { color: COLORS.primary, fontSize: 12, fontWeight: "bold" },

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
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },
  identity: { flex: 1, alignItems: "flex-end" },
  name: { fontSize: 17, fontWeight: "bold", color: COLORS.text },
  statusBadge: {
    marginTop: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    fontSize: 11,
    fontWeight: "600",
    overflow: "hidden",
  },
  separator: { height: 1, backgroundColor: COLORS.border, marginVertical: 14 },

  infoRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    marginBottom: 10,
    gap: 12,
  },
  infoLabel: { color: COLORS.muted, fontSize: 13 },
  infoValueWrapper: { flex: 1, alignItems: "flex-start" },
  infoValue: { color: COLORS.text, fontSize: 13, textAlign: "left" },
  infoLink: { color: "#2563EB", textDecorationLine: "underline" },

  childrenToggle: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFF0F1",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    marginTop: 6,
  },
  childrenToggleText: {
    color: COLORS.primary,
    fontWeight: "bold",
    fontSize: 14,
  },

  noChildren: {
    color: COLORS.muted,
    fontSize: 13,
    textAlign: "right",
    marginTop: 12,
  },

  childCard: {
    backgroundColor: "#FFFBFA",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 13,
    marginTop: 12,
  },
  childHeader: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginBottom: 10,
  },
  childAvatar: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#FDF2F8",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  childIdentity: { flex: 1, alignItems: "flex-end" },
  childName: { fontSize: 15, fontWeight: "bold", color: COLORS.text },
  childMeta: { fontSize: 12, color: COLORS.muted, marginTop: 3 },

  coursesTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: COLORS.text,
    textAlign: "right",
    marginTop: 6,
    marginBottom: 8,
  },
  noCourses: { color: COLORS.muted, fontSize: 12, textAlign: "right" },
  courseRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 7,
    gap: 10,
  },
  courseTitle: {
    flex: 1,
    fontSize: 13,
    color: COLORS.text,
    textAlign: "right",
  },
  courseStatus: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
    fontSize: 11,
    fontWeight: "600",
    overflow: "hidden",
  },

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
