import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from "react-native";

interface RecListItemsProps {
  item: {
    title: string;
    genres: string[];
    img: any;
  };
  onPress: () => void;
}

const RecListItems: React.FC<RecListItemsProps> = ({ item, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={[styles.container]}>
        <ImageBackground source={item.img} style={styles.background}>
          <Text style={[styles.title]}>{item.title}</Text>
          <Text style={styles.genres}>{item.genres.join(", ")}</Text>
        </ImageBackground>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 0,
    alignItems: "center",
    height: 250,
    marginBottom: 20,
  },
  background: {
    flex: 1,
    justifyContent: "center",
    width: 500,
    height: "120%",
    alignItems: "center",
    opacity: 0.6,
  },
  title: {
    fontWeight: "800",
    fontSize: 28,
    color: "#493d8a",
    textAlign: "center",
  },
  genres: {
    fontWeight: "300",
    color: "#62656b",
    textAlign: "center",
    paddingHorizontal: 64,
  },
});

export default RecListItems;
