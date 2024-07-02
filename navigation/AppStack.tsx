import React, {useEffect} from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import FriendsScreen from "../screens/FriendsScreen";
import PreferencesScreen from "../screens/PreferencesScreen";
import ListScreen from "../screens/ListsScreen";
import BottomNav from "../components/BottomNav";
import { StatusBar } from "react-native";

const Stack = createNativeStackNavigator();

const AppStack = () => {

  useEffect(() => {
    // Set status bar style when component mounts
    StatusBar.setBarStyle('light-content'); // or 'dark-content'
  }, []);

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Preferences"
        component={PreferencesScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="List"
        component={ListScreen}
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
