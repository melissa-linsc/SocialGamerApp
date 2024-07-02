import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ImageBackground
} from "react-native";
import GradientText from "react-native-gradient-texts";

const WelcomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* <ImageBackground source={require('../assets/geometric-shapes-neon-lights-background/3449559.jpg')} resizeMode="cover" style={styles.background}> */}
      <GradientText
        text={"Gamerly"}
        fontSize={60}
        width={420}
        locations={{ x: 210, y: 65 }}
        isGradientFill
        gradientColors={["#f20089", "#2d00f7"]}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          navigation.navigate("Login");
        }}
      >
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          navigation.navigate("SignUp");
        }}
      >
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      {/* </ImageBackground> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#0a0a31"
  },
  background: {
    flex: 1,
    justifyContent: "center",
    width: 500,
    height: "120%",
    alignItems: "center"
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#f20089",
    width: "60%",
    paddingVertical: 15,
    marginHorizontal: 15,
    borderRadius: 15,
    marginBottom: 20,
    marginTop: 10,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default WelcomeScreen;