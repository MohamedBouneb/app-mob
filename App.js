import { NavigationContainer } from "@react-navigation/native";
import { useEffect } from "react";

import { testSupabase } from "./src/api/supabaseTest";
import { AuthProvider } from "./src/context/AuthContext";
import AppNavigator from "./src/navigation/AppNavigator";

export default function App() {
  useEffect(() => {
    testSupabase();
  }, []);

  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
