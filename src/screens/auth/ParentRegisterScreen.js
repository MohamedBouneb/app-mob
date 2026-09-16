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
    Modal,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import Routes from "../../constants/routes";

const RED = "#F52F46";

export default function ParentRegisterScreen({ navigation }) {

    const [address, setAddress] = useState("");
    const [childLastName, setChildLastName] = useState("");
    const [childFirstName, setChildFirstName] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [relation, setRelation] = useState("");

    const [relationModal, setRelationModal] = useState(false);

    const relations = [
        "الأب",
        "الأم",
        "الوصي",
        "الوصية",
        "أخرى",
    ];


    // =========================
    // Submit
    // =========================

    const handleSubmit = () => {

        if (
            !address ||
            !childLastName ||
            !childFirstName ||
            !birthDate ||
            !relation
        ) {
            Alert.alert(
                "تنبيه",
                "يرجى ملء جميع المعلومات"
            );

            return;
        }

        console.log("Parent data:", {
            address,
            childLastName,
            childFirstName,
            birthDate,
            relation,
        });

        Alert.alert(
            "تم الحفظ",
            "تم حفظ معلوماتك بنجاح"
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

                <View style={styles.backgroundCircle1} />
                <View style={styles.backgroundCircle2} />

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


                        {/* =========================
                            BACK BUTTON
                        ========================= */}

                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => navigation.goBack()}
                            activeOpacity={0.7}
                        >
                            <Ionicons
                                name="arrow-back"
                                size={23}
                                color="#333333"
                            />
                        </TouchableOpacity>

                        {/* Top icon */}
                        <View style={styles.topIcon}>
                            <Text style={styles.familyEmoji}>
                                👨‍👩‍👧
                            </Text>
                        </View>


                        {/* Title */}

                        <Text style={styles.title}>
                            بالنسبة للوالد
                        </Text>


                        {/* =========================
                            ADDRESS
                        ========================= */}

                        <Field
                            label="العنوان"
                            icon="lock-closed-outline"
                            placeholder="أدخل عنوانك الكامل"
                            value={address}
                            onChangeText={setAddress}
                        />


                        {/* =========================
                            CHILD LAST NAME
                        ========================= */}

                        <Field
                            label="اسم الطفل"
                            icon={null}
                            placeholder="أدخل اسم عائلة الطفل"
                            value={childLastName}
                            onChangeText={setChildLastName}
                        />


                        {/* =========================
                            CHILD FIRST NAME
                        ========================= */}

                        <Field
                            label="الاسم الأول للطفل"
                            icon={null}
                            placeholder="أدخل الاسم الأول للطفل"
                            value={childFirstName}
                            onChangeText={setChildFirstName}
                        />


                        {/* =========================
                            BIRTH DATE
                        ========================= */}

                        <Field
                            label="تاريخ ميلاد الطفل"
                            icon="calendar-outline"
                            placeholder="اختر تاريخ الميلاد"
                            value={birthDate}
                            onChangeText={setBirthDate}
                            keyboardType="numeric"
                        />


                        {/* =========================
                            RELATION
                        ========================= */}

                        <Text style={styles.fieldLabel}>
                            الصلة بالطفل
                        </Text>

                        <TouchableOpacity
                            style={styles.inputContainer}
                            onPress={() =>
                                setRelationModal(true)
                            }
                            activeOpacity={0.8}
                        >

                            <Ionicons
                                name="chevron-down"
                                size={19}
                                color="#999999"
                            />

                            <Text
                                style={[
                                    styles.selectText,
                                    !relation &&
                                        styles.placeholder,
                                ]}
                            >
                                {relation ||
                                    "اختر علاقتك بالطفل (مثلاً: أب، أم، وصي)"}
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


                        {/* Bottom message */}

                        <Text style={styles.skipText}>
                            تخطي للوقت الحالي
                        </Text>

                    </View>

                </ScrollView>

            </KeyboardAvoidingView>


            {/* =========================
                RELATION MODAL
            ========================= */}

            <Modal
                visible={relationModal}
                transparent
                animationType="fade"
                onRequestClose={() =>
                    setRelationModal(false)
                }
            >

                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() =>
                        setRelationModal(false)
                    }
                >

                    <View style={styles.modalContainer}>

                        <Text style={styles.modalTitle}>
                            اختر الصلة بالطفل
                        </Text>

                        {relations.map((item) => (

                            <TouchableOpacity
                                key={item}
                                style={styles.relationItem}
                                onPress={() => {
                                    setRelation(item);
                                    setRelationModal(false);
                                }}
                            >

                                <Text style={styles.relationText}>
                                    {item}
                                </Text>

                            </TouchableOpacity>

                        ))}

                    </View>

                </TouchableOpacity>

            </Modal>

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

                {icon && (
                    <Ionicons
                        name={icon}
                        size={19}
                        color="#E4A0A7"
                    />
                )}

                <TextInput
                    style={styles.input}
                    placeholder={placeholder}
                    placeholderTextColor="#999999"
                    value={value}
                    onChangeText={onChangeText}
                    keyboardType={keyboardType}
                    textAlign="right"
                />

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

    backgroundCircle1: {
        position: "absolute",
        width: 350,
        height: 350,
        borderRadius: 175,
        backgroundColor: "#D91F3A",
        opacity: 0.3,
        top: -200,
        right: -100,
    },

    backgroundCircle2: {
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

        minHeight: 650,

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

    familyEmoji: {
        fontSize: 38,
    },

    title: {
        fontSize: 26,
        fontWeight: "800",
        color: "#222222",

        marginTop: 8,
        marginBottom: 12,

        textAlign: "center",
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

    selectText: {
        flex: 1,

        fontSize: 12.5,

        color: "#333333",

        textAlign: "right",
        writingDirection: "rtl",

        marginLeft: 8,
    },

    placeholder: {
        color: "#999999",
    },

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
    // Modal
    // =========================

    modalOverlay: {
        flex: 1,

        backgroundColor: "rgba(0,0,0,0.4)",

        justifyContent: "center",
        alignItems: "center",
    },

    modalContainer: {
        width: "85%",

        backgroundColor: "#FFFFFF",

        borderRadius: 20,

        padding: 20,
    },

    modalTitle: {
        fontSize: 20,
        fontWeight: "700",

        textAlign: "center",

        marginBottom: 15,

        writingDirection: "rtl",
    },

    relationItem: {
        paddingVertical: 14,

        borderBottomWidth: 1,
        borderBottomColor: "#EEEEEE",
    },

    relationText: {
        fontSize: 16,

        color: "#333333",

        textAlign: "center",

        writingDirection: "rtl",
    },
});