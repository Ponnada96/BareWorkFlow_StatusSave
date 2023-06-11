import { FlatList } from "react-native";
import { View, StyleSheet, Dimensions, Image, Text } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Pressable } from "react-native";
import InfoComponent from "./InfoComponent";
import { GlobalStyles } from "../constants/Colors";

const height = Dimensions.get("window").height;
const width = Dimensions.get("window").width;
console.log(Dimensions.get("window").height / 4);
console.log(Dimensions.get("screen").height);

const renderVideoThumbnail = ({ item, index }) => {
  return (
    <Pressable
      onPress={play}
      style={({ pressed }) => pressed && styles.pressed}
    >
      <View style={styles.container}>
        <Image source={{ uri: item }} style={styles.video}></Image>
        <View style={styles.button}>
          <Pressable
            onPress={play}
            style={({ pressed }) => pressed && styles.pressed}
          >
            <FontAwesome
              name="play-circle-o"
              color={GlobalStyles.colors.primary1000}
              size={50}
            />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
};

const play = () => {
  console.log("play");
};

function VideosGallery({ videoURIs }) {
  if (videoURIs.length > 0) {
    return (
      <View style={{ backgroundColor: GlobalStyles.colors.primary900 }}>
        <FlatList
          data={videoURIs}
          renderItem={renderVideoThumbnail}
          keyExtractor={(_, index) => index}
        />
      </View>
    );
  } else {
    return <InfoComponent>No Videos</InfoComponent>;
  }
}

export default VideosGallery;

const styles = StyleSheet.create({
  container: {
    height: height / 4,
    margin: 8,
    borderRadius: 10,
    elevation: 8,
    opacity: 0.93,
  },
  itemContainer: {},

  video: {
    borderRadius: 10,
    flex: 1,
  },
  button: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -25 }, { translateY: -25 }],
  },
  pressed: {
    opacity: 0.75,
  },
});
