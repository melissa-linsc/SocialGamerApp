import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { authentication } from "../firebase/config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useAuth } from "../contexts/AuthContext";

const SignUpScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const { setLoggedInUser } = useAuth();

  const handleSignUp = () => {
    setIsLoading(true);
    createUserWithEmailAndPassword(authentication, email, password)
      .then((res) => {
        console.log(res.user);
        setLoggedInUser(res.user);
      })
      .catch((re) => {
        console.log(re);
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#fff"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#fff"
        secureTextEntry
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        placeholderTextColor="#fff"
        secureTextEntry
        value={confirmPassword}
        onChangeText={(text) => setConfirmPassword(text)}
      />
      <TouchableOpacity onPress={handleSignUp} style={styles.button}>
        <Text style={styles.buttonText}>Sign Up</Text>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2e2157",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#fff"
  },
  input: {
    width: "80%",
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 50,
    marginBottom: 16,
    paddingLeft: 8,
  },
  button: {
    backgroundColor: "#920075",
    width: "80%",
    paddingVertical: 15,
    borderRadius: 50,
    marginTop: 10,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default SignUpScreen;