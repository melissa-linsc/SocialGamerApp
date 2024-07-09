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
  ActivityIndicator,
} from "react-native-paper";
import { useAuth } from "../contexts/AuthContext";
import {
  getGameById,
  fetchUsers,
  postToWishlist,
  postToLibrary,
  deleteFromLibrary,
  deleteFromWishlist,
} from "../utils/api";
import { formatGameTitle, formatDescription } from "../utils/utils";

const OneGame = ({ route, visible, onRemove }) => {
  const { loggedInUser } = useAuth();
  const [gameData, setGameData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const [isExtended, setIsExtended] = useState(false);
  const [rating, setRating] = useState(0);
  const [optionsVisible, setOptionsVisible] = useState(false);
  const [modalType, setModalType] = useState(null); // Add state to track modal type
  const { gameid } = route.params;

  useEffect(() => {
    getGameById(gameid).then((result) => {
      setGameData(result);
      setIsLoading(false);
    });
  }, []);

  const handlePlatform = (url) => {
    Linking.openURL(url).catch((err) =>
      console.error("Couldn't load page", err)
    );
  };

  const onRatingCompleted = (rating) => {
    setRating(rating);
  };

  const openOptions = (type) => {
    setModalType(type); // Set the modal type when opening options
    setOptionsVisible(true);
  };

  const closeOptions = () => {
    setOptionsVisible(false);
    setModalType(null); // Reset the modal type when closing options
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: "#0a0a31" }}>
        <ActivityIndicator animating={true} color="#f20089" size="large" />
      </View>
    );
  }

  const handleWishlist = () => {
    const currentUser = loggedInUser.displayName;

    fetchUsers().then((result) => {
      const foundUser = result.allUsers.find(
        (user) => user.name === currentUser
      );
      if (foundUser) {
        const userId = foundUser.uid;
        if (modalType === "add") {
          postToWishlist(userId, gameid).then((result) => {
            return result.postedWish.wishlist;
          });
        } else if (modalType === "remove") {
         //remove from wishlist logic
        }
      }
    });
    closeOptions();
  };

  const handleLibrary = () => {
    const currentUser = loggedInUser.displayName;

    fetchUsers().then((result) => {
      const foundUser = result.allUsers.find(
        (user) => user.name === currentUser
      );
      if (foundUser) {
        const userId = foundUser.uid;
        if (modalType === "add") {
          postToLibrary(userId, gameid).then((result) => {
            return result.postedWish.library;
          });
        } else if (modalType === "remove") {
          //remove from library logic
        }
      }
    });
    closeOptions();
  };

  return (
    <Provider>
      <ScrollView style={styles.scrollView}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: gameData.background_image }}
            style={styles.image}
          />
        </View>
        <View style={styles.container}>
          <Text style={styles.title}>{gameData.name}</Text>
          <View style={styles.allRatings}>
            {gameData.ratings.map((rating) => {
              if (rating.title === "recommended") {
                return (
                  <View style={styles.gameStat} key={rating.id}>
                    <Text style={styles.buttonText}>{rating.title} </Text>
                    <Text style={styles.buttonText}>{rating.percent}% </Text>
                  </View>
                );
              }
            })}
            <View style={styles.gameStat}>
              <Text style={styles.buttonText}>Released</Text>
              <Text style={styles.buttonText}>{gameData.released} </Text>
            </View>
            {gameData.esrb_rating ? (
              <View style={styles.gameStat}>
                <Text style={styles.buttonText}>ESRB</Text>
                <Text style={styles.buttonText}>
                  {gameData.esrb_rating.name}{" "}
                </Text>
              </View>
            ) : null}
          </View>
          <Text style={styles.description}>
            {formatDescription(gameData.description)}
          </Text>
          <View style={styles.platformContainer}>
            <Text style={styles.availableOn}>Available On: </Text>
            {gameData.platforms.map((platforms) => (
              <TouchableOpacity
                key={platforms.platform.id}
                style={styles.button}
              >
                <Text style={styles.buttonText}>
                  {platforms.platform.name}{" "}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.platformContainer}>
            <Text style={styles.availableOn}>Genres: </Text>
            {gameData.genreSlugs.map((genre) => (
              <TouchableOpacity key={genre} style={styles.genreButton}>
                <Text style={styles.genreButtonText}>{genre}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.platformContainer}>
            <Text style={styles.availableOn}>Tags: </Text>
            {gameData.tags.map((tag) => (
              <TouchableOpacity key={tag.id} style={styles.button}>
                <Text style={styles.buttonText}>{tag.slug} </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.ratingContainer}>
            <AirbnbRating
              showRating={false}
              onFinishRating={onRatingCompleted}
              defaultRating={3}
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
            {modalType === "add" ? (
              <>
                <Button
                  icon="plus"
                  mode="contained"
                  onPress={handleLibrary}
                  style={styles.modalButton}
                >
                  Add to My Games
                </Button>
                <Button
                  icon="plus"
                  mode="contained"
                  onPress={handleWishlist}
                  style={styles.modalButton}
                >
                  Add to Wishlist
                </Button>
              </>
            ) : (
              <>
                <Button
                  icon="minus"
                  mode="contained"
                  onPress={handleLibrary}
                  style={styles.modalButton}
                >
                  Remove From My Games
                </Button>
                <Button
                  icon="minus"
                  mode="contained"
                  onPress={handleWishlist}
                  style={styles.modalButton}
                >
                  Remove From Wishlist
                </Button>
              </>
            )}
          </View>
        </Modal>
      </Portal>
      <AnimatedFAB
        icon="plus"
        label="            Add"
        extended={true}
        onPress={() => openOptions("add")} // Pass 'add' as the modal type
        visible={visible}
        animateFrom={"left"}
        iconMode="static"
        style={styles.fabStyleAdd}
      />
      <AnimatedFAB
        icon="minus"
        label="          Remove"
        extended={true}
        onPress={() => openOptions("remove")} // Pass 'remove' as the modal type
        visible={visible}
        animateFrom={"left"}
        iconMode="static"
        style={styles.fabStyleRemove}
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
    margin: 5,
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
    shadowColor: "#000",
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
    textShadowColor: "#f20089", // Set the shadow color
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
  fabStyleAdd: {
    bottom: 50,
    justifyContent: "center",
    alignSelf: "center",
    marginHorizontal: 10,
    padding: 8,
    paddingLeft: 0,
    backgroundColor: "#4cc9f0",
    right: 10,
  },
  fabStyleRemove: {
    bottom: 50,
    justifyContent: "center",
    alignSelf: "center",
    marginHorizontal: 10,
    padding: 8,
    paddingLeft: 0,
    backgroundColor: "#4cc9f0",
    left: 10,
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
