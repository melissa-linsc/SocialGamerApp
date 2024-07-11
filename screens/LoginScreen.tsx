import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import GradientText from "react-native-gradient-texts";
import { authentication } from "../firebase/config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useAuth } from "../contexts/AuthContext";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState(null);

  const inputRef = React.useRef();
  const passwordRef = React.useRef();

  const [isLoading, setIsLoading] = useState(false);

  const { setLoggedInUser } = useAuth();

  const handleSignIn = async () => {
    setIsLoading(true);

    signInWithEmailAndPassword(authentication, email, password)
      .then((res) => {
        console.log("successful");
        setLoggedInUser(res.user);
        return res.user.uid
      })

      .catch((err) => {
        console.log(err);
        setError("Incorrect Email/Password ");
      })

      .finally(() => setIsLoading(false));
  };

  return (
    <View style={styles.container}>
      <GradientText
        text={"Welcome!"}
        fontSize={40}
        width={420}
        locations={{ x: 210, y: 70 }}
        isGradientFill
        gradientColors={["#f20089", "#2d00f7"]}
      />
      <Image
        source={{
          uri: "https://www.creativefabrica.com/wp-content/uploads/2023/05/08/Video-Game-Controller-Logo-Graphics-69127373-1-580x387.png",
        }}
        style={styles.logo}
      />

      <TextInput
        ref={inputRef}
        style={styles.input}
        placeholder="Enter your email"
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#fff"
        value={email}
        onChangeText={(email) => setEmail(email)}
      />

      <TextInput
        ref={passwordRef}
        style={styles.input}
        placeholder="Enter your password"
        placeholderTextColor="#fff"
        value={password}
        secureTextEntry
        onChangeText={(text) => setPassword(text)}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}

      <TouchableOpacity onPress={handleSignIn} style={styles.button}>
        <Text style={styles.loginText}>Login</Text>
        {isLoading && (
          <ActivityIndicator
            size="small"
            color="white"
            style={{
              alignSelf: "center",
              justifyContent: "center",
              paddingLeft: 10,
            }}
          />
        )}
      </TouchableOpacity>
      <View
        style={{
          flexDirection: "row",
        }}
      >
        <Text style={styles.downText}>Don't have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
          <Text style={styles.signup}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 20,
    flex: 1,
    backgroundColor: "#0a0a31",
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: "#920075",
  },
  input: {
    width: "80%",
    height: 40,
    borderColor: "gray",
    borderRadius: 15,
    borderWidth: 1,
    marginBottom: 16,
    paddingLeft: 8,
    paddingRight: 8,
    color: "#fff",
  },
  button: {
    backgroundColor: "#f20089",
    borderRadius: 15,
    padding: 10,
    margin: 14,
    width: "78%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  loginText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
    alignSelf: "center",
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "#fff",
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  downText: {
    color: "#f20089",
    fontSize: 16,
    fontWeight: "400",
    marginTop: 10,
  },
  signup: {
    alignSelf: "flex-start",
    textDecorationLine: "underline",
    color: "#f20089",
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 5,
    marginTop: 10,
  },
  errorText: {
    color: "#fff"
  }
});

export default LoginScreen;
