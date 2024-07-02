import React, {useEffect} from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import WelcomeScreen from "../screens/WelcomeScreen";
import SignUpScreen from "../screens/SignUpScreen";
import { StatusBar } from "react-native";

const Stack = createNativeStackNavigator();

const GuestStack = () => {

  useEffect(() => {
    // Set status bar style when component mounts
    StatusBar.setBarStyle('light-content'); // or 'dark-content'
  }, []);

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: true,
          headerStyle: {
            backgroundColor: "#0a0a31"
          },
          headerTintColor: "#f20089"
         }}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUpScreen}
        options={{ headerShown: true,
          headerStyle: {
            backgroundColor: "#0a0a31"
          },
          headerTintColor: "#f20089"
         }}
      />
    </Stack.Navigator>
  );
};

export default GuestStack;