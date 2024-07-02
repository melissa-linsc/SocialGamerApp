import React from "react";
import { SafeAreaView, TouchableOpacity, Text, StyleSheet, Image } from "react-native";
import { useAuth } from "../contexts/AuthContext"
import { authentication } from "../firebase/config";
import { signOut } from "firebase/auth";

function ProfileScreen() {

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
        <SafeAreaView style={styles.container}>
            <Image 
                style={styles.image}
                source={{uri: loggedInUser.photoURL}}
            /> 
            <Text style={styles.title}>{loggedInUser.displayName}</Text>
            <TouchableOpacity onPress={signOutUser} style={styles.button}>
                <Text style={styles.signOutText}>Sign Out</Text>
            </TouchableOpacity>
            <Text> My Library </Text>
        </SafeAreaView>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#2e2157",
        alignItems: "center",
    },
    title: {
        color: "#fff",
        fontSize: 30,
        marginTop: 20,
    },
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
    image: {
        width: 100,
        height: 100,
        backgroundColor:  "#920075",
        borderRadius: 50,
        marginTop: 20,
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

export default ProfileScreen