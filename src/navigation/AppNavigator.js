import React, { useState } from "react";

import {
    NavigationContainer
} from "@react-navigation/native";

import {
    ActivityIndicator,
    View
} from "react-native";

import { useAuth } from "../context/AuthContext";

import AuthNavigator from "./AuthNavigator";

import SplashScreen from "../screens/splash/SplashScreen";


export default function AppNavigator() {

    const { loading, user } = useAuth();

    const [splashFinished, setSplashFinished] = useState(false);


    // 1️⃣ Afficher le SplashScreen au démarrage
    if (!splashFinished) {

        return (

            <SplashScreen
                onFinish={() => setSplashFinished(true)}
            />

        );

    }


    // 2️⃣ Vérifier la session utilisateur
    if (loading) {

        return (

            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center"
                }}
            >

                <ActivityIndicator
                    size="large"
                />

            </View>

        );

    }


    // 3️⃣ Afficher la navigation
    return (

        <NavigationContainer>

            {
                user

                ?

                (
                    // Pour le moment
                    // nous n'avons pas encore créé
                    // AdminNavigator / TeacherNavigator / ParentNavigator

                    <AuthNavigator />
                )

                :

                (
                    <AuthNavigator />
                )
            }

        </NavigationContainer>

    );

}