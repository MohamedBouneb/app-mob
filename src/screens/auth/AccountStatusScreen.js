import { Ionicons } from "@expo/vector-icons";
import {
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const COLORS = {
  primary: "#F52F46",
  secondary: "#E85A24",
  yellow: "#FFD83D",
  background: "#FFF8F5",
  white: "#FFFFFF",
  text: "#333333",
  gray: "#777777",
  border: "#F1E5E0",
  warning: "#D99518",
  warningBg: "#FFF4D9",
  danger: "#D93636",
  dangerBg: "#FDEAEA",
};

export default function AccountStatusScreen({ status = "PENDING", onLogout }) {
  const isPending = status?.toUpperCase() === "PENDING";

  const content = isPending
    ? {
        icon: "time-outline",
        iconColor: COLORS.warning,
        iconBg: COLORS.warningBg,
        title: "طلبك قيد المراجعة",
        subtitle: "شكراً لانضمامك إلى روضة المستقبل!",
        badge: "في انتظار موافقة الإدارة",
        message:
          "تم استلام طلب التسجيل بنجاح. يقوم فريق الإدارة حالياً بمراجعة معلوماتك والتحقق منها.",
        footer:
          "سيتم تفعيل حسابك فور الموافقة على طلبك. يمكنك العودة لاحقاً للتحقق من حالة حسابك.",
      }
    : {
        icon: "close-circle-outline",
        iconColor: COLORS.danger,
        iconBg: COLORS.dangerBg,
        title: "تم رفض طلب التسجيل",
        subtitle: "نأسف لعدم قبول طلبك حالياً.",
        badge: "طلب التسجيل مرفوض",
        message:
          "بعد مراجعة معلوماتك، لم تتم الموافقة على طلب التسجيل الخاص بك.",
        footer: "يرجى التواصل مع إدارة الروضة لمعرفة المزيد من التفاصيل.",
      };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      <View style={styles.container}>
        {/* Logo / Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Ionicons name="school-outline" size={35} color={COLORS.primary} />
          </View>

          <Text style={styles.appName}>روضة المستقبل</Text>

          <Text style={styles.appSubtitle}>مرحباً بك في فضائنا التربوي</Text>
        </View>

        {/* Main Card */}
        <View style={styles.card}>
          {/* Status Icon */}
          <View
            style={[styles.iconContainer, { backgroundColor: content.iconBg }]}
          >
            <Ionicons name={content.icon} size={55} color={content.iconColor} />
          </View>

          {/* Title */}
          <Text style={styles.title}>{content.title}</Text>

          <Text style={styles.subtitle}>{content.subtitle}</Text>

          {/* Status Badge */}
          <View
            style={[
              styles.badge,
              {
                backgroundColor: content.iconBg,
              },
            ]}
          >
            <View
              style={[styles.statusDot, { backgroundColor: content.iconColor }]}
            />

            <Text style={[styles.badgeText, { color: content.iconColor }]}>
              {content.badge}
            </Text>
          </View>

          {/* Message */}
          <View style={styles.messageBox}>
            <Text style={styles.message}>{content.message}</Text>
          </View>

          {/* Footer Information */}
          <View style={styles.infoContainer}>
            <Ionicons
              name="information-circle-outline"
              size={22}
              color={COLORS.secondary}
            />

            <Text style={styles.infoText}>{content.footer}</Text>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          activeOpacity={0.8}
          onPress={onLogout}
        >
          <Ionicons name="log-out-outline" size={22} color={COLORS.white} />

          <Text style={styles.logoutText}>تسجيل الخروج</Text>
        </TouchableOpacity>

        {/* Bottom Text */}
        <Text style={styles.bottomText}>روضة المستقبل © 2026</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
    alignItems: "center",
  },

  header: {
    alignItems: "center",
    marginBottom: 30,
  },

  logoContainer: {
    width: 75,
    height: 75,
    borderRadius: 25,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    elevation: 3,
  },

  appName: {
    fontSize: 23,
    fontWeight: "bold",
    color: COLORS.primary,
  },

  appSubtitle: {
    fontSize: 13,
    color: COLORS.gray,
    marginTop: 5,
  },

  card: {
    width: "100%",
    backgroundColor: COLORS.white,
    borderRadius: 25,
    paddingHorizontal: 22,
    paddingVertical: 30,
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },

  iconContainer: {
    width: 105,
    height: 105,
    borderRadius: 55,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 22,
  },

  title: {
    fontSize: 23,
    fontWeight: "bold",
    color: COLORS.text,
    textAlign: "center",
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 14,
    color: COLORS.gray,
    textAlign: "center",
    lineHeight: 24,
  },

  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 30,
    marginTop: 22,
    marginBottom: 22,
  },

  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 5,
    marginRight: 8,
  },

  badgeText: {
    fontSize: 13,
    fontWeight: "bold",
  },

  messageBox: {
    width: "100%",
    backgroundColor: COLORS.background,
    borderRadius: 15,
    padding: 17,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  message: {
    fontSize: 14,
    color: COLORS.text,
    textAlign: "center",
    lineHeight: 27,
  },

  infoContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 20,
    gap: 9,
  },

  infoText: {
    flex: 1,
    fontSize: 12,
    color: COLORS.gray,
    lineHeight: 23,
    textAlign: "right",
  },

  logoutButton: {
    width: "100%",
    height: 55,
    backgroundColor: COLORS.primary,
    borderRadius: 15,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    marginTop: 25,
    elevation: 3,
  },

  logoutText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
  },

  bottomText: {
    fontSize: 11,
    color: COLORS.gray,
    marginTop: 25,
  },
});
