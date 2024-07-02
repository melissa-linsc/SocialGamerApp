import React, { useState, useEffect } from "react";
import { SafeAreaView, View, Text, ScrollView, StyleSheet } from "react-native";
import { Button, ThemeProvider } from "@rneui/themed";
import { useAuth } from "../contexts/AuthContext";
import GradientText from "react-native-gradient-texts";

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
          buttonStyle={preferences.includes(button.title) ? styles.pressedButton : styles.button }
          titleStyle={preferences.includes(button.title) ? styles.pressedButtonTitle : styles.buttonTitle}
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
          buttonStyle={selectedGenres.includes(genre) ? styles.pressedButton : styles.button }
          titleStyle={selectedGenres.includes(genre) ? styles.pressedButtonTitle : styles.buttonTitle}
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
    <SafeAreaView style={styles.safeScroll}>
      <ScrollView style={styles.container}>
        <GradientText
          text={"Gamerly"}
          fontSize={40}
          width={420}
          locations={{ x: 100, y: 60 }}
          isGradientFill
          gradientColors={["#f20089", "#2d00f7"]}
        />
        <Text style={{ color: "white", fontSize: 18, marginVertical: 20 }}>
          Select At Least 3 Games:{" "}
        </Text>
        {renderButtons()}

        <Text style={{ color: "white", fontSize: 18, marginVertical: 20 }}>
          Select At Least 3 Genres:{" "}
        </Text>
        {renderGenreButtons()}

        <Button
          title="Continue"
          disabled={preferences.length < 3 || selectedGenres.length < 3}
          type="outline"
          containerStyle={{ marginVertical: 15, borderRadius: 15 }}
          onPress={() => {
            if (preferences.length >= 3 && selectedGenres.length >= 3) {
              navigation.navigate("Home");
            }
          }}
          disabledStyle={styles.continueButtonDisabled}
          disabledTitleStyle={styles.continueButtonTitleDisabled}
          buttonStyle={preferences.length >= 3 && selectedGenres.length >= 3 ? styles.continueButtonEnabled : null}
          titleStyle={preferences.length >= 3 && selectedGenres.length >= 3 ? styles.continueButtonTitleEnabled : null}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({ 
  safeScroll: {
    backgroundColor: "#0a0a31",
    justifyContent: "center"
  },
  container: {
    backgroundColor: "#0a0a31",
    padding: 30,
  },
  button: {
    padding: 10,
    borderRadius: 15,
    color: "#f20089",
    borderColor: "#f20089",
    borderWidth: 2,
  },
  buttonTitle: {
    color: "#f20089",
  },
  pressedButton: {
    backgroundColor: "#f20089",
    borderRadius: 15,
  },
  pressedButtonTitle: {
    color: "#fff",
  },
  continueButtonEnabled: {
    backgroundColor: "#f20089",
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#f20089",
    marginBottom: 40,
  },
  continueButtonTitleEnabled: {
    color: "#fff",
  },
  continueButtonDisabled: {
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#fff",
    marginBottom: 40,
  },
  continueButtonTitleDisabled: {
    color: "#fff",
  }
})

export default PreferencesScreen;
