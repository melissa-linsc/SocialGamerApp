import { SafeAreaView } from "react-native";
import { Button } from "@rneui/themed";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import React from "react";

interface Game {
  title: string;
}

const PreferencesScreen: React.FC = () => {
  const { loggedInUser, setLoggedInUser } = useAuth();
  const [preferences, setPreferences] = useState<string[]>([]);

  const gameDataExample: Game[] = [
    { title: "Stardew Valley" },
    { title: "Elden Ring" },
    { title: "The Sims 4" },
    { title: "Baldur's Gate 3" },
    { title: "Minecraft" },
    { title: "League of Legends" },
    { title: "Animal Crossing" },
    { title: "Hollow Knight" },
    { title: "Hades" },
    { title: "The Legend of Zelda" },
  ];

  const handlePress = (title: string) => {
    setPreferences((prevPreferences) => {
      if (prevPreferences.includes(title)) {
        return prevPreferences.filter((pref) => pref !== title);
      } else {
        return [...prevPreferences, title];
      }
    });
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#2e2157",
      }}
    >
      {gameDataExample.map((button, index) => (
        <Button
          key={index}
          title={button.title}
          type={preferences.includes(button.title) ? "solid" : "outline"}
          containerStyle={{ marginVertical: 15 }}
          onPress={() => handlePress(button.title)}
        />
      ))}
      <Button
        title="Continue"
        disabled={preferences.length < 3}
        type="outline"
        containerStyle={{ marginVertical: 15 }}
        // onPress={continueToMain}
      />
    </SafeAreaView>
  );
};

export default PreferencesScreen;
