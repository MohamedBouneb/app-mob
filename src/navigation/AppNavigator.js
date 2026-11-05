import { useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { useAuth } from "../context/AuthContext";

import AdminNavigator from "./AdminNavigator";
import AuthNavigator from "./AuthNavigator";
import ParentNavigator from "./ParentNavigator";
import TeacherNavigator from "./TeacherNavigator";

import AccountStatusScreen from "../screens/auth/AccountStatusScreen";
import SplashScreen from "../screens/splash/SplashScreen";
import WelcomeScreen from "../screens/welcome/WelcomeScreen";

import Routes from "../constants/routes";

export default function AppNavigator() {
  const { loading, user, accountNotice, logout } = useAuth();

  const [splashFinished, setSplashFinished] = useState(false);
  const [welcomeFinished, setWelcomeFinished] = useState(false);
  const [initialAuthRoute, setInitialAuthRoute] = useState(Routes.LOGIN);

  // 1. Afficher le Splash Screen
  if (!splashFinished) {
    return <SplashScreen onFinish={() => setSplashFinished(true)} />;
  }

  // 2. Attendre le chargement de la session et du profil
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#F52F46" />
      </View>
    );
  }

  // 3. Vérifier le statut de validation de l'animatrice
  if (
    user &&
    user.role?.toUpperCase() === "TEACHER" &&
    (accountNotice === "PENDING" || accountNotice === "REJECTED")
  ) {
    return <AccountStatusScreen status={accountNotice} onLogout={logout} />;
  }

  // 4. Accueil pour les utilisateurs non connectés
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

  // 5. Redirection vers l'authentification
  if (!user) {
    return <AuthNavigator initialRouteName={initialAuthRoute} />;
  }

  // 6. Redirection selon le rôle
  switch (user.role?.toUpperCase()) {
    case "ADMIN":
      return <AdminNavigator />;

    case "TEACHER":
      return <TeacherNavigator />;

    case "PARENT":
      return <ParentNavigator />;

    default:
      return <AuthNavigator initialRouteName={Routes.LOGIN} />;
  }
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF8F6",
  },
});
