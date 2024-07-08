import {
  Dimensions,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import React from "react";
import Animated, {
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";
import { formatGameTitle } from "../utils/utils";

type Props = {
  item: {
    id: string;
    title: string;
    img: any;
  };
  index: number;
  scrollX: Animated.SharedValue<number>;
};

const { width } = Dimensions.get("window");

const CarouselItem = ({ item, index, scrollX }: Props) => {
  const navigation = useNavigation();

  const rnStyle = useAnimatedStyle(() => {
    return {
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

  const handlePress = () => {
    navigation.navigate("Back To Home", { game: item, gameid: item.id });
  };

  return (
    <Animated.View
      style={[
        { width, height: 250, justifyContent: "center", alignItems: "center" },
        rnStyle,
      ]}
      key={item.id}
    >
      <TouchableOpacity
        onPress={handlePress}
        style={{ width: "90%", height: "100%" }}
      >
        <ImageBackground
          source={{uri: item.background_image}}
          style={{
            width: "100%",
            height: "100%",
            justifyContent: "flex-end",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.9,
            shadowRadius: 5,
            elevation: 10, // Android shadow
          }}
          imageStyle={{ opacity: 0.6, borderRadius: 15 }}
          resizeMode="cover"
        >
          <Text style={styles.title}>{formatGameTitle(item.slug)}</Text>
        </ImageBackground>
      </TouchableOpacity>
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
    textShadowColor: "rgba(1, 30, 97, 0.8)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 15,
  },
});
