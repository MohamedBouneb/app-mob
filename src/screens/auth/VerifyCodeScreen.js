import React, { useEffect, useRef, useState } from "react";

import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import Routes from "../../constants/routes";


export default function VerifyCodeScreen({ navigation, route }) {

    // ==========================================
    // CODE
    // ==========================================

    const [code, setCode] = useState(["", "", "", ""]);

    const [seconds, setSeconds] = useState(30);

    const inputRefs = useRef([]);


    // Email reçu depuis l'écran précédent
    const email = route?.params?.email || "بريدك الإلكتروني";


    // ==========================================
    // COMPTEUR
    // ==========================================

    useEffect(() => {

        if (seconds <= 0) {
            return;
        }

        const timer = setInterval(() => {

            setSeconds((prev) => prev - 1);

        }, 1000);


        return () => clearInterval(timer);

    }, [seconds]);


    // ==========================================
    // CHANGEMENT DU CODE
    // ==========================================

    const handleCodeChange = (value, index) => {

        // Garder seulement un chiffre
        const digit = value.replace(/[^0-9]/g, "");

        const newCode = [...code];

        newCode[index] = digit;

        setCode(newCode);


        // Passer automatiquement à la case suivante
        if (digit && index < 3) {

            inputRefs.current[index + 1]?.focus();

        }

    };


    // ==========================================
    // RETOUR AVEC BACKSPACE
    // ==========================================

    const handleKeyPress = ({ nativeEvent }, index) => {

        if (
            nativeEvent.key === "Backspace" &&
            code[index] === "" &&
            index > 0
        ) {

            inputRefs.current[index - 1]?.focus();

        }

    };


    // ==========================================
    // RENVOYER LE CODE
    // ==========================================

    const handleResend = () => {

        if (seconds > 0) {
            return;
        }


        console.log("📩 Nouveau code envoyé à :", email);

        setSeconds(30);

        setCode(["", "", "", ""]);

        inputRefs.current[0]?.focus();

    };


    // ==========================================
    // VÉRIFICATION
    // ==========================================

    const handleVerify = () => {

        const verificationCode = code.join("");

        console.log(
            "🔐 Code de vérification :",
            verificationCode
        );


        if (verificationCode.length !== 4) {

            console.log(
                "⚠️ Veuillez entrer les 4 chiffres"
            );

            return;
        }


        // ======================================
        // POUR LE MOMENT : FAKE VERIFICATION
        // ======================================

        console.log("✅ Code vérifié");


        /*
            Ici tu peux plus tard appeler ton API :

            await verifyCode(email, verificationCode);

        */


        // Exemple :
        // navigation.navigate(Routes.HOME);

    };


    // ==========================================
    // INTERFACE
    // ==========================================

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

                contentContainerStyle={styles.scrollContainer}

                showsVerticalScrollIndicator={false}

                keyboardShouldPersistTaps="handled"

            >

                <View style={styles.card}>


                    {/* =================================
                        BOUTON RETOUR
                    ================================= */}

                    <TouchableOpacity

                        style={styles.backButton}

                        onPress={() => navigation.goBack()}

                        activeOpacity={0.7}

                    >

                        <Ionicons
                            name="chevron-back"
                            size={38}
                            color="#111111"
                        />

                    </TouchableOpacity>


                    {/* =================================
                        CONTENU
                    ================================= */}

                    <View style={styles.content}>


                        {/* TITRE */}

                        <Text style={styles.title}>

                            إدخال رمز التحقق

                        </Text>


                        {/* DESCRIPTION */}

                        <Text style={styles.subtitle}>

                            أرسلنا رمز التحقق إلى بريدك

                            {"\n"}

                            الإلكتروني

                        </Text>


                        {/* =================================
                            CODE INPUTS
                        ================================= */}

                        <View style={styles.codeContainer}>

                            {code.map((digit, index) => (

                                <TextInput

                                    key={index}

                                    ref={(ref) => {
                                        inputRefs.current[index] = ref;
                                    }}

                                    style={styles.codeInput}

                                    value={digit}

                                    onChangeText={(value) =>
                                        handleCodeChange(
                                            value,
                                            index
                                        )
                                    }

                                    onKeyPress={(event) =>
                                        handleKeyPress(
                                            event,
                                            index
                                        )
                                    }

                                    keyboardType="number-pad"

                                    maxLength={1}

                                    textAlign="center"

                                    selectionColor="#F52F46"

                                />

                            ))}

                        </View>


                        {/* =================================
                            RESEND
                        ================================= */}

                        <View style={styles.resendContainer}>

                            <TouchableOpacity

                                onPress={handleResend}

                                disabled={seconds > 0}

                            >

                                <Text
                                    style={[
                                        styles.resendText,

                                        seconds > 0 &&
                                        styles.resendDisabled
                                    ]}
                                >

                                    لم يصلك الرمز؟

                                    {" "}

                                    <Text style={styles.resendActive}>

                                        إعادة الإرسال

                                    </Text>

                                </Text>

                            </TouchableOpacity>


                            <Text style={styles.timerText}>

                                طلب رمز جديد خلال {seconds} ثانية

                            </Text>

                        </View>


                        {/* =================================
                            VERIFY BUTTON
                        ================================= */}

                        <TouchableOpacity

                            style={styles.verifyButton}

                            onPress={handleVerify}

                            activeOpacity={0.8}

                        >

                            {/* Cercle gauche */}

                            <View style={styles.buttonCircle} />


                            <Text style={styles.verifyButtonText}>

                                التحقق والمتابعة

                            </Text>


                            {/* Décoration droite */}

                            <View
                                style={styles.buttonDecoration}
                            />

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

    // ==========================================
    // SCREEN
    // ==========================================

    screen: {

        flex: 1,

        backgroundColor: "#242424",

    },


    // ==========================================
    // SCROLL
    // ==========================================

    scrollContainer: {

        flexGrow: 1,

        justifyContent: "center",

        alignItems: "center",

        paddingVertical: 15,

    },


    // ==========================================
    // CARD
    // ==========================================

    card: {

        width: "90%",

        minHeight: 740,

        backgroundColor: "#FFFFFF",

        borderRadius: 32,

        overflow: "hidden",

        position: "relative",

    },


    // ==========================================
    // BACK BUTTON
    // ==========================================

    backButton: {

        position: "absolute",

        top: 55,

        left: 15,

        zIndex: 10,

        width: 45,

        height: 45,

        justifyContent: "center",

        alignItems: "center",

    },


    // ==========================================
    // CONTENT
    // ==========================================

    content: {

        flex: 1,

        alignItems: "center",

        paddingTop: 125,

        paddingHorizontal: 18,

    },


    // ==========================================
    // TITLE
    // ==========================================

    title: {

        width: "100%",

        color: "#111111",

        fontSize: 32,

        fontWeight: "400",

        textAlign: "right",

        writingDirection: "rtl",

        marginBottom: 5,

    },


    // ==========================================
    // SUBTITLE
    // ==========================================

    subtitle: {

        width: "100%",

        color: "#777777",

        fontSize: 17,

        lineHeight: 29,

        fontWeight: "400",

        textAlign: "right",

        writingDirection: "rtl",

        marginBottom: 45,

    },


    // ==========================================
    // CODE
    // ==========================================

    codeContainer: {

        width: "100%",

        flexDirection: "row",

        justifyContent: "space-between",

        alignItems: "center",

        paddingHorizontal: 0,

        direction: "ltr",

    },


    codeInput: {

        width: 70,

        height: 74,

        backgroundColor: "#FFE9B3",

        borderRadius: 10,

        fontSize: 22,

        color: "#555555",

        textAlign: "center",

        borderWidth: 0,

    },


    // ==========================================
    // RESEND
    // ==========================================

    resendContainer: {

        width: "100%",

        alignItems: "center",

        marginTop: 67,

    },


    resendText: {

        fontSize: 12,

        color: "#222222",

        textAlign: "center",

        writingDirection: "rtl",

    },


    resendActive: {

        color: "#F52F46",

        fontWeight: "500",

    },


    resendDisabled: {

        color: "#222222",

    },


    timerText: {

        fontSize: 11,

        color: "#777777",

        marginTop: 5,

        textAlign: "center",

        writingDirection: "rtl",

    },


    // ==========================================
    // VERIFY BUTTON
    // ==========================================

    verifyButton: {

        width: 210,

        height: 39,

        backgroundColor: "#FF6F87",

        borderRadius: 22,

        marginTop: 135,

        justifyContent: "center",

        alignItems: "center",

        position: "relative",

        overflow: "hidden",

        shadowColor: "#65C9E8",

        shadowOffset: {

            width: 0,

            height: 10,

        },

        shadowOpacity: 0.30,

        shadowRadius: 12,

        elevation: 5,

    },


    verifyButtonText: {

        color: "#FFFFFF",

        fontSize: 17,

        fontWeight: "700",

        writingDirection: "rtl",

        zIndex: 2,

    },


    // ==========================================
    // CERCLE GAUCHE
    // ==========================================

    buttonCircle: {

        position: "absolute",

        left: 12,

        width: 21,

        height: 21,

        borderRadius: 20,

        borderWidth: 2,

        borderColor: "#FFFFFF",

        zIndex: 3,

    },


    // ==========================================
    // DECORATION DROITE
    // ==========================================

    buttonDecoration: {

        position: "absolute",

        right: -8,

        bottom: -8,

        width: 55,

        height: 35,

        borderRadius: 30,

        backgroundColor: "#F57C91",

    },

});