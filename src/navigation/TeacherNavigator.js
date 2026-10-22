import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
    Alert,
    Dimensions,
    Pressable,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";

const Stack = createNativeStackNavigator();
const { width } = Dimensions.get("window");

const C = {
  primary: "#7955E8",
  primaryDark: "#6441D2",
  background: "#FFFFFF",
  white: "#FFFFFF",
  text: "#17366D",
  muted: "#8190B1",
  border: "#E9EDF7",
  purpleLight: "#F1EDFF",
  greenLight: "#E8F8F2",
  blueLight: "#EAF4FF",
  pinkLight: "#FFF0F0",
  green: "#19A889",
  blue: "#3788F5",
  pink: "#F36B80",
};

const features = [
  {
    id: "create",
    icon: "📝",
    title: "إنشاء تمرين أو نشاط",
    subtitle: "أضف أنشطة جديدة ومتنوعة\nلتطوير مهارات الأطفال",
    color: C.purpleLight,
    accent: C.primary,
  },
  {
    id: "edit",
    icon: "📋",
    title: "تعديل تماريني",
    subtitle: "قم بتعديل أو تحديث التمارين\nالتي أنشأتها مسبقاً",
    color: C.greenLight,
    accent: C.green,
  },
  {
    id: "courses",
    icon: "📖",
    title: "عرض الدروس",
    subtitle: "اطّلع على الدروس لتحضير\nحصصك بسهولة",
    color: C.blueLight,
    accent: C.blue,
  },
];

function FeatureCard({ item, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.featureCard,
        {
          backgroundColor: item.color,
          opacity: pressed ? 0.75 : 1,
        },
      ]}
    >
      <View
        style={[styles.featureIconContainer, { backgroundColor: item.accent }]}
      >
        <Text style={styles.featureIcon}>{item.icon}</Text>
      </View>

      <View style={styles.featureTextContainer}>
        <Text style={styles.featureTitle}>{item.title}</Text>
        <Text style={styles.featureSubtitle}>{item.subtitle}</Text>
      </View>

      <Text style={[styles.arrow, { color: item.accent }]}>‹</Text>
    </Pressable>
  );
}

