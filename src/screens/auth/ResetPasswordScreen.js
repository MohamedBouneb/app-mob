import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import Routes from "../../constants/routes";

export default function ResetPasswordScreen({ navigation }) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleResetPassword = () => {
    if (!newPassword.trim() || !confirmPassword.trim()) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs.");
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert(
        "Erreur",
        "Le mot de passe doit contenir au moins 6 caractères.",
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Erreur", "Les mots de passe ne correspondent pas.");
      return;
    }

    // Simulation de réinitialisation
    console.log("🔐 Nouveau mot de passe :", newPassword);
    console.log("✅ Mot de passe réinitialisé");

    Alert.alert(
      "Succès",
      "Votre mot de passe a été réinitialisé avec succès.",
      [
        {
          text: "OK",
          onPress: () => {
            navigation.navigate(Routes.LOGIN);
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Background rouge */}
          <View style={styles.redBackground}>
            <View style={styles.redCircle} />
          </View>

          {/* Carte blanche */}
          <View style={styles.card}>
            <View style={styles.content}>
              {/* Titre */}
              <Text style={styles.title}>إعادة تعيين كلمة المرور</Text>

              {/* Description */}
              <Text style={styles.description}>
                يرجى إدخال كلمة المرور الجديدة
                {"\n"}
                الخاصة بك لتأمين حسابك.
              </Text>

              {/* Nouveau mot de passe */}
              <View style={styles.inputContainer}>
                <Ionicons
                  name="lock-closed-outline"
                  size={21}
                  color="#B9A76A"
                  style={styles.inputIcon}
                />

                <TextInput
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="كلمة مرور جديدة"
                  placeholderTextColor="#AFAFAF"
                  style={styles.input}
                  textAlign="right"
                  secureTextEntry={!showNewPassword}
                />

                <TouchableOpacity
                  onPress={() => setShowNewPassword(!showNewPassword)}
                  style={styles.eyeButton}
                >
                  <Ionicons
                    name={showNewPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color="#B9A76A"
                  />
                </TouchableOpacity>
              </View>

              {/* Confirmation mot de passe */}
              <View style={styles.inputContainer}>
                <Ionicons
                  name="lock-closed-outline"
                  size={21}
                  color="#B9A76A"
                  style={styles.inputIcon}
                />

                <TextInput
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="تأكيد كلمة المرور"
                  placeholderTextColor="#AFAFAF"
                  style={styles.input}
                  textAlign="right"
                  secureTextEntry={!showConfirmPassword}
                />

                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.eyeButton}
                >
                  <Ionicons
                    name={
                      showConfirmPassword ? "eye-off-outline" : "eye-outline"
                    }
                    size={20}
                    color="#B9A76A"
                  />
                </TouchableOpacity>
              </View>

              {/* Illustration */}
              <Image
                source={require("../../assets/images/splash/welcome-child.png")}
                style={styles.childImage}
                resizeMode="contain"
              />

              {/* Bouton */}
              <TouchableOpacity
                style={[
                  styles.resetButton,
                  (!newPassword.trim() || !confirmPassword.trim()) &&
                    styles.resetButtonDisabled,
                ]}
                onPress={handleResetPassword}
                activeOpacity={0.8}
                disabled={!newPassword.trim() || !confirmPassword.trim()}
              >
                <Text style={styles.resetButtonText}>تأكيد كلمة المرور</Text>
              </TouchableOpacity>

              {/* Annuler */}
              <TouchableOpacity
                onPress={() => navigation.navigate(Routes.LOGIN)}
                activeOpacity={0.7}
                style={styles.cancelButton}
              >
                <Text style={styles.cancelText}>إلغاء</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F52F46",
  },

  container: {
    flex: 1,
    backgroundColor: "#F52F46",
  },

  scrollContent: {
    flexGrow: 1,
    backgroundColor: "#F52F46",
    paddingTop: 20,
  },

  /* ---------------- BACKGROUND ---------------- */

  redBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 300,
    backgroundColor: "#F52F46",
    overflow: "hidden",
  },

  redCircle: {
    position: "absolute",
    width: 330,
    height: 330,
    borderRadius: 165,
    backgroundColor: "#D91F35",
    top: -155,
    right: -90,
  },

  /* ---------------- CARD ---------------- */

  card: {
    flex: 1,
    marginTop: 145,
    backgroundColor: "#FFFFFF",

    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,

    minHeight: 570,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,

    elevation: 5,
  },

  content: {
    alignItems: "center",
    paddingHorizontal: 28,
    paddingTop: 60,
    paddingBottom: 25,
  },

  /* ---------------- TEXT ---------------- */

  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#151515",
    textAlign: "center",
    writingDirection: "rtl",
    marginBottom: 12,
  },

  description: {
    fontSize: 16,
    lineHeight: 25,
    color: "#4D4D4D",
    textAlign: "center",
    writingDirection: "rtl",
    marginBottom: 22,
  },

  /* ---------------- INPUT ---------------- */

  inputContainer: {
    width: "100%",
    height: 50,
    backgroundColor: "#FFE9B3",
    borderRadius: 11,

    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 12,
    marginBottom: 10,
  },

  inputIcon: {
    marginRight: 8,
  },

  input: {
    flex: 1,
    height: "100%",
    color: "#555555",
    fontSize: 15,
    fontWeight: "500",
    writingDirection: "rtl",
  },

  eyeButton: {
    padding: 5,
  },

  /* ---------------- IMAGE ---------------- */

  childImage: {
    width: 150,
    height: 125,
    marginTop: 5,
    marginBottom: 2,
  },

  /* ---------------- BUTTON ---------------- */

  resetButton: {
    width: "92%",
    height: 48,

    backgroundColor: "#F52F46",
    borderRadius: 25,

    alignItems: "center",
    justifyContent: "center",

    marginTop: 0,
  },

  resetButtonDisabled: {
    opacity: 0.55,
  },

  resetButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
    textAlign: "center",
  },

  /* ---------------- CANCEL ---------------- */

  cancelButton: {
    marginTop: 10,
    paddingVertical: 4,
  },

  cancelText: {
    color: "#F52F46",
    fontSize: 15,
    fontWeight: "600",
  },
});
