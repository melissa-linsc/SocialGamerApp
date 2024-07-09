import React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import CarouselItem from "./CarouselItem";
import { items } from "./items";

export default function Carousel({ games, onRemove }) {
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
        showsHorizontalScrollIndicator={false}
        data={games}
        keyExtractor={(item) => item.id}
        pagingEnabled
        renderItem={({ item, index }) => {
          return <CarouselItem item={item} index={index} scrollX={scrollX} />;
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a31",
    marginVertical: 20,
  },
});
