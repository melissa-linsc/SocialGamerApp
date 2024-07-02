import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  useWindowDimensions,
  ImageURISource,
  ImageBackground
} from "react-native";

interface RecListItemsProps {
  item: {
    title: string;
    genres: string[];
    img: ImageURISource;
  };
}

const RecListItems: React.FC<RecListItemsProps> = ({ item }) => {
  const { width } = useWindowDimensions();

  return (
    <View style={[styles.container]}>
      <ImageBackground source={item.img} style={styles.background}>
      <Text style={[styles.title]}>{item.title}</Text>
      <Text style={styles.genres}>{item.genres.join(", ")}</Text>
      {/* <Image
        source={item.img}
        style={[styles.image, { width, resizeMode: "contain" }]}
      /> */}
      </ImageBackground>
    </View>
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
    alignItems: "center"
  },
  image: {
    justifyContent: "center",
    width: 200,
    height: 200,
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
