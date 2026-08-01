import { StyleSheet } from "react-native";

import Theme from "./theme";

const GlobalStyles = StyleSheet.create({

    container:{

        flex:1,

        backgroundColor:Theme.colors.background,

        padding:Theme.spacing.md,

    },

    title:{

        fontSize:Theme.typography.h2,

        color:Theme.colors.textPrimary,

        fontWeight:"700",

    },

    subtitle:{

        fontSize:Theme.typography.body,

        color:Theme.colors.textSecondary,

    },

    center:{

        justifyContent:"center",

        alignItems:"center",

    }

});

export default GlobalStyles;