import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Routes from "../../constants/routes";

const RED = "#F52F46";
const DARK_RED = "#D91F3A";
const LIGHT_RED = "#FFF0F2";

export default function RoleSelectionScreen({ navigation }) {

    const handleParent = () => {
        navigation.navigate(Routes.PARENT_REGISTER);
    };

    const handleTeacher = () => {
        navigation.navigate(Routes.TEACHER_REGISTER);
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar
                barStyle="light-content"
                backgroundColor={RED}
            />

            {/* =========================
                RED BACKGROUND
            ========================= */}
            <View style={styles.redBackground}>

                {/* Decorative circles */}
                <View style={styles.circle1} />
                <View style={styles.circle2} />

            </View>


            {/* =========================
                MAIN WHITE CARD
            ========================= */}
            <View style={styles.mainCard}>

                {/* Small top illustration */}
                <View style={styles.topIcon}>
                    <Text style={styles.familyEmoji}>
                        👨‍👩‍👧
                    </Text>
                </View>


                {/* Title */}
                <Text style={styles.title}>
                    اختر نوع حسابك
                </Text>

                <Text style={styles.subtitle}>
                    يرجى الاختيار للبدء
                </Text>


                {/* =========================
                    PARENT
                ========================= */}
                <TouchableOpacity
                    activeOpacity={0.85}
                    style={[
                        styles.roleCard,
                        styles.parentCard,
                    ]}
                    onPress={handleParent}
                >

                    {/* Illustration */}
                    <View style={styles.roleImageContainer}>
                        <Text style={styles.roleEmoji}>
                            👨‍👩‍👧
                        </Text>
                    </View>

                    {/* Check */}
                    <View style={styles.checkCircle}>
                        <Ionicons
                            name="checkmark"
                            size={18}
                            color="#FFFFFF"
                        />
                    </View>

                    {/* Text */}
                    <Text style={styles.roleTitle}>
                        وليّ أمر
                    </Text>

                    <Text style={styles.roleDescription}>
                        للوصول إلى أنشطة طفلك، والاطلاع على
                    </Text>

                    <Text style={styles.roleDescription}>
                        الأنشطة، والتواصل مع الحضانة.
                    </Text>

                </TouchableOpacity>


                {/* =========================
                    TEACHER
                ========================= */}
                <TouchableOpacity
                    activeOpacity={0.85}
                    style={[
                        styles.roleCard,
                        styles.teacherCard,
                    ]}
                    onPress={handleTeacher}
                >

                    {/* Illustration */}
                    <View style={styles.teacherImageContainer}>
                        <Text style={styles.teacherEmoji}>
                            👩‍🏫
                        </Text>
                    </View>

                    {/* Check */}
                    <View style={styles.checkCircleTeacher}>
                        <Ionicons
                            name="checkmark"
                            size={18}
                            color="#FFFFFF"
                        />
                    </View>

                    {/* Text */}
                    <Text style={styles.teacherTitle}>
                        منشّطة
                    </Text>

                    <Text style={styles.teacherDescription}>
                        إدارة الصفوف بكفاءة، تخطيط وتنفيذ الأنشطة
                    </Text>

                    <Text style={styles.teacherDescription}>
                        ومشاركة تعلم الأطفال بشكل فعال مع أولياء الأمور
                    </Text>

                </TouchableOpacity>


                {/* =========================
                    BUTTON
                ========================= */}
                <TouchableOpacity
                    style={styles.continueButton}
                    activeOpacity={0.85}
                    onPress={handleTeacher}
                >
                    <Text style={styles.continueText}>
                        متابعة
                    </Text>

                    <Ionicons
                        name="arrow-forward"
                        size={24}
                        color="#FFFFFF"
                    />
                </TouchableOpacity>


                {/* Bottom links */}
                <View style={styles.bottomLinks}>

                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={styles.cancelText}>
                            إلغاء
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => navigation.navigate(Routes.LOGIN)}
                    >
                        <Text style={styles.loginText}>
                            تسجيل دخول
                        </Text>
                    </TouchableOpacity>

                </View>

            </View>
        </SafeAreaView>
    );
}


