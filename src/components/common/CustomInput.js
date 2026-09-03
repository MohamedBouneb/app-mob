import React from "react";

import {
    View,
    Text,
    TextInput,
    StyleSheet
} from "react-native";


export default function CustomInput({
    label,
    placeholder,
    value,
    onChangeText,
    secureTextEntry = false,
    keyboardType = "default",
}) {

    return (

        <View style={styles.container}>

            {label && (
                <Text style={styles.label}>
                    {label}
                </Text>
            )}

            <TextInput
                style={styles.input}
                placeholder={placeholder}
                placeholderTextColor="#888"
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={secureTextEntry}
                keyboardType={keyboardType}
                autoCapitalize="none"
            />

        </View>

    );
}


const styles = StyleSheet.create({

    container: {
        width: "100%",
        marginBottom: 12,
    },

    label: {
        fontSize: 13,
        marginBottom: 5,
        color: "#555",
    },

    input: {
        height: 52,
        backgroundColor: "#FFF0C7",
        borderRadius: 10,
        paddingHorizontal: 15,
        fontSize: 14,
        color: "#333",
    },

});