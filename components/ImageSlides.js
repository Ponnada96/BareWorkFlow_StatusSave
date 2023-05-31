import {
  Dimensions,
  View,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { GlobalStyles } from "../constants/Colors";
import { useLayoutEffect, useRef, useState } from "react";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

function ImageSlides({ route }) {
  const imageURIs = route.params?.imageURIs;
  const imgIndex = route.params?.selectdImgIndex;
  const [selectedIndex, setSelecetedIndex] = useState();
  const bottomRef = useRef();
  const topRef = useRef();

  function scrollImages(e) {
    const index = (e.nativeEvent.contentOffset.x / screenWidth).toFixed(0);
    setSelecetedIndex(index);
    bottomRef.current.scrollToIndex({ animated: true, index: index });
  }

  useLayoutEffect(() => {
    setSelecetedIndex(imgIndex);
    topRef.current.scrollToIndex({ animated: true, index: imgIndex });
  }, []);

  return (
    <View style={styles.imageContainer}>
      <FlatList
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        data={imageURIs}
        ref={topRef}
        contentContainerStyle={{ alignItems: "center" }}
        getItemLayout={(_, index) => ({
          length: screenWidth,
          offset: screenWidth * index,
          index,
        })}
        onScrollToIndexFailed={(info) => {
          console.warn(
            `Scroll to index failed: ${info.index}. Falling back to alternative scrolling method.`
          );
        }}
        onScroll={(e) => {
          scrollImages(e);
        }}
        renderItem={({ item }) => {
          return <Image source={{ uri: item }} style={styles.image}></Image>;
        }}
      ></FlatList>
      <View style={{ position: "absolute", bottom: 60 }}>
        <FlatList
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          ref={bottomRef}
          data={imageURIs}
          getItemLayout={(_, index) => ({
            length: 90,
            offset: (screenWidth / (screenWidth / 90)) * index,
            index,
          })}
          onScrollToIndexFailed={(info) => {
            console.warn(
              `Scroll to index failed: ${info.index}. Falling back to alternative scrolling method.`
            );
          }}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity
                style={styles.bottomGallaryGridContainer}
                onPress={() => {
                  setSelecetedIndex(index);
                  topRef.current.scrollToIndex({
                    animated: true,
                    index: index,
                  });
                }}
              >
                <Image
                  source={{ uri: item }}
                  style={{
                    width: selectedIndex == index ? 60 : 50,
                    height: selectedIndex == index ? 60 : 50,
                    borderRadius: 10,
                    borderColor: "#fff",
                    borderWidth: selectedIndex == index ? 3 : 0,
                  }}
                ></Image>
              </TouchableOpacity>
            );
          }}
        ></FlatList>
      </View>
    </View>
  );
}
export default ImageSlides;

const styles = StyleSheet.create({
  imageContainer: {
    flex: 1,
    backgroundColor: GlobalStyles.colors.primary50,
  },
  bottomGallaryGridContainer: {
    width: 90,
    height: 90,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContainer: {
    alignItems: "center",
  },
  imageContainer: {
    alignItems: "center",
    width: screenWidth,
  },
  image: {
    width: screenWidth,
    height: screenHeight,
    resizeMode: "contain",
  },
});
