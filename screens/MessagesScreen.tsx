
import React, {useEffect, useState, useCallback} from 'react'
import { Firestore } from 'firebase/firestore';

import { SafeAreaView, StatusBar, ScrollView, View, FlatList, TouchableOpacity, Image, Text, StyleSheet, KeyboardAvoidingView, Platform, Button} from 'react-native';
import { collection, getDocs, updateDoc, doc, query, where, addDoc, FieldValue, arrayUnion, arrayRemove, getFirestore, orderBy, onSnapshot, writeBatch } from "firebase/firestore";
import { serverTimestamp } from 'firebase/firestore';

import { db } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';
import { GiftedChat, Bubble, InputToolbar, Send, Avatar } from 'react-native-gifted-chat'

function MessagesScreen({user, route}) {
    const [messages, setMessages] = useState([]);
    const {name, uid}  = route.params
    const { loggedInUser, setLoggedInUser } = useAuth();


    const chatid = uid > loggedInUser.uid ? `${loggedInUser.uid}-${uid}` : `${uid}-${loggedInUser.uid}`;

        useEffect(() => {
        
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
                read: false,
                receiver: uid
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
        }

        const renderAvatar = (props) => {
            return (
              <Avatar
                {...props}
                imageStyle={{
                  left: { backgroundColor: '#f20089' }, // left (received) avatar background color
                  right: { backgroundColor: '#4cc9f0' }, // right (sent) avatar background color
                }}
              />
            );
          };
        
          const renderInputToolbar = (props) => {
            return (
              <InputToolbar
                {...props}
                containerStyle={styles.inputToolbar}
                // primaryStyle={{ alignItems: 'center' }}
              />
            );
          };

          const markMessagesAsRead = async (chatid) => {
            const q = query(
              collection(db, 'Chats', chatid, 'messages'),
              where('read', '==', false)
            );
            const snapshot = await getDocs(q);
          
            const batch = writeBatch(db);
          
            snapshot.forEach(doc => {
              batch.update(doc.ref, { read: true });
            });
          
            await batch.commit();
          };
        
          useEffect(() => {
            markMessagesAsRead(chatid)
          }, [chatid])
        //   const renderSend = (props) => {
        //     return (
        //       <Send {...props} containerStyle={styles.sendingContainer}>
        //         <TouchableOpacity onPress={() => {props.onSend={text: props.text}}}>
        //           <Text>Send</Text>
        //         </TouchableOpacity>
        //       </Send>
        //     );
        //   };

        return (
            <KeyboardAvoidingView
                // behavior={Platform.OS === 'ios' ? "padding" : "height"}
                style={styles.container}
            >
            <GiftedChat 
            renderBubble={renderBubble}
            renderAvatar={renderAvatar}
            renderInputToolbar={renderInputToolbar}
            // renderSend={renderSend}
            messages={messages}
            onSend={text => onSend(text)}
            user={{ 
              _id: loggedInUser.uid,
              avatar: loggedInUser.photoURL
            }}
            />
            </KeyboardAvoidingView>
        )
}

const styles = StyleSheet.create({
    rightBubble: {
      backgroundColor: '#4cc9f0',
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
    container: {
        backgroundColor: "#0a0a31",
        flex: 1,
    },
    inputToolbar: {
        // borderTopWidth: 2,
        // borderTopColor: '#f20089',
        padding: 3,
      },
      sendingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 5,
        marginRight: 5,
        backgroundColor: "#f20089",
        borderRadius: 5,
        fontSize: 10,
        color: "#fff"
        // padding: 10,
      },
      button: {
        fontSize: 10,
      }
  });



export default MessagesScreen;
