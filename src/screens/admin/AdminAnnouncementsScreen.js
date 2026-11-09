import { useCallback, useEffect, useState } from "react";

import {
    ActivityIndicator,
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    View,
} from "react-native";

import {
    createAnnouncement,
    deleteAnnouncement,
    getAnnouncements,
} from "../../services/announcementService";

const C = {
  primary: "#F52F46",
  primaryDark: "#D93456",
  background: "#FFF8F6",
  white: "#FFFFFF",
  text: "#292D45",
  muted: "#85899D",
  border: "#F0E5E5",
  blue: "#69B9F4",
  blueLight: "#EDF7FF",
  pinkLight: "#FFF0F4",
  purpleLight: "#F3F0FF",
  green: "#53BD91",
  greenLight: "#ECFAF3",
};

const audiences = [
  { value: "ALL", label: "الجميع", icon: "👨‍👩‍👧‍👦" },
  { value: "PARENT", label: "الأولياء", icon: "👨‍👩‍👧" },
  { value: "TEACHER", label: "المنشّطات", icon: "👩‍🏫" },
];

const categories = [
  { value: "GENERAL", label: "عام" },
  { value: "EVENT", label: "حدث أو مناسبة" },
  { value: "URGENT", label: "إعلان عاجل" },
  { value: "EDUCATION", label: "معلومات تعليمية" },
  { value: "SCHEDULE", label: "تغيير في التوقيت" },
];

