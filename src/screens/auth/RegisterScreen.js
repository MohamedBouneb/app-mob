import { useState } from "react";

import {
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
import { useAuth } from "../../context/AuthContext";

export default function RegisterScreen({ navigation }) {
  const { login } = useAuth();

  // =========================
  // États des champs
  // =========================

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [accepted, setAccepted] = useState(false);

  // =========================
  // Création du compte
  // =========================

  const handleRegister = async () => {
    if (!fullName || !email || !phone || !password) {
      console.log("Veuillez remplir tous les champs");
      return;
    }

    if (!accepted) {
      console.log("Veuillez accepter les conditions");
      return;
    }

    // Pour le moment : fake inscription
    const fakeUser = {
      id: 1,
      name: fullName,
      email: email,
      phone: phone,
      role: "PARENT",
    };

    const fakeToken = "fake-register-token";

    await login(fakeUser, fakeToken);

    console.log("Compte créé avec succès");
  };

  // =========================
  // Retour Login
  // =========================

  const goToLogin = () => {
    navigation.navigate(Routes.LOGIN);
  };

  // =========================
  // Sélection du rôle
  // =========================

  const goToRoleSelection = () => {
    navigation.navigate(Routes.ROLE_SELECTION);
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
          {/* ================================= */}
          {/* IMAGE */}
          {/* ================================= */}

          <Image
            source={require("../../assets/images/login/login-1.png")}
            style={styles.image}
            resizeMode="cover"
          />

          {/* ================================= */}
          {/* TITRE */}
          {/* ================================= */}

          <Text style={styles.title}>البدء</Text>

          <Text style={styles.subtitle}>من خلال إنشاء حساب مجاني</Text>

          {/* ================================= */}
          {/* FORMULAIRE */}
          {/* ================================= */}

          <View style={styles.form}>
            {/* NOM COMPLET */}

            <View style={styles.inputContainer}>
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
                onChangeText={setFullName}
                textAlign="right"
                writingDirection="rtl"
              />
            </View>

            {/* EMAIL */}

            <View style={styles.inputContainer}>
              <Ionicons
                name="mail-outline"
                size={21}
                color="#777"
                style={styles.inputIcon}
              />

              <TextInput
                style={styles.input}
                placeholder="بريد إلكتروني صالح"
                placeholderTextColor="#777"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                textAlign="right"
                writingDirection="rtl"
              />
            </View>

            {/* TELEPHONE */}

            <View style={styles.inputContainer}>
              <Ionicons
                name="phone-portrait-outline"
                size={21}
                color="#777"
                style={styles.inputIcon}
              />

              <TextInput
                style={styles.input}
                placeholder="رقم الهاتف"
                placeholderTextColor="#777"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                textAlign="right"
                writingDirection="rtl"
              />
            </View>

            {/* PASSWORD */}

            <View style={styles.inputContainer}>
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
                style={styles.input}
                placeholder="كلمة مرور"
                placeholderTextColor="#777"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                textAlign="right"
                writingDirection="rtl"
              />
            </View>
          </View>

          {/* ================================= */}
          {/* CONDITIONS */}
          {/* ================================= */}

          <TouchableOpacity
            style={styles.termsRow}
            onPress={() => setAccepted(!accepted)}
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

          {/* ================================= */}
          {/* BUTTON */}
          {/* ================================= */}

          <TouchableOpacity
            style={styles.registerButton}
            onPress={goToRoleSelection}
            activeOpacity={0.8}
          >
            {/* Cercle gauche */}

            <View style={styles.buttonCircle} />

            <Text style={styles.buttonText}>الاستمرار</Text>

            {/* Partie arrondie droite */}

            <View style={styles.buttonRightShape} />
          </TouchableOpacity>

          {/* ================================= */}
          {/* LOGIN LINK */}
          {/* ================================= */}

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
  // ==========================================
  // ÉCRAN ROUGE
  // ==========================================

  screen: {
    flex: 1,
    backgroundColor: "#F52F46",
  },

  // ==========================================
  // SCROLL
  // ==========================================

  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 8,
  },

  // ==========================================
  // CARTE BLANCHE
  // ==========================================

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

  // ==========================================
  // IMAGE
  // ==========================================

  image: {
    width: 140,
    height: 140,
    borderRadius: 25,
    marginBottom: 5,
  },

  // ==========================================
  // TITRE
  // ==========================================

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

  // ==========================================
  // FORMULAIRE
  // ==========================================

  form: {
    width: "100%",
    alignItems: "center",
  },

  // ==========================================
  // INPUT
  // ==========================================

  inputContainer: {
    width: "100%",
    height: 42,
    backgroundColor: "#FFE9B5",
    borderRadius: 8,
    marginBottom: 9,
    flexDirection: "row",
    alignItems: "center",
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

  // ==========================================
  // ICÔNE
  // ==========================================

  inputIcon: {
    marginLeft: 12,
  },

  inputIconButton: {
    width: 45,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  // ==========================================
  // CONDITIONS
  // ==========================================

  termsRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: 38,
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

  // ==========================================
  // BOUTON
  // ==========================================

  registerButton: {
    width: "72%",
    height: 36,
    backgroundColor: "#FF6F87",
    borderRadius: 20,
    marginTop: 47,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    overflow: "hidden",

    shadowColor: "#65C9E8",

    shadowOffset: {
      width: 0,
      height: 10,
    },

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

  // ==========================================
  // CERCLE GAUCHE
  // ==========================================

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

  // ==========================================
  // FORME DROITE
  // ==========================================

  buttonRightShape: {
    position: "absolute",
    right: -8,
    bottom: -8,
    width: 55,
    height: 35,
    borderRadius: 30,
    backgroundColor: "#F57C91",
  },

  // ==========================================
  // LOGIN
  // ==========================================

  loginRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 38,

    // CORRECTION :
    writingDirection: "rtl",
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
