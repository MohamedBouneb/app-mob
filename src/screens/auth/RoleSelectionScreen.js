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

import colors from "../../styles/colors";
import typography from "../../styles/typography";
import spacing from "../../styles/spacing";


export default function RoleSelectionScreen({ navigation }) {

    // ==========================================
    // Parent
    // ==========================================

    const handleParent = () => {
        navigation.navigate(Routes.PARENT_REGISTER);
    };


    // ==========================================
    // Teacher / Animatrice
    // ==========================================

    const handleTeacher = () => {
        navigation.navigate(Routes.TEACHER_REGISTER);
    };


    // ==========================================
    // Back
    // ==========================================

    const handleBack = () => {
        navigation.goBack();
    };


    return (
        <SafeAreaView style={styles.container}>

            <StatusBar
                barStyle="light-content"
                backgroundColor={colors.primary}
            />


            {/* ==================================
                RED BACKGROUND
            ================================== */}

            <View style={styles.redBackground}>

                <View style={styles.circle1} />

                <View style={styles.circle2} />

            </View>


            {/* ==================================
                MAIN WHITE CARD
            ================================== */}

            <View style={styles.mainCard}>

                {/* ==================================
                    BACK BUTTON
                ================================== */}

                <TouchableOpacity
                    style={styles.backButton}
                    onPress={handleBack}
                    activeOpacity={0.7}
                >

                    <Ionicons
                        name="arrow-back"
                        size={23}
                        color={colors.textDark}
                    />

                </TouchableOpacity>


                {/* ==================================
                    TOP ICON
                ================================== */}

                <View style={styles.topIcon}>

                    <Text style={styles.familyEmoji}>
                        👨‍👩‍👧
                    </Text>

                </View>


                {/* ==================================
                    TITLE
                ================================== */}

                <Text style={styles.title}>
                    اختر نوع حسابك
                </Text>


                <Text style={styles.subtitle}>
                    يرجى الاختيار للبدء
                </Text>


                {/* ==================================
                    PARENT
                ================================== */}

                <TouchableOpacity
                    activeOpacity={0.85}
                    style={styles.roleCard}
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
                            color={colors.white}
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


                {/* ==================================
                    TEACHER
                ================================== */}

                <TouchableOpacity
                    activeOpacity={0.85}
                    style={styles.roleCard}
                    onPress={handleTeacher}
                >

                    {/* Illustration */}

                    <View style={styles.teacherImageContainer}>

                        <Text style={styles.teacherEmoji}>
                            👩‍🏫
                        </Text>

                    </View>


                    {/* Check */}

                    <View style={styles.checkCircle}>

                        <Ionicons
                            name="checkmark"
                            size={18}
                            color={colors.white}
                        />

                    </View>


                    {/* Text */}

                    <Text style={styles.roleTitle}>
                        منشّطة
                    </Text>


                    <Text style={styles.roleDescription}>
                        إدارة الصفوف بكفاءة، تخطيط وتنفيذ الأنشطة
                    </Text>

                    <Text style={styles.roleDescription}>
                        ومشاركة تعلم الأطفال بشكل فعال مع أولياء الأمور
                    </Text>

                </TouchableOpacity>


                {/* ==================================
                    BOTTOM LINKS
                ================================== */}

                <View style={styles.bottomLinks}>

                    {/* Cancel */}

                    <TouchableOpacity
                        onPress={handleBack}
                    >

                        <Text style={styles.cancelText}>
                            إلغاء
                        </Text>

                    </TouchableOpacity>


                    {/* Login */}

                    <TouchableOpacity
                        onPress={() =>
                            navigation.navigate(Routes.LOGIN)
                        }
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

    // ==================================
    // Container
    // ==================================

    container: {
        flex: 1,

        backgroundColor: colors.primary,
    },


    // ==================================
    // Red background
    // ==================================

    redBackground: {
        position: "absolute",

        top: 0,
        left: 0,
        right: 0,

        height: "55%",

        backgroundColor: colors.primary,

        overflow: "hidden",
    },


    circle1: {
        position: "absolute",

        width: 360,
        height: 360,

        borderRadius: 180,

        backgroundColor: colors.primaryDark,

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


    // ==================================
    // Main card
    // ==================================

    mainCard: {
        position: "absolute",

        left: 20,
        right: 20,

        top: 115,
        bottom: 0,

        backgroundColor: colors.white,

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


    // ==================================
    // Back button
    // ==================================

    backButton: {
        position: "absolute",

        top: 18,
        left: 18,

        width: 42,
        height: 42,

        borderRadius: 21,

        backgroundColor: colors.backgroundLight,

        justifyContent: "center",
        alignItems: "center",

        zIndex: 10,
    },


    // ==================================
    // Top icon
    // ==================================

    topIcon: {
        width: 70,
        height: 70,

        borderRadius: 35,

        backgroundColor: colors.white,

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


    // ==================================
    // Title
    // ==================================

    title: {
        ...typography.titleLarge,

        color: colors.text,

        marginTop: spacing.sm,

        textAlign: "center",

        writingDirection: "rtl",
    },


    subtitle: {
        ...typography.subtitle,

        color: colors.textLight,

        marginTop: spacing.xs,

        marginBottom: spacing.lg,

        textAlign: "center",

        writingDirection: "rtl",
    },


    // ==================================
    // Role card
    // ==================================

    roleCard: {
        width: "100%",

        borderRadius: spacing.radiusLarge,

        alignItems: "center",

        marginBottom: spacing.md,

        paddingTop: 13,
        paddingBottom: 13,

        position: "relative",

        // LES DEUX CARTES SONT ROUGES
        backgroundColor: colors.primary,

        shadowColor: "#000",

        shadowOffset: {
            width: 0,
            height: 3,
        },

        shadowOpacity: 0.12,

        shadowRadius: 7,

        elevation: 3,
    },


    // ==================================
    // Parent image
    // ==================================

    roleImageContainer: {
        width: 82,
        height: 82,

        borderRadius: 41,

        backgroundColor: colors.white,

        justifyContent: "center",
        alignItems: "center",

        marginBottom: 4,
    },


    roleEmoji: {
        fontSize: 48,
    },


    // ==================================
    // Teacher image
    // ==================================

    teacherImageContainer: {
        width: 82,
        height: 82,

        borderRadius: 41,

        backgroundColor: colors.white,

        justifyContent: "center",
        alignItems: "center",

        marginBottom: 4,
    },


    teacherEmoji: {
        fontSize: 45,
    },


    // ==================================
    // Check
    // ==================================

    checkCircle: {
        position: "absolute",

        right: 12,
        top: 12,

        width: 25,
        height: 25,

        borderRadius: 13,

        backgroundColor: "rgba(255,255,255,0.25)",

        justifyContent: "center",
        alignItems: "center",
    },


    // ==================================
    // Role title
    // ==================================

    roleTitle: {
        ...typography.titleMedium,

        color: colors.white,

        marginBottom: 2,

        writingDirection: "rtl",

        textAlign: "center",
    },


    // ==================================
    // Description
    // ==================================

    roleDescription: {
        ...typography.small,

        color: colors.white,

        lineHeight: 16,

        textAlign: "center",

        writingDirection: "rtl",
    },


    // ==================================
    // Bottom links
    // ==================================

    bottomLinks: {
        width: "100%",

        flexDirection: "row",

        justifyContent: "space-between",

        paddingHorizontal: 10,

        marginTop: spacing.sm,
    },


    cancelText: {
        ...typography.smallMedium,

        color: colors.placeholder,

        writingDirection: "rtl",
    },


    loginText: {
        ...typography.smallMedium,

        color: colors.textLight,

        writingDirection: "rtl",
    },

});