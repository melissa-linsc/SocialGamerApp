import React, {useEffect, useState} from "react"
import { StyleSheet, View, Text, TouchableOpacity } from "react-native"
import { Entypo } from '@expo/vector-icons';
import GradientText from "react-native-gradient-texts";
import { collection, query, where, getDocs, onSnapshot, collectionGroup } from 'firebase/firestore';
import { Badge } from 'react-native-paper';
import { db } from "../firebase/config";
import { useAuth } from "../contexts/AuthContext";

function Header({navigation}) {

    const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
    const { loggedInUser, setLoggedInUser } = useAuth();

    useEffect(() => {
        const fetchUnreadMessagesCount = () => {
          const messagesQuery = query(
            collectionGroup(db, 'messages'),
            where('receiver', '==', loggedInUser.uid),
            where('read', '==', false)
          );
    
          // Subscribe to real-time updates
          const unsubscribe = onSnapshot(messagesQuery, (querySnapshot) => {
            let totalUnread = 0;
            querySnapshot.forEach((doc) => {
              totalUnread += 1;
            });
    
            // Update state with unread count
            setUnreadMessagesCount(totalUnread);
          });
    
          return unsubscribe; // Cleanup function to unsubscribe from listener
        };
    
        const unsubscribe = fetchUnreadMessagesCount();
    
        // Cleanup function to unsubscribe when component unmounts
        return () => unsubscribe();
      }, [loggedInUser.uid]);
   

    return (
        <View style={styles.container}>
            <GradientText
                text={"Gamerly"}
                fontSize={40}
                width={180}
                locations={{ x: 90, y: 58 }}
                isGradientFill
                gradientColors={["#f20089", "#2d00f7"]}
            
            />
            <TouchableOpacity onPress={() => navigation.navigate("Chat")}>
                {unreadMessagesCount > 0 ? <Badge style={{position: 'absolute', top: -12, right: -12, backgroundColor: "#4cc9f0", zIndex: 10}}>{unreadMessagesCount}</Badge> : null}
                <Entypo name="chat" size={30} color="#f20089" />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({ 
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        paddingHorizontal: 30,
    },
    icon: {
        color: "#fff"
    }
})

export default Header

