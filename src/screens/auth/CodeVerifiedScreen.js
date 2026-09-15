import { Ionicons } from "@expo/vector-icons";
import {
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Routes from "../../constants/routes";

export default function CodeVerifiedScreen({ navigation }) {
  const handleContinue = () => {
    navigation.navigate(Routes.RESET_PASSWORD);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Background rouge */}
        <View style={styles.redBackground}>
          <View style={styles.redCircle} />
        </View>

        {/* Card */}
        <View style={styles.card}>
          <View style={styles.content}>
            {/* Icône succès */}
            <View style={styles.successCircle}>
              <Ionicons name="checkmark" size={55} color="#FFFFFF" />
            </View>

            {/* Titre */}
            <Text style={styles.title}>تم التحقق بنجاح</Text>

            {/* Description */}
            <Text style={styles.description}>
              تم التحقق من رمز التأكيد بنجاح
              {"\n"}
              يمكنك الآن إعادة تعيين كلمة المرور الخاصة بك.
            </Text>

            {/* Image enfant */}
            <Image
              source={require("../../assets/images/splash/welcome-child.png")}
              style={styles.childImage}
              resizeMode="contain"
            />

            {/* Bouton */}
            <TouchableOpacity
              style={styles.continueButton}
              onPress={handleContinue}
              activeOpacity={0.8}
            >
              <Text style={styles.continueButtonText}>متابعة</Text>
            </TouchableOpacity>

            {/* Retour connexion */}
            <TouchableOpacity
              onPress={() => navigation.navigate(Routes.LOGIN)}
              activeOpacity={0.7}
            >
              <Text style={styles.backToLogin}>العودة لتسجيل الدخول</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
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

  redBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "45%",
    backgroundColor: "#F52F46",
    overflow: "hidden",
  },

  redCircle: {
    position: "absolute",
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: "#FF465A",
    top: -120,
    right: -80,
  },

  card: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "78%",
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
  },

  content: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 28,
    paddingTop: 35,
  },

  successCircle: {
    width: 95,
    height: 95,
    borderRadius: 48,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 22,
  },

  title: {
    fontSize: 25,
    fontWeight: "700",
    color: "#333333",
    textAlign: "center",
    marginBottom: 15,
  },

  description: {
    fontSize: 15,
    lineHeight: 25,
    color: "#777777",
    textAlign: "center",
    writingDirection: "rtl",
    marginBottom: 10,
  },

  childImage: {
    width: 190,
    height: 190,
    marginTop: 5,
    marginBottom: 5,
  },

  continueButton: {
    width: "100%",
    height: 52,
    backgroundColor: "#F52F46",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
  },

  continueButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },

  backToLogin: {
    marginTop: 18,
    color: "#777777",
    fontSize: 14,
    textAlign: "center",
  },
});
