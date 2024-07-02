export const items = [
    {
      id: 1,
      title: "Cult of the Lamb",
      genres: ["strategy", "adventure", "roguelike", "fantasy"],
      img: require("../assets/CoverImgs/CultoftheLamb.png"),
    },
    {
      id: 2,
      title: "Celeste",
      genres: ["platform", "adventure", "indie", "fantasy"],
      img: require("../assets/CoverImgs/celesteCover.jpg"),
    },
    {
      id: 3,
      title: "Ori and the Blind Forest",
      genres: ["fantasy", "adventure", "platform"],
      img: require("../assets/CoverImgs/OriCover.jpg"),
    },
  ];

  import React from 'react';
  import { StatusBar } from 'expo-status-bar';
  import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
  import Animated, {
    useAnimatedScrollHandler,
    useScrollViewOffset,
    useSharedValue,
  } from 'react-native-reanimated';
  import CarouselItem from './CarouselItem';
  import { useRef } from 'react';
  
  export default function Carousel() {
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
          data={items}
          keyExtractor={(item) => item.id}
          pagingEnabled={true}
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