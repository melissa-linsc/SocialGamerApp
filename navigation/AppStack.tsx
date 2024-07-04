import React, { useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import FriendsScreen from "../screens/FriendsScreen";
import PreferencesScreen from "../screens/PreferencesScreen";
import ListScreen from "../screens/ListsScreen";
import BottomNav from "../components/BottomNav";
import ChatScreen from "../screens/ChatScreen";
import MessagesScreen from "../screens/MessagesScreen";
import OneGame from "../screens/OneGame";
import { StatusBar } from "react-native";

const Stack = createNativeStackNavigator();

const AppStack = () => {
  useEffect(() => {
    StatusBar.setBarStyle("dark-content"); 
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
        name="Chat"
        component={ChatScreen}
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: "#0a0a31",
          },
          headerTintColor: "#f20089",
        }}
      />
      <Stack.Screen
        name="Messages"
        component={MessagesScreen}
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: "#0a0a31",
          },
          headerTintColor: "#f20089",
        }}
      />
      <Stack.Screen
        name="Friends"
        component={FriendsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="OneGame"
        component={OneGame}
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: "#0a0a31",
          },
          headerTintColor: "#f20089",
        }}
      />
    </Stack.Navigator>
  );
};

export default AppStack;
