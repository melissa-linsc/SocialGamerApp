import {
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
  } from "react-native";
  import React from "react";
  
  import { useAuth } from "../contexts/AuthContext";
  import { authentication } from "../firebase/config";
  import { signOut } from "firebase/auth";
  
  const HomeScreen = ({navigation}) => {
    const { loggedInUser, setLoggedInUser } = useAuth();
  
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
  
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#2e2157"
        }}
      >
        <Text style={styles.text}>{loggedInUser.displayName}</Text>
        <Text style={styles.text}>{loggedInUser.photoURL}</Text>
        <TouchableOpacity onPress={signOutUser} style={styles.button}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Friends")}>
          <Text style={styles.signOutText}>Friends</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  };
  
  export default HomeScreen;
  
  const styles = StyleSheet.create({
    button: {
      backgroundColor: "#920075",
      borderRadius: 20,
      padding: 10,
      margin: 14,
      width: "78%",
      height: 50,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
    },
    signOutText: {
      color: "white",
      fontWeight: "bold",
      textAlign: "center",
      fontSize: 16,
      alignSelf: "center",
    },
    text: {
      color: "#fff"
    }
  });