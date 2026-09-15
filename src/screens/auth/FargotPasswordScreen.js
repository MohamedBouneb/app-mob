import { useState } from "react";
import {
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

import { Ionicons } from "@expo/vector-icons";

import Routes from "../../constants/routes";

export default function FargotPasswordScreen({ navigation }) {
  const [emailOrPhone, setEmailOrPhone] = useState("");

  const handleSend = () => {
    if (!emailOrPhone.trim()) {
      return;
    }

    // Pour le moment, on passe directement à l'écran de vérification
    navigation.navigate(Routes.VERIFY_CODE, {
      emailOrPhone: emailOrPhone,
    });
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
          {/* Background decoration */}
          <View style={styles.redBackground}>
            <View style={styles.redCircle} />
          </View>

          {/* White Card */}
          <View style={styles.card}>
            {/* Content */}
            <View style={styles.content}>
              {/* Title */}
              <Text style={styles.title}>نسيت كلمة المرور</Text>

              {/* Description */}
              <Text style={styles.description}>
                يرجى إدخال بريدك الإلكتروني أو رقم هاتفك
                {"\n"}
                لإعادة تعيين كلمة المرور.
              </Text>

              {/* Input Label */}
              <Text style={styles.inputLabel}>البريد الإلكتروني</Text>

              {/* Input */}
              <View style={styles.inputContainer}>
                <Ionicons
                  name="lock-closed-outline"
                  size={21}
                  color="#B9A76A"
                  style={styles.inputIcon}
                />

                <TextInput
                  value={emailOrPhone}
                  onChangeText={setEmailOrPhone}
                  placeholder="البريد الإلكتروني / رقم الهاتف"
                  placeholderTextColor="#AFAFAF"
                  style={styles.input}
                  textAlign="right"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              {/* Illustration */}
              <Image
                source={require("../../assets/images/splash/welcome-child.png")}
                style={styles.childImage}
                resizeMode="contain"
              />

              {/* Send Button */}
              <TouchableOpacity
                style={[
                  styles.sendButton,
                  !emailOrPhone.trim() && styles.sendButtonDisabled,
                ]}
                onPress={handleSend}
                activeOpacity={0.8}
                disabled={!emailOrPhone.trim()}
              >
                <Text style={styles.sendButtonText}>إرسال</Text>
              </TouchableOpacity>

              {/* Back to Login */}
              <TouchableOpacity
                onPress={() => navigation.navigate(Routes.LOGIN)}
                activeOpacity={0.7}
              >
                <Text style={styles.backToLogin}>العودة لتسجيل الدخول</Text>
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
    minHeight: "100%",
  },

  /*
   * RED BACKGROUND
   */
  redBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 310,
    backgroundColor: "#F52F46",
    overflow: "hidden",
  },

  redCircle: {
    position: "absolute",
    width: 430,
    height: 430,
    borderRadius: 215,
    backgroundColor: "#D91632",
    top: 55,
    left: 100,
    opacity: 0.8,
  },

  /*
   * WHITE CARD
   */
  card: {
    flex: 1,
    marginTop: 165,
    minHeight: 650,

    backgroundColor: "#FFFFFF",

    borderTopLeftRadius: 35,
    borderTopRightRadius: 75,

    paddingTop: 95,
    paddingHorizontal: 28,
    paddingBottom: 30,
  },

  content: {
    width: "100%",
    alignItems: "center",
  },

  /*
   * TITLE
   */
  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "#111111",
    textAlign: "center",
    marginBottom: 10,
  },

  /*
   * DESCRIPTION
   */
  description: {
    fontSize: 16,
    lineHeight: 27,
    color: "#222222",
    textAlign: "right",
    writingDirection: "rtl",
    width: "100%",
    marginBottom: 28,
  },

  /*
   * LABEL
   */
  inputLabel: {
    width: "100%",
    fontSize: 13,
    color: "#A9A9A9",
    textAlign: "right",
    marginBottom: 7,
  },

  /*
   * INPUT
   */
  inputContainer: {
    width: "100%",
    height: 48,

    flexDirection: "row",
    alignItems: "center",

    backgroundColor: "#FFF0C9",

    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E9D79E",
  },

  inputIcon: {
    marginLeft: 12,
    marginRight: 5,
  },

  input: {
    flex: 1,
    height: "100%",

    fontSize: 14,
    color: "#555555",

    paddingHorizontal: 12,

    writingDirection: "rtl",
  },

  /*
   * CHILD IMAGE
   */
  childImage: {
    width: 105,
    height: 105,

    marginTop: 78,
    marginBottom: -5,
  },

  /*
   * SEND BUTTON
   */
  sendButton: {
    width: "72%",
    height: 42,

    backgroundColor: "#F26372",

    borderRadius: 22,

    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#8EC9E8",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.35,
    shadowRadius: 12,

    elevation: 5,
  },

  sendButtonDisabled: {
    opacity: 0.6,
  },

  sendButtonText: {
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "600",
    textAlign: "center",
  },

  /*
   * BACK TO LOGIN
   */
  backToLogin: {
    marginTop: 34,

    fontSize: 16,
    fontWeight: "600",

    color: "#D86672",

    textAlign: "center",
    writingDirection: "rtl",
  },
});