function BottomNavigation({ activeTab, onNavigate }) {
  const tabs = [
    { id: "home", icon: "⌂", label: "الرئيسية" },
    { id: "exercises", icon: "▤", label: "التمارين" },
    { id: "courses", icon: "◫", label: "الدروس" },
    { id: "profile", icon: "♙", label: "الملف الشخصي" },
  ];

  return (
    <View style={styles.bottomNavigation}>
      {tabs.map((tab) => {
        const active = activeTab === tab.id;

        return (
          <Pressable
            key={tab.id}
            onPress={() => onNavigate(tab)}
            accessibilityRole="button"
            style={styles.navItem}
          >
            <Text
              style={[styles.navIcon, { color: active ? C.primary : C.muted }]}
            >
              {tab.icon}
            </Text>

            <Text
              style={[
                styles.navLabel,
                {
                  color: active ? C.primary : C.muted,
                  fontWeight: active ? "700" : "400",
                },
              ]}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function TeacherHomeScreen({ navigation }) {
  const { user, logout } = useAuth();

  const teacherName =
    [user?.first_name, user?.last_name].filter(Boolean).join(" ") ||
    user?.user_metadata?.full_name ||
    "المُنشِّطة";

  const showFeature = (id, title) => {
    // Navigation vers les écrans à connecter
    // lorsque les autres écrans seront créés.
    if (id === "create") {
      navigation.navigate("CreateExercise");
      return;
    }

    if (id === "edit") {
      navigation.navigate("MyExercises");
      return;
    }

    if (id === "courses") {
      navigation.navigate("TeacherCourses");
      return;
    }

    Alert.alert(title, "سيتم ربط هذه الصفحة قريباً.");
  };

  const handleTabNavigation = (tab) => {
    if (tab.id === "home") {
      return;
    }

    if (tab.id === "exercises") {
      showFeature("edit", tab.label);
      return;
    }

    if (tab.id === "courses") {
      showFeature("courses", tab.label);
      return;
    }

    if (tab.id === "profile") {
      Alert.alert("الملف الشخصي", "يمكنك الاطلاع على معلومات حسابك هنا.");
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      Alert.alert("خطأ", "تعذر تسجيل الخروج. حاول مرة أخرى.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <StatusBar barStyle="dark-content" backgroundColor={C.background} />

      <View style={styles.container}>
        <ScrollView
          style={styles.screen}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* En-tête */}
          <View style={styles.header}>
            <Pressable
              style={styles.notificationButton}
              onPress={() => Alert.alert("الإشعارات", "لا توجد إشعارات جديدة.")}
              accessibilityRole="button"
              accessibilityLabel="الإشعارات"
            >
              <Text style={styles.notificationIcon}>♧</Text>
              <View style={styles.notificationDot} />
            </Pressable>

            <View style={styles.headerUser}>
              <View style={styles.headerText}>
                <Text style={styles.greeting}>مرحباً</Text>
                <Text style={styles.teacherName} numberOfLines={1}>
                  {teacherName}
                </Text>
                <View style={styles.roleBadge}>
                  <Text style={styles.roleText}>● مُنشِّطة</Text>
                </View>
              </View>

              <View style={styles.avatar}>
                <Text style={styles.avatarEmoji}>👩🏻‍🏫</Text>
              </View>
            </View>
          </View>

          {/* Bannière de bienvenue */}
          <View style={styles.welcomeBanner}>
            <View style={styles.bannerIllustration}>
              <Text style={styles.childrenEmoji}>👧🏻👦🏻</Text>
              <Text style={styles.plantEmoji}>🌿</Text>
            </View>

            <View style={styles.bannerText}>
              <Text style={styles.sunEmoji}>☀️</Text>
              <Text style={styles.bannerTitle}>معاً نصنع تعلّماً ممتعاً</Text>
              <Text style={styles.bannerSubtitle}>لأطفالنا الصغار ❤️</Text>
            </View>
          </View>

          {/* Outils de l'animatrice */}
          <Text style={styles.sectionTitle}>أدواتي كمُنشِّطة</Text>

          <View style={styles.featuresContainer}>
            {features.map((item) => (
              <FeatureCard
                key={item.id}
                item={item}
                onPress={() => showFeature(item.id, item.title)}
              />
            ))}
          </View>

          {/* Conseil */}
          <View style={styles.tipCard}>
            <Text style={styles.tipIcon}>💡</Text>

            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>نصيحة اليوم</Text>
              <Text style={styles.tipText}>
                اجعلي التعلّم ممتعاً من خلال اللعب والأنشطة الإبداعية، فكل طفل
                يتعلّم بطريقته الخاصة.
              </Text>
            </View>
          </View>

          {/* Déconnexion */}
          <Pressable
            style={styles.logoutButton}
            onPress={handleLogout}
            accessibilityRole="button"
          >
            <Text style={styles.logoutText}>تسجيل الخروج</Text>
          </Pressable>
        </ScrollView>

        {/* Barre de navigation */}
        <BottomNavigation activeTab="home" onNavigate={handleTabNavigation} />
      </View>
    </SafeAreaView>
  );
}

export default function TeacherNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="TeacherHome" component={TeacherHomeScreen} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: C.background,
  },

  container: {
    flex: 1,
    backgroundColor: C.background,
  },

  screen: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 24,
  },

  // En-tête
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
    minHeight: 68,
  },

  notificationButton: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  notificationIcon: {
    fontSize: 27,
    color: C.text,
  },

  notificationDot: {
    position: "absolute",
    top: 5,
    left: 9,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#FF5A70",
  },

  headerUser: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flexShrink: 1,
  },

  headerText: {
    alignItems: "flex-end",
    flexShrink: 1,
  },

  greeting: {
    fontSize: 13,
    color: C.text,
  },

  teacherName: {
    fontSize: 17,
    fontWeight: "800",
    color: C.text,
    maxWidth: width * 0.48,
  },

  roleBadge: {
    marginTop: 3,
    backgroundColor: C.purpleLight,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },

  roleText: {
    fontSize: 11,
    color: C.primary,
    fontWeight: "600",
  },

  avatar: {
    width: 53,
    height: 53,
    borderRadius: 27,
    backgroundColor: "#FFE9DC",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  avatarEmoji: {
    fontSize: 34,
  },

  // Bannière
  welcomeBanner: {
    minHeight: 116,
    backgroundColor: "#FFF5E9",
    borderRadius: 23,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 22,
    overflow: "hidden",
  },

  bannerIllustration: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  childrenEmoji: {
    fontSize: 39,
  },

  plantEmoji: {
    fontSize: 19,
  },

  bannerText: {
    flex: 1.3,
    alignItems: "flex-end",
  },

  sunEmoji: {
    fontSize: 25,
    marginBottom: 3,
  },

  bannerTitle: {
    color: C.text,
    fontSize: 15,
    fontWeight: "800",
    textAlign: "right",
  },

  bannerSubtitle: {
    color: C.text,
    fontSize: 13,
    fontWeight: "600",
    textAlign: "right",
    marginTop: 3,
  },

  // Section des outils
  sectionTitle: {
    color: C.text,
    fontSize: 16,
    fontWeight: "800",
    textAlign: "right",
    marginBottom: 12,
  },

  featuresContainer: {
    gap: 12,
  },

  featureCard: {
    minHeight: 91,
    borderRadius: 15,
    paddingHorizontal: 11,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  featureIconContainer: {
    width: 53,
    height: 53,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },

  featureIcon: {
    fontSize: 25,
  },

  featureTextContainer: {
    flex: 1,
    alignItems: "flex-end",
  },

  featureTitle: {
    color: C.text,
    fontSize: 14,
    fontWeight: "800",
    textAlign: "right",
    marginBottom: 4,
  },

  featureSubtitle: {
    color: "#65799F",
    fontSize: 11,
    lineHeight: 17,
    textAlign: "right",
  },

  arrow: {
    fontSize: 27,
    fontWeight: "400",
    marginLeft: 1,
  },

  // Conseil
  tipCard: {
    marginTop: 20,
    backgroundColor: "#FFF8E8",
    borderRadius: 15,
    padding: 13,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },

  tipIcon: {
    fontSize: 23,
  },

  tipContent: {
    flex: 1,
    alignItems: "flex-end",
  },

  tipTitle: {
    color: C.text,
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 5,
  },

  tipText: {
    color: "#65799F",
    fontSize: 12,
    lineHeight: 19,
    textAlign: "right",
  },

  // Déconnexion
  logoutButton: {
    marginTop: 18,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F5DDE2",
    backgroundColor: "#FFF8F9",
  },

  logoutText: {
    color: "#E6536D",
    fontSize: 13,
    fontWeight: "700",
  },

  // Navigation inférieure
  bottomNavigation: {
    minHeight: 59,
    backgroundColor: C.white,
    borderTopWidth: 1,
    borderTopColor: C.border,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 4,
    paddingTop: 5,
    paddingBottom: 3,
  },

  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },

  navIcon: {
    fontSize: 23,
    fontWeight: "600",
  },

  navLabel: {
    fontSize: 10,
    textAlign: "center",
  },
});
