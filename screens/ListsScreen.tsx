// src/screens/ListScreen.tsx

import React, { useEffect, useState } from "react";
import { ScrollView, Text, StatusBar, StyleSheet, FlatList, View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../components/Header";
import Carousel from "../components/Carousel";
import { Searchbar } from 'react-native-paper';
import { Feather } from '@expo/vector-icons';

import { getSearchedGames } from "../utils/api";

const ListScreen = ({ navigation }) => {

  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])

  useEffect(() => {
    StatusBar.setBarStyle("light-content");

    getSearchedGames(searchQuery).then((results) => {
      setSearchResults(results)
    })
  }, [searchQuery]);

  const handlePress = (item) => {
    navigation.navigate("Back To Home", { game: item, gameid: item.id });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.searchResults} onPress={() => handlePress(item)}>
      <Text style={{ color: '#fff' }}>{item.slug}</Text>
      <Feather name="arrow-right-circle" size={24} color="#f20089" />
    </TouchableOpacity>
  );

 

  return (
    <SafeAreaView style={styles.safeScroll}>
      <ScrollView>
        <Header navigation={navigation} />
          <Searchbar
            placeholder="Search for a game"
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchbar}
          />
        {searchQuery ? <FlatList
        data={searchResults}
        renderItem={renderItem}
        keyExtractor={(item) => item.id} // Use a unique key extractor
      /> : null}
        <Text style={styles.subheading}>Your Recommendations</Text>
        <Carousel />
        <Text style={styles.subheading}>RPGs</Text>
        <Carousel />
        <Text style={styles.subheading}>Top Rated Games</Text>
        <Carousel />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeScroll: {
    paddingTop: 10,
    backgroundColor: "#0a0a31",
  },
  subheading: {
    color: "#fff",
    fontSize: 20,
    textAlign: "center",
    marginBottom: 10,
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
    backgroundColor:"rgba(256,256,256,0.15)",
    borderRadius: 15,
    flexDirection: "row",
    justifyContent: "space-between",
   },
});

export default ListScreen;
