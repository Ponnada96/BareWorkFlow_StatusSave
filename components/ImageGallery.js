import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
  StyleSheet,
  Image,
  FlatList,
  View,
  TouchableOpacity,
} from "react-native";

function ImageGallery({ imageURIs }) {
  const navigation = useNavigation();

  const RenderImage = ({ item,index }) => {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={openGallery.bind(this,index)}
          style={{ flex: 1 }}
          activeOpacity={0.6}
        >
          <Image
            source={{ uri: item }}
            style={styles.image}
            resizeMode="cover"
          />
        </TouchableOpacity>
      </View>
    );
  };

  const openGallery = (index) => {
    navigation.navigate("ImageSlides", { imageURIs: imageURIs, selectdImgIndex: index });
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
    overflow: "hidden",
    backfaceVisibility: "hidden",
  },
  image: {
    flex: 1,
    width: null,
    height: 200,
  },
});
