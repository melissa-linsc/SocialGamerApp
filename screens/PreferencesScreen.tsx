import React, { useState, useEffect } from "react";
import { SafeAreaView, View, Text } from "react-native";
import { Button } from "@rneui/themed";
import { useAuth } from "../contexts/AuthContext";

interface Game {
  title: string;
  genres: string[];
}

const PreferencesScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { loggedInUser, setLoggedInUser } = useAuth();
  const [preferences, setPreferences] = useState<string[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [uniqueGenres, setUniqueGenres] = useState<string[]>([]);

  const gameDataExample: Game[] = [
    {
      title: "Stardew Valley",
      genres: ["indie", "rpg", "adventure", "simulation"],
    },
    {
      title: "Elden Ring",
      genres: ["rpg", "adventure", "survival", "action", "fantasy"],
    },
    { title: "The Sims 4", genres: ["simulation"] },
    {
      title: "Baldur's Gate 3",
      genres: ["rpg", "adventure", "action", "fantasy"],
    },
    { title: "Minecraft", genres: ["sandbox"] },
    { title: "League of Legends", genres: ["moba", "fantasy"] },
    { title: "Animal Crossing", genres: ["simulation"] },
    { title: "Hollow Knight", genres: ["action", "adventure"] },
    { title: "Hades", genres: ["roguelike", "action"] },
    { title: "The Legend of Zelda", genres: ["action", "adventure", "rpg"] },
    { title: "Super Mario Bros", genres: ["platform", "adventure"] },
    { title: "Grand Theft Auto", genres: ["action", "adventure"] },
    { title: "Persona 5 Royal", genres: ["rpg", "jrpg", "action"] },
    {
      title: "Final Fantasy IX",
      genres: ["rpg", "action", "adventure", "fantasy"],
    },
    { title: "Undertale", genres: ["indie", "adventure", "rpg"] },
    { title: "FIFA", genres: ["sports"] },
    { title: "Pokemon", genres: ["action", "rpg", "fighting"] },
    { title: "Kingdom Hearts", genres: ["action", "adventure", "fantasy"] },
    { title: "Kirby and the Forgotten Land", genres: ["fantasy"] },
    {
      title: "Ratchet and Clank",
      genres: ["fantasy", "adventure", "platform"],
    },
  ];

  useEffect(() => {
    const genres = new Set<string>();
    gameDataExample.forEach((game) => {
      game.genres.forEach((genre) => genres.add(genre));
    });
    setUniqueGenres(Array.from(genres));
  }, []);

  const handlePress = (title: string) => {
    setPreferences((prevPreferences) => {
      if (prevPreferences.includes(title)) {
        return prevPreferences.filter((pref) => pref !== title);
      } else {
        return [...prevPreferences, title];
      }
    });
  };

  const handleGenrePress = (genre: string) => {
    setSelectedGenres((prevGenres) => {
      if (prevGenres.includes(genre)) {
        return prevGenres.filter((g) => g !== genre);
      } else {
        return [...prevGenres, genre];
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

  const renderGenreButtons = () => {
    let rows: JSX.Element[] = [];
    let row: JSX.Element[] = [];

    uniqueGenres.forEach((genre, index) => {
      row.push(
        <Button
          key={index}
          title={genre}
          type={selectedGenres.includes(genre) ? "solid" : "outline"}
          containerStyle={{ flex: 1, margin: 5 }}
          onPress={() => handleGenrePress(genre)}
        />
      );

      if ((index + 1) % 3 === 0) {
        rows.push(
          <View key={index} style={{ flexDirection: "row", marginBottom: 10 }}>
            {row}
          </View>
        );
        row = [];
      }
    });

    if (row.length > 0) {
      rows.push(
        <View
          key="lastGenreRow"
          style={{ flexDirection: "row", marginBottom: 10 }}
        >
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
      <Text style={{ color: "white", fontSize: 18, marginTop: 20 }}>
        Select At Least 3 Games:{" "}
      </Text>
      {renderButtons()}

      <Text style={{ color: "white", fontSize: 18, marginTop: 20 }}>
        Select At Least 3 Genres:{" "}
      </Text>
      {renderGenreButtons()}

      <Button
        title="Continue"
        disabled={preferences.length < 3 || selectedGenres.length < 3}
        type="outline"
        containerStyle={{ marginVertical: 15 }}
        onPress={() => {
          if (preferences.length >= 3 && selectedGenres.length >= 3) {
            navigation.navigate("List");
          }
        }}
      />
    </SafeAreaView>
  );
};

export default PreferencesScreen;
