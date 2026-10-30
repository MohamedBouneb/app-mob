import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { supabase } from "../../lib/supabase";

const AGE_GROUPS = ["1-2", "3-4", "5-6"];

const emptyForm = {
  title: "",
  description: "",
  age_group: "3-4",
  theme: "",
  week: "1",
};

export default function CourseManagementScreen() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const loadCourses = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("courses")
        .select("id, title, description, age_group, theme, week")
        .order("title", { ascending: true });

      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error("Erreur chargement cours :", error);
      Alert.alert("Erreur", "Impossible de charger les cours.");
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadCourses();
    }, [loadCourses]),
  );

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModalVisible(true);
  };

  const openEdit = (course) => {
    setEditingId(course.id);
    setForm({
      title: course.title || "",
      description: course.description || "",
      age_group: course.age_group || "3-4",
      theme: course.theme || "",
      week: String(course.week ?? "1"),
    });
    setModalVisible(true);
  };

  const saveCourse = async () => {
    if (!form.title.trim() || !form.theme.trim()) {
      Alert.alert("تنبيه", "يرجى إدخال عنوان الدرس والموضوع");
      return;
    }

    if (!/^\d+$/.test(form.week) || Number(form.week) < 1) {
      Alert.alert("تنبيه", "يرجى إدخال رقم أسبوع صحيح");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        age_group: form.age_group,
        theme: form.theme.trim(),
        week: Number(form.week),
      };

      const result = editingId
        ? await supabase.from("courses").update(payload).eq("id", editingId)
        : await supabase.from("courses").insert(payload);

      if (result.error) throw result.error;

      setModalVisible(false);
      await loadCourses();

      Alert.alert(
        "تم",
        editingId ? "تم تعديل الدرس بنجاح." : "تمت إضافة الدرس بنجاح.",
      );
    } catch (error) {
      console.error("Erreur sauvegarde cours :", error);
      Alert.alert("Erreur", "Impossible d'enregistrer le cours.");
    } finally {
      setSaving(false);
    }
  };

  const deleteCourse = (course) => {
    Alert.alert("حذف الدرس", `هل تريد حذف "${course.title}"؟`, [
      { text: "إلغاء", style: "cancel" },
      {
        text: "حذف",
        style: "destructive",
        onPress: async () => {
          try {
            const { error } = await supabase
              .from("courses")
              .delete()
              .eq("id", course.id);

            if (error) throw error;

            await loadCourses();
          } catch (error) {
            console.error("Erreur suppression cours :", error);
            Alert.alert(
              "Erreur",
              "Impossible de supprimer ce cours. Vérifiez s'il est utilisé par d'autres données.",
            );
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#F52F46" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addButton} onPress={openCreate}>
        <Ionicons name="add-circle-outline" size={22} color="#FFFFFF" />
        <Text style={styles.addButtonText}>إضافة درس جديد</Text>
      </TouchableOpacity>

      <FlatList
        data={courses}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.detail}>
              الفئة العمرية: {item.age_group} سنوات
            </Text>
            <Text style={styles.detail}>الموضوع: {item.theme}</Text>
            <Text style={styles.detail}>الأسبوع: {item.week}</Text>

            {!!item.description && (
              <Text style={styles.description}>{item.description}</Text>
            )}

            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => openEdit(item)}
              >
                <Text style={styles.editText}>تعديل</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteCourse(item)}
              >
                <Text style={styles.deleteText}>حذف</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>لا توجد دروس حالياً</Text>
        }
      />

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>
              {editingId ? "تعديل الدرس" : "إضافة درس"}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="عنوان الدرس"
              value={form.title}
              onChangeText={(value) =>
                setForm((prev) => ({ ...prev, title: value }))
              }
            />

            <TextInput
              style={styles.input}
              placeholder="وصف الدرس"
              value={form.description}
              multiline
              onChangeText={(value) =>
                setForm((prev) => ({ ...prev, description: value }))
              }
            />

            <Text style={styles.label}>الفئة العمرية</Text>
            <View style={styles.ageOptions}>
              {AGE_GROUPS.map((age) => (
                <TouchableOpacity
                  key={age}
                  style={[
                    styles.ageOption,
                    form.age_group === age && styles.ageSelected,
                  ]}
                  onPress={() =>
                    setForm((prev) => ({ ...prev, age_group: age }))
                  }
                >
                  <Text
                    style={[
                      styles.ageText,
                      form.age_group === age && styles.ageTextSelected,
                    ]}
                  >
                    {age} سنوات
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              style={styles.input}
              placeholder="الموضوع / Theme"
              value={form.theme}
              onChangeText={(value) =>
                setForm((prev) => ({ ...prev, theme: value }))
              }
            />

            <TextInput
              style={styles.input}
              placeholder="رقم الأسبوع"
              keyboardType="number-pad"
              value={form.week}
              onChangeText={(value) =>
                setForm((prev) => ({ ...prev, week: value }))
              }
            />

            <TouchableOpacity
              style={styles.saveButton}
              disabled={saving}
              onPress={saveCourse}
            >
              <Text style={styles.saveText}>
                {saving ? "جارٍ الحفظ..." : "حفظ"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelText}>إلغاء</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF8F6" },
  list: { padding: 16, paddingBottom: 30 },
  addButton: {
    backgroundColor: "#F52F46",
    borderRadius: 13,
    margin: 16,
    marginBottom: 0,
    padding: 15,
    flexDirection: "row-reverse",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  addButtonText: { color: "#FFFFFF", fontWeight: "bold", fontSize: 15 },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 16,
    marginBottom: 13,
    borderWidth: 1,
    borderColor: "#F1E5E2",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "right",
    color: "#292524",
  },
  detail: { textAlign: "right", color: "#57534E", marginTop: 7 },
  description: { textAlign: "right", color: "#78716C", marginTop: 10 },
  actions: { flexDirection: "row-reverse", gap: 10, marginTop: 15 },
  editButton: {
    flex: 1,
    padding: 11,
    backgroundColor: "#DBEAFE",
    borderRadius: 10,
    alignItems: "center",
  },
  editText: { color: "#1D4ED8", fontWeight: "bold" },
  deleteButton: {
    flex: 1,
    padding: 11,
    backgroundColor: "#FEE2E2",
    borderRadius: 10,
    alignItems: "center",
  },
  deleteText: { color: "#B91C1C", fontWeight: "bold" },
  empty: { textAlign: "center", marginTop: 40, color: "#78716C" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: 18,
  },
  modal: { backgroundColor: "#FFFFFF", borderRadius: 20, padding: 20 },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "right",
    marginBottom: 16,
    color: "#292524",
  },
  input: {
    borderWidth: 1,
    borderColor: "#E7DAD7",
    borderRadius: 11,
    padding: 12,
    marginBottom: 12,
    textAlign: "right",
    color: "#292524",
  },
  label: {
    textAlign: "right",
    fontWeight: "600",
    marginBottom: 9,
    color: "#292524",
  },
  ageOptions: { flexDirection: "row-reverse", gap: 8, marginBottom: 13 },
  ageOption: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#F5F5F4",
    alignItems: "center",
  },
  ageSelected: { backgroundColor: "#F52F46" },
  ageText: { fontSize: 12, color: "#292524" },
  ageTextSelected: { color: "#FFFFFF", fontWeight: "bold" },
  saveButton: {
    backgroundColor: "#F52F46",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 5,
  },
  saveText: { color: "#FFFFFF", fontWeight: "bold" },
  cancelButton: { padding: 12, alignItems: "center" },
  cancelText: { color: "#78716C" },
});
