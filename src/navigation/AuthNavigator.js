import React from "react";

import {
    createNativeStackNavigator
} from "@react-navigation/native-stack";

import Routes from "../constants/routes";

// =========================
// Auth
// =========================

import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import RoleSelectionScreen from "../screens/auth/RoleSelectionScreen";

// =========================
// Registration
// =========================

import ParentRegisterScreen from "../screens/auth/ParentRegisterScreen";
import TeacherRegisterScreen from "../screens/auth/TeacherRegisterScreen";
import AccountCreatedScreen from "../screens/auth/AccountCreatedScreen";

// =========================
// Password
// =========================

import FargotPasswordScreen from "../screens/auth/FargotPasswordScreen";
import VerifyCodeScreen from "../screens/auth/VerifyCodeScreen";
import ResetPasswordScreen from "../screens/auth/ResetPasswordScreen";


const Stack = createNativeStackNavigator();


export default function AuthNavigator({
    initialRouteName
}) {

    return (

        <Stack.Navigator
            initialRouteName={
                initialRouteName || Routes.LOGIN
            }
            screenOptions={{
                headerShown: false,
            }}
        >

            {/* Login */}

            <Stack.Screen
                name={Routes.LOGIN}
                component={LoginScreen}
            />


            {/* Register */}

            <Stack.Screen
                name={Routes.REGISTER}
                component={RegisterScreen}
            />


            {/* Role Selection */}

            <Stack.Screen
                name={Routes.ROLE_SELECTION}
                component={RoleSelectionScreen}
            />


            {/* Parent Register */}

            <Stack.Screen
                name={Routes.PARENT_REGISTER}
                component={ParentRegisterScreen}
            />


            {/* Teacher Register */}

            <Stack.Screen
                name={Routes.TEACHER_REGISTER}
                component={TeacherRegisterScreen}
            />


            {/* Account Created */}

            <Stack.Screen
                name={Routes.ACCOUNT_CREATED}
                component={AccountCreatedScreen}
            />


            {/* Forgot Password */}

            <Stack.Screen
                name={Routes.FORGOT_PASSWORD}
                component={FargotPasswordScreen}
            />


            {/* Verify Code */}

            <Stack.Screen
                name={Routes.VERIFY_CODE}
                component={VerifyCodeScreen}
            />


            {/* Reset Password */}

            <Stack.Screen
                name={Routes.RESET_PASSWORD}
                component={ResetPasswordScreen}
            />

        </Stack.Navigator>
    );
}