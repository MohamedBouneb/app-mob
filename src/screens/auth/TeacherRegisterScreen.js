import React, { useState } from "react";

import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";

const RED = "#F52F46";

export default function TeacherRegisterScreen({ navigation }) {

    const [address, setAddress] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [diploma, setDiploma] = useState("");
    const [experience, setExperience] = useState("");

    const [cv, setCv] = useState(null);


    // =========================
    // Select CV
    // =========================

    const handlePickCV = async () => {

        try {

            const result =
                await DocumentPicker.getDocumentAsync({
                    type: [
                        "application/pdf",
                        "application/msword",
                        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                    ],
                    copyToCacheDirectory: true,
                });

            if (
                !result.canceled &&
                result.assets &&
                result.assets.length > 0
            ) {
                setCv(result.assets[0]);
            }

        } catch (error) {

            console.log(
                "Erreur sélection CV:",
                error
            );

            Alert.alert(
                "Erreur",
                "Impossible de sélectionner le CV."
            );
        }
    };


    // =========================
    // Submit
    // =========================

    const handleSubmit = () => {

        if (
            !address ||
            !birthDate ||
            !diploma ||
            !experience
        ) {

            Alert.alert(
                "تنبيه",
                "يرجى ملء جميع المعلومات المطلوبة"
            );

            return;
        }

        console.log("Teacher data:", {
            address,
            birthDate,
            diploma,
            experience,
            cv,
        });

        Alert.alert(
            "تم الحفظ",
            "تم حفظ معلوماتك. سيتم مراجعة طلبك من طرف الإدارة."
        );
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

            <View style={styles.background}>

                <View style={styles.circle1} />
                <View style={styles.circle2} />

            </View>


            <KeyboardAvoidingView
                style={styles.keyboard}
                behavior={
                    Platform.OS === "ios"
                        ? "padding"
                        : undefined
                }
            >

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >

                    {/* =========================
                        WHITE CARD
                    ========================= */}

                    <View style={styles.card}>

                        {/* Teacher icon */}

                        <View style={styles.topIcon}>
                            <Text style={styles.teacherEmoji}>
                                👩‍🏫
                            </Text>
                        </View>


                        {/* =========================
                            TITLE
                        ========================= */}

                        <Text style={styles.title}>
                            بالنسبة للمنشّطة/ة
                        </Text>

                        <Text style={styles.profileTitle}>
                            لمحة عن الملف الشخصي
                        </Text>

                       

                        {/* =========================
                            ADDRESS
                        ========================= */}

                        <Field
                            label="العنوان"
                            icon="location-outline"
                            placeholder=""
                            value={address}
                            onChangeText={setAddress}
                        />


                        {/* =========================
                            BIRTH DATE
                        ========================= */}

                        <Field
                            label="تاريخ الميلاد"
                            icon="calendar-outline"
                            placeholder="تاريخ الميلاد"
                            value={birthDate}
                            onChangeText={setBirthDate}
                            keyboardType="numeric"
                        />


                        {/* =========================
                            DIPLOMA
                        ========================= */}

                        <Field
                            label="الدبلوم / المؤهل"
                            icon="school-outline"
                            placeholder=""
                            value={diploma}
                            onChangeText={setDiploma}
                        />


                        {/* =========================
                            EXPERIENCE
                        ========================= */}

                        <Field
                            label="الخبرة المهنية"
                            icon="briefcase-outline"
                            placeholder="سنوات الخبرة"
                            value={experience}
                            onChangeText={setExperience}
                            keyboardType="numeric"
                        />


                        {/* =========================
                            CV
                        ========================= */}

                        <Text style={styles.fieldLabel}>
                            اختياري: سيرة ذاتية / مستند داعم
                        </Text>

                        <TouchableOpacity
                            style={styles.cvContainer}
                            onPress={handlePickCV}
                            activeOpacity={0.8}
                        >

                            <Ionicons
                                name={
                                    cv
                                        ? "checkmark-circle"
                                        : "cloud-upload-outline"
                                }
                                size={21}
                                color={
                                    cv
                                        ? "#55A868"
                                        : "#E4A0A7"
                                }
                            />

                            <Text
                                style={[
                                    styles.cvText,
                                    !cv &&
                                        styles.cvPlaceholder,
                                ]}
                                numberOfLines={1}
                            >
                                {cv
                                    ? cv.name
                                    : ""}
                            </Text>

                        </TouchableOpacity>


                        {/* =========================
                            BUTTON
                        ========================= */}

                        <TouchableOpacity
                            style={styles.submitButton}
                            onPress={handleSubmit}
                            activeOpacity={0.85}
                        >

                            <Text style={styles.submitText}>
                                حفظ ومتابعة
                            </Text>

                            <Ionicons
                                name="arrow-forward"
                                size={21}
                                color="#FFFFFF"
                            />

                        </TouchableOpacity>


                        {/* =========================
                            SKIP
                        ========================= */}

                        <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        activeOpacity={0.7}
                                        >
                                <Text style={styles.skipText}>
                                   تخطي للوقت الحالي
                               </Text>
                        </TouchableOpacity>


                        {/* =========================
                            ADMIN INFO
                        ========================= */}

                        <View style={styles.infoBox}>

                            <Ionicons
                                name="information-circle-outline"
                                size={20}
                                color={RED}
                            />

                            <Text style={styles.infoText}>
                                سيتم مراجعة ملفك من طرف الإدارة
                                قبل تفعيل الحساب.
                            </Text>

                        </View>

                    </View>

                </ScrollView>

            </KeyboardAvoidingView>

        </SafeAreaView>
    );
}


