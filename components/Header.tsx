import React from "react"
import { StyleSheet, View, Text, TouchableOpacity } from "react-native"
import { Entypo } from '@expo/vector-icons';
import GradientText from "react-native-gradient-texts";

function Header({navigation}) {

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

