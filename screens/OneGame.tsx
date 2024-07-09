import React, { useState, useEffect } from "react";
import { Linking } from "react-native";
import { Rating, AirbnbRating } from "react-native-elements";
import {
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import {
  AnimatedFAB,
  Provider,
  Portal,
  Modal,
  Button,
  ActivityIndicator
} from "react-native-paper";
import GradientText from "react-native-gradient-texts";
import { getGameById } from "../utils/api";
import { formatGameTitle, formatDescription } from "../utils/utils";

const OneGame = ({ route, visible, animateFrom }) => {

  const [gameData, setGameData] = useState({})
  const [isLoading, setIsLoading] = useState(true)

  const [isExtended, setIsExtended] = useState(false);
  const [rating, setRating] = useState(0);
  const [optionsVisible, setOptionsVisible] = useState(false);
  const { gameid } = route.params;

  useEffect(() => {
    getGameById(gameid).then((result) => {
      setGameData(result)
      setIsLoading(false)
    })
  }, [])

  const handlePlatform = (url) => {
    Linking.openURL(url).catch((err) =>
      console.error("Couldn't load page", err)
    );
  };

  const onRatingCompleted = (rating) => {
    setRating(rating);
  };

  const openOptions = () => {
    setIsExtended(!isExtended);
    setOptionsVisible(!optionsVisible);
  };

  const closeOptions = () => {
    setIsExtended(false);
    setOptionsVisible(false);
  };

  if (isLoading) {
    return <View style={{flex: 1, backgroundColor: "#0a0a31"}}>
      <ActivityIndicator animating={true} color="#f20089" size="large"/>
    </View>
  }

  return (
    <Provider>
      <ScrollView style={styles.scrollView}>
        <View style={styles.imageContainer}>
          <Image source={{uri: gameData.background_image}} style={styles.image} />
        </View>
        <View style={styles.container}>
            <Text style={styles.title}>
              {gameData.name}
            </Text>
        <View style={styles.allRatings}>
            {gameData.ratings.map((rating) => {
              if (rating.title === 'recommended') {
                return <View style={styles.gameStat}>
                <Text style={styles.buttonText}>{rating.title}</Text>
                <Text style={styles.buttonText}>{rating.percent}%</Text>
                </View> 
              }
            })}
            <View style={styles.gameStat}>
                <Text style={styles.buttonText}>Released</Text>
                <Text style={styles.buttonText}>{gameData.released}</Text>
            </View>
            {gameData.esrb_rating ? <View style={styles.gameStat}>
                <Text style={styles.buttonText}>ESRB</Text>
                <Text style={styles.buttonText}>{gameData.esrb_rating.name}</Text>
            </View> : null}
        </View>
        <Text style={styles.description}>{formatDescription(gameData.description)}</Text>
        {/* <Text style={styles.genres}>Genres: {gameData.genres.join(", ")}</Text> */}
        <View style={styles.platformContainer}>
          <Text style={styles.availableOn}>Available On: </Text>
          {gameData.platforms.map((platforms) => (
            <TouchableOpacity
              key={platforms.platform.id}
              // onPress={() => handlePlatform(platform.url)}
              style={styles.button}
            >
              <Text style={styles.buttonText}>{platforms.platform.name} </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.platformContainer}>
          <Text style={styles.availableOn}>Genres: </Text>
          {gameData.genreSlugs.map((genre) => (
              <TouchableOpacity
                key={genre}
                // onPress={() => handlePlatform(platform.url)}
                style={styles.genreButton}
              >
                <Text style={styles.genreButtonText}>{genre}</Text>
              </TouchableOpacity>
            ))}
        </View>
        <View style={styles.platformContainer}>
          <Text style={styles.availableOn}>Tags: </Text>
          {/* {gameData.genres.map((genre) => (
              <TouchableOpacity
                key={genre.id}
                // onPress={() => handlePlatform(platform.url)}
                style={styles.genreButton}
              >
                <Text style={styles.buttonText}>{genre.slug}</Text>
              </TouchableOpacity>
            ))} */}
          {gameData.tags.map((tag) => (
              <TouchableOpacity
                key={tag.id}
                // onPress={() => handlePlatform(platform.url)}
                style={styles.button}
              >
                <Text style={styles.buttonText}>{tag.slug}</Text>
              </TouchableOpacity>
            ))}
        </View>
          <View style={styles.ratingContainer}>
            <AirbnbRating
              showRating={false}
              onFinishRating={onRatingCompleted}
              defaultRating={3}
              // tintColor="#0a0a31"
              // ratingBackgroundColor="#00ff15"
              // ratingColor="#ff0000"
              // type='heart'
              // style={{ borderWidth: 0, padding: 2, borderColor: "#00ff15" }}
            />
          </View>
          </View>
      </ScrollView>
      <Portal>
        <Modal
          visible={optionsVisible}
          onDismiss={closeOptions}
          contentContainerStyle={styles.modalContent}
        >
          <View>
            <Button
              icon="plus"
              mode="contained"
              onPress={() => {
                console.log("Add to My Games");
                closeOptions();
              }}
              style={styles.modalButton}
            >
              Add to My Games
            </Button>
            <Button
              icon="plus"
              mode="contained"
              onPress={() => {
                console.log("Add to Wishlist");
                closeOptions();
              }}
              style={styles.modalButton}
            >
              Add to Wishlist
            </Button>
          </View>
        </Modal>
      </Portal>
      <AnimatedFAB
        icon="plus"
        label="            Add"
        extended={true}
        onPress={openOptions}
        visible={visible}
        animateFrom={"left"}
        iconMode="static"
        style={styles.fabStyle}
      />
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a31",
    paddingHorizontal: 10,
  },
  scrollView: {
    backgroundColor: "#0a0a31",
  },
  titleContainer: {
    width: 420,
    justifyContent: "center",
    alignItems: "center",
  },
  allRatings: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
  },
  gameStat: {
    backgroundColor: "#4cc9f0",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    padding: 10,
    margin: 5
  },
  image: {
    width: "100%",
    backgroundColor: "#0a0a31",
    height: 300,
    marginLeft: "auto",
    marginRight: "auto",
    borderBottomEndRadius: 15,
    borderBottomStartRadius: 15,
   
  },
  imageContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.7,
    shadowRadius: 2,
    elevation: 5, // For Android
    paddingBottom: 10,
  },
  title: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
    textShadowColor: '#f20089', // Set the shadow color
    textShadowOffset: { width: 0, height: 0 }, // Set the shadow offset
    textShadowRadius: 20, // Set the shadow radius
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
    fontSize: 17,
    alignContent: "center",
    marginLeft: "auto",
    marginRight: "auto",
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: "#fff",
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
  genreButton: {
    backgroundColor: "#4cc9f0",
    padding: 5,
    margin: 5,
    borderRadius: 5,
    alignItems: "center",
  },
  genreButtonText: {
    color: "#0a0a31",
    fontSize: 15,
  },
  buttonText: {
    color: "#fff",
    fontSize: 15,
  },
  ratingContainer: {
    marginTop: 25,
    marginBottom: 150,
    // outline: 'none'
  },
  fabStyle: {
    bottom: 50,
    justifyContent: "center",
    alignSelf: "center",
    marginHorizontal: 10,
    padding: 8,
    paddingLeft: 0,
    backgroundColor: "#4cc9f0",
  },
  modalContent: {
    backgroundColor: "#0a0a31",
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 15,
  },
  modalButton: {
    marginVertical: 5,
    backgroundColor: "#f20089",
  },
});

export default OneGame;
