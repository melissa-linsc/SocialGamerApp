import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Image,
  Button,
} from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { useState, useEffect } from "react";
import { db } from "../firebase/config";

import {
  collection,
  getDocs,
  updateDoc,
  doc,
  query,
  where,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";

import Header from "../components/Header";
import React from "react";

const FriendsScreen = ({ navigation }) => {
  const { loggedInUser, setLoggedInUser } = useAuth();

  const [loggedInUserDoc, setLoggedInUserDoc] = useState({});
  const [targetDoc, setTargetDoc] = useState({});
  const [userFriends, setUserFriends] = useState([]);
  const [users, setUsers] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);

  useEffect(() => {
    const usersRef = collection(db, "users");

    const q = query(
      collection(db, "users"),
      where("uid", "!=", loggedInUser.uid)
    );

    const userRef = query(
      collection(db, "users"),
      where("uid", "==", loggedInUser.uid)
    );

    getDocs(q)
      .then((snapshot) => {
        let userData = [];
        snapshot.docs.forEach((doc) => {
          userData.push({ ...doc.data(), id: doc.id });
        });
        setUsers(userData);
      })
      .catch((err) => {
        console.log(err.message);
      });

    getDocs(userRef)
      .then((snapshot) => {
        let userData = [];
        // console.log(snapshot.docs)
        snapshot.docs.forEach((doc) => {
          userData.push({ ...doc.data(), id: doc.id });
        });

        setLoggedInUserDoc(userData[0]);
        setUserFriends(userData[0].realFriend);
        setFriendRequests(userData[0].req);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  function handleSendFriendRequest(item) {
    const userQuery = query(
      collection(db, "users"),
      where("uid", "==", item.uid)
    );

    getDocs(userQuery)
      .then((querySnapshot) => {
        if (!querySnapshot.empty) {
          // Assuming there is only one document matching the query
          const userDoc = querySnapshot.docs[0];
          const userDocRef = doc(db, "users", userDoc.id);

          // Update the realFriend array field using arrayUnion
          updateDoc(userDocRef, {
            req: arrayUnion(loggedInUserDoc),
          });
        } else {
          throw new Error("No matching user document found.");
        }
      })
      .then(() => {
        console.log("Friend Requests updated successfully!");
      })
      .catch((error) => {
        console.error("Error updating friend requests:", error);
      });
  }

  function handleAddFriend(item) {
    const userQuery = query(
      collection(db, "users"),
      where("uid", "==", item.uid)
    );

    // Execute the query
    getDocs(userQuery)
      .then((querySnapshot) => {
        if (!querySnapshot.empty) {
          // Assuming there is only one document matching the query
          const userToAddDoc = querySnapshot.docs[0];
          const userToAddDocRef = doc(db, "users", userToAddDoc.id);

          const currentUserRef = doc(db, "users", loggedInUserDoc.id);

          // Update the realFriend array field using arrayUnion
          updateDoc(userToAddDocRef, {
            realFriend: arrayUnion(loggedInUserDoc),
          });

          updateDoc(currentUserRef, {
            realFriend: arrayUnion(item),
          });

          updateDoc(currentUserRef, {
            req: arrayRemove(item),
          });

          setUserFriends((currFriends) => {
            return [item, ...currFriends];
          });

          setFriendRequests((currFriendRequests) => {
            return currFriendRequests.filter((friend) => {
              return friend.uid !== item.uid;
            });
          });
        } else {
          throw new Error("No matching user document found.");
        }
      })
      .then(() => {
        console.log("Real friends updated successfully!");
      })
      .catch((error) => {
        console.error("Error updating real friends:", error);
      });
  }

  function handleRemoveFriend(item) {
    const userQuery = query(
      collection(db, "users"),
      where("uid", "==", item.uid)
    );

    getDocs(userQuery)
      .then((querySnapshot) => {
        if (!querySnapshot.empty) {
          const userToRemoveDoc = querySnapshot.docs[0];
          const userToRemoveDocRef = doc(db, "users", userToRemoveDoc.id);

          const currentUserRef = doc(db, "users", loggedInUserDoc.id);
          updateDoc(userToRemoveDocRef, {
            realFriend: arrayRemove(loggedInUserDoc),
          });

          updateDoc(currentUserRef, {
            realFriend: arrayRemove(item),
          });

          setUserFriends((currFriends) => {
            return currFriends.filter((friend) => {
              return friend.uid !== item.uid;
            });
          });
        } else {
          throw new Error("No matching user document found.");
        }
      })
      .then(() => {
        console.log("Real friends updated successfully!");
      })
      .catch((error) => {
        console.error("Error updating real friends:", error);
      });
  }

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Header navigation={navigation} />
        <Text style={styles.subheading}>Friend Requests</Text>
        <FlatList
          data={friendRequests}
          style={styles.list}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.user}>
              <Image style={styles.image} source={{ uri: item.avatar }} />
              <Text style={styles.text}>{item.name}</Text>
              <Button
                title="Accept"
                onPress={() => handleAddFriend(item)}
              ></Button>
            </View>
          )}
        />
        <Text style={styles.subheading}>My Friends</Text>
        <FlatList
          data={userFriends}
          style={styles.list}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.user}>
              <Image style={styles.image} source={{ uri: item.avatar }} />
              <Text style={styles.text}>{item.name} </Text>
              <Button
                title="Remove"
                onPress={() => handleRemoveFriend(item)}
              ></Button>
            </View>
          )}
        />
        <Text style={styles.subheading}>Find Friends</Text>
        <FlatList
          data={users}
          style={styles.list}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.user}>
              <Image style={styles.image} source={{ uri: item.avatar }} />
              <Text style={styles.text}>{item.name} </Text>

              {!item.req.some((friend) => friend.uid === loggedInUser.uid) ? (
                <Button
                  title="Add Friend"
                  onPress={() => handleSendFriendRequest(item)}
                ></Button>
              ) : null}
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default FriendsScreen;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingTop: 60,
    backgroundColor: "#0a0a31",
    flex: 1,
  },
  view: {
    padding: 20,
  },
  list: {
    padding: 20,
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 20,
    backgroundColor: "#920075",
    borderRadius: 50,
  },
  user: {
    // padding: 20,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    padding: 20,
    margin: 10,
    borderRadius: 15,
    backgroundColor: "#292441",
  },
  text: {
    color: "#fff",
  },
  subheading: {
    color: "#d9d6e7",
    fontSize: 20,
    paddingHorizontal: 30,
  },
  homeButton: {
    backgroundColor: "#920075",
    padding: 10,
    borderRadius: 50,
    margin: 20,
  },
});
