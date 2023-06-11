import {
  Dimensions,
  View,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ToastAndroid,
} from "react-native";
import { GlobalStyles } from "../constants/Colors";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import IconButton from "../UI/IconButton";
import { IconTypes } from "../constants/IconTypes";
import * as RNFS from "react-native-fs";
import Button from "../UI/Button";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

function ImageSlides({ route, navigation }) {
  const [selectedIndex, setSelecetedIndex] = useState(0);
  const [isFileDownload, setFileDownload] = useState(false);
  const imageURIs = route.params?.imageURIs;
  const imgIndex = route.params?.selectdImgIndex;
  const bottomRef = useRef();
  const topRef = useRef();

  function scrollImages(e) {
    const index = (e.nativeEvent.contentOffset.x / screenWidth).toFixed(0);
    setSelecetedIndex(index);
    bottomRef.current.scrollToIndex({ animated: true, index: index });
  }

  function getFileDestPath(itemIndex) {
    const fileUri = imageURIs[itemIndex];
    const fileName = fileUri.substr(fileUri.lastIndexOf("%2F") + 1);
    const dirPath = `${RNFS.PicturesDirectoryPath}/StatusSave`;
    const destPath = `${dirPath}/${fileName}`;
    return { dirPath, destPath, fileUri };
  }

  function displayFileSavedToastMsg(text) {
    ToastAndroid.showWithGravityAndOffset(
      text,
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
      150,
      50
    );
  }

  async function SaveImage(itemIndex) {
    const { dirPath, destPath, fileUri } = getFileDestPath(itemIndex);
    if (await RNFS.exists(destPath)) {
      return;
    }
    const isDirExists = await RNFS.exists(dirPath);
    if (!isDirExists) {
      await RNFS.mkdir(dirPath);
    }
    await RNFS.copyFile(fileUri, destPath);
    RNFS.scanFile(destPath);
  }

  async function saveImageByIndex() {
    await SaveImage(selectedIndex);
    setFileDownload(true);
    displayFileSavedToastMsg("File Saved");
  }

  function saveAll() {
    imageURIs.map(async (_, index) => {
      await SaveImage(index);
    });
    setFileDownload(true);
    displayFileSavedToastMsg("Saved All Successfully!");
  }

  useLayoutEffect(() => {
    setSelecetedIndex(imgIndex);
    topRef.current.scrollToIndex({ animated: true, index: imgIndex });
  }, []);

  useLayoutEffect(() => {
    async function VerifyFileExistense() {
      const { destPath } = getFileDestPath(selectedIndex);
      const isFileExists = await RNFS.exists(destPath);
      setFileDownload(isFileExists);
    }
    VerifyFileExistense();
  }, [selectedIndex]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.btnContainer}>
          <Button
            style={styles.btn}
            onPress={saveAll}
            showIcon={true}
            iconName="download"
          >
            Save All
          </Button>
          {isFileDownload ? (
            <IconButton
              name="check"
              size={24}
              color="#b62323"
              onPress={displayFileSavedToastMsg.bind(
                this,
                "File Already Saved!"
              )}
              iconType={IconTypes.Entypo}
            ></IconButton>
          ) : (
            <IconButton
              name="download"
              size={24}
              color="green"
              onPress={saveImageByIndex}
              iconType={IconTypes.Entypo}
            ></IconButton>
          )}
        </View>
      ),
    });
  }, [selectedIndex, isFileDownload]);

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
  btnContainer: {
    alignItems: "center",
    marginRight: 10,
    flexDirection: "row",
  },
  btn: {
    marginHorizontal: 10,
  },
});
