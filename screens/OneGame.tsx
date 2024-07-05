import React, { useState } from "react";
import { Linking } from "react-native";
import { Rating } from "react-native-ratings";
import {
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";

const OneGame = ({ route }) => {
  const [rating, setRating] = useState(0);
  const { game } = route.params;

  const handlePlatform = (url) => {
    Linking.openURL(url).catch((err) =>
      console.error("Couldn't load page", err)
    );
  };

  const onRatingCompleted = (rating) => {
    setRating(rating);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{game.title}</Text>
      <Image source={game.img} style={styles.image} />
      <View style={styles.ratingContainer}>
        <Rating
          showRating={false}
          onFinishRating={onRatingCompleted}
          tintColor="#0a0a31"
        />
      </View>
      <Text style={styles.description}>{game.description}</Text>
      <Text style={styles.genres}>Genres: {game.genres.join(", ")}</Text>
      <View style={styles.platformContainer}>
        <Text style={styles.availableOn}>Available On: </Text>
        {game.platforms.map((eachPlatform, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handlePlatform(eachPlatform.url)}
            style={styles.button}
          >
            <Text style={styles.buttonText}>{eachPlatform.name} </Text>
          </TouchableOpacity>
        ))}
      </View>
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
  platformContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    flexWrap: "wrap",
  },
  availableOn: {
    color: "#fff",
    fontSize: 15,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#f20089",
    padding: 5,
    margin: 5,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 15,
  },
  ratingContainer: {
    marginTop: 15,
    
  },
});

export default OneGame;
