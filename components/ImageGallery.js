import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Pressable } from "react-native";
import {
  StyleSheet,
  Image,
  FlatList,
  View,
  TouchableOpacity,
} from "react-native";

function ImageGallery({ imageURIs }) {
  const navigation = useNavigation();

  const RenderImage = ({ item, index }) => {
    return (
      <View style={styles.container}>
        <Pressable
          onPress={openGallery.bind(this, index)}
          style={({ pressed }) => [styles.flex, pressed && styles.pressed]}
        >
          <Image
            source={{ uri: item }}
            style={styles.image}
            resizeMode="cover"
          />
        </Pressable>
      </View>
    );
  };

  const openGallery = (index) => {
    navigation.navigate("ImageSlides", {
      imageURIs: imageURIs,
      selectdImgIndex: index,
    });
  };

  return (
    <FlatList
      data={imageURIs}
      renderItem={RenderImage}
      keyExtractor={(item) => item}
      horizontal={false}
      numColumns={2}
    />
  );
}

export default ImageGallery;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    margin: 10,
    borderRadius: 20,
  },
  image: {
    flex: 1,
    height: 200,
    borderRadius: 20,
  },
  pressed: {
    opacity: 0.75,
  },
  flex: {
    flex: 1,
  },
});
