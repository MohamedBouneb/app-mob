import React, { useState } from "react";

import {
    View,
    Text,
    Image,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from "react-native";

import {
    Ionicons,
    FontAwesome,
} from "@expo/vector-icons";

import { useAuth } from "../../context/AuthContext";
import Routes from "../../constants/routes";


export default function LoginScreen({ navigation }) {

    const { login } = useAuth();

    // ==============================
    // STATES
    // ==============================

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);


    // ==============================
    // LOGIN
    // ==============================

    const handleLogin = () => {

        console.log("Email :", email);
        console.log("Password :", password);
        console.log("Remember :", rememberMe);

        // Fake login pour le moment
        login(
            {
                id: 1,
                name: "Mohamed",
                email: email || "mohamed@gmail.com",
                role: "ADMIN",
            },
            "fake-jwt-token"
        );
    };


    // ==============================
    // INTERFACE
    // ==============================

    return (

        <KeyboardAvoidingView
            style={styles.screen}
            behavior={
                Platform.OS === "ios"
                    ? "padding"
                    : undefined
            }
        >

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >

                {/* ==============================
                    BACKGROUND
                ============================== */}

                <View style={styles.backgroundShape1} />
                <View style={styles.backgroundShape2} />
                <View style={styles.backgroundShape3} />


                {/* ==============================
                    WHITE CARD
                ============================== */}

                <View style={styles.card}>


                    {/* ==============================
                        PHOTO GRID
                    ============================== */}

                    <View style={styles.photoGrid}>

                        {/* Grande image */}

                        <Image
                            source={require(
                                "../../assets/images/login/login-1.png"
                            )}
                            style={styles.photoLarge}
                        />


                        {/* Petite image haut droite */}

                        <Image
                            source={require(
                                "../../assets/images/login/login-2.png"
                            )}
                            style={styles.photoSmallTop}
                        />


                        {/* Petite image bas gauche */}

                        <Image
                            source={require(
                                "../../assets/images/login/login-3.png"
                            )}
                            style={styles.photoSmallLeft}
                        />


                        {/* Image centrale */}

                        <Image
                            source={require(
                                "../../assets/images/login/login-4.png"
                            )}
                            style={styles.photoCenter}
                        />


                        {/* Image droite */}

                        <Image
                            source={require(
                                "../../assets/images/login/login-5.png"
                            )}
                            style={styles.photoRight}
                        />

                    </View>


                    {/* ==============================
                        TITRE
                    ============================== */}

                    <Text style={styles.title}>
                        أهلاً بك مجدداً
                    </Text>


                    <Text style={styles.subtitle}>
                        يرجى تسجيل الدخول للوصول إلى حسابك.
                    </Text>


                    {/* ==============================
                        EMAIL
                    ============================== */}

                    <View style={styles.inputContainer}>

                        <Ionicons
                            name="mail-outline"
                            size={21}
                            color="#777"
                            style={styles.inputIcon}
                        />


                        <TextInput
                            value={email}
                            onChangeText={setEmail}
                            placeholder="أدخل بريدك الإلكتروني"
                            placeholderTextColor="#777"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            textAlign="right"
                            style={styles.input}
                        />

                    </View>


                    {/* ==============================
                        PASSWORD
                    ============================== */}

                    <View style={styles.inputContainer}>

                        <TouchableOpacity
                            onPress={() =>
                                setShowPassword(!showPassword)
                            }
                            style={styles.passwordIcon}
                        >

                            <Ionicons
                                name={
                                    showPassword
                                        ? "eye-outline"
                                        : "eye-off-outline"
                                }
                                size={21}
                                color="#777"
                            />

                        </TouchableOpacity>


                        <TextInput
                            value={password}
                            onChangeText={setPassword}
                            placeholder="كلمة المرور"
                            placeholderTextColor="#777"
                            secureTextEntry={!showPassword}
                            textAlign="right"
                            style={styles.input}
                        />

                    </View>


                    {/* ==============================
                        REMEMBER / FORGOT
                    ============================== */}

                    <View style={styles.optionsRow}>


                        {/* Forgot password */}

                        <TouchableOpacity>

                            <Text style={styles.forgotPassword}>
                                نسيت كلمة المرور؟
                            </Text>

                        </TouchableOpacity>


                        {/* Remember me */}

                        <TouchableOpacity
                            style={styles.rememberContainer}
                            onPress={() =>
                                setRememberMe(!rememberMe)
                            }
                        >

                            <Text style={styles.rememberText}>
                                تذكرني
                            </Text>


                            <View
                                style={[
                                    styles.checkbox,
                                    rememberMe &&
                                    styles.checkboxActive,
                                ]}
                            >

                                {rememberMe && (

                                    <Ionicons
                                        name="checkmark"
                                        size={13}
                                        color="#FFFFFF"
                                    />

                                )}

                            </View>

                        </TouchableOpacity>

                    </View>


                    {/* ==============================
                        SEPARATOR
                    ============================== */}

                    <View style={styles.separatorContainer}>

                        <View style={styles.separator} />

                        <Text style={styles.separatorText}>
                            أو سجل الدخول باستخدام
                        </Text>

                        <View style={styles.separator} />

                    </View>


                    {/* ==============================
                        SOCIAL LOGIN
                    ============================== */}

                    <View style={styles.socialContainer}>


                        {/* Google */}

                        <TouchableOpacity
                            style={styles.socialButton}
                        >

                            <Text style={styles.googleG}>
                                G
                            </Text>

                        </TouchableOpacity>


                        {/* Facebook */}

                        <TouchableOpacity
                            style={styles.socialButton}
                        >

                            <FontAwesome
                                name="facebook"
                                size={30}
                                color="#1877F2"
                            />

                        </TouchableOpacity>

                    </View>


                    {/* ==============================
                        LOGIN BUTTON
                    ============================== */}

                    <TouchableOpacity
                        style={styles.loginButton}
                        onPress={handleLogin}
                        activeOpacity={0.8}
                    >

                        <View style={styles.loginCircle} />

                        <Text style={styles.loginButtonText}>
                            تسجيل الدخول
                        </Text>

                        <View style={styles.loginDecoration} />

                    </TouchableOpacity>


                    {/* ==============================
                        REGISTER
                    ============================== */}

                    <View style={styles.registerContainer}>

                        <Text style={styles.registerText}>
                            ليس لديك حساب؟
                        </Text>


                        <TouchableOpacity
                            onPress={() =>
                                navigation.navigate(
                                    Routes.REGISTER
                                )
                            }
                        >

                            <Text style={styles.registerLink}>
                                سجل الآن
                            </Text>

                        </TouchableOpacity>

                    </View>


                </View>

            </ScrollView>

        </KeyboardAvoidingView>

    );
}