export default function AdminAnnouncementsScreen() {
  const [announcements, setAnnouncements] = useState([]);

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const [audience, setAudience] = useState("ALL");
  const [category, setCategory] = useState("GENERAL");
  const [isImportant, setIsImportant] = useState(false);

  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);

  // ====================================
  // Charger les annonces
  // ====================================

  const loadAnnouncements = useCallback(async () => {
    try {
      const data = await getAnnouncements();
      setAnnouncements(data);
    } catch (error) {
      console.log("Erreur annonces :", error.message);

      Alert.alert("خطأ", "تعذر تحميل الإعلانات. تحقق من الاتصال.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAnnouncements();
  }, [loadAnnouncements]);

  // ====================================
  // Publier une annonce
  // ====================================

  const handlePublish = async () => {
    if (!title.trim()) {
      Alert.alert("تنبيه", "يرجى إدخال عنوان الإعلان.");
      return;
    }

    if (!message.trim()) {
      Alert.alert("تنبيه", "يرجى كتابة محتوى الإعلان.");
      return;
    }

    try {
      setPublishing(true);

      await createAnnouncement({
        title,
        message,
        audience,
        category,
        isImportant,
      });

      Alert.alert("تم النشر بنجاح", "تم إرسال الإعلان إلى المستلمين المحددين.");

      // Réinitialiser le formulaire
      setTitle("");
      setMessage("");
      setAudience("ALL");
      setCategory("GENERAL");
      setIsImportant(false);

      // Actualiser la liste
      await loadAnnouncements();
    } catch (error) {
      console.log("Erreur publication :", error);

      Alert.alert("خطأ", error.message || "تعذر نشر الإعلان.");
    } finally {
      setPublishing(false);
    }
  };

  // ====================================
  // Supprimer une annonce
  // ====================================

  const handleDelete = (id) => {
    Alert.alert("حذف الإعلان", "هل أنت متأكد من حذف هذا الإعلان؟", [
      {
        text: "إلغاء",
        style: "cancel",
      },
      {
        text: "حذف",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteAnnouncement(id);

            setAnnouncements((previous) =>
              previous.filter((item) => item.id !== id),
            );

            Alert.alert("نجاح", "تم حذف الإعلان.");
          } catch (error) {
            Alert.alert("خطأ", "تعذر حذف الإعلان.");
            console.log(error);
          }
        },
      },
    ]);
  };

  // ====================================
  // Interface
  // ====================================

  const renderAnnouncement = (item) => {
    const selectedAudience = audiences.find((a) => a.value === item.audience);

    return (
      <View key={item.id} style={styles.announcementCard}>
        <View style={styles.cardHeader}>
          <View style={styles.cardIcon}>
            <Text style={{ fontSize: 23 }}>📢</Text>
          </View>

          <View style={styles.cardHeaderContent}>
            <Text style={styles.cardTitle}>{item.title}</Text>

            <Text style={styles.cardDate}>
              {item.published_at
                ? new Date(item.published_at).toLocaleDateString("fr-FR")
                : "غير محدد"}
            </Text>
          </View>

          {item.is_important && <Text style={styles.importantBadge}>مهم</Text>}
        </View>

        <Text style={styles.cardMessage}>{item.message}</Text>

        <View style={styles.cardFooter}>
          <Text style={styles.audienceText}>
            {selectedAudience?.icon} {selectedAudience?.label || item.audience}
          </Text>

          <Pressable
            onPress={() => handleDelete(item.id)}
            style={styles.deleteButton}
          >
            <Text style={styles.deleteText}>حذف 🗑️</Text>
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {/* Introduction */}

      <View style={styles.introCard}>
        <Text style={styles.introIcon}>📢</Text>

        <View style={{ flex: 1 }}>
          <Text style={styles.introTitle}>إدارة الإعلانات والرسائل</Text>

          <Text style={styles.introSubtitle}>
            تواصل مع أولياء الأمور والمنشّطات بسهولة
          </Text>
        </View>
      </View>

      {/* Formulaire */}

      <View style={styles.formCard}>
        <Text style={styles.sectionTitle}>✏️ إنشاء إعلان جديد</Text>

        <Text style={styles.label}>عنوان الإعلان</Text>

        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="أدخل عنوان الإعلان..."
          placeholderTextColor={C.muted}
          textAlign="right"
          maxLength={120}
        />

        <Text style={styles.label}>محتوى الإعلان</Text>

        <TextInput
          style={[styles.input, styles.messageInput]}
          value={message}
          onChangeText={setMessage}
          placeholder="اكتب تفاصيل الإعلان هنا..."
          placeholderTextColor={C.muted}
          textAlign="right"
          multiline
          maxLength={3000}
        />

        {/* Destinataires */}

        <Text style={styles.label}>تحديد المستلمين</Text>

        <View style={styles.audienceContainer}>
          {audiences.map((item) => {
            const active = audience === item.value;

            return (
              <Pressable
                key={item.value}
                onPress={() => setAudience(item.value)}
                style={[
                  styles.audienceButton,
                  active && styles.audienceButtonActive,
                ]}
              >
                <Text style={styles.audienceIcon}>{item.icon}</Text>

                <Text
                  style={[
                    styles.audienceLabel,
                    active && styles.audienceLabelActive,
                  ]}
                >
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Catégorie */}

        <Text style={styles.label}>نوع الإعلان</Text>

        <View style={styles.categoriesContainer}>
          {categories.map((item) => {
            const active = category === item.value;

            return (
              <Pressable
                key={item.value}
                onPress={() => setCategory(item.value)}
                style={[
                  styles.categoryButton,
                  active && styles.categoryButtonActive,
                ]}
              >
                <Text
                  style={[
                    styles.categoryText,
                    active && styles.categoryTextActive,
                  ]}
                >
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Importance */}

        <View style={styles.importantRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.importantTitle}>إعلان مهم</Text>

            <Text style={styles.importantSubtitle}>
              تمييز الإعلان كإعلان مهم
            </Text>
          </View>

          <Switch
            value={isImportant}
            onValueChange={setIsImportant}
            trackColor={{
              false: "#D9DDE5",
              true: C.primary,
            }}
            thumbColor={C.white}
          />
        </View>

        {/* Publish */}

        <Pressable
          onPress={handlePublish}
          disabled={publishing}
          style={({ pressed }) => [
            styles.publishButton,
            {
              opacity: pressed || publishing ? 0.7 : 1,
            },
          ]}
        >
          {publishing ? (
            <ActivityIndicator color={C.white} />
          ) : (
            <Text style={styles.publishText}>📢 نشر الإعلان</Text>
          )}
        </Pressable>
      </View>

      {/* Liste */}

      <View style={styles.listHeader}>
        <Text style={styles.sectionTitle}>الإعلانات المنشورة</Text>

        <Pressable onPress={loadAnnouncements}>
          <Text style={styles.refreshText}>تحديث ↻</Text>
        </Pressable>
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color={C.primary}
          style={{ marginVertical: 30 }}
        />
      ) : announcements.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={{ fontSize: 38 }}>📭</Text>

          <Text style={styles.emptyTitle}>لا توجد إعلانات حالياً</Text>

          <Text style={styles.emptySubtitle}>
            ابدأ بإنشاء أول إعلان للروضة.
          </Text>
        </View>
      ) : (
        announcements.map(renderAnnouncement)
      )}
    </ScrollView>
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

  introCard: {
    backgroundColor: C.pinkLight,
    borderRadius: 18,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 12,
  },

  introIcon: {
    fontSize: 35,
  },

  introTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: C.text,
    textAlign: "right",
  },

  introSubtitle: {
    fontSize: 12,
    color: C.muted,
    textAlign: "right",
    marginTop: 5,
  },

  formCard: {
    backgroundColor: C.white,
    padding: 17,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: C.border,
    marginBottom: 25,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: C.text,
    textAlign: "right",
    marginBottom: 18,
  },

  label: {
    fontSize: 14,
    fontWeight: "700",
    color: C.text,
    textAlign: "right",
    marginBottom: 9,
    marginTop: 13,
  },

  input: {
    backgroundColor: "#FFFDFC",
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 12,
    paddingHorizontal: 13,
    paddingVertical: 13,
    color: C.text,
    fontSize: 14,
  },

  messageInput: {
    height: 120,
    textAlignVertical: "top",
  },

  audienceContainer: {
    flexDirection: "row",
    gap: 8,
  },

  audienceButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: "#F7F7FA",
    borderWidth: 1,
    borderColor: C.border,
  },

  audienceButtonActive: {
    backgroundColor: C.pinkLight,
    borderColor: C.primary,
  },

  audienceIcon: {
    fontSize: 21,
    marginBottom: 6,
  },

  audienceLabel: {
    fontSize: 11,
    color: C.muted,
    fontWeight: "600",
  },

  audienceLabelActive: {
    color: C.primary,
    fontWeight: "800",
  },

  categoriesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  categoryButton: {
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: "#F5F5F8",
    borderWidth: 1,
    borderColor: C.border,
  },

  categoryButtonActive: {
    backgroundColor: C.pinkLight,
    borderColor: C.primary,
  },

  categoryText: {
    fontSize: 12,
    color: C.muted,
  },

  categoryTextActive: {
    color: C.primary,
    fontWeight: "800",
  },

  importantRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: C.border,
  },

  importantTitle: {
    fontWeight: "700",
    color: C.text,
    textAlign: "right",
  },

  importantSubtitle: {
    fontSize: 11,
    color: C.muted,
    textAlign: "right",
    marginTop: 4,
  },

  publishButton: {
    backgroundColor: C.primary,
    padding: 16,
    borderRadius: 13,
    alignItems: "center",
    marginTop: 15,
  },

  publishText: {
    color: C.white,
    fontSize: 15,
    fontWeight: "800",
  },

  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  refreshText: {
    color: C.primary,
    fontWeight: "700",
  },

  announcementCard: {
    backgroundColor: C.white,
    padding: 15,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.border,
    marginBottom: 12,
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

  cardHeaderContent: {
    flex: 1,
  },

  cardTitle: {
    color: C.text,
    fontWeight: "800",
    fontSize: 14,
    textAlign: "right",
  },

  cardDate: {
    color: C.muted,
    fontSize: 11,
    marginTop: 5,
    textAlign: "right",
  },

  importantBadge: {
    backgroundColor: C.pinkLight,
    color: C.primary,
    fontSize: 11,
    padding: 6,
    borderRadius: 8,
    overflow: "hidden",
  },

  cardMessage: {
    fontSize: 13,
    lineHeight: 23,
    color: C.text,
    textAlign: "right",
    marginTop: 15,
  },

  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: C.border,
    marginTop: 14,
    paddingTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  audienceText: {
    fontSize: 12,
    color: C.muted,
  },

  deleteButton: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 9,
    backgroundColor: C.pinkLight,
  },

  deleteText: {
    color: C.primary,
    fontWeight: "700",
    fontSize: 12,
  },

  emptyCard: {
    backgroundColor: C.white,
    borderRadius: 16,
    padding: 30,
    alignItems: "center",
    borderWidth: 1,
    borderColor: C.border,
  },

  emptyTitle: {
    fontSize: 15,
    color: C.text,
    fontWeight: "800",
    marginTop: 12,
  },

  emptySubtitle: {
    fontSize: 12,
    color: C.muted,
    marginTop: 7,
  },
});
