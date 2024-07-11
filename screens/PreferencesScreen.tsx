import React, { useState, useEffect } from "react";
import { SafeAreaView, View, Text, ScrollView, StyleSheet } from "react-native";
import { Button, ThemeProvider } from "@rneui/themed";
import { useAuth } from "../contexts/AuthContext";
import GradientText from "react-native-gradient-texts";
import { fetchGames, fetchGenres, postToPreferences, deletePreferences } from "../utils/api.js";
import { ActivityIndicator } from "react-native-paper";

const PreferencesScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [genres, setGenres] = useState([]);
  const [games, setGames] = useState([]);
  const [preferences, setPreferences] = useState<string[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [uniqueGenres, setUniqueGenres] = useState<string[]>([]);

  const { loggedInUser, setLoggedInUser } = useAuth();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {

    deletePreferences(loggedInUser.uid)

    fetchGames()
      .then((result) => {
        const top30Games = result.slice(0, 50
        );
        const filteredGames = top30Games.filter((game) => {
          return game.name !== 'Resident Evil 2' 
          && game.name !== 'The Last Of Us Remastered' 
          && game.name !== 'Grand Theft Auto: San Andreas' 
          && game.name !== 'Grand Theft Auto: Vice City'
          && game.name !== 'Mass Effect 2' 
          && game.name !== 'Marvel\'s Spider-Man Remastered' 
          && game.name !== 'The Legend of Zelda: Tears of the Kingdom'
          && game.name !== 'Half-Life 2: Episode Two'
          && game.name !== 'Red Dead Redemption'
          && game.name !== 'Uncharted: Legacy of Thieves Collection'
          && !game.name.includes('Max Payne 2')
          && !game.name.includes('Ultimate')
        })
        setGames(filteredGames);
      })
      .catch((error) => {
        console.error("Error fetching games:", error);
      });

    fetchGenres()
      .then((result) => {
        const filteredGenres = result.filter(
          (genre) =>
            genre.name !== "Educational" &&
            genre.name !== "Family" &&
            genre.name !== "Board Games" &&
            genre.name !== "Card"
        );
        const genreNames = filteredGenres.map((genre) => genre.name);
        setUniqueGenres(genreNames);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching genres:", error);
      });
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

  // const handleGenrePress = (genre: string) => {
  //   setSelectedGenres((prevGenres) => {
  //     if (prevGenres.includes(genre)) {
  //       return prevGenres.filter((g) => g !== genre);
  //     } else {
  //       return [...prevGenres, genre];
  //     }
  //   });
  // };

  const renderButtons = () => {
    let rows: JSX.Element[] = [];
    let row: JSX.Element[] = [];

    games.forEach((game, index) => {
      row.push(
        <Button
          key={index}
          title={game.name}
          type={preferences.includes(game.slug) ? "solid" : "outline"}
          containerStyle={{ flex: 1, margin: 5 }}
          onPress={() => handlePress(game.slug)}
          buttonStyle={
            preferences.includes(game.slug)
              ? styles.pressedButton
              : styles.button
          }
          titleStyle={
            preferences.includes(game.slug)
              ? styles.pressedButtonTitle
              : styles.buttonTitle
          }
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

    // Push the last row if there are remaining buttons
    if (row.length > 0) {
      rows.push(
        <View key="lastRow" style={{ flexDirection: "row", marginBottom: 10 }}>
          {row}
        </View>
      );
    }

    return rows;
  };

  // const renderGenreButtons = () => {
  //   let rows: JSX.Element[] = [];
  //   let row: JSX.Element[] = [];

  //   uniqueGenres.forEach((genre, index) => {
  //     row.push(
  //       <Button
  //         key={index}
  //         title={genre}
  //         type={selectedGenres.includes(genre) ? "solid" : "outline"}
  //         containerStyle={{ flex: 1, margin: 5 }}
  //         onPress={() => handleGenrePress(genre)}
  //         buttonStyle={
  //           selectedGenres.includes(genre)
  //             ? styles.pressedButton
  //             : styles.button
  //         }
  //         titleStyle={
  //           selectedGenres.includes(genre)
  //             ? styles.pressedButtonTitle
  //             : styles.buttonTitle
  //         }
  //       />
  //     );

  //     if ((index + 1) % 3 === 0) {
  //       rows.push(
  //         <View key={index} style={{ flexDirection: "row", marginBottom: 10 }}>
  //           {row}
  //         </View>
  //       );
  //       row = [];
  //     }
  //   });

  //   // Push the last row if there are remaining buttons
  //   if (row.length > 0) {
  //     rows.push(
  //       <View
  //         key="lastGenreRow"
  //         style={{ flexDirection: "row", marginBottom: 10 }}
  //       >
  //         {row}
  //       </View>
  //     );
  //   }

  //   return rows;
  // };

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#0a0a31", height: 400 }}>
        <ActivityIndicator animating={true} color="#f20089" size="large" />
      </SafeAreaView>
    );
  }

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
          Select Up To 3 Games:{" "}
        </Text>
        {renderButtons()}

        {/* <Text style={{ color: "white", fontSize: 18, marginVertical: 20 }}>
          Select At Least 3 Genres:{" "}
        </Text>
        {renderGenreButtons()} */}

        <Button
          title="Continue"
          disabled={preferences.length > 3 || preferences.length === 0}
          type="outline"
          containerStyle={{ marginVertical: 15, borderRadius: 15 }}
          onPress={() => {
            console.log(preferences)
            postToPreferences(loggedInUser.uid, preferences).then((result) => {
              console.log("Successfully added preferences:", result)
            }).catch((err) => {
              console.log("Error adding preferences:", err)
            })
            if (preferences.length <= 3 && preferences.length > 0) {
              navigation.navigate("Home");
            }
          }}
          disabledStyle={styles.continueButtonDisabled}
          disabledTitleStyle={styles.continueButtonTitleDisabled}
          buttonStyle={
            preferences.length <= 3 && preferences.length > 0 ? styles.continueButtonEnabled : null
          }
          titleStyle={
            preferences.length <= 3 && preferences.length > 0 ? styles.continueButtonTitleEnabled : null
          }
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeScroll: {
    backgroundColor: "#0a0a31",
    justifyContent: "center",
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
    fontSize: 13,
  },
  pressedButton: {
    backgroundColor: "#f20089",
    borderRadius: 15,
  },
  pressedButtonTitle: {
    color: "#fff",
    fontSize: 13,
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
  },
});

export default PreferencesScreen;
