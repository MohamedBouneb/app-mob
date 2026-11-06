import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import Routes from "../../constants/routes";
import { supabase } from "../../lib/supabase";

const RED = "#F52F46";

export default function EmailConfirmationScreen({ navigation, route }) {
  const email = route?.params?.email || "";
  const [loading, setLoading] = useState(false);

  // Renvoyer l'e-mail de confirmation
  const resendEmail = async () => {
    if (loading) return;

    try {
      setLoading(true);

      const { error } = await supabase.auth.resend({
        type: "signup",
        email: email,
      });

      if (error) throw error;

      Alert.alert(
        "تم إرسال البريد الإلكتروني",
        "تم إرسال رابط التفعيل مرة أخرى إلى بريدك الإلكتروني.",
      );
    } catch (error) {
      console.error("Erreur renvoi email :", error.message);

      Alert.alert("خطأ", "تعذر إرسال البريد الإلكتروني. حاول مرة أخرى لاحقاً.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={RED} barStyle="light-content" />

      <View style={styles.backgroundCircle} />

      <View style={styles.card}>
        {/* ICON */}
        <View style={styles.iconContainer}>
          <Ionicons name="mail-open-outline" size={65} color={RED} />
          <View style={styles.checkIcon}>
            <Ionicons name="checkmark" size={19} color="#FFFFFF" />
          </View>
        </View>

        {/* TITLE */}
        <Text style={styles.title}>تم التسجيل بنجاح!</Text>

        <Text style={styles.subtitle}>مرحباً بك في روضة الياسمين</Text>

        {/* MESSAGE */}
        <Text style={styles.description}>
          لقد تم إنشاء طلب التسجيل بنجاح.
          {"\n"}
          لإكمال عملية التسجيل، يرجى تفعيل حسابك من خلال الرابط الذي أرسلناه إلى
          بريدك الإلكتروني.
        </Text>

        {/* EMAIL */}
        <View style={styles.emailBox}>
          <Ionicons name="mail-outline" size={21} color={RED} />

          <Text style={styles.email}>{email}</Text>
        </View>

        {/* INSTRUCTIONS */}
        <View style={styles.infoBox}>
          <Ionicons
            name="information-circle-outline"
            size={22}
            color="#D98B22"
          />

          <Text style={styles.infoText}>
            يرجى التحقق من بريدك الإلكتروني، وكذلك مجلد الرسائل غير المرغوب
            فيها.
          </Text>
        </View>

        {/* RESEND */}
        <TouchableOpacity
          style={styles.resendButton}
          onPress={resendEmail}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={RED} />
          ) : (
            <Text style={styles.resendText}>إعادة إرسال رابط التفعيل</Text>
          )}
        </TouchableOpacity>

        {/* LOGIN */}
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.replace(Routes.LOGIN)}
          activeOpacity={0.85}
        >
          <Text style={styles.loginText}>العودة إلى تسجيل الدخول</Text>

          <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: RED,
    justifyContent: "center",
    padding: 22,
  },

  backgroundCircle: {
    position: "absolute",
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: "#D91F3A",
    top: -120,
    right: -130,
    opacity: 0.4,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 25,
    alignItems: "center",
    elevation: 5,
  },

  iconContainer: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#FFF0F1",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 22,
  },

  checkIcon: {
    position: "absolute",
    bottom: 2,
    right: 2,
    backgroundColor: "#2EAD70",
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 25,
    fontWeight: "800",
    color: "#222222",
    textAlign: "center",
    writingDirection: "rtl",
  },

  subtitle: {
    fontSize: 17,
    fontWeight: "700",
    color: RED,
    marginTop: 9,
    writingDirection: "rtl",
  },

  description: {
    fontSize: 14,
    color: "#666666",
    lineHeight: 27,
    textAlign: "center",
    marginTop: 20,
    writingDirection: "rtl",
  },

  emailBox: {
    width: "100%",
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#FFF1F2",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    marginTop: 22,
  },

  email: {
    fontSize: 13,
    color: "#333333",
    fontWeight: "700",
  },

  infoBox: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF8E9",
    padding: 13,
    borderRadius: 12,
    marginTop: 18,
    gap: 8,
  },

  infoText: {
    flex: 1,
    fontSize: 12,
    color: "#805B22",
    lineHeight: 21,
    textAlign: "right",
    writingDirection: "rtl",
  },

  resendButton: {
    marginTop: 22,
    padding: 10,
  },

  resendText: {
    color: RED,
    fontSize: 14,
    fontWeight: "700",
  },

  loginButton: {
    width: "100%",
    height: 50,
    borderRadius: 25,
    backgroundColor: RED,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginTop: 15,
  },

  loginText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
});
