import React from "react";

import {
    createNativeStackNavigator
} from "@react-navigation/native-stack";

import Routes from "../constants/routes";

import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import FargotPasswordScreen from "../screens/auth/FargotPasswordScreen";
import VerifyCodeScreen from "../screens/auth/VerifyCodeScreen";


const Stack = createNativeStackNavigator();


export default function AuthNavigator({
    initialRouteName
}) {

    console.log(
        "AuthNavigator initial route:",
        initialRouteName
    );


    return (

        <Stack.Navigator

            initialRouteName={
                initialRouteName || Routes.LOGIN
            }

            screenOptions={{
                headerShown: false
            }}

        >

            <Stack.Screen
                name={Routes.LOGIN}
                component={LoginScreen}
            />

            <Stack.Screen
                name={Routes.REGISTER}
                component={RegisterScreen}
            />

            <Stack.Screen
                name={Routes.FORGOT_PASSWORD}
                component={FargotPasswordScreen}
            />

            <Stack.Screen
                name={Routes.VERIFY_CODE}
                component={VerifyCodeScreen}
            />

        </Stack.Navigator>

    );
}