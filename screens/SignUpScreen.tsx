import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { authentication, db } from "../firebase/config";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useAuth } from "../contexts/AuthContext";
import { setDoc,doc} from 'firebase/firestore';

const SignUpScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState('https://robohash.org/default');
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const { setLoggedInUser } = useAuth();

  const handleSignUp = () => {
    setIsLoading(true);
    createUserWithEmailAndPassword(authentication, email, password)
      .then((res) => {
        const user=res.user
        setDoc(doc(db, "users", user.uid), { uid:user.uid, email:email, name:name, req:[], realFriend:[], avatar:avatar  });
        updateProfile(user, {
          displayName: name,
          photoURL: 'https://robohash.org/default',
        })
        return user
      })
      .then((user) => {
        console.log(user);
        setLoggedInUser(user);
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
          placeholder='Username' 
          placeholderTextColor="#fff"
          autoCapitalize="none"
          value={name}
          onChangeText={(text) => setName(text)}
            />
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
    backgroundColor: "#0a0a31",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#fff"
  },
  input: {
    color: "#fff",
    width: "80%",
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 15,
    marginBottom: 16,
    paddingLeft: 8,
  },
  button: {
    backgroundColor: "#f20089",
    width: "80%",
    paddingVertical: 15,
    borderRadius: 15,
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