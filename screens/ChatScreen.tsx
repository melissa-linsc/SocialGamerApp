import React, { useEffect, useState } from "react";

import {
  SafeAreaView,
  StatusBar,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
} from "react-native";
import {
  collection,
  getDocs,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { Entypo } from "@expo/vector-icons";

import { db } from "../firebase/config";
import { useAuth } from "../contexts/AuthContext";

const ChatScreen = ({ navigation }) => {
  const [usersFriends, setUsersFriends] = useState([]);

  const { loggedInUser, setLoggedInUser } = useAuth();

  const q = query(
    collection(db, "users"),
    where("uid", "==", loggedInUser.uid)
  );

  useEffect(() => {
    getDocs(q)
      .then((snapshot) => {
        let userData = [];
        snapshot.docs.forEach((doc) => {
          userData.push({ ...doc.data(), id: doc.id });
        });
        const newUserData = userData[0].realFriend.map((friend) => {
          return { ...friend, unreadCount: 0 };
        });
        setUsersFriends(newUserData);
        userData[0].realFriend.forEach((friend) => {
          fetchUnreadMessagesCount(friend.uid);
        });
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  const fetchUnreadMessagesCount = (friendUid) => {
    const chatid =
      friendUid > loggedInUser.uid
        ? `${loggedInUser.uid}-${friendUid}`
        : `${friendUid}-${loggedInUser.uid}`;

    const messagesRef = collection(db, "Chats", chatid, "messages");
    const q = query(messagesRef, where("read", "==", false));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      let count = 0;
      snapshot.forEach((doc) => {
        count++;
      });

      setUsersFriends((prevFriends) => {
        const updatedFriends = prevFriends.map((friend) => {
          if (friend.uid === friendUid) {
            friend.unreadCount = count;
            return friend;
          }
          return friend;
        });
        return updatedFriends;
      });
    });

    return unsubscribe;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar />
      <View>
        <FlatList
          data={usersFriends}
          keyExtractor={(item) => item.uid}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Messages", {
                  name: item.name,
                  uid: item.uid,
                })
              }
            >
              <View style={styles.friendCards}>
                <View style={styles.friend}>
                  <Image source={{ uri: item.avatar }} style={styles.image} />
                  <View>
                    <Text style={styles.name}>{item.name}</Text>
                    {item.unreadCount > 0 ? (
                      <Text style={styles.unreadMsg}>New Unread Messages</Text>
                    ) : null}
                  </View>
                </View>
                <View style={styles.icon}>
                  <Entypo
                    name="arrow-with-circle-right"
                    size={24}
                    color="#f20089"
                  />
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a31",
  },
  friendCards: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#fff",
  },
  friend: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginLeft: 10,
  },
  unreadMsg: {
    fontSize: 15,
    color: "#f20089",
    paddingLeft: 10,
  },
  name: {
    fontSize: 20,
    color: "#fff",
    paddingLeft: 10,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 15,
    backgroundColor: "#fff",
  },
  icon: {
    justifyContent: "flex-end",
    marginRight: 20,
  },
});

export default ChatScreen;
