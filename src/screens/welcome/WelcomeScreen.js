import React from "react";

import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
} from "react-native";


export default function WelcomeScreen({
    onLogin,
    onRegister
}) {

    return (

        <View style={styles.container}>

            {/* Image principale */}
            <Image
                source={require("../../assets/images/splash/welcome-child.png")}
                style={styles.mainImage}
                resizeMode="contain"
            />


            {/* Bouton Login */}
            <TouchableOpacity
                style={styles.button}
                onPress={onLogin}
            >

                <Text style={styles.buttonText}>
                    تسجيل الدخول
                </Text>

            </TouchableOpacity>


            {/* Bouton Register */}
            <TouchableOpacity
                style={styles.button}
                onPress={onRegister}
            >

                <Text style={styles.buttonText}>
                    إنشاء حساب
                </Text>

            </TouchableOpacity>


            {/* Description */}
            <View style={styles.descriptionBox}>

                <Text style={styles.description}>
                    الروضة هي محطة شحن صغيرة
                    {"\n"}
                    للأرواح الصغيرة قبل انطلاقها في الحياة
                </Text>

                <Image
                    source={require("../../assets/images/splash/child-3.png")}
                    style={styles.character}
                    resizeMode="contain"
                />

            </View>

        </View>

    );

}


const styles = StyleSheet.create({

    container: {

        flex: 1,

        backgroundColor: "#F52F46",

        alignItems: "center",

        paddingHorizontal: 25,

        paddingTop: 70,

    },


    mainImage: {

        width: 280,

        height: 280,

        marginTop: 20,

    },


    button: {

        width: "85%",

        height: 55,

        backgroundColor: "#FFA83D",

        borderRadius: 30,

        justifyContent: "center",

        alignItems: "center",

        marginTop: 18,

    },


    buttonText: {

        color: "#FFFFFF",

        fontSize: 19,

        fontWeight: "700",

        writingDirection: "rtl",

    },


    descriptionBox: {

        width: "95%",

        minHeight: 70,

        backgroundColor: "#FFFFFF",

        borderRadius: 18,

        marginTop: "auto",

        marginBottom: 40,

        paddingHorizontal: 25,

        paddingVertical: 15,

        justifyContent: "center",

        alignItems: "center",

    },


    description: {

        color: "#E85A24",

        fontSize: 14,

        lineHeight: 20,

        textAlign: "center",

        writingDirection: "rtl",

    },


    character: {

        position: "absolute",

        right: -5,

        bottom: -10,

        width: 80,

        height: 90,

    },

});