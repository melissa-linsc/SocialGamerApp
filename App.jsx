// App.jsx
import React from "react";
import { LogBox } from "react-native";
LogBox.ignoreLogs(["Warning: ..."]); // Ignore log notification by message
LogBox.ignoreAllLogs(); // Ignore all log notifications

import { NavigationContainer } from "@react-navigation/native";

import { AuthProvider, useAuth } from "./contexts/AuthContext";
import GuestStack from "./navigation/GuestStack";
import AppStack from "./navigation/AppStack";

const AppContent = () => {
  const { loggedInUser } = useAuth();
  return (
    <NavigationContainer>
      {loggedInUser ? <AppStack /> : <GuestStack />}
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
