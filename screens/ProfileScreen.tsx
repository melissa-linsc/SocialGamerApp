import React from "react";
import { SafeAreaView, TouchableOpacity, Text, StyleSheet } from "react-native";
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
        <SafeAreaView>
            <TouchableOpacity onPress={signOutUser} style={styles.button}>
                <Text style={styles.signOutText}>Sign Out</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )

}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#2e2157",
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