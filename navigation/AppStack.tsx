import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import FriendsScreen from "../screens/FriendsScreen";
import PreferencesScreen from "../screens/PreferencesScreen";
import BottomNav from "../components/BottomNav";

const Stack = createNativeStackNavigator();

const AppStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Preferences"
        component={PreferencesScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Home"
        component={BottomNav}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Friends"
        component={FriendsScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default AppStack;
