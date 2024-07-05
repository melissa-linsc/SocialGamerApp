import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Image,
  Button,
  TouchableOpacity,
} from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { useState, useEffect } from "react";
import { db } from "../firebase/config";

import { Ionicons } from '@expo/vector-icons';

import {
  collection,
  getDocs,
  updateDoc,
  doc,
  query,
  where,
  arrayUnion,
  arrayRemove,
  onSnapshot,
  writeBatch
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
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('uid', '!=', loggedInUser.uid));
    const userRef = query(usersRef, where('uid', '==', loggedInUser.uid));

    const unsubscribeUserRef = onSnapshot(userRef, (snapshot) => {
      let userData = [];
      snapshot.docs.forEach((doc) => {
        userData.push({ ...doc.data(), id: doc.id });
      });

      if (userData[0]) {
        setLoggedInUserDoc(userData[0]);
        setUserFriends(userData[0].realFriend);
        setFriendRequests(userData[0].req);

      }
    }, (error) => {
      console.log('Error fetching logged-in user:', error.message);
    });

    const unsubscribeUsers = onSnapshot(q, (snapshot) => {
      let userData = [];
      snapshot.docs.forEach((doc) => {
        userData.push({ ...doc.data(), id: doc.id });
      });

      setUsers(userData);

    }, (error) => {
      console.log('Error fetching users:', error.message);
    });

    // Cleanup listeners on unmount
    return () => {
      unsubscribeUserRef();
      unsubscribeUsers();
    };
  }, [loggedInUser.uid]);



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

    if (userFriends.some(friend => friend.uid === item.uid)) {
      console.log("Friend already added");
      return;  
    }
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

          setUsers((currUsers) => {
            console.log(currUsers)
            return currUsers.filter((user) => { return user.uid !== item.uid});
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
    const itemDocRef = doc(db, 'users', item.id);
    const loggedInUserDocRef = doc(db, 'users', loggedInUserDoc.id);

    // Update item's document to remove loggedInUser from realFriend array
    updateDoc(itemDocRef, {
        realFriend: item.realFriend.filter(friend => friend.uid !== loggedInUserDoc.uid)
    })
    .then(() => {
        // Update loggedInUser's document to remove item from realFriend array
        return updateDoc(loggedInUserDocRef, {
            realFriend: loggedInUserDoc.realFriend.filter(friend => friend.uid !== item.uid)
        });

    })
    .then(() => {
        console.log('Friends removed successfully.');
        setUsers((currUsers) => {
          // Check if the removed friend is already in the users list
          const isFriendInList = currUsers.some(user => user.uid === item.uid);
          if (!isFriendInList) {
            // If not already in the list, add them back
            return [...currUsers, item];
          }
          // Otherwise, return the current list as is
          return currUsers;
        });
    })
    .catch(error => {
        console.error('Error removing friends:', error.message);
    });
  }

  function handleDeclineFriend(item) {
    const currentUserRef = doc(db, "users", loggedInUserDoc.id);

    updateDoc(currentUserRef, {
      req: arrayRemove(item),
    });

    setFriendRequests((currFriendRequests) => {
      return currFriendRequests.filter((friend) => {
        return friend.uid !== item.uid;
      });
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.view}>
        <Header navigation={navigation} />
        <Text style={styles.subheading}>Friend Requests</Text>
        <FlatList
          data={friendRequests}
          style={styles.list}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.user}>
                <Image style={styles.image} source={{ uri: item.avatar }} />
                <View style={styles.friendRequest}>
                  <Text style={styles.text}>{item.name} sent you a friend request!</Text>
                  <View style={styles.acceptDecline}>
                      <TouchableOpacity
                      onPress={() => handleAddFriend(item)}
                      style={styles.button}
                    >
                      <Text style={styles.text}>Accept</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleDeclineFriend(item)}
                      style={styles.button}
                    >
                      <Text style={styles.text}>Decline</Text>
                    </TouchableOpacity>
                  </View>
                </View>
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
                <View style={styles.userInfo}>
                  <Image style={styles.image} source={{ uri: item.avatar }} />
                  <Text style={styles.text}>{item.name}</Text>
                </View>
              <TouchableOpacity
                  onPress={() => handleRemoveFriend(item)}
                  style={styles.button}
                >
                  <Text style={styles.text}>Remove</Text>
                </TouchableOpacity>
            </View>
          )}
        />
        <Text style={styles.subheading}>Find Friends</Text>
   
        <FlatList
          data={users}
          style={styles.list}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const isFriend = userFriends.some((friend) => friend.uid === item.uid);
            const requestSent = item.req.some((friend) => friend.uid === loggedInUser.uid);
  
            return (
              <View style={styles.user}>
                <View style={styles.userInfo}>
                  <Image style={styles.image} source={{ uri: item.avatar }} />
                  <Text style={styles.text}>{item.name}</Text>
                </View>
  
                {isFriend ? (
                  <TouchableOpacity style={styles.disabledButton}>
                    <Text style={styles.text}>Friends</Text>
                  </TouchableOpacity>
                ) : requestSent ? (
                  <TouchableOpacity style={styles.disabledButton}>
                    <Text style={styles.text}>Request Sent</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => handleSendFriendRequest(item)}
                    style={styles.button}
                  >
                    <Text style={styles.text}>Add</Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          }}
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
    // padding: 20,
  },
  list: {
    paddingBottom: 20,
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
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    padding: 20,
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 15,
    backgroundColor: "#292441",
  },
  userInfo: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#fff",
    textAlign: "center",
  },
  subheading: {
    color: "#d9d6e7",
    fontSize: 20,
    paddingHorizontal: 30,
  },
  button: {
    backgroundColor: "#f20089",
    padding: 10,
    borderRadius: 10,
    color: "#fff",
    width: 90,
    justifyContent: "center",
  },
  disabledButton: {
    borderWidth: 2,
    borderColor: "#fff",
    padding: 10,
    borderRadius: 10,
    color: "#fff",
  },
  friendRequest: {
    flexDirection: "column",
    marginRight: 20,
    paddingRight: 20,
    marginHorizontal: 20,
    marginVertical: 10,
  },
  acceptDecline: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
});
