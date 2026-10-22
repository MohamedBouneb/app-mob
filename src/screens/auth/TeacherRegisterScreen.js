import { useState } from "react";

import {
  Alert,
  KeyboardAvoidingView,
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

import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import { supabase } from "../../lib/supabase";

const RED = "#F52F46";

export default function TeacherRegisterScreen({ navigation, route }) {
  const registrationData = route?.params?.registrationData;

  console.log("Received registrationData:", {
    fullName: registrationData?.fullName,
    email: registrationData?.email,
    phone: registrationData?.phone,
    password: registrationData?.password,
  });
  // Tes états existants restent ici :
  const [address, setAddress] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [diploma, setDiploma] = useState("");
  const [experience, setExperience] = useState("");
  const [saving, setSaving] = useState(false);
  const [cv, setCv] = useState(null);

  // =========================
  // Select CV
  // =========================

  const handlePickCV = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setCv(result.assets[0]);
      }
    } catch (error) {
      console.log("Erreur sélection CV:", error);

      Alert.alert("Erreur", "Impossible de sélectionner le CV.");
    }
  };
  console.log("Teacher data:", {
    address,
    birthDate,
    diploma,
    experience,
    cv,
  });

  // =========================
  // Submit
  // =========================

  const handleSubmit = async () => {
    if (saving) return;

    if (!registrationData?.email || !registrationData?.password) {
      Alert.alert(
        "Erreur",
        "Les informations du premier formulaire sont manquantes. Recommencez l'inscription.",
      );
      return;
    }

    const cleanAddress = address.trim();
    const cleanBirthDate = birthDate.trim();
    const cleanDiploma = diploma.trim();
    const normalizedExperience = experience.trim().replace(/^\+/, "");

    if (
      !cleanAddress ||
      !cleanBirthDate ||
      !cleanDiploma ||
      !normalizedExperience
    ) {
      Alert.alert("تنبيه", "يرجى ملء جميع المعلومات المطلوبة");
      return;
    }

    if (
      !/^\d+$/.test(normalizedExperience) ||
      Number(normalizedExperience) > 60
    ) {
      Alert.alert("تنبيه", "يرجى إدخال عدد سنوات خبرة صحيح");
      return;
    }

    const dateMatch = cleanBirthDate.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);

    if (!dateMatch) {
      Alert.alert("تنبيه", "أدخل تاريخ الميلاد بصيغة يوم/شهر/سنة");
      return;
    }

    const [, day, month, year] = dateMatch;
    const formattedBirthDate = `${year}-${month}-${day}`;
    const parsedDate = new Date(`${formattedBirthDate}T00:00:00`);

    if (
      Number.isNaN(parsedDate.getTime()) ||
      parsedDate.getFullYear() !== Number(year) ||
      parsedDate.getMonth() + 1 !== Number(month) ||
      parsedDate.getDate() !== Number(day)
    ) {
      Alert.alert("تنبيه", "تاريخ الميلاد غير صحيح");
      return;
    }

    setSaving(true);

    try {
      const { fullName, email, phone, password } = registrationData;
      const nameParts = fullName.trim().split(/\s+/);
      const firstName = nameParts.shift() || "";
      const lastName = nameParts.join(" ");

      // 1. Créer le compte Supabase Auth
      const { data: signUpData, error: signUpError } =
        await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              first_name: firstName,
              last_name: lastName,
              phone,
              role: "TEACHER",
            },
          },
        });

      if (signUpError) throw signUpError;

      const user = signUpData.user;

      if (!user) {
        throw new Error("Supabase n'a retourné aucun utilisateur.");
      }

      // Sans session, les écritures protégées par RLS ne peuvent
      // généralement pas être effectuées depuis cette page.
      if (!signUpData.session) {
        Alert.alert(
          "Confirmation requise",
          "Le compte a été créé. Confirmez votre adresse e-mail, puis connectez-vous pour terminer votre inscription.",
        );
        return;
      }

      // 2. Créer ou actualiser le profil principal.
      // Si un trigger crée déjà cette ligne, vérifiez que les
      // colonnes et les règles RLS permettent cet upsert.
      const { error: userError } = await supabase.from("users").upsert(
        {
          id: user.id,
          first_name: firstName,
          last_name: lastName,
          email: email.toLowerCase(),
          phone,
          role: "TEACHER",
          status: "PENDING",
        },
        { onConflict: "id" },
      );

      if (userError) throw userError;

      // 3. Enregistrer les informations complémentaires.
      const { error: profileError } = await supabase
        .from("teacher_profiles")
        .upsert(
          {
            user_id: user.id,
            address: cleanAddress,
            birth_date: formattedBirthDate,
            diploma: cleanDiploma,
            experience_years: Number(normalizedExperience),
            status: "PENDING",
          },
          { onConflict: "user_id" },
        );

      if (profileError) throw profileError;

      Alert.alert(
        "تم استلام طلب التسجيل",
        "تم إنشاء الحساب وحفظ معلوماتك بنجاح. طلبك الآن قيد المراجعة من طرف الإدارة.",
      );
    } catch (error) {
      console.error("Erreur inscription animatrice :", {
        message: error.message,
        code: error.code,
        details: error.details,
      });

      Alert.alert(
        "تعذر إكمال التسجيل",
        error.message || "حدث خطأ أثناء التسجيل. يرجى المحاولة مرة أخرى.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={RED} />

      {/* =========================
                RED BACKGROUND
            ========================= */}

      <View style={styles.background}>
        <View style={styles.circle1} />
        <View style={styles.circle2} />
      </View>

      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* =========================
                        WHITE CARD
                    ========================= */}

          <View style={styles.card}>
            {/* Teacher icon */}

            <View style={styles.topIcon}>
              <Text style={styles.teacherEmoji}>👩‍🏫</Text>
            </View>

            {/* =========================
                            TITLE
                        ========================= */}

            <Text style={styles.title}>بالنسبة للمنشّطة/ة</Text>

            <Text style={styles.profileTitle}>لمحة عن الملف الشخصي</Text>

            {/* =========================
                            ADDRESS
                        ========================= */}

            <Field
              label="العنوان"
              icon="location-outline"
              placeholder=""
              value={address}
              onChangeText={setAddress}
            />

            {/* =========================
                            BIRTH DATE
                        ========================= */}

            <Field
              label="تاريخ الميلاد"
              icon="calendar-outline"
              placeholder="تاريخ الميلاد"
              value={birthDate}
              onChangeText={setBirthDate}
              keyboardType="numeric"
            />

            {/* =========================
                            DIPLOMA
                        ========================= */}

            <Field
              label="الدبلوم / المؤهل"
              icon="school-outline"
              placeholder=""
              value={diploma}
              onChangeText={setDiploma}
            />

            {/* =========================
                            EXPERIENCE
                        ========================= */}

            <Field
              label="الخبرة المهنية"
              icon="briefcase-outline"
              placeholder="سنوات الخبرة"
              value={experience}
              onChangeText={setExperience}
              keyboardType="numeric"
            />

            {/* =========================
                            CV
                        ========================= */}

            <Text style={styles.fieldLabel}>
              اختياري: سيرة ذاتية / مستند داعم
            </Text>

            <TouchableOpacity
              style={styles.cvContainer}
              onPress={handlePickCV}
              activeOpacity={0.8}
            >
              <Ionicons
                name={cv ? "checkmark-circle" : "cloud-upload-outline"}
                size={21}
                color={cv ? "#55A868" : "#E4A0A7"}
              />

              <Text
                style={[styles.cvText, !cv && styles.cvPlaceholder]}
                numberOfLines={1}
              >
                {cv ? cv.name : ""}
              </Text>
            </TouchableOpacity>

            {/* =========================
                            BUTTON
                        ========================= */}

            <TouchableOpacity
              style={[styles.submitButton, saving && { opacity: 0.6 }]}
              onPress={handleSubmit}
              disabled={saving}
              activeOpacity={0.85}
            >
              <Text style={styles.submitText}>
                {saving ? "جارٍ الحفظ..." : "حفظ ومتابعة"}
              </Text>

              {!saving && (
                <Ionicons name="arrow-forward" size={21} color="#FFFFFF" />
              )}
            </TouchableOpacity>

            {/* =========================
                            SKIP
                        ========================= */}

            <TouchableOpacity
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <Text style={styles.skipText}>تخطي للوقت الحالي</Text>
            </TouchableOpacity>

            {/* =========================
                            ADMIN INFO
                        ========================= */}

            <View style={styles.infoBox}>
              <Ionicons
                name="information-circle-outline"
                size={20}
                color={RED}
              />

              <Text style={styles.infoText}>
                سيتم مراجعة ملفك من طرف الإدارة قبل تفعيل الحساب.
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#999999"
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          textAlign="right"
        />

        {icon && <Ionicons name={icon} size={19} color="#E4A0A7" />}
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

  circle1: {
    position: "absolute",

    width: 350,
    height: 350,

    borderRadius: 175,

    backgroundColor: "#D91F3A",

    opacity: 0.3,

    top: -200,
    right: -100,
  },

  circle2: {
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

    borderTopLeftRadius: 38,
    borderTopRightRadius: 38,

    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 25,

    minHeight: 680,

    alignItems: "center",
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

  teacherEmoji: {
    fontSize: 40,
  },

  title: {
    fontSize: 24,

    fontWeight: "800",

    color: "#222222",

    marginTop: 7,

    textAlign: "center",

    writingDirection: "rtl",
  },

  profileTitle: {
    fontSize: 24,

    fontWeight: "800",

    color: "#222222",

    textAlign: "center",

    writingDirection: "rtl",
  },

  introText: {
    fontSize: 14,

    color: "#333333",

    fontWeight: "600",

    marginTop: 3,
    marginBottom: 10,

    textAlign: "right",

    width: "100%",

    writingDirection: "rtl",
  },

  field: {
    width: "100%",

    marginBottom: 7,
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

    minHeight: 40,

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

    height: 40,

    fontSize: 13,

    color: "#333333",

    writingDirection: "rtl",
  },

  // =========================
  // CV
  // =========================

  cvContainer: {
    width: "100%",

    minHeight: 40,

    borderWidth: 1,

    borderColor: "#E8C3C7",

    borderRadius: 8,

    backgroundColor: "#FFFDFD",

    flexDirection: "row",

    alignItems: "center",

    paddingHorizontal: 10,
  },

  cvText: {
    flex: 1,

    marginLeft: 8,

    fontSize: 12,

    color: "#555555",

    textAlign: "right",

    writingDirection: "rtl",
  },

  cvPlaceholder: {
    color: "#999999",
  },

  // =========================
  // Submit
  // =========================

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

    marginTop: 8,

    writingDirection: "rtl",
  },

  // =========================
  // Admin information
  // =========================

  infoBox: {
    width: "100%",

    flexDirection: "row",

    alignItems: "center",

    backgroundColor: "#FFF3F4",

    borderRadius: 10,

    padding: 10,

    marginTop: 15,
  },

  infoText: {
    flex: 1,

    fontSize: 11,

    color: "#777777",

    marginLeft: 7,

    textAlign: "right",

    writingDirection: "rtl",
  },
});
