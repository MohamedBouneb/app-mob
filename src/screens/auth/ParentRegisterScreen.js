import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import Routes from "../../constants/routes";
import { supabase } from "../../lib/supabase";

const RED = "#F52F46";

// ======================================================
// FORMATAGE AUTOMATIQUE DE LA DATE DD/MM/YYYY
// ======================================================

const formatBirthDate = (value) => {
  const cleaned = value.replace(/\D/g, "").slice(0, 8);

  if (cleaned.length <= 2) {
    return cleaned;
  }

  if (cleaned.length <= 4) {
    return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
  }

  return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4)}`;
};

// ======================================================
// VALIDATION ET CONVERSION DE LA DATE
// DD/MM/YYYY -> YYYY-MM-DD
// ======================================================

const parseBirthDate = (value) => {
  const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);

  if (!match) {
    return null;
  }

  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);

  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return {
    date,
    iso: `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
  };
};

// ======================================================
// ÉCRAN INSCRIPTION PARENT
// ======================================================

export default function ParentRegisterScreen({ navigation, route }) {
  // ======================================================
  // INFORMATIONS DU PARENT
  // ======================================================

  const registrationData = route?.params?.registrationData;

  // ======================================================
  // INFORMATIONS DE L'ENFANT
  // ======================================================

  const [nomeleve, setNomeleve] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [relation, setRelation] = useState("");

  // ======================================================
  // ÉTATS
  // ======================================================

  const [loading, setLoading] = useState(false);
  const [relationModal, setRelationModal] = useState(false);

  const relations = ["الأب", "الأم", "الوصي", "الوصية", "أخرى"];

  // ======================================================
  // CALCUL DE L'ÂGE
  // ======================================================

  const calculateAge = (date) => {
    const today = new Date();

    let age = today.getFullYear() - date.getFullYear();

    const beforeBirthday =
      today.getMonth() < date.getMonth() ||
      (today.getMonth() === date.getMonth() &&
        today.getDate() < date.getDate());

    if (beforeBirthday) {
      age--;
    }

    return age;
  };

  // ======================================================
  // INSCRIPTION PARENT + ENFANT
  // ======================================================

  const handleSubmit = async () => {
    console.log("🚀 handleSubmit déclenché");

    if (loading) {
      return;
    }

    // --------------------------------------------------
    // 1. Vérifier les informations du parent
    // --------------------------------------------------

    if (!registrationData) {
      Alert.alert("خطأ", "بيانات التسجيل غير موجودة");
      return;
    }

    const { fullName, email, password, phone } = registrationData;

    if (!fullName?.trim() || !email?.trim() || !password) {
      Alert.alert("خطأ", "معلومات التسجيل غير مكتملة");
      return;
    }

    console.log("✅ Informations parent OK");

    // --------------------------------------------------
    // 2. Vérifier les informations de l'enfant
    // --------------------------------------------------

    console.log("👶 Nom enfant :", nomeleve);
    console.log("📅 Date naissance :", birthDate);
    console.log("👨‍👩‍👧 Relation :", relation);

    if (!nomeleve.trim() || !birthDate.trim() || !relation) {
      Alert.alert("تنبيه", "يرجى ملء جميع المعلومات");
      return;
    }

    console.log("✅ Informations enfant OK");

    // --------------------------------------------------
    // 3. Vérifier et convertir la date
    // --------------------------------------------------

    const parsedBirthDate = parseBirthDate(birthDate.trim());

    if (!parsedBirthDate) {
      Alert.alert("تنبيه", "يرجى إدخال تاريخ ميلاد صحيح بصيغة DD/MM/YYYY");
      return;
    }

    const parsedDate = parsedBirthDate.date;
    const birthDateISO = parsedBirthDate.iso;

    console.log("📅 Date utilisateur :", birthDate);
    console.log("📅 Date ISO :", birthDateISO);

    // --------------------------------------------------
    // 4. Vérifier que la date n'est pas dans le futur
    // --------------------------------------------------

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (parsedDate > today) {
      Alert.alert("تنبيه", "تاريخ الميلاد لا يمكن أن يكون في المستقبل");
      return;
    }

    // --------------------------------------------------
    // 5. Calculer et vérifier l'âge
    // --------------------------------------------------

    const calculatedAge = calculateAge(parsedDate);

    console.log("🎂 Âge calculé :", calculatedAge);

    if (calculatedAge < 1 || calculatedAge > 6) {
      Alert.alert("تنبيه", "عمر الطفل يجب أن يكون بين سنة واحدة و6 سنوات");
      return;
    }

    // --------------------------------------------------
    // 6. Séparer le nom du parent
    // --------------------------------------------------

    const parentNameParts = fullName.trim().split(/\s+/);

    const parentFirstName = parentNameParts[0];
    const parentLastName = parentNameParts.slice(1).join(" ");

    if (!parentLastName) {
      Alert.alert("تنبيه", "يرجى إدخال الاسم واللقب");
      return;
    }

    // --------------------------------------------------
    // 7. Séparer le nom de l'enfant
    // --------------------------------------------------

    const childNameParts = nomeleve.trim().split(/\s+/);

    const childFirstName = childNameParts[0];
    const childLastName = childNameParts.slice(1).join(" ");

    if (!childLastName) {
      Alert.alert("تنبيه", "يرجى إدخال اسم الطفل ولقبه");
      return;
    }

    // --------------------------------------------------
    // 8. Création du compte Supabase
    // --------------------------------------------------

    try {
      setLoading(true);

      console.log("🔥 Début inscription Supabase");
      console.log("📧 Email :", email);
      console.log("👨 Parent :", fullName);
      console.log("👶 Enfant :", nomeleve);
      console.log("🎂 Naissance ISO :", birthDateISO);
      console.log("🎂 Âge calculé :", calculatedAge);
      console.log("🔗 Relation :", relation);

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,

        options: {
          data: {
            // Informations parent
            first_name: parentFirstName,
            last_name: parentLastName,
            phone: phone || "",
            role: "PARENT",

            // Informations enfant
            child_first_name: childFirstName,
            child_last_name: childLastName,
            child_age: calculatedAge,
            child_birth_date: birthDateISO,
            relation: relation,
          },
        },
      });

      // --------------------------------------------------
      // 9. Vérifier la réponse Supabase
      // --------------------------------------------------

      console.log("📡 Réponse Supabase reçue");

      console.log("❌ Erreur :", error?.message || "Aucune erreur");

      console.log("👤 User ID :", data?.user?.id);

      console.log("📦 Metadata :", data?.user?.user_metadata);

      console.log("🔐 Session disponible :", !!data?.session);

      // --------------------------------------------------
      // 10. Gestion des erreurs Supabase
      // --------------------------------------------------

      if (error) {
        console.error("❌ Erreur inscription :", error.message);

        Alert.alert("خطأ", "حدث خطأ أثناء إنشاء الحساب: " + error.message);

        return;
      }

      if (!data?.user) {
        Alert.alert("خطأ", "تعذر إنشاء الحساب");
        return;
      }

      if (error) {
        console.error("Erreur inscription :", error.message);

        Alert.alert("خطأ", "حدث خطأ أثناء إنشاء الحساب: " + error.message);

        return;
      }

      if (!data?.user) {
        Alert.alert("خطأ", "تعذر إنشاء الحساب");
        return;
      }

      // 12. Vérifier la confirmation par email

      if (!data.session) {
        navigation.replace(Routes.EMAIL_CONFIRMATION, {
          email: email.trim().toLowerCase(),
        });

        return;
      }

      // Si une session existe, la confirmation email
      // n'est probablement pas activée dans Supabase.

      Alert.alert(
        "تنبيه",
        "تم إنشاء الحساب، لكن تأكيد البريد الإلكتروني غير مفعل.",
      );

      // --------------------------------------------------
      // 12. Inscription réussie
      // --------------------------------------------------

      Alert.alert("نجاح", "تم إنشاء حسابك بنجاح!");
    } catch (err) {
      console.error("❌ Exception :", err?.message || err);

      Alert.alert("خطأ", "حدث خطأ غير متوقع أثناء التسجيل.");
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // INTERFACE
  // ======================================================

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={RED} />

      {/* BACKGROUND */}

      <View style={styles.background}>
        <View style={styles.backgroundCircle1} />
        <View style={styles.backgroundCircle2} />
      </View>

      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* CARD */}

          <View style={styles.card}>
            {/* BACK BUTTON */}

            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={23} color="#333333" />
            </TouchableOpacity>

            {/* ICON */}

            <View style={styles.topIcon}>
              <Text style={styles.familyEmoji}>👨‍👩‍👧</Text>
            </View>

            {/* TITLE */}

            <Text style={styles.title}>بالنسبة للتلميذ(ة)</Text>

            {/* CHILD NAME */}

            <Field
              label="اسم التلميذ(ة) ولقبه"
              icon="person-outline"
              placeholder="أدخل اسم التلميذ(ة) ولقبه"
              value={nomeleve}
              onChangeText={setNomeleve}
            />

            {/* BIRTH DATE */}

            <Field
              label="تاريخ ميلاد الطفل"
              icon="calendar-outline"
              placeholder="DD/MM/YYYY مثال: 14/01/2021"
              value={birthDate}
              onChangeText={(value) => setBirthDate(formatBirthDate(value))}
              keyboardType="numeric"
              maxLength={10}
            />

            {/* RELATION */}

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>الصلة بالطفل</Text>

              <TouchableOpacity
                style={styles.inputContainer}
                onPress={() => setRelationModal(true)}
                activeOpacity={0.8}
              >
                <Ionicons name="chevron-down" size={19} color="#999999" />

                <Text
                  style={[styles.selectText, !relation && styles.placeholder]}
                >
                  {relation || "اختر علاقتك بالطفل (مثلاً: أب، أم، وصي)"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* SUBMIT BUTTON */}

            <TouchableOpacity
              style={[styles.submitButton, loading && { opacity: 0.6 }]}
              onPress={handleSubmit}
              disabled={loading}
              activeOpacity={0.85}
            >
              <Text style={styles.submitText}>
                {loading ? "جاري التسجيل..." : "حفظ ومتابعة"}
              </Text>

              <Ionicons name="arrow-forward" size={21} color="#FFFFFF" />
            </TouchableOpacity>

            {/* SKIP */}

            <TouchableOpacity
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <Text style={styles.skipText}>تخطي للوقت الحالي</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* RELATION MODAL */}

      <Modal
        visible={relationModal}
        transparent
        animationType="fade"
        onRequestClose={() => setRelationModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setRelationModal(false)}
        >
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>اختر الصلة بالطفل</Text>

            {relations.map((item) => (
              <TouchableOpacity
                key={item}
                style={styles.relationItem}
                onPress={() => {
                  setRelation(item);
                  setRelationModal(false);
                }}
              >
                <Text style={styles.relationText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

// ======================================================
// FIELD COMPONENT
// ======================================================

function Field({
  label,
  icon,
  placeholder,
  value,
  onChangeText,
  keyboardType,
  maxLength,
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>

      <View style={styles.inputContainer}>
        {icon && <Ionicons name={icon} size={19} color="#E4A0A7" />}

        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#999999"
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          textAlign="right"
          maxLength={maxLength}
        />
      </View>
    </View>
  );
}

// ======================================================
// STYLES
// ======================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: RED,
  },

  keyboard: {
    flex: 1,
  },

  background: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 230,
    backgroundColor: RED,
    overflow: "hidden",
  },

  backgroundCircle1: {
    position: "absolute",
    width: 350,
    height: 350,
    borderRadius: 175,
    backgroundColor: "#D91F3A",
    opacity: 0.3,
    top: -200,
    right: -100,
  },

  backgroundCircle2: {
    position: "absolute",
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: "#FF6372",
    opacity: 0.2,
    top: 30,
    left: -150,
  },

  scrollContent: {
    paddingTop: 105,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 25,
    minHeight: 600,
    alignItems: "center",
  },

  backButton: {
    alignSelf: "flex-start",
    padding: 5,
  },

  topIcon: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginTop: -48,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },

  familyEmoji: {
    fontSize: 38,
  },

  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#222222",
    marginTop: 8,
    marginBottom: 12,
    textAlign: "center",
    writingDirection: "rtl",
  },

  field: {
    width: "100%",
    marginBottom: 12,
  },

  fieldLabel: {
    width: "100%",
    fontSize: 14,
    fontWeight: "700",
    color: "#222222",
    marginBottom: 4,
    textAlign: "right",
    writingDirection: "rtl",
  },

  inputContainer: {
    width: "100%",
    minHeight: 42,
    borderWidth: 1,
    borderColor: "#E8C3C7",
    borderRadius: 8,
    backgroundColor: "#FFFDFD",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },

  input: {
    flex: 1,
    height: 42,
    fontSize: 13,
    color: "#333333",
    writingDirection: "rtl",
  },

  selectText: {
    flex: 1,
    fontSize: 12.5,
    color: "#333333",
    textAlign: "right",
    writingDirection: "rtl",
    marginLeft: 8,
  },

  placeholder: {
    color: "#999999",
  },

  submitButton: {
    width: "80%",
    height: 47,
    backgroundColor: RED,
    borderRadius: 24,
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  submitText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    writingDirection: "rtl",
  },

  skipText: {
    fontSize: 13,
    color: "#E69BA3",
    marginTop: 12,
    writingDirection: "rtl",
  },

  // MODAL

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalContainer: {
    width: "85%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 15,
    writingDirection: "rtl",
  },

  relationItem: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },

  relationText: {
    fontSize: 16,
    color: "#333333",
    textAlign: "center",
    writingDirection: "rtl",
  },
});
