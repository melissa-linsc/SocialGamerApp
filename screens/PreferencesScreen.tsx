import React, { useState } from "react";
import { SafeAreaView, View } from "react-native";
import { Button } from "@rneui/themed";
import { useAuth } from "../contexts/AuthContext";
import { authentication } from "../firebase/config";

import HomeScreen from "./HomeScreen";

interface Game {
  title: string;
}

const PreferencesScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
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
    { title: "Super Mario Bros" },
    { title: "Grand Theft Auto" },
    { title: "Persona 5 Royal" },
    { title: "Final Fantasy IX" },
    { title: "Undertale" },
    { title: "FIFA" },
    { title: "Pokemon" },
    { title: "Kingdom Hearts" },
    { title: "Kirby and the Forgotten Land" },
    { title: "Ratchet and Clank" },
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

  // Function to render buttons in rows
  const renderButtons = () => {
    let rows: JSX.Element[] = [];
    let row: JSX.Element[] = [];

    gameDataExample.forEach((button, index) => {
      row.push(
        <Button
          key={index}
          title={button.title}
          type={preferences.includes(button.title) ? "solid" : "outline"}
          containerStyle={{ flex: 1, margin: 5 }}
          onPress={() => handlePress(button.title)}
        />
      );

      // Create a new row after every 3 buttons
      if ((index + 1) % 3 === 0) {
        rows.push(
          <View key={index} style={{ flexDirection: "row", marginBottom: 10 }}>
            {row}
          </View>
        );
        row = []; // Reset row array
      }
    });

    // Push the last row if it's not empty
    if (row.length > 0) {
      rows.push(
        <View key="lastRow" style={{ flexDirection: "row", marginBottom: 10 }}>
          {row}
        </View>
      );
    }

    return rows;
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#2e2157",
        paddingHorizontal: 10,
      }}
    >
      {renderButtons()}

      <Button
        title="Continue"
        disabled={preferences.length < 3}
        type="outline"
        containerStyle={{ marginVertical: 15 }}
        onPress={() => {
          if (preferences.length >= 3) {
            navigation.navigate("Home");
          }
        }}
      />
    </SafeAreaView>
  );
};

export default PreferencesScreen;
