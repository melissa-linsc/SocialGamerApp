import React, {useEffect, useState} from 'react'

import { SafeAreaView, StatusBar, View, FlatList, TouchableOpacity, Image, Text, StyleSheet } from 'react-native';
import { collection, getDocs, query, where } from "firebase/firestore";
import { Entypo } from '@expo/vector-icons';

import { db } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';

const ChatScreen = ({user, navigation}) => {
  const [usersFriends, setUsersFriends] = useState(null)

  const { loggedInUser, setLoggedInUser } = useAuth();
  
  const q = query(collection(db, "users"), where("uid", "==", loggedInUser.uid));

  useEffect(()=>{
    getDocs(q).then((snapshot) => {
        let userData = []
        snapshot.docs.forEach((doc) => {
            userData.push({...doc.data(), id:doc.id })
        })
        setUsersFriends(userData[0].realFriend)
        })
        .catch((err) => {
            console.log(err.message)
        })
  },[])

  return (
    <SafeAreaView style={styles.container}>
    <StatusBar />
      <View>
          <FlatList
              data={usersFriends}
              keyExtractor={(item)=>item.uid}
              renderItem={({item}) => (
              <TouchableOpacity onPress={() => navigation.navigate('Messages', {name: item.name, uid: item.uid})}>
                  <View style={styles.friendCards}>
                    <View style={styles.friend}>
                        <Image source={{uri: item.avatar}} style={styles.image}/>
                        <View >
                            <Text style={styles.name}>{item.name}</Text>
                        </View>
                    </View>
                    <View style={styles.icon}>
                    <Entypo name="arrow-with-circle-right" size={24} color="#f20089" />
                    </View>
                  </View>
                  </TouchableOpacity>
              )}
              />
      </View>
  </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#0a0a31"
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
    name: {
        fontSize: 20,
        color: "#fff",
        padding: 10,
    },
    image: {
        width: 60,
        height: 60,
        borderRadius: 15,
        backgroundColor: "#fff"
    },
    icon: {
        justifyContent: "flex-end",
        marginRight: 20,
    }
})

export default ChatScreen