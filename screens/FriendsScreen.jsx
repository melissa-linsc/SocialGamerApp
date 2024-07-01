import { View, Text, StyleSheet, SafeAreaView, FlatList, Image, TouchableOpacity, Button} from "react-native"
import { useAuth } from "../contexts/AuthContext";
import { useState, useEffect } from "react";
import { db } from "../firebase/config";
   
import { collection, getDocs, updateDoc, doc, query, where, update, FieldValue, arrayUnion, arrayRemove } from "firebase/firestore";

const FriendsScreen = ({navigation}) => {
    
    const { loggedInUser, setLoggedInUser } = useAuth();

    const [loggedInUserDoc, setLoggedInUserDoc] = useState({})
    const [targetDoc, setTargetDoc] = useState({})
    const [userFriends, setUserFriends] = useState([])
    const [users, setUsers] = useState([])
    const [friendRequests, setFriendRequests] = useState([])

    useEffect(() => {

        const usersRef = collection(db, 'users')

        const q = query(collection(db, "users"), where("uid", "!=", loggedInUser.uid));

        const userRef = query(collection(db, "users"), where("uid", "==", loggedInUser.uid));

        getDocs(q).then((snapshot) => {
            let userData = []
            // console.log(snapshot.docs)
            snapshot.docs.forEach((doc) => {
                userData.push({...doc.data(), id:doc.id })
            })
            setUsers(userData)
        })
        .catch((err) => {
            console.log(err.message)
        })

        getDocs(userRef).then((snapshot) => {
            let userData = []
            // console.log(snapshot.docs)
            snapshot.docs.forEach((doc) => {
                userData.push({...doc.data(), id:doc.id })
            })

            setLoggedInUserDoc(userData[0])
            setUserFriends(userData[0].realFriend)
            setFriendRequests(userData[0].req)
        })
        .catch((err) => {
            console.log(err.message)
        })
        

    }, [])

    function handleSendFriendRequest(item) {

        const userQuery = query(collection(db, 'users'), where('uid', '==', item.uid));

        getDocs(userQuery)
        .then((querySnapshot) => {
            if (!querySnapshot.empty) {
            
                // Assuming there is only one document matching the query
                const userDoc = querySnapshot.docs[0];
                const userDocRef = doc(db, 'users', userDoc.id);
                
                // Update the realFriend array field using arrayUnion
                updateDoc(userDocRef, {
                    req: arrayUnion(loggedInUserDoc)
                });

            } else {
                throw new Error('No matching user document found.');
            }
            })
            .then(() => {
                console.log('Friend Requests updated successfully!');
            })
            .catch((error) => {
                console.error('Error updating friend requests:', error);
            });

    }
    
    function handleAddFriend(item) {

    const userQuery = query(collection(db, 'users'), where('uid', '==', item.uid));

  // Execute the query
    getDocs(userQuery)
    .then((querySnapshot) => {
            if (!querySnapshot.empty) {
                // Assuming there is only one document matching the query
                const userToAddDoc = querySnapshot.docs[0];
                const userToAddDocRef = doc(db, 'users', userToAddDoc.id);

                const currentUserRef = doc(db, 'users', loggedInUserDoc.id)

                // Update the realFriend array field using arrayUnion
                updateDoc(userToAddDocRef, {
                    realFriend: arrayUnion(loggedInUserDoc)
                });
                
                updateDoc(currentUserRef, {
                    realFriend: arrayUnion(item)
                })

                updateDoc(currentUserRef, {
                    req: arrayRemove(item)
                    });

                setUserFriends((currFriends) => {
                    return [item, ...currFriends]
                })

                setFriendRequests((currFriendRequests) => {
                    return currFriendRequests.filter((friend) => {
                        return friend.uid !== item.uid
                    })
                })

            } else {
                throw new Error('No matching user document found.');
            }
            })
            .then(() => {
            console.log('Real friends updated successfully!');
            })
            .catch((error) => {
            console.error('Error updating real friends:', error);
            });
    }

    function handleRemoveFriend(item) {

        const userQuery = query(collection(db, 'users'), where('uid', '==', item.uid));
    
      // Execute the query
        getDocs(userQuery)
        .then((querySnapshot) => {
                if (!querySnapshot.empty) {
                    // Assuming there is only one document matching the query
                    const userToRemoveDoc = querySnapshot.docs[0];
                    const userToRemoveDocRef = doc(db, 'users', userToRemoveDoc.id);
    
                    const currentUserRef = doc(db, 'users', loggedInUserDoc.id)
                    // Update the realFriend array field using arrayUnion
                    updateDoc(userToRemoveDocRef, {
                        realFriend: arrayRemove(loggedInUserDoc)
                    });
                    
                    updateDoc(currentUserRef, {
                        realFriend: arrayRemove(item)
                    })

                    setUserFriends((currFriends) => {
                        return currFriends.filter((friend) => {
                            return friend.uid !== item.uid
                        })
                    })

                } else {
                    throw new Error('No matching user document found.');
                }
                })
                .then(() => {
                console.log('Real friends updated successfully!');
                })
                .catch((error) => {
                console.error('Error updating real friends:', error);
                });
        }

    return (
        <SafeAreaView>
            <View style={styles.container}>
                <Text>All Users</Text>
                <FlatList
                    data={users}
                    keyExtractor={item => item.id}
                    renderItem={({item}) => (
                        <View style={styles.user}>
                            <Image 
                            style={styles.image}
                            source={{uri: item.avatar}}
                            /> 
                            <Text>{item.name}</Text>  
                            {/* <Text>{item.req}</Text> */}
                            {!item.req.some(friend => friend.uid === loggedInUser.uid) ? <Button title="Add Friend" onPress={() => handleSendFriendRequest(item)}></Button> : null }                     
                        </View>
                )}
                />
                <Text>My Friends</Text>
                <FlatList
                    data={userFriends}
                    keyExtractor={item => item.id}
                    renderItem={({item}) => (
                        <View style={styles.user}>
                            <Image 
                            style={styles.image}
                            source={{uri: item.avatar}}
                            /> 
                            <Text>{item.name}</Text>  
                            <Button title="Remove Friends" onPress={() => handleRemoveFriend(item)}></Button>          
                        </View>
                )}
                />
                <Text>Friend Requests</Text>
                <FlatList
                    data={friendRequests}
                    keyExtractor={item => item.id}
                    renderItem={({item}) => (
                        <View style={styles.user}>
                            <Image 
                            style={styles.image}
                            source={{uri: item.avatar}}
                            /> 
                            <Text>{item.name}</Text>  
                            <Button title="Accept" onPress={() => handleAddFriend(item)}></Button>          
                        </View>
                )}
                />
                <TouchableOpacity onPress={() => navigation.navigate("Home")}>
                    <Text>Home</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default FriendsScreen

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    image: {
        width: 50,
        height: 50,
        marginRight: 20,
    },
    user: {
        justifyContent: "center",
        alignItems: "center",
        flexDirection: 'row',
        padding: 20,
        borderWidth: 2,
        margin: 10
    }
})

