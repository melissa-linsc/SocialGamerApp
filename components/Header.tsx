import React from "react"
import { StyleSheet, View, Text } from "react-native"
import { Entypo } from '@expo/vector-icons';

function Header() {

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Gamerly</Text>
            <Entypo name="chat" size={30} color="white" />
        </View>
    )
}

const styles = StyleSheet.create({ 
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
        width: "100%",
        paddingHorizontal: 30,
        paddingVertical: 40,
        marginTop: 40,
    },
    title: {
        alignSelf: "flex-start",
        color: "#fff",
        fontSize: 30,
        fontWeight: "bold",
    },
    icon: {
        alignSelf: "flex-end",
        color: "#fff"
    }
})

export default Header

