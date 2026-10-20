import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
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
  primary: "#F34B69",
  primaryDark: "#D93456",
  background: "#FFF9F8",
  white: "#FFFFFF",
  text: "#292D45",
  muted: "#85899D",
  border: "#F2E7E8",
  blue: "#69B9F4",
  purple: "#9480E8",
  green: "#53BD91",
  yellow: "#F6C35C",
  pinkLight: "#FFF0F4",
  blueLight: "#EDF7FF",
  purpleLight: "#F3F0FF",
  greenLight: "#ECFAF3",
  yellowLight: "#FFF8E8",
};

const chapters = [
  {
    icon: "🧩",
    title: "التركيز والانتباه",
    subtitle: "ألعاب لتنمية التركيز",
    color: C.blueLight,
    accent: C.blue,
  },
  {
    icon: "🌈",
    title: "المرح والسعادة",
    subtitle: "أنشطة ترفيهية",
    color: C.pinkLight,
    accent: C.primary,
  },
  {
    icon: "🎨",
    title: "عالم الإبداع",
    subtitle: "الرسم والتلوين",
    color: C.yellowLight,
    accent: C.yellow,
  },
  {
    icon: "🔤",
    title: "تعلم الحروف",
    subtitle: "أنشطة تعليمية",
    color: C.purpleLight,
    accent: C.purple,
  },
];

const announcements = [
  {
    icon: "📢",
    title: "إعلان هام حول الروضة",
    message: "تابعوا آخر أخبار وأنشطة الروضة.",
    date: "إعلان الإدارة",
    color: C.pinkLight,
  },
  {
    icon: "👩‍🏫",
    title: "رسالة من المربية",
    message: "اكتشفوا الأنشطة التعليمية لهذا الأسبوع.",
    date: "رسالة تعليمية",
    color: C.blueLight,
  },
];

function SectionHeading({ title, action, onAction }) {
  return (
    <View style={styles.sectionHeading}>
      <Text style={styles.sectionTitle}>{title}</Text>

      {action ? (
        <Pressable onPress={onAction} accessibilityRole="button" hitSlop={8}>
          <Text style={styles.sectionAction}>{action}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

function FeatureCard({ icon, title, subtitle, color, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.featureCard,
        { backgroundColor: color, opacity: pressed ? 0.78 : 1 },
      ]}
    >
      <Text style={styles.featureIcon}>{icon}</Text>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureSubtitle}>{subtitle}</Text>
      <View style={styles.featureArrow}>
        <Text style={styles.featureArrowText}>←</Text>
      </View>
    </Pressable>
  );
}

function ChapterCard({ item, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.chapterCard,
        {
          backgroundColor: item.color,
          opacity: pressed ? 0.8 : 1,
        },
      ]}
    >
      <View style={[styles.chapterIllustration, { backgroundColor: C.white }]}>
        <Text style={styles.chapterEmoji}>{item.icon}</Text>
      </View>

      <Text style={styles.chapterTitle}>{item.title}</Text>
      <Text style={styles.chapterSubtitle}>{item.subtitle}</Text>

      <View style={[styles.chapterButton, { backgroundColor: item.accent }]}>
        <Text style={styles.chapterButtonText}>عرض الأنشطة ←</Text>
      </View>
    </Pressable>
  );
}

function AnnouncementRow({ item, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.announcementRow,
        { opacity: pressed ? 0.75 : 1 },
      ]}
    >
      <View
        style={[styles.announcementIconBox, { backgroundColor: item.color }]}
      >
        <Text style={styles.announcementIcon}>{item.icon}</Text>
      </View>

      <View style={styles.announcementContent}>
        <Text style={styles.announcementTitle}>{item.title}</Text>
        <Text style={styles.announcementMessage} numberOfLines={2}>
          {item.message}
        </Text>
        <Text style={styles.announcementDate}>{item.date}</Text>
      </View>

      <Text style={styles.announcementArrow}>‹</Text>
    </Pressable>
  );
}

