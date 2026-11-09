import { useCallback, useEffect, useState } from "react";

import {
    ActivityIndicator,
    Alert,
    Pressable,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import {
    getAnnouncementsForUser,
    markAnnouncementAsRead,
} from "../../services/announcementService";

const C = {
  primary: "#F34B69",
  background: "#FFF9F8",
  white: "#FFFFFF",
  text: "#292D45",
  muted: "#85899D",
  border: "#F0E5E5",
  pinkLight: "#FFF0F4",
  blueLight: "#EDF7FF",
  purpleLight: "#F3F0FF",
};

export default function AnnouncementsScreen({ route }) {
  const audience = route.params?.audience;

  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const isParent = audience === "PARENT";

  // ====================================
  // Charger les annonces
  // ====================================

  const loadAnnouncements = useCallback(async () => {
    try {
      const data = await getAnnouncementsForUser(audience);
      setAnnouncements(data);
    } catch (error) {
      console.error("Erreur annonces :", error);

      Alert.alert("خطأ", "تعذر تحميل الإعلانات. حاول مرة أخرى.");
    }
  }, [audience]);

  useEffect(() => {
    if (!["PARENT", "TEACHER"].includes(audience)) {
      setLoading(false);
      Alert.alert("خطأ", "نوع الحساب غير صالح.");
      return;
    }

    loadAnnouncements().finally(() => setLoading(false));
  }, [audience, loadAnnouncements]);

  // ====================================
  // Actualiser
  // ====================================

  const onRefresh = async () => {
    setRefreshing(true);

    await loadAnnouncements();

    setRefreshing(false);
  };

  // ====================================
  // Ouvrir une annonce
  // ====================================

  const openAnnouncement = async (item) => {
    if (!item.isRead) {
      try {
        await markAnnouncementAsRead(item.id);

        setAnnouncements((previous) =>
          previous.map((announcement) =>
            announcement.id === item.id
              ? { ...announcement, isRead: true }
              : announcement,
          ),
        );
      } catch (error) {
        console.error("Erreur lecture :", error);

        Alert.alert("خطأ", "تعذر تسجيل قراءة الإعلان.");

        return;
      }
    }

    Alert.alert(item.title, item.message, [
      {
        text: "إغلاق",
        style: "cancel",
      },
    ]);
  };

  const unreadCount = announcements.filter((item) => !item.isRead).length;

  // ====================================
  // Interface
  // ====================================

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[C.primary]}
          />
        }
      >
        {/* Introduction */}

        <View style={styles.banner}>
          <Text style={styles.bannerIcon}>📢</Text>

          <Text style={styles.bannerTitle}>
            {isParent ? "رسائل وإعلانات الروضة" : "إعلانات الإدارة"}
          </Text>

          <Text style={styles.bannerSubtitle}>
            {isParent
              ? "تابعوا آخر أخبار ومواعيد الروضة"
              : "تابعي آخر الأخبار والتعليمات الإدارية"}
          </Text>
        </View>

        {/* Statistiques */}

        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{announcements.length}</Text>

            <Text style={styles.statLabel}>جميع الإعلانات</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: C.primary }]}>
              {unreadCount}
            </Text>

            <Text style={styles.statLabel}>غير المقروءة</Text>
          </View>
        </View>

        {/* Liste des annonces */}

        <Text style={styles.sectionTitle}>آخر الإعلانات</Text>

        {loading ? (
          <ActivityIndicator
            size="large"
            color={C.primary}
            style={{ marginTop: 35 }}
          />
        ) : announcements.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>📭</Text>

            <Text style={styles.emptyTitle}>لا توجد إعلانات حالياً</Text>

            <Text style={styles.emptyText}>
              ستظهر هنا جميع الإعلانات الجديدة من الإدارة.
            </Text>
          </View>
        ) : (
          announcements.map((item) => (
            <Pressable
              key={item.id}
              onPress={() => openAnnouncement(item)}
              style={({ pressed }) => [
                styles.announcementCard,
                {
                  opacity: pressed ? 0.75 : 1,
                  borderColor: item.is_important ? C.primary : C.border,
                },
              ]}
            >
              <View style={styles.cardHeader}>
                <View style={styles.cardIcon}>
                  <Text style={{ fontSize: 23 }}>
                    {item.is_important ? "🚨" : "📢"}
                  </Text>
                </View>

                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{item.title}</Text>

                  <Text style={styles.cardDate}>
                    {item.published_at
                      ? new Date(item.published_at).toLocaleDateString("fr-FR")
                      : ""}
                  </Text>
                </View>

                {!item.isRead && (
                  <View style={styles.newBadge}>
                    <Text style={styles.newBadgeText}>جديد</Text>
                  </View>
                )}
              </View>

              <Text style={styles.cardMessage} numberOfLines={3}>
                {item.message}
              </Text>

              <View style={styles.cardFooter}>
                <Text style={styles.readMore}>اقرأ المزيد ←</Text>

                {item.isRead && (
                  <Text style={styles.readStatus}>تمت القراءة ✓</Text>
                )}
              </View>
            </Pressable>
          ))
        )}
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
    backgroundColor: C.background,
  },

  content: {
    padding: 16,
    paddingBottom: 35,
  },

  banner: {
    backgroundColor: C.pinkLight,
    borderRadius: 18,
    padding: 22,
    alignItems: "center",
  },

  bannerIcon: {
    fontSize: 36,
    marginBottom: 8,
  },

  bannerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: C.text,
  },

  bannerSubtitle: {
    fontSize: 12,
    color: C.muted,
    marginTop: 7,
    textAlign: "center",
  },

  statsCard: {
    backgroundColor: C.white,
    borderRadius: 15,
    padding: 16,
    flexDirection: "row",
    marginTop: 16,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: C.border,
  },

  statItem: {
    flex: 1,
    alignItems: "center",
  },

  statNumber: {
    fontSize: 23,
    fontWeight: "800",
    color: C.text,
  },

  statLabel: {
    fontSize: 11,
    color: C.muted,
    marginTop: 5,
  },

  statDivider: {
    width: 1,
    backgroundColor: C.border,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: C.text,
    textAlign: "right",
    marginBottom: 13,
  },

  announcementCard: {
    backgroundColor: C.white,
    borderRadius: 16,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  cardIcon: {
    width: 45,
    height: 45,
    borderRadius: 12,
    backgroundColor: C.pinkLight,
    alignItems: "center",
    justifyContent: "center",
  },

  cardContent: {
    flex: 1,
  },

  cardTitle: {
    color: C.text,
    fontSize: 14,
    fontWeight: "800",
    textAlign: "right",
  },

  cardDate: {
    color: C.muted,
    fontSize: 11,
    marginTop: 5,
    textAlign: "right",
  },

  newBadge: {
    backgroundColor: C.primary,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 8,
  },

  newBadgeText: {
    color: C.white,
    fontSize: 10,
    fontWeight: "800",
  },

  cardMessage: {
    color: C.text,
    fontSize: 13,
    lineHeight: 23,
    textAlign: "right",
    marginTop: 13,
  },

  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 13,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: C.border,
  },

  readMore: {
    color: C.primary,
    fontSize: 12,
    fontWeight: "800",
  },

  readStatus: {
    color: "#19A889",
    fontSize: 11,
  },

  emptyCard: {
    backgroundColor: C.white,
    borderRadius: 16,
    padding: 30,
    alignItems: "center",
  },

  emptyIcon: {
    fontSize: 40,
  },

  emptyTitle: {
    color: C.text,
    fontWeight: "800",
    marginTop: 12,
  },

  emptyText: {
    color: C.muted,
    fontSize: 12,
    textAlign: "center",
    marginTop: 8,
  },
});
