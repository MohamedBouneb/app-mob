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

import WelcomeScreen from "../screens/welcome/WelcomeScreen";


export default function AppNavigator() {

    const { loading, user } = useAuth();

    const [splashFinished, setSplashFinished] = useState(false);

    const [welcomeFinished, setWelcomeFinished] = useState(false);


    // 1️⃣ Splash
    if (!splashFinished) {

        return (

            <SplashScreen
                onFinish={() => setSplashFinished(true)}
            />

        );

    }


    // 2️⃣ Vérification session
    if (loading) {

        return (

            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center"
                }}
            >

                <ActivityIndicator size="large" />

            </View>

        );

    }


    // 3️⃣ Écran de choix
    if (!welcomeFinished) {

        return (

            <WelcomeScreen

                onLogin={() => {

                    setWelcomeFinished(true);

                }}

                onRegister={() => {

                    setWelcomeFinished(true);

                }}

            />

        );

    }


    // 4️⃣ Navigation
    return (

        <NavigationContainer>

            <AuthNavigator />

        </NavigationContainer>

    );

}