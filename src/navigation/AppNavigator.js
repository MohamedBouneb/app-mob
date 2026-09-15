import { useState } from "react";

import { NavigationContainer } from "@react-navigation/native";
import { ActivityIndicator, View } from "react-native";

import { useAuth } from "../context/AuthContext";

import AuthNavigator from "./AuthNavigator";

import SplashScreen from "../screens/splash/SplashScreen";
import WelcomeScreen from "../screens/welcome/WelcomeScreen";

import Routes from "../constants/routes";

export default function AppNavigator() {
  const { loading, user } = useAuth();

  const [splashFinished, setSplashFinished] = useState(false);

  const [welcomeFinished, setWelcomeFinished] = useState(false);

  const [initialAuthRoute, setInitialAuthRoute] = useState(Routes.LOGIN);

  // =========================
  // 1. SPLASH SCREEN
  // =========================

  if (!splashFinished) {
    return (
      <SplashScreen
        onFinish={() => {
          console.log("Splash finished");
          setSplashFinished(true);
        }}
      />
    );
  }

  // =========================
  // 2. LOADING AUTH
  // =========================

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // =========================
  // 3. WELCOME SCREEN
  // =========================

  if (!welcomeFinished) {
    return (
      <WelcomeScreen
        onLogin={() => {
          console.log("LOGIN BUTTON");

          setInitialAuthRoute(Routes.LOGIN);

          setWelcomeFinished(true);
        }}
        onRegister={() => {
          console.log("REGISTER BUTTON");

          setInitialAuthRoute(Routes.REGISTER);

          setWelcomeFinished(true);
        }}
      />
    );
  }

  // =========================
  // 4. AUTH NAVIGATOR
  // =========================

  return (
    <NavigationContainer>
      <AuthNavigator initialRouteName={initialAuthRoute} />
    </NavigationContainer>
  );
}
