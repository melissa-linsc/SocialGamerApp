// PreferencesStack.tsx
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PreferencesScreen from "../screens/PreferencesScreen";
import HomeScreen from "../screens/HomeScreen";

const Stack = createNativeStackNavigator();

const PreferencesStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Preferences"
        component={PreferencesScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default PreferencesStack;
