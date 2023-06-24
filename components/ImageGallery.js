import { useIsFocused, useNavigation } from "@react-navigation/native";
import React from "react";
import { Pressable } from "react-native";
import { StyleSheet, Image, FlatList, View } from "react-native";
import { useEffect } from "react";
import HeaderBtns from "./HeaderBtns";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import FavouriteIcon from "../UI/FavouriteIcon";
import * as RNFS from "react-native-fs";
import {
  getFileNameFromPath,
  SaveFile,
  markFileAsFavourite,
  displayFileSavedToastMsg,
  SaveAllFiles,
} from "./Common/Utils";
import DownloadIcon from "../UI/DownloadIcon";

function ImageGallery({ imageURIs, enableHeaderActions }) {
  const navigation = useNavigation();
  const [favourites, setFavorites] = useState([]);
  const [savedImages, setSavedImages] = useState([]);
  const isFocused = useIsFocused();
  const appDirPath = `${RNFS.PicturesDirectoryPath}/StatusSave`;

  useEffect(() => {
    if (isFocused) {
      const getFavourites = async () => {
        await AsyncStorage.setItem("favourites", JSON.stringify(favourites));
        const data = await AsyncStorage.getItem("favourites");
        if (data != null && data.length > 0) {
          setFavorites(JSON.parse(data));
        }
      };
      getFavourites();
    }
  }, [isFocused]);

  useEffect(() => {
    if (isFocused) {
      const getSavedImages = async () => {
        if (await RNFS.exists(appDirPath)) {
          const folderContents = (await RNFS.readDir(appDirPath)).map((item) =>
            getFileNameFromPath(item.path)
          );
          const images = folderContents.filter((url) =>
            /^(?!.*trashed-).*\.(jpe?g|png|webp)$/.test(url)
          );
          setSavedImages(images);
        }
      };
      getSavedImages();
    }
  }, [isFocused]);

  if (enableHeaderActions) {
    useEffect(() => {
      navigation.getParent().setOptions({
        headerRight: () => (
          <HeaderBtns
            showSaveAllBtn={true}
            saveAllHandler={SaveAllFilesHandler.bind(this, imageURIs)}
            saveImgByIndexHandler={null}
            isFileDownload={false}
            displayInfoHandler={displayFileSavedToastMsg}
          />
        ),
      });
    }, [imageURIs, isFocused]);
  }

  useEffect(() => {
    const updateFavourites = async () => {
      await AsyncStorage.setItem("favourites", JSON.stringify(favourites));
    };
    updateFavourites();
  }, [favourites]);

  async function saveImage(uri) {
    await SaveFile(uri);
    const fileName = getFileNameFromPath(uri);
    displayFileSavedToastMsg("File Saved");
    setSavedImages((items) =>
      items.length === 0 ? [fileName] : [...items, fileName]
    );
  }

  function SaveAllFilesHandler(imageURIs) {
    SaveAllFiles(imageURIs);
    imageURIs.map((item) => {
      const fileName = getFileNameFromPath(item);
      if (!savedImages.includes(fileName)) {
        setSavedImages((items) => [...items, fileName]);
      }
    });
  }

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
          <View style={styles.favIconContainer}>
            <FavouriteIcon
              iconName={
                favourites.includes(getFileNameFromPath(item))
                  ? "favorite"
                  : "favorite-border"
              }
              onPressHandler={markFileAsFavourite.bind(
                this,
                item,
                favourites,
                setFavorites
              )}
            />
          </View>
          {enableHeaderActions && (
            <View style={styles.downloadIconContainer}>
              <DownloadIcon
                iconName={
                  savedImages.includes(getFileNameFromPath(item))
                    ? "check"
                    : "file-download"
                }
                onPressHandler={
                  savedImages.includes(getFileNameFromPath(item))
                    ? displayFileSavedToastMsg.bind(this, "File already saved!")
                    : saveImage.bind(this, item)
                }
              />
            </View>
          )}
        </Pressable>
      </View>
    );
  };

  const openGallery = (index) => {
    navigation.navigate("ImageSlides", {
      imageURIs: imageURIs,
      selectdImgIndex: index,
      showHeaderActions: enableHeaderActions,
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
    margin: 8,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: 240,
  },
  favIconContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    position: "absolute",
    top: "95%",
    left: "90%",
    transform: [{ translateX: -22 }, { translateY: -22 }],
    elevation: 6,
  },
  downloadIconContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    position: "absolute",
    top: "95%",
    left: "70%",
    transform: [{ translateX: -22 }, { translateY: -22 }],
    elevation: 6,
  },
  image: {
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: 200,
  },
  pressed: {
    opacity: 0.75,
  },
  flex: {
    flex: 1,
  },
});
