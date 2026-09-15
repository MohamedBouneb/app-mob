import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Routes from "../../constants/routes";

export default function RoleSelectionScreen({ navigation }) {

    const handleParent = () => {
        navigation.navigate(Routes.PARENT_REGISTER);
    };

    const handleTeacher = () => {
        navigation.navigate(Routes.TEACHER_REGISTER);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>

                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons
                            name="arrow-back"
                            size={24}
                            color="#333"
                        />
                    </TouchableOpacity>

                    <Text style={styles.title}>
                        إنشاء حساب
                    </Text>

                    <View style={styles.emptySpace} />
                </View>

                {/* Question */}
                <View style={styles.intro}>
                    <Text style={styles.mainTitle}>
                        اختر نوع الحساب
                    </Text>

                    <Text style={styles.subtitle}>
                        اختر نوع الحساب المناسب للمتابعة
                    </Text>
                </View>

                {/* Parent */}
                <TouchableOpacity
                    style={styles.roleCard}
                    activeOpacity={0.8}
                    onPress={handleParent}
                >
                    <View style={styles.iconContainer}>
                        <Ionicons
                            name="people"
                            size={42}
                            color="#F52F46"
                        />
                    </View>

                    <View style={styles.textContainer}>
                        <Text style={styles.roleTitle}>
                            وليّ أمر
                        </Text>

                        <Text style={styles.roleDescription}>
                            تابع أنشطة طفلك وتواصل مع الروضة بسهولة
                        </Text>
                    </View>

                    <Ionicons
                        name="chevron-forward"
                        size={24}
                        color="#999"
                    />
                </TouchableOpacity>

                {/* Teacher */}
                <TouchableOpacity
                    style={styles.roleCard}
                    activeOpacity={0.8}
                    onPress={handleTeacher}
                >
                    <View style={styles.iconContainer}>
                        <Ionicons
                            name="school"
                            size={42}
                            color="#F52F46"
                        />
                    </View>

                    <View style={styles.textContainer}>
                        <Text style={styles.roleTitle}>
                            منشّطة
                        </Text>

                        <Text style={styles.roleDescription}>
                            أنشئي الأنشطة وتابعي تعلم الأطفال
                        </Text>
                    </View>

                    <Ionicons
                        name="chevron-forward"
                        size={24}
                        color="#999"
                    />
                </TouchableOpacity>

            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },

    content: {
        flex: 1,
        paddingHorizontal: 24,
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 15,
    },

    backButton: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: "#F5F5F5",
        justifyContent: "center",
        alignItems: "center",
    },

    emptySpace: {
        width: 42,
    },

    title: {
        fontSize: 20,
        fontWeight: "700",
        color: "#222",
    },

    intro: {
        alignItems: "center",
        marginTop: 55,
        marginBottom: 35,
    },

    mainTitle: {
        fontSize: 28,
        fontWeight: "700",
        color: "#222",
        textAlign: "center",
    },

    subtitle: {
        fontSize: 15,
        color: "#777",
        marginTop: 10,
        textAlign: "center",
    },

    roleCard: {
        minHeight: 125,
        borderWidth: 1,
        borderColor: "#EEEEEE",
        borderRadius: 22,
        marginBottom: 20,
        paddingHorizontal: 18,
        paddingVertical: 20,

        flexDirection: "row",
        alignItems: "center",

        backgroundColor: "#FFFFFF",

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.08,
        shadowRadius: 8,

        elevation: 3,
    },

    iconContainer: {
        width: 75,
        height: 75,
        borderRadius: 20,
        backgroundColor: "#FFF0F2",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 16,
    },

    textContainer: {
        flex: 1,
    },

    roleTitle: {
        fontSize: 21,
        fontWeight: "700",
        color: "#222",
        marginBottom: 7,
        textAlign: "left",
    },

    roleDescription: {
        fontSize: 14,
        lineHeight: 21,
        color: "#777",
    },
});