import React from "react";

import {
    createNativeStackNavigator
} from "@react-navigation/native-stack";

import Routes from "../constants/routes";

import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";


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

        </Stack.Navigator>

    );

}