// ======================================================
// FIELD COMPONENT
// ======================================================

function Field({
    label,
    icon,
    placeholder,
    value,
    onChangeText,
    keyboardType,
}) {
    return (
        <View style={styles.field}>

            <Text style={styles.fieldLabel}>
                {label}
            </Text>

            <View style={styles.inputContainer}>

                <TextInput
                    style={styles.input}
                    placeholder={placeholder}
                    placeholderTextColor="#999999"
                    value={value}
                    onChangeText={onChangeText}
                    keyboardType={keyboardType}
                    textAlign="right"
                />

                {icon && (
                    <Ionicons
                        name={icon}
                        size={19}
                        color="#E4A0A7"
                    />
                )}

            </View>

        </View>
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

    keyboard: {
        flex: 1,
    },

    background: {
        position: "absolute",

        top: 0,
        left: 0,
        right: 0,

        height: 230,

        backgroundColor: RED,

        overflow: "hidden",
    },

    circle1: {
        position: "absolute",

        width: 350,
        height: 350,

        borderRadius: 175,

        backgroundColor: "#D91F3A",

        opacity: 0.3,

        top: -200,
        right: -100,
    },

    circle2: {
        position: "absolute",

        width: 280,
        height: 280,

        borderRadius: 140,

        backgroundColor: "#FF6372",

        opacity: 0.2,

        top: 30,
        left: -150,
    },

    scrollContent: {
        paddingTop: 105,
        paddingHorizontal: 20,
        paddingBottom: 30,
    },

    card: {
        backgroundColor: "#FFFFFF",

        borderTopLeftRadius: 38,
        borderTopRightRadius: 38,

        paddingHorizontal: 20,
        paddingTop: 15,
        paddingBottom: 25,

        minHeight: 680,

        alignItems: "center",
    },

    topIcon: {
        width: 66,
        height: 66,

        borderRadius: 33,

        backgroundColor: "#FFFFFF",

        justifyContent: "center",
        alignItems: "center",

        marginTop: -48,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 5,

        elevation: 4,
    },

    teacherEmoji: {
        fontSize: 40,
    },

    title: {
        fontSize: 24,

        fontWeight: "800",

        color: "#222222",

        marginTop: 7,

        textAlign: "center",

        writingDirection: "rtl",
    },

    profileTitle: {
        fontSize: 24,

        fontWeight: "800",

        color: "#222222",

        textAlign: "center",

        writingDirection: "rtl",
    },

    introText: {
        fontSize: 14,

        color: "#333333",

        fontWeight: "600",

        marginTop: 3,
        marginBottom: 10,

        textAlign: "right",

        width: "100%",

        writingDirection: "rtl",
    },

    field: {
        width: "100%",

        marginBottom: 7,
    },

    fieldLabel: {
        width: "100%",

        fontSize: 14,

        fontWeight: "700",

        color: "#222222",

        marginBottom: 4,

        textAlign: "right",

        writingDirection: "rtl",
    },

    inputContainer: {
        width: "100%",

        minHeight: 40,

        borderWidth: 1,

        borderColor: "#E8C3C7",

        borderRadius: 8,

        backgroundColor: "#FFFDFD",

        flexDirection: "row",

        alignItems: "center",

        paddingHorizontal: 10,
    },

    input: {
        flex: 1,

        height: 40,

        fontSize: 13,

        color: "#333333",

        writingDirection: "rtl",
    },

    // =========================
    // CV
    // =========================

    cvContainer: {
        width: "100%",

        minHeight: 40,

        borderWidth: 1,

        borderColor: "#E8C3C7",

        borderRadius: 8,

        backgroundColor: "#FFFDFD",

        flexDirection: "row",

        alignItems: "center",

        paddingHorizontal: 10,
    },

    cvText: {
        flex: 1,

        marginLeft: 8,

        fontSize: 12,

        color: "#555555",

        textAlign: "right",

        writingDirection: "rtl",
    },

    cvPlaceholder: {
        color: "#999999",
    },

    // =========================
    // Submit
    // =========================

    submitButton: {
        width: "80%",

        height: 47,

        backgroundColor: RED,

        borderRadius: 24,

        marginTop: 10,

        flexDirection: "row",

        alignItems: "center",

        justifyContent: "center",

        gap: 8,
    },

    submitText: {
        color: "#FFFFFF",

        fontSize: 16,

        fontWeight: "700",

        writingDirection: "rtl",
    },

    skipText: {
        fontSize: 13,

        color: "#E69BA3",

        marginTop: 8,

        writingDirection: "rtl",
    },

    // =========================
    // Admin information
    // =========================

    infoBox: {
        width: "100%",

        flexDirection: "row",

        alignItems: "center",

        backgroundColor: "#FFF3F4",

        borderRadius: 10,

        padding: 10,

        marginTop: 15,
    },

    infoText: {
        flex: 1,

        fontSize: 11,

        color: "#777777",

        marginLeft: 7,

        textAlign: "right",

        writingDirection: "rtl",
    },
});