import React from "react";
import {
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";

const OneGame = ({ route }) => {
  const { game } = route.params;
  //   const splitPlatforms = game.platforms.join(", ");

  const handlePlatform = (eachPlatform, index) => {
    console.log(eachPlatform);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{game.title}</Text>
      <Image source={game.img} style={styles.image} />
      <Text style={styles.description}>{game.description}</Text>
      <Text style={styles.genres}>Genres: {game.genres.join(", ")}</Text>
      <Text style={styles.genres}>
        Available On: {game.platforms.join(", ")}
      </Text>
      {game.platforms.map((eachPlatform, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => handlePlatform(eachPlatform)}
        >
          <Text style={styles.platform}>{eachPlatform.name}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a31",
  },
  image: {
    width: "75%",
    height: 300,
    marginLeft: "auto",
    marginRight: "auto",
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
    fontSize: 15,
    textAlign: "center",
    marginTop: 20,
  },
  description: {
    color: "#fff",
    textAlign: "center",
    marginTop: 20,
    width: 400,
    fontSize: 17,
    alignContent: "center",
    marginLeft: "auto",
    marginRight: "auto",
  },
});

export default OneGame;
