import { StyleSheet } from "react-native";

import colors from "./colors";
import typography from "./typography";
import spacing from "./spacing";

const globalStyle = StyleSheet.create({

    // =========================
    // Containers
    // =========================

    container: {
        flex: 1,
        backgroundColor: colors.background,
    },

    screen: {
        flex: 1,
        backgroundColor: colors.background,
        paddingHorizontal: spacing.screenHorizontal,
    },

    center: {
        justifyContent: "center",
        alignItems: "center",
    },


    // =========================
    // Text
    // =========================

    title: {
        ...typography.title,
        color: colors.text,
    },

    subtitle: {
        ...typography.subtitle,
        color: colors.textLight,
    },

    body: {
        ...typography.body,
        color: colors.textMedium,
    },


    // =========================
    // Buttons
    // =========================

    primaryButton: {
        height: 48,

        backgroundColor: colors.primary,

        borderRadius: spacing.radiusRound,

        alignItems: "center",
        justifyContent: "center",

        flexDirection: "row",
    },


    // =========================
    // Inputs
    // =========================

    inputContainer: {
        minHeight: 44,

        borderWidth: 1,
        borderColor: colors.borderInput,

        borderRadius: spacing.radiusSmall,

        backgroundColor: colors.white,

        flexDirection: "row",
        alignItems: "center",

        paddingHorizontal: spacing.md,
    },

    input: {
        flex: 1,

        fontSize: 14,

        color: colors.text,

        writingDirection: "rtl",
    },


    // =========================
    // Cards
    // =========================

    card: {
        backgroundColor: colors.white,

        borderRadius: spacing.radiusLarge,

        padding: spacing.lg,

        shadowColor: "#000",

        shadowOffset: {
            width: 0,
            height: 3,
        },

        shadowOpacity: 0.08,

        shadowRadius: 8,

        elevation: 3,
    },


    // =========================
    // Arabic
    // =========================

    textArabic: {
        writingDirection: "rtl",
        textAlign: "right",
    },

    textArabicCenter: {
        writingDirection: "rtl",
        textAlign: "center",
    },
});

export default globalStyle;