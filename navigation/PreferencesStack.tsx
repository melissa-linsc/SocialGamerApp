// PreferencesStack.tsx
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PreferencesScreen from "../screens/PreferencesScreen";
import recsCarousel from "../screens/Recommendations";

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
        name="Recs"
        component={recsCarousel}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default PreferencesStack;
