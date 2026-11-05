import { useState } from "react";

import {
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

import Routes from "../../constants/routes";
import { supabase } from "../../lib/supabase";

const RED = "#F52F46";

const MSG = {
  missingData:
    "المعلومات الأساسية مفقودة. يرجى العودة وإعادة التسجيل من البداية.",
  required: "يرجى ملء جميع المعلومات المطلوبة.",
  experience: "يرجى إدخال عدد سنوات خبرة صحيح.",
  birthFormat: "أدخل تاريخ الميلاد بصيغة يوم/شهر/سنة.",
  birthInvalid: "تاريخ الميلاد غير صحيح.",
  birthAge: "يجب أن يكون عمرك 18 سنة على الأقل.",
  emailExists:
    "هذا البريد الإلكتروني مستخدم بالفعل. يرجى تسجيل الدخول أو استخدام بريد آخر.",
  rateLimit:
    "تم تجاوز عدد المحاولات المسموح بها. يرجى الانتظار قليلاً ثم المحاولة مجدداً.",
  network: "تعذر الاتصال بالخادم. تحقق من اتصالك بالإنترنت وحاول مجدداً.",
  generic: "تعذر إكمال التسجيل. يرجى المحاولة مرة أخرى.",
};

// Formate la saisie en JJ/MM/AAAA automatiquement
const formatBirthDateInput = (text) => {
  const digits = text.replace(/\D/g, "").slice(0, 8);

  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;

  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
};

const parseBirthDate = (value) => {
  const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);

  if (!match) return { error: MSG.birthFormat };

  const [, day, month, year] = match;
  const date = new Date(Number(year), Number(month) - 1, Number(day));

  if (
    date.getFullYear() !== Number(year) ||
    date.getMonth() !== Number(month) - 1 ||
    date.getDate() !== Number(day) ||
    date > new Date()
  ) {
    return { error: MSG.birthInvalid };
  }

  const today = new Date();
  let age = today.getFullYear() - date.getFullYear();
  const monthDiff = today.getMonth() - date.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
    age -= 1;
  }

  if (age < 18) return { error: MSG.birthAge };

  return { iso: `${year}-${month}-${day}` };
};

const getSignUpError = (err) => {
  const message = (err?.message || "").toLowerCase();
  const code = String(err?.code || "").toLowerCase();

  if (
    code === "user_already_exists" ||
    message.includes("already registered")
  ) {
    return MSG.emailExists;
  }

  if (
    code === "over_email_send_rate_limit" ||
    err?.status === 429 ||
    message.includes("rate limit")
  ) {
    return MSG.rateLimit;
  }

  if (message.includes("network") || message.includes("fetch")) {
    return MSG.network;
  }

  return MSG.generic;
};

