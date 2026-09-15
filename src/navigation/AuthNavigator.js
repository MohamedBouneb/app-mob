import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Routes from "../constants/routes";

import FargotPasswordScreen from "../screens/auth/FargotPasswordScreen";
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import ResetPasswordScreen from "../screens/auth/ResetPasswordScreen";
import RoleSelectionScreen from "../screens/auth/RoleSelectionScreen";
import VerifyCodeScreen from "../screens/auth/VerifyCodeScreen";

const Stack = createNativeStackNavigator();

export default function AuthNavigator({ initialRouteName }) {
  console.log("AuthNavigator rendered");

  return (
    <Stack.Navigator
      initialRouteName={initialRouteName || Routes.LOGIN}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name={Routes.LOGIN} component={LoginScreen} />

      <Stack.Screen name={Routes.REGISTER} component={RegisterScreen} />

      <Stack.Screen
        name={Routes.FORGOT_PASSWORD}
        component={FargotPasswordScreen}
      />
      <Stack.Screen
        name={Routes.RESET_PASSWORD}
        component={ResetPasswordScreen}
      />

      <Stack.Screen name={Routes.VERIFY_CODE} component={VerifyCodeScreen} />

      <Stack.Screen
        name={Routes.ROLE_SELECTION}
        component={RoleSelectionScreen}
      />
    </Stack.Navigator>
  );
}
