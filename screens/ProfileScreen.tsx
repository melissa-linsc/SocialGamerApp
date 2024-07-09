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
import { ActivityIndicator } from "react-native-paper";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import Carousel from "../components/Carousel";

import Header from "../components/Header";
import { fetchUserById } from "../utils/api";

function ProfileScreen({ navigation }) {
  const { loggedInUser, setLoggedInUser } = useAuth();
  const [loggedInUserDoc, setLoggedInUserDoc] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState({})

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

  useEffect(() => {
    const userRef = query(
      collection(db, "users"),
      where("uid", "==", loggedInUser.uid)
    );

    getDocs(userRef)
      .then((snapshot) => {
        let userData = [];
        snapshot.docs.forEach((doc) => {
          userData.push({ ...doc.data(), id: doc.id });
        });

        setLoggedInUserDoc(userData[0]);
      })
      .catch((err) => {
        console.log(err.message);
      });

      fetchUserById(loggedInUser.uid).then((result) => {
        setProfileData(result)
        setIsLoading(false);
      })
  }, []);

  if (isLoading) {
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0a0a31" }}>
      <ActivityIndicator animating={true} color="#f20089" size="large" />
    </SafeAreaView>
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
        <Carousel />
        <Text style={styles.text}> My WishList </Text>
        <Carousel />
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
