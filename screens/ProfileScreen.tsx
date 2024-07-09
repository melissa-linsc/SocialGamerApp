import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  View,
  ScrollView,
} from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { authentication, db } from "../firebase/config";
import { signOut } from "firebase/auth";
import {
  fetchUsers,
  getGameById,
  fetchUserById,
  deleteFromLibrary,
} from "../utils/api";
import { ActivityIndicator } from "react-native-paper";
import { collection, getDocs, query, where } from "firebase/firestore";
import Carousel from "../components/Carousel";
import Header from "../components/Header";

function ProfileScreen({ navigation }) {
  const [userWishlist, setUserWishlist] = useState([]);
  const [userLibrary, setUserLibrary] = useState([]);
  const { loggedInUser, setLoggedInUser } = useAuth();
  const [loggedInUserDoc, setLoggedInUserDoc] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState({});

  const signOutUser = () => {
    signOut(authentication)
      .then((res) => {
        console.log(res);
        setLoggedInUser(null);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const filterDuplicates = (games) => {
    const uniqueGames = [];
    const gameIds = new Set();

    games.forEach((game) => {
      if (!gameIds.has(game.id)) {
        uniqueGames.push(game);
        gameIds.add(game.id);
      }
    });

    return uniqueGames;
  };

  const fetchUserData = async () => {
    try {
      const userRef = query(
        collection(db, "users"),
        where("uid", "==", loggedInUser.uid)
      );

      const snapshot = await getDocs(userRef);
      const userData = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      setLoggedInUserDoc(userData[0]);

      const profileResult = await fetchUserById(loggedInUser.uid);
      setProfileData(profileResult);
      setIsLoading(false);

      const usersResult = await fetchUsers();
      const foundUser = usersResult.allUsers.find(
        (user) => user.name === loggedInUser.displayName
      );

      if (foundUser) {
        const wishlistDetails = await Promise.all(
          foundUser.wishlist.map((game) => getGameById(game.gameId))
        );
        const filteredWishlistDetails = wishlistDetails.filter(
          (game) => game !== undefined
        );

        const libraryDetails = await Promise.all(
          foundUser.library.map((game) => getGameById(game.gameId))
        );
        const filteredLibraryDetails = libraryDetails.filter(
          (game) => game !== undefined
        );

        setUserWishlist(filterDuplicates(filteredWishlistDetails));
        setUserLibrary(filterDuplicates(filteredLibraryDetails));
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // const removeFromList = (gameId, listType) => {
  //   if (listType === "wishlist") {
  //     const updatedWishlist = userWishlist.filter((game) => game.id !== gameId);
  //     setUserWishlist(updatedWishlist);
  //   } else if (listType === "library") {
  //     const updatedLibrary = userLibrary.filter((game) => game.id !== gameId);
  //     setUserLibrary(updatedLibrary);
  //     deleteFromLibrary(loggedInUser.uid, gameId).catch((error) =>
  //       console.error("Error removing from library:", error)
  //     );
  //   }
  // };

  useEffect(() => {
    fetchUserData();
  }, [loggedInUser.displayName, loggedInUser.uid]);

  useEffect(() => {
    fetchUsers().then((result) => {
      const foundUser = result.allUsers.find(
        (user) => user.name === loggedInUser.displayName
      );
      if (foundUser) {
        const currentWishlist = foundUser.wishlist.map((game) => game.gameId);
        Promise.all(currentWishlist.map((gameId) => getGameById(gameId))).then(
          (gameResults) => {
            const uniqueWishlist = filterDuplicates(
              gameResults.filter((game) => game !== undefined)
            );
            setUserWishlist(uniqueWishlist);
          }
        );

        const currentLibrary = foundUser.library.map((game) => game.gameId);
        Promise.all(currentLibrary.map((gameId) => getGameById(gameId))).then(
          (gameResults) => {
            const uniqueLibrary = filterDuplicates(
              gameResults.filter((game) => game !== undefined)
            );
            setUserLibrary(uniqueLibrary);
          }
        );
      }
    });
  }, []);

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#0a0a31" }}>
        <ActivityIndicator animating={true} color="#f20089" size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Header navigation={navigation} />
        <View style={styles.container}>
          <Image style={styles.image} source={{ uri: profileData.avatar }} />
          <Text style={styles.title}>{profileData.name} </Text>
          <View>
            <Text style={styles.text}>Email: {profileData.email} </Text>
          </View>
        </View>
        <Text style={styles.text}> My Library </Text>
        <Carousel
          games={userLibrary}
          onRemove={(gameId) => removeFromList(gameId, "library")}
        />
        <Text style={styles.text}> My WishList </Text>
        <Carousel
          games={userWishlist}
          onRemove={(gameId) => removeFromList(gameId, "wishlist")}
        />
        <View style={styles.container}>
          <TouchableOpacity onPress={signOutUser} style={styles.button}>
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    flex: 1,
    backgroundColor: "#0a0a31",
    alignItems: "center",
  },
  title: {
    color: "#fff",
    fontSize: 30,
    marginTop: 20,
  },
  text: {
    color: "#fff",
    fontSize: 20,
    paddingVertical: 20,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#f20089",
    borderRadius: 20,
    padding: 10,
    margin: 14,
    width: "78%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  image: {
    width: 100,
    height: 100,
    backgroundColor: "#920075",
    borderRadius: 50,
    marginTop: 0,
    paddingTop: 0,
  },
  signOutText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
    alignSelf: "center",
  },
});

export default ProfileScreen;
