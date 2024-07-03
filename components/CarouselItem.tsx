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
          justifyContent: "flex-end",
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.9,
          shadowRadius: 5,
          elevation: 10, // Android shadow
        }}
        imageStyle={{opacity: 0.6, borderRadius: 15}}
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
    color: "#fff",
    opacity: 1,
    fontSize: 25,
    fontWeight: "bold",
    padding: 20,
    textShadowColor: 'rgba(1, 30, 97, 0.8)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 15,
  },
});