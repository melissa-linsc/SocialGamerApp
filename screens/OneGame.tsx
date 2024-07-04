import React from "react";
import { Text, Image, StyleSheet, ScrollView } from "react-native";

const OneGame = ({ route }) => {
  const { game } = route.params;

  return (
    <ScrollView style={styles.container}>
      <Image source={game.img} style={styles.image} />
      <Text style={styles.title}>{game.title}</Text>
      <Text style={styles.genres}>{game.genres.join(", ")}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a31",
  },
  image: {
    width: "100%",
    height: 300,
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
  },
  genres: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
});

export default OneGame;
