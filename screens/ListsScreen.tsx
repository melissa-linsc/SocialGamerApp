// src/screens/ListScreen.tsx

import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  StatusBar,
  StyleSheet,
  FlatList,
  View,
  TouchableOpacity,
} from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../components/Header";
import Carousel from "../components/Carousel";
import { Searchbar, Chip, ActivityIndicator } from "react-native-paper";
import { Feather } from "@expo/vector-icons";
import { formatGameTitle } from "../utils/utils";
import {
  getSearchedGames,
  fetchGenres,
  getGamesByGenre,
  fetchGames,
  fetchUserById,
  fetchRecommendedGames
} from "../utils/api.js";

const ListScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("racing");
  const [selectedGenreGames, setSelectedGenreGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [topRatedGames, setTopRatedGames] = useState([]);

  const { loggedInUser, setLoggedInUser } = useAuth();

  const [profileData, setProfileData] = useState({})

  const [recommendations, setRecommendations] = useState([])
  const [recommendationsGenerating, setRecommendationsGenerating] = useState(true)

  useEffect(() => {
    StatusBar.setBarStyle("light-content");

    fetchUserById(loggedInUser.uid).then((profile) => {
      setProfileData(profile)
    })

    getSearchedGames(searchQuery).then((results) => {
      setSearchResults(results);
    });

    fetchGenres().then((results) => {
      const filteredGenres = results.filter((genre) => {
        if (
          genre.slug !== "card" &&
          genre.slug !== "board-games" &&
          genre.slug !== "family" &&
          genre.slug !== "educational"
        ) {
          return genre;
        }
      });
      setGenres(filteredGenres);
    });

    getGamesByGenre(selectedGenre).then((result) => {
      setSelectedGenreGames(result);
    });

    fetchGames().then((result) => {
      setTopRatedGames(result);
      setIsLoading(false);
    });

    if (profileData.recommendations) {
      fetchRecommendedGames(profileData.preferences).then((result) => {
        console.log(result)
        setRecommendations(result)
        setRecommendationsGenerating(false)
      })
    }

  }, [searchQuery, selectedGenre]);

  const handlePress = (item) => {
    navigation.navigate("Back To Home", { game: item, gameid: item.id });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.searchResults}
      onPress={() => handlePress(item)}
    >
      <Text style={{ color: "#fff" }}>{item.slug}</Text>
      <Feather name="arrow-right-circle" size={24} color="#f20089" />
    </TouchableOpacity>
  );

  const handleGenrePress = (genre) => {
    setSelectedGenre(genre);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#0a0a31" }}>
        <ActivityIndicator animating={true} color="#f20089" size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeScroll}>
      <ScrollView>
        <View style={styles.view}>
          <Header navigation={navigation} />
          <Searchbar
            placeholder="Search for a game"
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchbar}
          />
          {searchQuery ? (
            <FlatList
              data={searchResults}
              renderItem={renderItem}
              keyExtractor={(item) => item.id} // Use a unique key extractor
            />
          ) : null}
          <Text style={styles.subheading}>Browse Genres</Text>
          <ScrollView style={styles.genreChipContainer} horizontal>
            {genres.map((genre) => {
              return (
                <Chip
                  style={
                    genre.slug === selectedGenre
                      ? styles.selectedChip
                      : styles.genreChip
                  }
                  selectedColor="#000"
                  elevated={true}
                  onPress={() => {
                    handleGenrePress(genre.slug);
                  }}
                  key={genre.id}
                >
                  {genre.slug}
                </Chip>
              );
            })}
          </ScrollView>
          <Carousel games={selectedGenreGames} />
          {recommendationsGenerating ? 
          <Text style={styles.subheading}>Recommendations Generating...</Text>
          : <View>
            <Text style={styles.subheading}>Your Recommendations</Text>
            <Carousel games={recommendations}/>
            </View>}
          <Text style={styles.subheading}>Top Rated Games</Text>
          <Carousel games={topRatedGames} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeScroll: {
    // paddingTop: 10,
    paddingBottom: 0,
    margin: 0,
    backgroundColor: "#0a0a31",
  },
  view: {
    paddingBottom: 0,
    margin: 0,
  },
  subheading: {
    color: "#fff",
    fontSize: 20,
    textAlign: "center",
    marginBottom: 10,
    fontWeight: "bold",
  },
  searchbar: {
    margin: 20,
    backgroundColor: "#fff",
    marginHorizontal: 30,
  },
  searchResults: {
    color: "#fff",
    margin: 10,
    padding: 10,
    marginHorizontal: 30,
    // borderBottomWidth: 2,
    // borderBottomColor: "#fff",
    backgroundColor: "rgba(256,256,256,0.15)",
    borderRadius: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  genreChip: {
    backgroundColor: "#fff",
    padding: 0,
    margin: 10,
  },
  genreChipContainer: {
    flexDirection: "row",
    margin: 10,
    marginHorizontal: 20,
  },
  selectedChip: {
    backgroundColor: "#f20089",
    padding: 0,
    margin: 10,
    color: "#fff",
  },
});

export default ListScreen;
