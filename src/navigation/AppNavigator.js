import { NavigationContainer } from "@react-navigation/native";
import { useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { useAuth } from "../context/AuthContext";

import AdminNavigator from "./AdminNavigator";
import AuthNavigator from "./AuthNavigator";
import ParentNavigator from "./ParentNavigator";
import TeacherNavigator from "./TeacherNavigator";

import SplashScreen from "../screens/splash/SplashScreen";
import WelcomeScreen from "../screens/welcome/WelcomeScreen";

import Routes from "../constants/routes";

export default function AppNavigator() {
  const { loading, user } = useAuth();

  const [splashFinished, setSplashFinished] = useState(false);
  const [welcomeFinished, setWelcomeFinished] = useState(false);
  const [initialAuthRoute, setInitialAuthRoute] = useState(Routes.LOGIN);

  // 1. Afficher le splash screen
  if (!splashFinished) {
    return (
      <SplashScreen
        onFinish={() => {
          setSplashFinished(true);
        }}
      />
    );
  }

  // 2. Attendre la récupération de la session et du profil
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#F52F46" />
      </View>
    );
  }

  // 3. Accueil pour les utilisateurs non connectés
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

  // 4. Afficher l'espace correspondant au rôle
  const renderUserNavigator = () => {
    switch (user?.role) {
      case "ADMIN":
        return <AdminNavigator />;

      case "TEACHER":
        // Le statut APPROVED doit également être vérifié
        // avant de permettre à l'animatrice d'accéder à son espace.
        return <TeacherNavigator />;

      case "PARENT":
        return <ParentNavigator />;

      default:
        // Profil absent ou rôle inconnu :
        // ne pas accorder d'accès privilégié.
        return <AuthNavigator initialRouteName={Routes.LOGIN} />;
    }
  };

  return (
    <NavigationContainer>
      {user ? (
        renderUserNavigator()
      ) : (
        <AuthNavigator initialRouteName={initialAuthRoute} />
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF8F6",
  },
});
