import { Dimensions, Image, ImageBackground, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Animated, {
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';

type Props = {
  item: {
    id: string;
    title: string;
    img: any;
  };
  index: number;
  scrollX: Animated.SharedValue<number>;
};
const { width } = Dimensions.get('window');

const CarouselItem = ({ item, index, scrollX }: Props) => {
  const rnStyle = useAnimatedStyle(() => {
    return {
      //get the previous and next item on the view of the active item, only a little bit
      transform: [
        {
          translateX: interpolate(
            scrollX.value,
            [(index - 1) * width, index * width, (index + 1) * width],
            [-width * 0.15, 0, width * 0.15],
            'clamp'
          ),
        },
        {
          scale: interpolate(
            scrollX.value,
            [(index - 1) * width, index * width, (index + 1) * width],
            [0.9, 1, 0.9],
            'clamp'
          ),
        },
      ],
    };
  });
  return (
    <Animated.View
      style={[
        { width, height: 250, justifyContent: 'center', alignItems: 'center' },
        rnStyle,
      ]}
      key={item.id}
    >
      <ImageBackground
        source={item.img}
        style={{
          width: '90%',
          height: '100%',
          opacity: 0.8,
          justifyContent: "flex-end",
        }}
        resizeMode="cover"
      >
          <Text style={styles.title}>{item.title}</Text>
      </ImageBackground>
    </Animated.View>
  );
};

export default CarouselItem;

const styles = StyleSheet.create({
  title: {
    color: "#f20089",
    opacity: 1,
    fontSize: 25,
    fontWeight: "bold",
    padding: 20,
  },
});