function ParentHomeScreen() {
  const { user, logout } = useAuth();

  const parentName =
    [user?.first_name, user?.last_name].filter(Boolean).join(" ") ||
    user?.user_metadata?.full_name ||
    "وليّ الأمر";

  const showFeature = (title) => {
    Alert.alert(title, "سيتم عرض المحتوى عند ربط هذه الصفحة بقاعدة البيانات.");
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      Alert.alert("خطأ", "تعذر تسجيل الخروج. حاول مرة أخرى.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <StatusBar barStyle="dark-content" backgroundColor={C.background} />

      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* En-tête */}
        <View style={styles.header}>
          <Pressable
            style={styles.notificationButton}
            onPress={() => showFeature("الإشعارات")}
            accessibilityRole="button"
            accessibilityLabel="الإشعارات"
          >
            <Text style={styles.notificationIcon}>🔔</Text>
            <View style={styles.notificationDot} />
          </Pressable>

          <View style={styles.headerText}>
            <Text style={styles.greeting}>صباح الخير، {parentName}</Text>
            <Text style={styles.greetingSubtitle}>
              نتمنى لطفلك يوماً سعيداً وممتعاً 💗
            </Text>
          </View>
        </View>

        {/* Bannière de bienvenue */}
        <View style={styles.welcomeBanner}>
          <View style={styles.bannerTextContainer}>
            <Text style={styles.bannerTitle}>مرحباً بكم في روضة الياسمين</Text>
            <Text style={styles.bannerSubtitle}>
              رحلة صغيرة نحو التعلم والإبداع
            </Text>

            <Pressable
              style={styles.bannerButton}
              onPress={() => showFeature("فصول الروضة")}
              accessibilityRole="button"
            >
              <Text style={styles.bannerButtonText}>اكتشفوا الأنشطة ←</Text>
            </Pressable>
          </View>

          <View style={styles.bannerIllustration}>
            <Text style={styles.bannerEmoji}>🌟</Text>
            <Text style={styles.bannerDecor}>✨</Text>
          </View>
        </View>

        {/* Accès rapides */}
        <SectionHeading title="اكتشفوا الروضة" />

        <View style={styles.featuresGrid}>
          <FeatureCard
            icon="📚"
            title="فصول الروضة"
            subtitle="اكتشفوا الفصول"
            color={C.pinkLight}
            onPress={() => showFeature("فصول الروضة")}
          />

          <FeatureCard
            icon="🧩"
            title="الأنشطة والتمارين"
            subtitle="تعلم واكتشف"
            color={C.blueLight}
            onPress={() => showFeature("الأنشطة والتمارين")}
          />

          <FeatureCard
            icon="🌙"
            title="حكايات قبل النوم"
            subtitle="وقت ممتع للقراءة"
            color={C.purpleLight}
            onPress={() => showFeature("حكايات قبل النوم")}
          />

          <FeatureCard
            icon="💌"
            title="رسائل الروضة"
            subtitle="إعلانات ومعلومات"
            color={C.yellowLight}
            onPress={() => showFeature("رسائل الروضة")}
          />
        </View>

        {/* Chapitres et activités */}
        <SectionHeading
          title="أنشطة هذا الأسبوع"
          action="عرض الكل"
          onAction={() => showFeature("جميع الأنشطة")}
        />

        <ScrollView
          horizontal
          inverted
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chaptersList}
        >
          {chapters.map((item) => (
            <ChapterCard
              key={item.title}
              item={item}
              onPress={() => showFeature(item.title)}
            />
          ))}
        </ScrollView>

        {/* Informations */}
        <SectionHeading
          title="التواصل والمعلومات"
          action="عرض الكل"
          onAction={() => showFeature("التواصل والمعلومات")}
        />

        <View style={styles.announcementsCard}>
          {announcements.map((item, index) => (
            <React.Fragment key={item.title}>
              {index > 0 ? <View style={styles.separator} /> : null}

              <AnnouncementRow
                item={item}
                onPress={() => showFeature(item.title)}
              />
            </React.Fragment>
          ))}
        </View>

        {/* Conseil */}
        <View style={styles.tipCard}>
          <Text style={styles.tipEmoji}>💡</Text>
          <View style={styles.tipContent}>
            <Text style={styles.tipTitle}>نصيحة اليوم</Text>
            <Text style={styles.tipText}>
              شجعوا طفلكم على الاستكشاف واللعب، فكل تجربة جديدة تساعده على
              التعلم والنمو.
            </Text>
          </View>
        </View>

        <Pressable
          style={styles.logoutButton}
          onPress={handleLogout}
          accessibilityRole="button"
        >
          <Text style={styles.logoutText}>تسجيل الخروج</Text>
        </Pressable>

        <Text style={styles.footer}>
          روضة الياسمين · معاً من أجل طفولة سعيدة 💗
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

export default function ParentNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ParentHome"
        component={ParentHomeScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: C.background,
  },
  screen: {
    flex: 1,
    backgroundColor: C.background,
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 30,
  },
  header: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginBottom: 22,
    gap: 12,
  },
  headerText: {
    flex: 1,
    alignItems: "flex-end",
  },
  greeting: {
    color: C.text,
    fontSize: 21,
    fontWeight: "800",
    textAlign: "right",
    fontFamily: "Arial",
  },
  greetingSubtitle: {
    color: C.muted,
    fontSize: 13,
    marginTop: 7,
    textAlign: "right",
  },
  notificationButton: {
    width: 45,
    height: 45,
    borderRadius: 16,
    backgroundColor: C.white,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: C.border,
  },
  notificationIcon: {
    fontSize: 21,
  },
  notificationDot: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: C.primary,
    top: 8,
    right: 8,
  },
  welcomeBanner: {
    minHeight: 150,
    borderRadius: 25,
    backgroundColor: "#DDF2FF",
    flexDirection: "row-reverse",
    alignItems: "center",
    padding: 16,
    marginBottom: 25,
    overflow: "hidden",
  },
  bannerTextContainer: {
    flex: 1,
    alignItems: "flex-end",
  },
  bannerTitle: {
    color: "#244B76",
    fontSize: 17,
    fontWeight: "800",
    textAlign: "right",
    lineHeight: 26,
  },
  bannerSubtitle: {
    color: "#567795",
    fontSize: 12,
    textAlign: "right",
    marginTop: 8,
    lineHeight: 20,
  },
  bannerButton: {
    marginTop: 13,
    backgroundColor: C.primary,
    borderRadius: 14,
    paddingHorizontal: 13,
    paddingVertical: 9,
  },
  bannerButtonText: {
    color: C.white,
    fontWeight: "700",
    fontSize: 12,
  },
  bannerIllustration: {
    width: width * 0.25,
    alignItems: "center",
    justifyContent: "center",
  },
  bannerEmoji: {
    fontSize: 64,
  },
  bannerDecor: {
    fontSize: 15,
    marginTop: 3,
  },
  sectionHeading: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 13,
    marginTop: 2,
  },
  sectionTitle: {
    color: C.text,
    fontSize: 18,
    fontWeight: "800",
    textAlign: "right",
  },
  sectionAction: {
    color: C.primary,
    fontSize: 12,
    fontWeight: "700",
  },
  featuresGrid: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  featureCard: {
    width: "48.2%",
    minHeight: 143,
    borderRadius: 20,
    padding: 13,
    alignItems: "flex-end",
    marginBottom: 11,
  },
  featureIcon: {
    fontSize: 31,
    marginBottom: 10,
  },
  featureTitle: {
    color: C.text,
    fontSize: 14,
    fontWeight: "800",
    textAlign: "right",
  },
  featureSubtitle: {
    color: C.muted,
    fontSize: 11,
    marginTop: 6,
    textAlign: "right",
  },
  featureArrow: {
    alignSelf: "flex-start",
    marginTop: 10,
    width: 25,
    height: 25,
    borderRadius: 13,
    backgroundColor: C.white,
    alignItems: "center",
    justifyContent: "center",
  },
  featureArrowText: {
    color: C.primary,
    fontSize: 16,
    fontWeight: "800",
  },
  chaptersList: {
    paddingBottom: 22,
    paddingLeft: 2,
    gap: 12,
  },
  chapterCard: {
    width: 165,
    borderRadius: 20,
    padding: 12,
    alignItems: "flex-end",
  },
  chapterIllustration: {
    width: "100%",
    height: 83,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 11,
  },
  chapterEmoji: {
    fontSize: 43,
  },
  chapterTitle: {
    width: "100%",
    fontSize: 14,
    fontWeight: "800",
    color: C.text,
    textAlign: "right",
  },
  chapterSubtitle: {
    width: "100%",
    color: C.muted,
    fontSize: 11,
    marginTop: 5,
    textAlign: "right",
  },
  chapterButton: {
    marginTop: 12,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 11,
  },
  chapterButtonText: {
    color: C.white,
    fontSize: 10,
    fontWeight: "700",
  },
  exerciseBanner: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: C.purpleLight,
    borderRadius: 22,
    padding: 16,
    marginBottom: 25,
    gap: 10,
  },
  exerciseText: {
    flex: 1,
    alignItems: "flex-end",
  },
  exerciseTitle: {
    color: C.text,
    fontSize: 15,
    fontWeight: "800",
    textAlign: "right",
  },
  exerciseSubtitle: {
    color: C.muted,
    fontSize: 12,
    textAlign: "right",
    lineHeight: 20,
    marginTop: 7,
  },
  exerciseButton: {
    backgroundColor: C.purple,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
    marginTop: 12,
  },
  exerciseButtonText: {
    color: C.white,
    fontSize: 11,
    fontWeight: "700",
  },
  exerciseEmoji: {
    fontSize: 43,
  },
  announcementsCard: {
    backgroundColor: C.white,
    borderRadius: 20,
    paddingHorizontal: 13,
    borderWidth: 1,
    borderColor: C.border,
    marginBottom: 18,
  },
  announcementRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    paddingVertical: 15,
    gap: 10,
  },
  announcementIconBox: {
    width: 43,
    height: 43,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  announcementIcon: {
    fontSize: 21,
  },
  announcementContent: {
    flex: 1,
    alignItems: "flex-end",
  },
  announcementTitle: {
    color: C.text,
    fontSize: 13,
    fontWeight: "800",
    textAlign: "right",
  },
  announcementMessage: {
    color: C.muted,
    fontSize: 11,
    textAlign: "right",
    lineHeight: 18,
    marginTop: 5,
  },
  announcementDate: {
    color: C.primary,
    fontSize: 10,
    marginTop: 6,
  },
  announcementArrow: {
    color: C.muted,
    fontSize: 25,
  },
  separator: {
    height: 1,
    backgroundColor: C.border,
  },
  tipCard: {
    flexDirection: "row-reverse",
    alignItems: "flex-start",
    backgroundColor: C.yellowLight,
    borderRadius: 20,
    padding: 15,
    marginBottom: 20,
    gap: 10,
  },
  tipEmoji: {
    fontSize: 28,
  },
  tipContent: {
    flex: 1,
    alignItems: "flex-end",
  },
  tipTitle: {
    color: "#A36A12",
    fontSize: 14,
    fontWeight: "800",
  },
  tipText: {
    color: C.text,
    fontSize: 12,
    textAlign: "right",
    lineHeight: 21,
    marginTop: 6,
  },
  logoutButton: {
    borderWidth: 1,
    borderColor: "#F4CAD2",
    borderRadius: 15,
    paddingVertical: 13,
    alignItems: "center",
    backgroundColor: C.white,
  },
  logoutText: {
    color: C.primaryDark,
    fontSize: 13,
    fontWeight: "800",
  },
  footer: {
    color: C.muted,
    fontSize: 11,
    textAlign: "center",
    marginTop: 20,
  },
});
