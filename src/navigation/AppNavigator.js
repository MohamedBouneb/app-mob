import { NavigationContainer } from "@react-navigation/native";
import { useState } from "react";
import { ActivityIndicator, View } from "react-native";

import { useAuth } from "../context/AuthContext";
import AuthNavigator from "./AuthNavigator";

import SplashScreen from "../screens/splash/SplashScreen";
import WelcomeScreen from "../screens/welcome/WelcomeScreen";

import AdminNavigator from "./AdminNavigator";
import ParentNavigator from "./ParentNavigator";
import TeacherNavigator from "./TeacherNavigator";

import Routes from "../constants/routes";

export default function AppNavigator() {
  const { loading, user } = useAuth();

  const [splashFinished, setSplashFinished] = useState(false);
  const [welcomeFinished, setWelcomeFinished] = useState(false);
  const [initialAuthRoute, setInitialAuthRoute] = useState(Routes.LOGIN);

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

  // Un utilisateur déjà connecté passe directement à son espace.
  // Un nouvel utilisateur voit le WelcomeScreen.
  if (!user && !welcomeFinished) {
    return (
      <WelcomeScreen
        onLogin={() => {
          setInitialAuthRoute(Routes.LOGIN);
          setWelcomeFinished(true);
        }}
        onRegister={() => {
          setInitialAuthRoute(Routes.REGISTER);
          setWelcomeFinished(true);
        }}
      />
    );
  }

  return (
    <NavigationContainer>
      {user ? (
        (() => {
          switch (user.role) {
            case "ADMIN":
              return <AdminNavigator />;

            case "TEACHER":
              return <TeacherNavigator />;

            case "PARENT":
              return <ParentNavigator />;

            default:
              return <AuthNavigator initialRouteName={Routes.LOGIN} />;
          }
        })()
      ) : (
        <AuthNavigator initialRouteName={initialAuthRoute} />
      )}
    </NavigationContainer>
  );
}
