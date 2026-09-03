import React from "react";

import {
    TouchableOpacity,
    Text,
    StyleSheet,
} from "react-native";


export default function PrimaryButton({
    title,
    onPress,
}) {

    return (

        <TouchableOpacity
            style={styles.button}
            onPress={onPress}
        >

            <Text style={styles.text}>
                {title}
            </Text>

        </TouchableOpacity>

    );

}


const styles = StyleSheet.create({

    button: {

        height: 50,

        backgroundColor: "#FF6B81",

        borderRadius: 25,

        justifyContent: "center",

        alignItems: "center",

    },


    text: {

        color: "#FFFFFF",

        fontSize: 18,

        fontWeight: "bold",

        writingDirection: "rtl",

    },

});