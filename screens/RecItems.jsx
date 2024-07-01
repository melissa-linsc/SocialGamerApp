import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import Animated, {
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";

type Props = {
  item: {
    id: string,
    title: string,
    img: any,
  },
  index: number,
  scrollX: Animated.SharedValue<number>,
};
const { width } = Dimensions.get("window");

const RecItem = ({ item, index, scrollX }: Props) => {
  const rnStyle = useAnimatedStyle(() => {
    return {
      //get the previous and next item on the view of the active item, only a little bit
      transform: [
        {
          translateX: interpolate(
            scrollX.value,
            [(index - 1) * width, index * width, (index + 1) * width],
            [-width * 0.15, 0, width * 0.15],
            "clamp"
          ),
        },
        {
          scale: interpolate(
            scrollX.value,
            [(index - 1) * width, index * width, (index + 1) * width],
            [0.9, 1, 0.9],
            "clamp"
          ),
        },
      ],
    };
  });
  return (
    <Animated.View
      style={[
        { width, height: 250, justifyContent: "center", alignItems: "center" },
        rnStyle,
      ]}
      key={item.id}
    >
      <Image
        source={item.img}
        style={{
          width: "85%",
          height: "100%",
        }}
        resizeMode="cover"
      />
      <Text>{item.title}</Text>
    </Animated.View>
  );
};

export default RecItem;
