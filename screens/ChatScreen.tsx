import React, {useEffect, useState} from 'react'
import { Firestore } from 'firebase/firestore';

import { SafeAreaView, StatusBar, ScrollView, View, FlatList, TouchableOpacity, Image, Text } from 'react-native';
import { collection, getDocs, updateDoc, doc, query, where,  FieldValue, arrayUnion, arrayRemove } from "firebase/firestore";

import { db } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';

const ChatScreen = ({user, navigation}) => {
  const [usersFriends, setUsersFriends] = useState(null)

  const { loggedInUser, setLoggedInUser } = useAuth();
  
  const q = query(collection(db, "users"), where("uid", "==", loggedInUser.uid));

  useEffect(()=>{
    getDocs(q).then((snapshot) => {
        let userData = []
        // console.log(snapshot.docs)
        snapshot.docs.forEach((doc) => {
            userData.push({...doc.data(), id:doc.id })
        })
        setUsersFriends(userData[0].realFriend)
        })
        .catch((err) => {
            console.log(err.message)
        })
  },[])

console.log(usersFriends)
  return (
    <SafeAreaView >
    <StatusBar />
    <ScrollView>
      <View>
          <FlatList
              data={usersFriends}
              keyExtractor={(item)=>item.uid}
              renderItem={({item}) => (
              <TouchableOpacity onPress={() => navigation.navigate('Messages', {name: item.name, uid: item.uid})} >
                  <View>
                        <Image source={{uri: item.avatar}} />
                    <View >
                        <Text >{item.name}</Text>
                        <Text >{item.email}</Text>
                    </View>
                  </View>
                  </TouchableOpacity>
              )}
              />
      </View>
      </ScrollView>
  </SafeAreaView>
  )
}

export default ChatScreen