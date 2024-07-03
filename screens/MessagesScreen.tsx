import React, {useEffect, useState, useCallback} from 'react'
import { Firestore } from 'firebase/firestore';

import { SafeAreaView, StatusBar, ScrollView, View, FlatList, TouchableOpacity, Image, Text, StyleSheet } from 'react-native';
import { collection, getDocs, updateDoc, doc, query, where, addDoc, FieldValue, arrayUnion, arrayRemove, getFirestore, orderBy, onSnapshot } from "firebase/firestore";
import { serverTimestamp } from 'firebase/firestore';

import { db } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';
import { GiftedChat, Bubble } from 'react-native-gifted-chat'

function MessagesScreen({user, route}) {
    const [messages, setMessages] = useState([]);
    const {name, uid}  = route.params
    const { loggedInUser, setLoggedInUser } = useAuth();

        // useEffect(() => {
        //     setMessages([
        //     {
        //         _id: 1,
        //         text: 'Hello developer ',
        //         createdAt: new Date(),
        //         user: {
        //         _id: 2,
        //         name: 'React Native',
        //         avatar: 'https://placeimg.com/140/140/any',
        //         },
        //     },
        //     ])
        // }, [])

        // const onSend = async (msgArray) => {
        //     const msg = msgArray[0];
        //     const usermsg = {
        //       ...msg,
        //       sentBy: loggedInUser.uid,
        //       sentTo: uid,
        //       createdAt: new Date(),
        //     };
        //     setMessages((previousMessages) => GiftedChat.append(previousMessages, usermsg));
          
        //     const chatId = uid > loggedInUser.uid ? `${loggedInUser.uid}-${uid}` : `${uid}-${loggedInUser.uid}`;
          
        //     try {
        //       await addDoc(collection(db, 'Chats', chatId, 'messages'), {
        //         ...usermsg,
        //         createdAt: serverTimestamp(),
        //       });
        //     } catch (error) {
        //       console.error('Error adding document: ', error);
        //     }
        //   };

        // const getAllMessages = async () => {
        //     const chatid = uid > loggedInUser.uid ? loggedInUser.uid+"-"+uid : uid+"-"+loggedInUser.uid   
        //       // Create a reference to the collection
        //     const messagesRef = collection(db, 'Chats', chatid, 'messages');
            
        //     // Create a query against the collection
        //     const q = query(messagesRef, orderBy('createdAt', 'desc'));
  
        //     try {
        //         // Fetch the documents
        //         const msgResponse = await getDocs(q);

        //         // Map the documents to a format suitable for your state
        //         const allTheMsgs = msgResponse.docs.map(docSnap => {
        //         const data = docSnap.data();
        //         return {
        //             ...data,
        //             createdAt: data.createdAt.toDate(),
        //         };
        //         });

        //         // Update the state with the messages
        //         setMessages(allTheMsgs);
        //     } catch (error) {
        //         console.error('Error getting messages: ', error);
        //     }
        //     };
          
        //   useEffect(() => {
        //     getAllMessages()
        //   },[]);
        useEffect(() => {
            const chatid = uid > loggedInUser.uid ? `${loggedInUser.uid}-${uid}` : `${uid}-${loggedInUser.uid}`;
        
            // Create a reference to the collection
            const messagesRef = collection(db, 'Chats', chatid, 'messages');
        
            // Create a query against the collection
            const q = query(messagesRef, orderBy('createdAt', 'desc'));
        
            // Set up the real-time listener
            const unsubscribe = onSnapshot(q, (snapshot) => {
              const allTheMsgs = snapshot.docs.map((docSnap) => {
                const data = docSnap.data();
                return {
                  ...data,
                  createdAt: data.createdAt.toDate(),
                };
              });
        
              setMessages(allTheMsgs);
            });
        
            // Clean up the listener on unmount
            return () => unsubscribe();
          }, [uid, loggedInUser]);
        
          const onSend = useCallback(async (messages = []) => {
            try {
              const { _id, createdAt, text, user } = messages[0];
              const chatid = uid > loggedInUser.uid ? `${loggedInUser.uid}-${uid}` : `${uid}-${loggedInUser.uid}`;
        
              const messagesRef = collection(db, 'Chats', chatid, 'messages');
              await addDoc(messagesRef, {
                _id,
                createdAt: new Date(),
                text,
                user,
              });
            } catch (error) {
              console.error('Error sending message:', error);
            }
          }, [uid, loggedInUser]);
        

          const renderBubble = (props) => {
            return (
            <Bubble
                {...props}
                wrapperStyle={{
                right: styles.rightBubble,
                left: styles.leftBubble,
                }}
                textStyle={{
                right: styles.rightBubbleText,
                left: styles.leftBubbleText,
                }}
            />
            );
        };

        return (
            <GiftedChat 
            renderBubble={renderBubble}
            messages={messages}
            onSend={text => onSend(text)}
            user={{ 
              _id: loggedInUser.uid,
            }}
            />
        )
}

const styles = StyleSheet.create({
    rightBubble: {
      backgroundColor: '#0a0a31',
    },
    leftBubble: {
      backgroundColor: '#f20089',
    },
    rightBubbleText: {
      color: '#fff',
    },
    leftBubbleText: {
      color: '#fff',
    },
  });


export default MessagesScreen