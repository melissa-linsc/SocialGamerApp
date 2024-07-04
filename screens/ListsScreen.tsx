// src/screens/ListScreen.tsx

import React, { useEffect } from "react";
import { ScrollView, Text, StatusBar, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../components/Header";
import Carousel from "../components/Carousel";

const ListScreen = ({ navigation }) => {
  useEffect(() => {
    StatusBar.setBarStyle("dark-content");
  }, []);

  return (
    <SafeAreaView style={styles.safeScroll}>
      <ScrollView>
        <Header navigation={navigation} />
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
});

export default ListScreen;