// ======================================================
// STYLES
// ======================================================

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: RED,
    },

    redBackground: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "55%",
        backgroundColor: RED,
        overflow: "hidden",
    },

    circle1: {
        position: "absolute",
        width: 360,
        height: 360,
        borderRadius: 180,
        backgroundColor: DARK_RED,
        opacity: 0.25,
        top: -190,
        right: -100,
    },

    circle2: {
        position: "absolute",
        width: 300,
        height: 300,
        borderRadius: 150,
        backgroundColor: "#FF5C6D",
        opacity: 0.2,
        top: 80,
        left: -170,
    },


    // =========================
    // Main card
    // =========================

    mainCard: {
        position: "absolute",
        left: 20,
        right: 20,
        top: 115,
        bottom: 0,

        backgroundColor: "#FFFFFF",

        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,

        paddingHorizontal: 18,
        paddingTop: 28,

        alignItems: "center",

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: -3,
        },
        shadowOpacity: 0.1,
        shadowRadius: 10,

        elevation: 8,
    },


    // =========================
    // Top icon
    // =========================

    topIcon: {
        width: 70,
        height: 70,
        borderRadius: 35,

        backgroundColor: "#FFFFFF",

        justifyContent: "center",
        alignItems: "center",

        marginTop: -55,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.08,
        shadowRadius: 5,

        elevation: 4,
    },

    familyEmoji: {
        fontSize: 39,
    },


    // =========================
    // Title
    // =========================

    title: {
        fontSize: 27,
        fontWeight: "800",
        color: "#222222",

        marginTop: 8,

        textAlign: "center",
        writingDirection: "rtl",
    },

    subtitle: {
        fontSize: 14,
        color: "#888888",

        marginTop: 3,
        marginBottom: 15,

        textAlign: "center",
        writingDirection: "rtl",
    },


    // =========================
    // Role cards
    // =========================

    roleCard: {
        width: "100%",
        borderRadius: 20,

        alignItems: "center",

        marginBottom: 12,

        position: "relative",
    },

    parentCard: {
        backgroundColor: "#EAF7FF",

        paddingTop: 13,
        paddingBottom: 13,
    },

    teacherCard: {
        backgroundColor: RED,

        paddingTop: 13,
        paddingBottom: 13,
    },


    // =========================
    // Images
    // =========================

    roleImageContainer: {
        width: 82,
        height: 82,

        borderRadius: 41,

        backgroundColor: "#DDF2FF",

        justifyContent: "center",
        alignItems: "center",

        marginBottom: 4,
    },

    roleEmoji: {
        fontSize: 48,
    },

    teacherImageContainer: {
        width: 65,
        height: 65,

        borderRadius: 32.5,

        backgroundColor: "#FFFFFF",

        justifyContent: "center",
        alignItems: "center",

        marginBottom: 4,
    },

    teacherEmoji: {
        fontSize: 40,
    },


    // =========================
    // Check
    // =========================

    checkCircle: {
        position: "absolute",

        right: 12,
        top: 12,

        width: 25,
        height: 25,

        borderRadius: 13,

        backgroundColor: "#B7C7D0",

        justifyContent: "center",
        alignItems: "center",
    },

    checkCircleTeacher: {
        position: "absolute",

        right: 12,
        top: 12,

        width: 25,
        height: 25,

        borderRadius: 13,

        backgroundColor: "#E85C6B",

        justifyContent: "center",
        alignItems: "center",
    },


    // =========================
    // Parent text
    // =========================

    roleTitle: {
        fontSize: 21,
        fontWeight: "800",
        color: "#333333",

        marginBottom: 2,

        writingDirection: "rtl",
    },

    roleDescription: {
        fontSize: 11.5,
        color: "#555555",

        lineHeight: 16,

        textAlign: "center",
        writingDirection: "rtl",
    },


    // =========================
    // Teacher text
    // =========================

    teacherTitle: {
        fontSize: 21,
        fontWeight: "800",
        color: "#FFFFFF",

        marginBottom: 2,

        writingDirection: "rtl",
    },

    teacherDescription: {
        fontSize: 10.5,
        color: "#FFFFFF",

        lineHeight: 15,

        textAlign: "center",
        writingDirection: "rtl",

        paddingHorizontal: 5,
    },


    // =========================
    // Continue button
    // =========================

    continueButton: {
        width: "100%",
        height: 48,

        backgroundColor: RED,

        borderRadius: 24,

        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",

        gap: 10,

        marginTop: 1,
    },

    continueText: {
        color: "#FFFFFF",

        fontSize: 17,
        fontWeight: "700",

        writingDirection: "rtl",
    },


    // =========================
    // Bottom links
    // =========================

    bottomLinks: {
        width: "100%",

        flexDirection: "row",
        justifyContent: "space-between",

        paddingHorizontal: 10,

        marginTop: 9,
    },

    cancelText: {
        fontSize: 13,
        color: "#999999",

        writingDirection: "rtl",
    },

    loginText: {
        fontSize: 13,
        color: "#777777",

        writingDirection: "rtl",
    },
});