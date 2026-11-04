import { useRef, useState } from "react";

import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import Routes from "../../constants/routes";
import { supabase } from "../../lib/supabase";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+?[0-9]{8,15}$/;

const EMAIL_EXISTS_MSG =
  "هذا البريد الإلكتروني مستخدم بالفعل. يرجى تسجيل الدخول أو استخدام بريد آخر.";

const NETWORK_ERROR_MSG =
  "تعذر التحقق من البريد الإلكتروني. تحقق من اتصالك بالإنترنت وحاول مجدداً.";

const EMPTY_ERRORS = {
  fullName: "",
  email: "",
  phone: "",
  password: "",
  accepted: "",
  general: "",
};

export default function RegisterScreen({ navigation }) {
  // =========================
  // États
  // =========================

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [accepted, setAccepted] = useState(false);

  const [errors, setErrors] = useState(EMPTY_ERRORS);
  const [checking, setChecking] = useState(false);

  // Refs pour passer au champ suivant avec le clavier
  const emailRef = useRef(null);
  const phoneRef = useRef(null);
  const passwordRef = useRef(null);

  const clearError = (field) => {
    setErrors((prev) => (prev[field] ? { ...prev, [field]: "" } : prev));
  };

  const goToLogin = () => {
    navigation.navigate(Routes.LOGIN);
  };

  // =========================
  // Vérifier si l'email existe déjà
  // =========================

  const checkEmailExists = async (cleanEmail) => {
    const { data, error } = await supabase.rpc("email_exists", {
      check_email: cleanEmail,
    });

    if (error) throw error;

    return data === true;
  };

  // =========================
  // Validation + passage au choix du rôle
  // =========================

  const goToRoleSelection = async () => {
    if (checking) return;

    const cleanFullName = fullName.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.replace(/\s/g, "");

    const newErrors = { ...EMPTY_ERRORS };

    // Nom complet
    if (!cleanFullName) {
      newErrors.fullName = "يرجى إدخال الاسم الكامل.";
    } else if (cleanFullName.length < 3) {
      newErrors.fullName = "يجب أن يتكون الاسم من 3 أحرف على الأقل.";
    }

    // Email
    if (!cleanEmail) {
      newErrors.email = "يرجى إدخال البريد الإلكتروني.";
    } else if (!EMAIL_REGEX.test(cleanEmail)) {
      newErrors.email = "يرجى إدخال بريد إلكتروني صحيح.";
    }

    // Téléphone
    if (!cleanPhone) {
      newErrors.phone = "يرجى إدخال رقم الهاتف.";
    } else if (!PHONE_REGEX.test(cleanPhone)) {
      newErrors.phone = "يرجى إدخال رقم هاتف صحيح.";
    }

    // Mot de passe
    if (!password) {
      newErrors.password = "يرجى إدخال كلمة المرور.";
    } else if (password.length < 8) {
      newErrors.password = "يجب أن تتكون كلمة المرور من 8 أحرف على الأقل.";
    } else if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
      newErrors.password = "يجب أن تحتوي كلمة المرور على حروف وأرقام.";
    }

    // Conditions
    if (!accepted) {
      newErrors.accepted = "يرجى الموافقة على الشروط والأحكام.";
    }

    const hasErrors = Object.values(newErrors).some((e) => e !== "");

    if (hasErrors) {
      setErrors(newErrors);
      return;
    }

    // Vérification email déjà utilisé
    try {
      setChecking(true);
      setErrors(EMPTY_ERRORS);

      const exists = await checkEmailExists(cleanEmail);

      if (exists) {
        setErrors({ ...EMPTY_ERRORS, email: EMAIL_EXISTS_MSG });
        return;
      }

      navigation.navigate(Routes.ROLE_SELECTION, {
        registrationData: {
          fullName: cleanFullName,
          email: cleanEmail,
          phone: cleanPhone,
          password,
        },
      });
    } catch (err) {
      console.error("Email check error:", err);
      setErrors({ ...EMPTY_ERRORS, general: NETWORK_ERROR_MSG });
    } finally {
      setChecking(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          {/* IMAGE */}

          <Image
            source={require("../../assets/images/login/login-1.png")}
            style={styles.image}
            resizeMode="cover"
          />

          {/* TITRE */}

          <Text style={styles.title}>البدء</Text>
          <Text style={styles.subtitle}>من خلال إنشاء حساب مجاني</Text>

          {/* FORMULAIRE */}

          <View style={styles.form}>
            {/* NOM COMPLET */}

            <View
              style={[
                styles.inputContainer,
                errors.fullName ? styles.inputContainerError : null,
              ]}
            >
              <Ionicons
                name="person-outline"
                size={21}
                color="#777"
                style={styles.inputIcon}
              />

              <TextInput
                style={styles.input}
                placeholder="الاسم الكامل"
                placeholderTextColor="#777"
                value={fullName}
                onChangeText={(text) => {
                  setFullName(text);
                  clearError("fullName");
                }}
                textAlign="right"
                autoComplete="name"
                textContentType="name"
                returnKeyType="next"
                onSubmitEditing={() => emailRef.current?.focus()}
              />
            </View>
            {errors.fullName ? (
              <Text style={styles.errorText}>{errors.fullName}</Text>
            ) : null}

            {/* EMAIL */}

            <View
              style={[
                styles.inputContainer,
                errors.email ? styles.inputContainerError : null,
              ]}
            >
              <Ionicons
                name="mail-outline"
                size={21}
                color="#777"
                style={styles.inputIcon}
              />

              <TextInput
                ref={emailRef}
                style={styles.input}
                placeholder="بريد إلكتروني صالح"
                placeholderTextColor="#777"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  clearError("email");
                  clearError("general");
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                textContentType="emailAddress"
                textAlign="right"
                returnKeyType="next"
                onSubmitEditing={() => phoneRef.current?.focus()}
              />
            </View>
            {errors.email ? (
              <Text style={styles.errorText}>{errors.email}</Text>
            ) : null}

            {/* TELEPHONE */}

            <View
              style={[
                styles.inputContainer,
                errors.phone ? styles.inputContainerError : null,
              ]}
            >
              <Ionicons
                name="phone-portrait-outline"
                size={21}
                color="#777"
                style={styles.inputIcon}
              />

              <TextInput
                ref={phoneRef}
                style={styles.input}
                placeholder="رقم الهاتف"
                placeholderTextColor="#777"
                value={phone}
                onChangeText={(text) => {
                  setPhone(text);
                  clearError("phone");
                }}
                keyboardType="phone-pad"
                autoComplete="tel"
                textContentType="telephoneNumber"
                textAlign="right"
                returnKeyType="next"
                onSubmitEditing={() => passwordRef.current?.focus()}
              />
            </View>
            {errors.phone ? (
              <Text style={styles.errorText}>{errors.phone}</Text>
            ) : null}

            {/* PASSWORD */}

            <View
              style={[
                styles.inputContainer,
                errors.password ? styles.inputContainerError : null,
              ]}
            >
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.inputIconButton}
              >
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={21}
                  color="#777"
                />
              </TouchableOpacity>

              <TextInput
                ref={passwordRef}
                style={styles.input}
                placeholder="كلمة مرور"
                placeholderTextColor="#777"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  clearError("password");
                }}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoComplete="new-password"
                textContentType="newPassword"
                textAlign="right"
                returnKeyType="done"
                onSubmitEditing={goToRoleSelection}
              />
            </View>
            {errors.password ? (
              <Text style={styles.errorText}>{errors.password}</Text>
            ) : null}
          </View>

          {/* CONDITIONS */}

          <TouchableOpacity
            style={styles.termsRow}
            onPress={() => {
              setAccepted(!accepted);
              clearError("accepted");
            }}
            activeOpacity={0.8}
          >
            <View style={[styles.checkbox, accepted && styles.checkboxChecked]}>
              {accepted && (
                <Ionicons name="checkmark" size={14} color="#FFFFFF" />
              )}
            </View>

            <Text style={styles.termsText}>
              من خلال تحديد المربع، فإنك توافق على شروطنا وأحكامنا
            </Text>
          </TouchableOpacity>
          {errors.accepted ? (
            <Text style={styles.errorText}>{errors.accepted}</Text>
          ) : null}

          {/* ERREUR GÉNÉRALE (réseau...) */}

          {errors.general ? (
            <Text style={styles.errorText}>{errors.general}</Text>
          ) : null}

          {/* BOUTON */}

          <TouchableOpacity
            style={[styles.registerButton, checking && { opacity: 0.65 }]}
            onPress={goToRoleSelection}
            activeOpacity={0.8}
            disabled={checking}
            accessibilityRole="button"
          >
            <View style={styles.buttonCircle} />

            {checking ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>الاستمرار</Text>
            )}

            <View style={styles.buttonRightShape} />
          </TouchableOpacity>

          {/* LOGIN LINK */}

          <View style={styles.loginRow}>
            <Text style={styles.loginText}>هل لديك حساب بالفعل؟</Text>

            <TouchableOpacity onPress={goToLogin}>
              <Text style={styles.loginLink}>تسجيل الدخول</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  // ÉCRAN
  screen: {
    flex: 1,
    backgroundColor: "#F52F46",
  },

  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 8,
  },

  // CARTE
  card: {
    width: "94%",
    minHeight: 650,
    backgroundColor: "#FFFFFF",
    borderRadius: 32,
    paddingHorizontal: 18,
    paddingTop: 28,
    paddingBottom: 25,
    alignItems: "center",
    overflow: "hidden",
  },

  // IMAGE
  image: {
    width: 140,
    height: 140,
    borderRadius: 25,
    marginBottom: 5,
  },

  // TITRE
  title: {
    fontSize: 30,
    color: "#111111",
    fontWeight: "500",
    textAlign: "center",
    writingDirection: "rtl",
    marginTop: 3,
  },

  subtitle: {
    fontSize: 14,
    color: "#777777",
    textAlign: "center",
    writingDirection: "rtl",
    marginTop: 2,
    marginBottom: 14,
  },

  // FORMULAIRE
  form: {
    width: "100%",
    alignItems: "center",
  },

  inputContainer: {
    width: "100%",
    height: 42,
    backgroundColor: "#FFE9B5",
    borderRadius: 8,
    marginBottom: 9,
    flexDirection: "row",
    alignItems: "center",
  },

  inputContainerError: {
    borderWidth: 1.5,
    borderColor: "#E53935",
    marginBottom: 4,
  },

  input: {
    flex: 1,
    height: "100%",
    fontSize: 13,
    color: "#333333",
    paddingHorizontal: 13,
    textAlign: "right",
    writingDirection: "rtl",
  },

  inputIcon: {
    marginLeft: 12,
  },

  inputIconButton: {
    width: 45,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  // ERREURS (sous chaque champ)
  errorText: {
    width: "100%",
    color: "#E53935",
    fontSize: 12,
    textAlign: "right",
    writingDirection: "rtl",
    fontFamily: "TajawalRegular",
    marginBottom: 8,
  },

  // CONDITIONS
  termsRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: 20,
    marginBottom: 6,
    paddingHorizontal: 5,
  },

  checkbox: {
    width: 12,
    height: 12,
    borderWidth: 1,
    borderColor: "#BDBDBD",
    borderRadius: 2,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 6,
  },

  checkboxChecked: {
    backgroundColor: "#F85D76",
    borderColor: "#F85D76",
  },

  termsText: {
    flex: 1,
    fontSize: 10,
    color: "#222222",
    textAlign: "right",
    writingDirection: "rtl",
    lineHeight: 16,
  },

  // BOUTON
  registerButton: {
    width: "72%",
    height: 36,
    backgroundColor: "#FF6F87",
    borderRadius: 20,
    marginTop: 30,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
    shadowColor: "#65C9E8",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    writingDirection: "rtl",
    zIndex: 2,
  },

  buttonCircle: {
    position: "absolute",
    left: 10,
    width: 21,
    height: 21,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    zIndex: 3,
  },

  buttonRightShape: {
    position: "absolute",
    right: -8,
    bottom: -8,
    width: 55,
    height: 35,
    borderRadius: 30,
    backgroundColor: "#F57C91",
  },

  // LOGIN
  loginRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 26,
  },

  loginText: {
    fontSize: 12,
    color: "#222222",
    writingDirection: "rtl",
  },

  loginLink: {
    fontSize: 12,
    color: "#FF3D55",
    marginLeft: 4,
    writingDirection: "rtl",
  },
});
