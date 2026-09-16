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


export default function AccountCreatedScreen({ navigation }) {

    const handleLogin = () => {
        navigation.reset({
            index: 0,
            routes: [
                {
                    name: Routes.LOGIN,
                },
            ],
        });
    };


    return (
        <SafeAreaView style={styles.container}>

            <StatusBar
                barStyle="light-content"
                backgroundColor={RED}
            />


            {/* ==================================
                RED BACKGROUND
            ================================== */}

            <View style={styles.background}>

                <View style={styles.circle1} />

                <View style={styles.circle2} />

            </View>


            {/* ==================================
                WHITE CARD
            ================================== */}

            <View style={styles.card}>

                {/* ==================================
                    SUCCESS ICON
                ================================== */}

                <View style={styles.successCircle}>

                    <Ionicons
                        name="checkmark"
                        size={58}
                        color="#FFFFFF"
                    />

                </View>


                {/* ==================================
                    TITLE
                ================================== */}

                <Text style={styles.title}>
                    تم إنشاء حسابك بنجاح
                </Text>


                {/* ==================================
                    DESCRIPTION
                ================================== */}

                <Text style={styles.description}>
                    تم إنشاء حسابك بنجاح.
                </Text>

                <Text style={styles.description}>
                    يمكنك الآن تسجيل الدخول
                    والاستفادة من خدمات التطبيق.
                </Text>


                {/* ==================================
                    WELCOME MESSAGE
                ================================== */}

                <View style={styles.messageBox}>

                    <Ionicons
                        name="sparkles-outline"
                        size={25}
                        color={RED}
                    />

                    <Text style={styles.messageText}>
                        مرحباً بك معنا 🌷
                    </Text>

                </View>


                {/* ==================================
                    LOGIN BUTTON
                ================================== */}

                <TouchableOpacity
                    style={styles.loginButton}
                    activeOpacity={0.85}
                    onPress={handleLogin}
                >

                    <Text style={styles.loginButtonText}>
                        تسجيل الدخول
                    </Text>

                    <Ionicons
                        name="arrow-forward"
                        size={22}
                        color="#FFFFFF"
                    />

                </TouchableOpacity>


                {/* ==================================
                    BACK TO HOME / CLOSE
                ================================== */}

                <TouchableOpacity
                    style={styles.secondaryButton}
                    activeOpacity={0.7}
                    onPress={handleLogin}
                >

                    <Text style={styles.secondaryText}>
                        العودة لتسجيل الدخول
                    </Text>

                </TouchableOpacity>

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


    // ==================================
    // Background
    // ==================================

    background: {
        position: "absolute",

        top: 0,
        left: 0,
        right: 0,

        height: 280,

        backgroundColor: RED,

        overflow: "hidden",
    },

    circle1: {
        position: "absolute",

        width: 370,
        height: 370,

        borderRadius: 185,

        backgroundColor: DARK_RED,

        opacity: 0.28,

        top: -210,
        right: -110,
    },

    circle2: {
        position: "absolute",

        width: 280,
        height: 280,

        borderRadius: 140,

        backgroundColor: "#FF7180",

        opacity: 0.2,

        top: 50,
        left: -170,
    },


    // ==================================
    // Card
    // ==================================

    card: {
        position: "absolute",

        top: 145,
        bottom: 0,

        left: 20,
        right: 20,

        backgroundColor: "#FFFFFF",

        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,

        paddingHorizontal: 25,
        paddingTop: 80,

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
    // Success icon
    // ==================================

    successCircle: {
        width: 105,
        height: 105,

        borderRadius: 53,

        backgroundColor: RED,

        justifyContent: "center",
        alignItems: "center",

        marginBottom: 25,

        shadowColor: RED,

        shadowOffset: {
            width: 0,
            height: 5,
        },

        shadowOpacity: 0.25,

        shadowRadius: 10,

        elevation: 6,
    },


    // ==================================
    // Title
    // ==================================

    title: {
        fontSize: 28,

        fontWeight: "800",

        color: "#222222",

        textAlign: "center",

        writingDirection: "rtl",

        marginBottom: 15,
    },


    // ==================================
    // Description
    // ==================================

    description: {
        fontSize: 15,

        lineHeight: 25,

        color: "#777777",

        textAlign: "center",

        writingDirection: "rtl",
    },


    // ==================================
    // Message
    // ==================================

    messageBox: {
        width: "100%",

        minHeight: 65,

        backgroundColor: "#FFF2F4",

        borderRadius: 15,

        marginTop: 30,

        flexDirection: "row",

        justifyContent: "center",

        alignItems: "center",

        gap: 10,
    },

    messageText: {
        fontSize: 17,

        fontWeight: "700",

        color: RED,

        writingDirection: "rtl",
    },


    // ==================================
    // Login button
    // ==================================

    loginButton: {
        width: "90%",

        height: 52,

        backgroundColor: RED,

        borderRadius: 26,

        marginTop: 35,

        flexDirection: "row",

        alignItems: "center",

        justifyContent: "center",

        gap: 10,
    },

    loginButtonText: {
        color: "#FFFFFF",

        fontSize: 17,

        fontWeight: "700",

        writingDirection: "rtl",
    },


    // ==================================
    // Secondary button
    // ==================================

    secondaryButton: {
        marginTop: 15,

        paddingVertical: 10,
    },

    secondaryText: {
        fontSize: 14,

        color: "#999999",

        writingDirection: "rtl",
    },

});