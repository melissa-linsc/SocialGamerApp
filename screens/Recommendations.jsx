export const items = [
  {
    id: "Stardew Valley",
    title: "Stardew Valley",
    img: require("../assets/HardcodeGameImgs/SDVCover.jpeg"),
  },
  {
    id: "Hollow Knight",
    title: "Hollow Knight",
    img: require("../assets/HardcodeGameImgs/HollowKnightCover.jpeg"),
  },
  {
    id: "The Sims 4",
    title: "The Sims 4",
    img: require("../assets/HardcodeGameImgs/Sims4Cover.png"),
  },
];

import { StatusBar } from "expo-status-bar";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import RecItem from "./RecItems";

export default function recsCarousel() {
  const scrollX = useSharedValue(0);
  const onScrollHandler = useAnimatedScrollHandler((event) => {
    scrollX.value = event.contentOffset.x;
  });
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Animated.FlatList
        horizontal
        onScroll={onScrollHandler}
        data={items}
        keyExtractor={(item) => item.id}
        pagingEnabled={true}
        renderItem={({ item, index }) => {
          return <RecItem item={item} index={index} scrollX={scrollX} />;
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 0.2,
    backgroundColor: "#1b1e23",
    marginTop: 0,
  },
});
