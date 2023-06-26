import {
  Dimensions,
  View,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { GlobalStyles } from "../constants/Colors";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import * as RNFS from "react-native-fs";
import HeaderBtns from "./HeaderBtns";
import {
  SaveAllFiles,
  SaveFile,
  getFileDestPath,
  displayFileSavedToastMsg,
  getFileNameFromPath,
  markFileAsFavourite,
} from "./Common/Utils";
import FavouriteIcon from "../UI/FavouriteIcon";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

function ImageSlides({ route, navigation }) {
  const [selectedIndex, setSelecetedIndex] = useState(0);
  const [isFileDownload, setFileDownload] = useState(false);
  const imageURIs = route.params?.imageURIs;
  const imgIndex = route.params?.selectdImgIndex;
  const enableHeaderAction = route.params?.showHeaderActions;
  const showFavActn = route.params?.showFavActnBtn;
  const bottomRef = useRef();
  const topRef = useRef();
  const [favourites, setFavorites] = useState([]);
  const isFocused = useIsFocused();
  function scrollImages(e) {
    const index = (e.nativeEvent.contentOffset.x / screenWidth).toFixed(0);
    setSelecetedIndex(index);
    bottomRef.current.scrollToIndex({ animated: true, index: index });
  }

  async function saveImageByIndex() {
    await SaveFile(imageURIs[selectedIndex]);
    setFileDownload(true);
    displayFileSavedToastMsg("File Saved");
  }

  function saveAll() {
    SaveAllFiles(imageURIs);
    setFileDownload(true);
  }

  useEffect(() => {
    if (isFocused) {
      const getFavourites = async () => {
        // await AsyncStorage.setItem("favImages", JSON.stringify(favourites));
        const data = await AsyncStorage.getItem("favImages");
        if (data != null && data.length > 0) {
          setFavorites(JSON.parse(data));
        }
        console.log("fa", data);
      };
      getFavourites();
    }
  }, [isFocused]);

  useEffect(() => {
    const updateFavourites = async () => {
      await AsyncStorage.setItem("favImages", JSON.stringify(favourites));
    };
    updateFavourites();
  }, [favourites]);

  useLayoutEffect(() => {
    setSelecetedIndex(imgIndex);
    topRef.current.scrollToIndex({ animated: true, index: imgIndex });
  }, []);

  useLayoutEffect(() => {
    async function VerifyFileExistense() {
      const { destPath } = getFileDestPath(imageURIs[selectedIndex]);
      const isFileExists = await RNFS.exists(destPath);
      setFileDownload(isFileExists);
    }
    VerifyFileExistense();
  }, [selectedIndex]);

  if (enableHeaderAction) {
    useEffect(() => {
      navigation.setOptions({
        headerRight: () => (
          <HeaderBtns
            saveAllHandler={saveAll}
            showSaveAllBtn={true}
            saveImgByIndexHandler={saveImageByIndex}
            isFileDownload={isFileDownload}
            displayInfoHandler={displayFileSavedToastMsg}
          />
        ),
      });
    }, [selectedIndex, isFileDownload]);
  }

  if (showFavActn) {
    useEffect(() => {
      navigation.setOptions({
        headerRight: () => (
          <View style={styles.favContainer}>
            <FavouriteIcon
              iconName={
                favourites.includes(
                  getFileNameFromPath(imageURIs[selectedIndex])
                )
                  ? "favorite"
                  : "favorite-border"
              }
              size={26}
              onPressHandler={markFileAsFavourite.bind(
                this,
                imageURIs[selectedIndex],
                favourites,
                setFavorites
              )}
            />
          </View>
        ),
      });
    }, [selectedIndex, favourites]);
  }

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
  favContainer: {
    alignItems: "center",
    marginRight: 10,
    flexDirection: "row",
  },
});
