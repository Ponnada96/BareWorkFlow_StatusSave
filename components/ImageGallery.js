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
  isFileExistsInSystem,
} from "./Common/Utils";
import DownloadIcon from "../UI/DownloadIcon";
import ShareBtn from "./ShareBtn";
import CheckBoxItem from "../UI/CheckBoxItem";

function ImageGallery({
  imageURIs,
  enableHeaderActions,
  showFavActn,
  showDownloadActn,
}) {
  const navigation = useNavigation();
  const [favourites, setFavorites] = useState([]);
  const [savedImages, setSavedImages] = useState([]);
  const isFocused = useIsFocused();
  const appDirPath = `${RNFS.PicturesDirectoryPath}/StatusSave`;
  const [selectedImages, setSelectedImages] = useState([]);
  const [isMulSelectEnabled, setMulSelectEnabled] = useState(false);
  const [isShareCompleted, setIsShareCompleted] = useState(false);

  useEffect(() => {
    if (isFocused) {
      const getFavourites = async () => {
        //  await AsyncStorage.setItem("favImages", JSON.stringify(favourites));
        const data = await AsyncStorage.getItem("favImages");
        if (data != null && data.length > 0) {
          setFavorites(JSON.parse(data));
        }
      };
      getFavourites();
    }
  }, [isFocused]);

  useEffect(() => {
    if (isFocused || isShareCompleted) {
        setMulSelectEnabled(false);
        setSelectedImages([]);
    }
  }, [isFocused, isShareCompleted]);

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

  
    useEffect(() => {
      if (enableHeaderActions) {
        navigation.getParent().setOptions({
          headerRight: () => (
            <HeaderBtns
              showSaveAllBtn={true}
              saveAllHandler={SaveAllFilesHandler.bind(this, imageURIs)}
              saveImgByIndexHandler={null}
              isFileDownload={false}
              displayInfoHandler={displayFileSavedToastMsg}
              showShareBtnActn={false}
            />
          ),
        });
      }
      if (isMulSelectEnabled) {
        navigation.getParent().setOptions({
          headerRight: () => (
            <View style={styles.headerShareIconContainer}>
              <ShareBtn
                fileItems={getSelecetdImages()}
                fileType={"image/png"}
                setIsShareCompleted={setIsShareCompleted}
                color={"#FFFFFF"}
              />
            </View>
          ),
        });
      }
    }, [imageURIs, isFocused, isMulSelectEnabled, selectedImages]);
  

  const getSelecetdImages = () => {
    const selImages = imageURIs.filter((item) =>
      selectedImages.includes(getFileNameFromPath(item))
    );
    return selImages;
  };
  useEffect(() => {
    const updateFavourites = async () => {
      await AsyncStorage.setItem("favImages", JSON.stringify(favourites));
    };
    updateFavourites();
  }, [favourites]);

  async function saveImage(uri, showToastMsg) {
    await SaveFile(uri);
    const fileName = getFileNameFromPath(uri);
    setSavedImages((items) =>
      items.length === 0 ? [fileName] : [...items, fileName]
    );
    showToastMsg && displayFileSavedToastMsg("File Saved");
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

  const markImageAsFavourite = async (fileUri) => {
    if (!(await isFileExistsInSystem(fileUri))) {
      await saveImage(fileUri, false);
    }
    await markFileAsFavourite(fileUri, favourites, setFavorites);
  };

  if (!showFavActn) {
    styles.downloadIconContainer.left = "90%";
  }

  const handleLongPress = (fileUri) => {
    console.log("longPress");
    selectImage(fileUri);
    setMulSelectEnabled(!isMulSelectEnabled);
  };

  const selectImage = (fileUri) => {
    const fileName = getFileNameFromPath(fileUri);
    const isSelected = selectedImages.includes(fileName);
    if (isSelected) {
      setSelectedImages(selectedImages.filter((item) => item !== fileName));
    } else {
      setSelectedImages([...selectedImages, fileName]);
    }
  };

  useEffect(() => {
    if (selectedImages.length === 0) {
      setMulSelectEnabled(false);
    }
  }, [selectedImages]);

  const isFileSelected = (fileUri) => {
    const fileName = getFileNameFromPath(fileUri);
    const isExists = selectedImages.includes(fileName);
    return isExists;
  };

  const RenderImage = ({ item, index }) => {
    return (
      <View style={[styles.container, isMulSelectEnabled && { opacity: 0.78 }]}>
        <Pressable
          onPress={
            isMulSelectEnabled
              ? selectImage.bind(this, item)
              : openGallery.bind(this, index)
          }
          style={({ pressed }) => [styles.flex, pressed && styles.pressed]}
          onLongPress={handleLongPress.bind(this, item)}
        >
          <Image
            source={{ uri: item }}
            style={styles.image}
            resizeMode="cover"
          />
        </Pressable>
        {showFavActn && !isMulSelectEnabled && (
          <View style={styles.favIconContainer}>
            <FavouriteIcon
              iconName={
                favourites.includes(getFileNameFromPath(item))
                  ? "favorite"
                  : "favorite-border"
              }
              size={22}
              onPressHandler={markImageAsFavourite.bind(this, item)}
            />
          </View>
        )}
        {showDownloadActn && !isMulSelectEnabled && (
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
                  : saveImage.bind(this, item, true)
              }
            />
          </View>
        )}
        {!isMulSelectEnabled && (
          <View style={styles.shareIconContainer}>
            <ShareBtn
              fileItems={[item]}
              fileType={"image/png"}
              setIsShareCompleted={setIsShareCompleted}
              color={"#f03709"}
            />
          </View>
        )}
        <CheckBoxItem
          fileUri={item}
          isMulSelectEnabled={isMulSelectEnabled}
          onPressHandler={selectImage.bind(this, item)}
          isFileSelecetd={isFileSelected(item)}
          checkBoxContainerStyle={styles.checkBoxContainer}
        />
      </View>
    );
  };

  const openGallery = (index) => {
    navigation.navigate("ImageSlides", {
      imageURIs: imageURIs,
      selectdImgIndex: index,
      showHeaderActions: enableHeaderActions,
      showFavActnBtn: showFavActn,
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
    borderRadius: 20,
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
  shareIconContainer: {
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
  headerShareIconContainer: {
    width: 30,
    height: 30,
    alignItems: "center",
    marginRight: 10,
    flexDirection: "row",
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
  checkBoxContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    position: "absolute",
    top: "10%",
    left: "90%",
    transform: [{ translateX: -22 }, { translateY: -22 }],
    elevation: 6,
  },
  image: {
    flex: 1,
    borderRadius: 20,
    height: 200,
  },
  pressed: {
    opacity: 0.75,
  },
  flex: {
    flex: 1,
  },
});