// ==================================================
// STYLES
// ==================================================

const styles = StyleSheet.create({

    // ==============================
    // SCREEN
    // ==============================

    screen: {
        flex: 1,
        backgroundColor: "#F52F46",
    },


    scrollContent: {
        flexGrow: 1,
        justifyContent: "center",
        paddingVertical: 14,
        paddingHorizontal: 8,
    },


    // ==============================
    // BACKGROUND
    // ==============================

    backgroundShape1: {
        position: "absolute",

        width: 450,
        height: 260,

        backgroundColor: "#D91F38",

        top: 90,
        left: -100,

        borderRadius: 180,

        transform: [
            {
                rotate: "-8deg",
            },
        ],
    },


    backgroundShape2: {
        position: "absolute",

        width: 430,
        height: 250,

        backgroundColor: "#E5253E",

        top: 300,
        right: -150,

        borderRadius: 180,

        transform: [
            {
                rotate: "10deg",
            },
        ],
    },


    backgroundShape3: {
        position: "absolute",

        width: 500,
        height: 250,

        backgroundColor: "#D91F38",

        bottom: 100,
        left: -200,

        borderRadius: 180,

        transform: [
            {
                rotate: "-15deg",
            },
        ],
    },


    // ==============================
    // WHITE CARD
    // ==============================

    card: {
        width: "100%",

        minHeight: 730,

        backgroundColor: "#FFFFFF",

        borderRadius: 32,

        paddingHorizontal: 16,
        paddingTop: 70,
        paddingBottom: 28,

        alignItems: "center",

        overflow: "hidden",
    },


    // ==============================
    // PHOTO GRID
    // ==============================

    photoGrid: {
        width: 245,
        height: 165,

        position: "relative",

        marginBottom: 14,
    },


    photoLarge: {
        position: "absolute",

        left: 0,
        top: 0,

        width: 157,
        height: 67,

        borderRadius: 9,
    },


    photoSmallTop: {
        position: "absolute",

        right: 0,
        top: 0,

        width: 76,
        height: 38,

        borderRadius: 8,
    },


    photoSmallLeft: {
        position: "absolute",

        left: 0,
        bottom: 0,

        width: 64,
        height: 80,

        borderRadius: 8,
    },


    photoCenter: {
        position: "absolute",

        left: 72,
        bottom: 0,

        width: 87,
        height: 80,

        borderRadius: 8,
    },


    photoRight: {
        position: "absolute",

        right: 0,
        bottom: 0,

        width: 76,
        height: 116,

        borderRadius: 8,
    },


    // ==============================
    // TITLES
    // ==============================

    title: {
        fontSize: 30,

        color: "#111111",

        fontWeight: "500",

        textAlign: "center",

        writingDirection: "rtl",

        marginTop: 0,
    },


    subtitle: {
        fontSize: 13,

        color: "#777777",

        textAlign: "center",

        writingDirection: "rtl",

        marginTop: 6,

        marginBottom: 24,
    },


    // ==============================
    // INPUTS
    // ==============================

    inputContainer: {
        width: "92%",
        height: 46,

        backgroundColor: "#FFE9B3",

        borderRadius: 9,

        flexDirection: "row",

        alignItems: "center",

        marginBottom: 10,

        paddingHorizontal: 12,
    },


    input: {
        flex: 1,

        height: "100%",

        fontSize: 13,

        color: "#333333",

        writingDirection: "rtl",

        paddingHorizontal: 8,
    },


    inputIcon: {
        marginRight: 4,
    },


    passwordIcon: {
        padding: 3,
    },


    // ==============================
    // OPTIONS
    // ==============================

    optionsRow: {
        width: "92%",

        flexDirection: "row",

        justifyContent: "space-between",

        alignItems: "center",

        marginTop: 1,

        marginBottom: 35,
    },


    forgotPassword: {
        color: "#F52F46",

        fontSize: 10,

        writingDirection: "rtl",
    },


    rememberContainer: {
        flexDirection: "row",

        alignItems: "center",

        gap: 5,
    },


    rememberText: {
        color: "#333333",

        fontSize: 10,

        writingDirection: "rtl",
    },


    checkbox: {
        width: 12,
        height: 12,

        borderWidth: 1,

        borderColor: "#BBBBBB",

        borderRadius: 2,

        justifyContent: "center",

        alignItems: "center",
    },


    checkboxActive: {
        backgroundColor: "#F52F46",

        borderColor: "#F52F46",
    },


    // ==============================
    // SEPARATOR
    // ==============================

    separatorContainer: {
        width: "82%",

        flexDirection: "row",

        alignItems: "center",

        justifyContent: "center",

        marginBottom: 17,
    },


    separator: {
        flex: 1,

        height: 1,

        backgroundColor: "#AAAAAA",
    },


    separatorText: {
        fontSize: 9,

        color: "#444444",

        marginHorizontal: 10,

        writingDirection: "rtl",
    },


    // ==============================
    // SOCIAL
    // ==============================

    socialContainer: {
        flexDirection: "row",

        justifyContent: "center",

        alignItems: "center",

        gap: 24,

        marginBottom: 35,
    },


    socialButton: {
        width: 38,
        height: 38,

        justifyContent: "center",

        alignItems: "center",
    },


    googleG: {
        fontSize: 28,

        fontWeight: "bold",

        color: "#4285F4",
    },


    // ==============================
    // LOGIN BUTTON
    // ==============================

    loginButton: {
        width: 190,
        height: 39,

        borderRadius: 22,

        backgroundColor: "#FF6B83",

        justifyContent: "center",

        alignItems: "center",

        position: "relative",

        overflow: "hidden",

        shadowColor: "#4FC3F7",

        shadowOffset: {
            width: 0,
            height: 10,
        },

        shadowOpacity: 0.25,

        shadowRadius: 14,

        elevation: 5,

        marginBottom: 35,
    },


    loginButtonText: {
        color: "#FFFFFF",

        fontSize: 17,

        fontWeight: "bold",

        writingDirection: "rtl",

        zIndex: 2,
    },


    loginCircle: {
        position: "absolute",

        left: 10,

        width: 22,
        height: 22,

        borderWidth: 2,

        borderColor: "#FFFFFF",

        borderRadius: 20,

        zIndex: 3,
    },


    loginDecoration: {
        position: "absolute",

        right: -20,
        bottom: -20,

        width: 70,
        height: 60,

        backgroundColor: "#FF8094",

        borderRadius: 40,
    },


    // ==============================
    // REGISTER
    // ==============================

    registerContainer: {
        flexDirection: "row",

        alignItems: "center",

        justifyContent: "center",

        gap: 4,
    },


    registerText: {
        color: "#222222",

        fontSize: 12,

        writingDirection: "rtl",
    },


    registerLink: {
        color: "#F52F46",

        fontSize: 12,

        writingDirection: "rtl",
    },

});