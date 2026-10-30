import { Ionicons } from "@expo/vector-icons";
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const COLORS = {
  primary: "#F52F46",
  background: "#FFF8F6",
  text: "#292524",
  muted: "#78716C",
  white: "#FFFFFF",
  border: "#F1E5E2",
};

const MENU = [
  {
    title: "إدارة المنشّطات",
    description: "مراجعة طلبات التسجيل وقبول المنشّطات",
    icon: "people-outline",
    screen: "TeacherManagement",
  },
  {
    title: "إدارة الدروس",
    description: "إضافة الدروس وتعديلها وتنظيمها",
    icon: "book-outline",
    screen: "CourseManagement",
  },
  {
    title: "الإحصائيات والتقارير",
    description: "متابعة نشاط التطبيق",
    icon: "stats-chart-outline",
    screen: "Statistics",
  },
];

export default function AdminDashboardScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.welcome}>
          <View style={styles.avatar}>
            <Ionicons name="shield-checkmark" size={32} color="#FFFFFF" />
          </View>

          <Text style={styles.welcomeTitle}>مرحباً بك، مدير الروضة 👋</Text>
          <Text style={styles.welcomeText}>
            يمكنك إدارة الدروس ومتابعة طلبات التسجيل من هنا.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>إدارة التطبيق</Text>

        {MENU.map((item) => (
          <TouchableOpacity
            key={item.screen}
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => navigation.navigate(item.screen)}
          >
            <View style={styles.iconBox}>
              <Ionicons name={item.icon} size={27} color={COLORS.primary} />
            </View>

            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDescription}>{item.description}</Text>
            </View>

            <Ionicons name="chevron-back" size={22} color={COLORS.muted} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 20,
    paddingBottom: 35,
  },
  welcome: {
    backgroundColor: COLORS.primary,
    borderRadius: 22,
    padding: 22,
    alignItems: "flex-end",
    marginBottom: 28,
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  welcomeTitle: {
    color: COLORS.white,
    fontSize: 21,
    fontWeight: "bold",
    textAlign: "right",
    marginBottom: 8,
  },
  welcomeText: {
    color: COLORS.white,
    fontSize: 14,
    lineHeight: 23,
    textAlign: "right",
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 19,
    fontWeight: "bold",
    textAlign: "right",
    marginBottom: 14,
  },
  card: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 16,
    marginBottom: 13,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 15,
    backgroundColor: "#FFF0F1",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 13,
  },
  cardText: {
    flex: 1,
    alignItems: "flex-end",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.text,
    textAlign: "right",
    marginBottom: 5,
  },
  cardDescription: {
    fontSize: 12,
    color: COLORS.muted,
    textAlign: "right",
    lineHeight: 19,
  },
});