export default function TeacherRegisterScreen({ navigation, route }) {
  const registrationData = route?.params?.registrationData;

  const [address, setAddress] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [diploma, setDiploma] = useState("");
  const [experience, setExperience] = useState("");

  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [needsEmailConfirmation, setNeedsEmailConfirmation] = useState(false);

  // =========================
  // Submit
  // =========================

  const handleSubmit = async () => {
    if (saving) return;

    setFormError("");

    if (!registrationData?.email || !registrationData?.password) {
      setFormError(MSG.missingData);
      return;
    }

    const cleanAddress = address.trim();
    const cleanDiploma = diploma.trim();
    const cleanExperience = experience.trim();

    if (
      !cleanAddress ||
      !birthDate.trim() ||
      !cleanDiploma ||
      !cleanExperience
    ) {
      setFormError(MSG.required);
      return;
    }

    if (!/^\d+$/.test(cleanExperience) || Number(cleanExperience) > 60) {
      setFormError(MSG.experience);
      return;
    }

    const birth = parseBirthDate(birthDate.trim());

    if (birth.error) {
      setFormError(birth.error);
      return;
    }

    setSaving(true);

    try {
      const { fullName, email, phone, password } = registrationData;

      const nameParts = fullName.trim().split(/\s+/);
      const firstName = nameParts.shift() || "";
      const lastName = nameParts.join(" ");

      // Toutes les données partent dans signUp : un trigger SQL crée
      // users + teacher_profiles (statut PENDING) côté serveur.
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            phone,
            role: "TEACHER",
            address: cleanAddress,
            birth_date: birth.iso,
            diploma: cleanDiploma,
            experience_years: Number(cleanExperience),
          },
        },
      });

      if (error) throw error;

      if (!data?.user) {
        throw new Error("Supabase n'a retourné aucun utilisateur.");
      }

      // Email déjà utilisé (Supabase ne renvoie pas d'erreur dans ce cas)
      if (data.user.identities?.length === 0) {
        setFormError(MSG.emailExists);
        return;
      }

      // Si une session s'est ouverte (confirmation email désactivée),
      // on la ferme : l'animatrice doit attendre la validation de l'admin.
      if (data.session) {
        await supabase.auth.signOut();
      }

      setNeedsEmailConfirmation(!data.session);
      setSubmitted(true);
    } catch (err) {
      console.error("Erreur inscription animatrice :", {
        message: err?.message,
        code: err?.code,
        status: err?.status,
      });

      setFormError(getSignUpError(err));
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // Écran de succès
  // =========================

  if (submitted) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={RED} />

        <View style={styles.background}>
          <View style={styles.circle1} />
          <View style={styles.circle2} />
        </View>

        <View style={styles.successWrapper}>
          <View style={styles.successCard}>
            <View style={styles.successIcon}>
              <Ionicons name="hourglass-outline" size={36} color={RED} />
            </View>

            <Text style={styles.successTitle}>تم استلام طلبك بنجاح</Text>

            <Text style={styles.successText}>
              حسابك قيد المراجعة من طرف الإدارة. سيتم تفعيله بعد الموافقة على
              طلبك.
            </Text>

            {needsEmailConfirmation ? (
              <View style={styles.infoBox}>
                <Ionicons name="mail-outline" size={20} color={RED} />

                <Text style={styles.infoText}>
                  يرجى أيضاً تأكيد بريدك الإلكتروني عبر الرسالة التي وصلتك.
                </Text>
              </View>
            ) : null}

            <TouchableOpacity
              style={styles.submitButton}
              onPress={() => navigation.navigate(Routes.LOGIN)}
              activeOpacity={0.85}
            >
              <Text style={styles.submitText}>العودة إلى تسجيل الدخول</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // =========================
  // Formulaire
  // =========================

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={RED} />

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
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.card}>
            <View style={styles.topIcon}>
              <Text style={styles.teacherEmoji}>👩‍🏫</Text>
            </View>

            <Text style={styles.title}>بالنسبة للمنشّطة/ة</Text>
            <Text style={styles.profileTitle}>لمحة عن الملف الشخصي</Text>

            <Field
              label="العنوان"
              icon="location-outline"
              value={address}
              onChangeText={(text) => {
                setAddress(text);
                setFormError("");
              }}
            />

            <Field
              label="تاريخ الميلاد"
              icon="calendar-outline"
              placeholder="يوم/شهر/سنة"
              value={birthDate}
              onChangeText={(text) => {
                setBirthDate(formatBirthDateInput(text));
                setFormError("");
              }}
              keyboardType="numeric"
              maxLength={10}
            />

            <Field
              label="الدبلوم / المؤهل"
              icon="school-outline"
              value={diploma}
              onChangeText={(text) => {
                setDiploma(text);
                setFormError("");
              }}
            />

            <Field
              label="الخبرة المهنية"
              icon="briefcase-outline"
              placeholder="سنوات الخبرة"
              value={experience}
              onChangeText={(text) => {
                setExperience(text.replace(/\D/g, ""));
                setFormError("");
              }}
              keyboardType="numeric"
              maxLength={2}
            />

            {formError ? (
              <Text style={styles.errorText}>{formError}</Text>
            ) : null}

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
  maxLength,
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
          maxLength={maxLength}
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
    minHeight: 640,
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
    shadowOffset: { width: 0, height: 2 },
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
    marginBottom: 8,
  },

  field: {
    width: "100%",
    marginBottom: 9,
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

  errorText: {
    width: "100%",
    color: "#E53935",
    fontSize: 13,
    textAlign: "right",
    writingDirection: "rtl",
    marginTop: 4,
    marginBottom: 4,
  },

  submitButton: {
    width: "80%",
    height: 47,
    backgroundColor: RED,
    borderRadius: 24,
    marginTop: 14,
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

  // =========================
  // Succès
  // =========================

  successWrapper: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  successCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    paddingHorizontal: 22,
    paddingVertical: 32,
    alignItems: "center",
  },

  successIcon: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: "#FFF0F1",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
  },

  successTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#222222",
    textAlign: "center",
    writingDirection: "rtl",
    marginBottom: 10,
  },

  successText: {
    fontSize: 15,
    lineHeight: 25,
    color: "#555555",
    textAlign: "center",
    writingDirection: "rtl",
    marginBottom: 8,
  },
});
