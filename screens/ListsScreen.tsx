import React, {useEffect} from "react";
import {
  ScrollView,
  View,
  ImageURISource,
  Text,
  Animated,
  StyleSheet, StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import RecListItems from "../components/RecListItems";
import Header from "../components/Header";
import Carousel from "../components/Carousel";

interface RecGame {
  id: number;
  title: string;
  genres: string[];
  img: ImageURISource;
}

const ListScreen = ({ navigation }) => {
  //   const scrollX = new Animated.Value(0);
  useEffect(() => {
    // Set status bar style when component mounts
    StatusBar.setBarStyle('light-content'); // or 'dark-content'
  }, []);

  const recommendationsData: RecGame[] = [
    {
      id: 1,
      title: "Cult of the Lamb",
      genres: ["strategy", "adventure", "roguelike", "fantasy"],
      img: require("../assets/CoverImgs/CultoftheLamb.png"),
    },
    {
      id: 2,
      title: "Celeste",
      genres: ["platform", "adventure", "indie", "fantasy"],
      img: require("../assets/CoverImgs/celesteCover.jpg"),
    },
    {
      id: 3,
      title: "Ori and the Blind Forest",
      genres: ["fantasy", "adventure", "platform"],
      img: require("../assets/CoverImgs/OriCover.jpg"),
    },
  ];

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
