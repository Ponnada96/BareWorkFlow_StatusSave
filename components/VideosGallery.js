import { FlatList } from "react-native";
import { View, StyleSheet, Dimensions, Image } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Pressable } from "react-native";
import InfoComponent from "./InfoComponent";
import { GlobalStyles } from "../constants/Colors";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { useEffect, useLayoutEffect, useState } from "react";
import HeaderBtns from "./HeaderBtns";
import {
  SaveAllFiles,
  displayFileSavedToastMsg,
  getFileNameFromPath,
  SaveFile,
  markFileAsFavourite,
  isFileExistsInSystem,
} from "./Common/Utils";
import FavouriteIcon from "../UI/FavouriteIcon";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as RNFS from "react-native-fs";
import DownloadIcon from "../UI/DownloadIcon";

const height = Dimensions.get("window").height;

function VideosGallery({ videoURIs, showHeaderActions }) {
  const navigation = useNavigation();
  const [favourites, setFavorites] = useState([]);
  const [savedVideos, setSavedVideos] = useState([]);
  const isFocused = useIsFocused();
  const appDirPath = `${RNFS.PicturesDirectoryPath}/StatusSave`;

  useEffect(() => {
    const getFavourites = async () => {
      if (isFocused) {
        console.log("useLayEff-Fav");
        // await AsyncStorage.setItem("fav_videos", JSON.stringify(favourites));
        const data = await AsyncStorage.getItem("favVideos");
        if (data != null && data.length > 0) {
          setFavorites(JSON.parse(data));
        }
      }
    };
    getFavourites();
  }, [isFocused]);

  useEffect(() => {
    const getSavedVideos = async () => {
      if (isFocused && (await RNFS.exists(appDirPath))) {
        const folderContents = (await RNFS.readDir(appDirPath)).map((item) =>
          getFileNameFromPath(item.path)
        );
        const videos = folderContents.filter((url) =>
          /^(?!.*trashed-).*\.(mp4)$/.test(url)
        );
        setSavedVideos(videos);
      }
    };
    getSavedVideos();
  }, [isFocused]);

  useEffect(() => {
    const updateFavourites = async () => {
      if (isFocused) {
        console.log("set storage", favourites);
        await AsyncStorage.setItem("favVideos", JSON.stringify(favourites));
      }
    };
    updateFavourites();
    console.log("Executed updateFav storage", favourites);
  }, [favourites, isFocused]);

  if (showHeaderActions) {
    useEffect(() => {
      navigation.getParent().setOptions({
        headerRight: () => (
          <HeaderBtns
            showSaveAllBtn={true}
            saveAllHandler={SaveAllFilesHandler.bind(this, videoURIs)}
            saveImgByIndexHandler={null}
            isFileDownload={false}
            displayInfoHandler={displayFileSavedToastMsg}
          />
        ),
      });
    }, [videoURIs, isFocused]);
  }

  function SaveAllFilesHandler(videoURIs) {
    SaveAllFiles(videoURIs);
    videoURIs.map((item) => {
      const fileName = getFileNameFromPath(item);
      if (!savedVideos.includes(fileName)) {
        setSavedVideos((items) => [...items, fileName]);
      }
    });
  }
  async function saveVideo(uri, showToastMsg) {
    await SaveFile(uri);
    const fileName = getFileNameFromPath(uri);
    setSavedVideos((items) =>
      items.length === 0 ? [fileName] : [...items, fileName]
    );
    showToastMsg && displayFileSavedToastMsg("File Saved");
  }

  const markVideoAsFavourite = async (fileUri) => {
    if (!(await isFileExistsInSystem(fileUri))) {
      await saveVideo(fileUri, false);
    }
    await markFileAsFavourite(fileUri, favourites, setFavorites);
  };

  const renderVideoThumbnail = ({ item, _ }) => {
    return (
      <View style={styles.container}>
        <Pressable
          onPress={play.bind(this, item)}
          style={({ pressed }) => pressed && styles.pressed}
        >
          <Image source={{ uri: item }} style={styles.video}></Image>
        </Pressable>
        <View style={styles.button}>
          <Pressable
            onPress={play.bind(this, item)}
            style={({ pressed }) => pressed && styles.pressed}
          >
            <FontAwesome
              name="play-circle-o"
              color={GlobalStyles.colors.primary1000}
              size={50}
            />
          </Pressable>
        </View>
        <View style={styles.favIconContainer}>
          <FavouriteIcon
            iconName={
              favourites.includes(getFileNameFromPath(item))
                ? "favorite"
                : "favorite-border"
            }
            onPressHandler={markVideoAsFavourite.bind(this, item)}
          />
        </View>
        {showHeaderActions && (
          <View style={styles.downloadIconContainer}>
            <DownloadIcon
              iconName={
                savedVideos.includes(getFileNameFromPath(item))
                  ? "check"
                  : "file-download"
              }
              onPressHandler={
                savedVideos.includes(getFileNameFromPath(item))
                  ? displayFileSavedToastMsg.bind(this, "File already saved!")
                  : saveVideo.bind(this, item, true)
              }
            />
          </View>
        )}
      </View>
    );
  };

  const play = (uri) => {
    navigation.navigate("VideoPlayer", {
      videoUri: uri,
      showHeaderActions: showHeaderActions,
    });
  };

  if (videoURIs.length > 0) {
    return (
      <View style={styles.mainConatiner}>
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
  mainConatiner: {
    height: "100%",
  },
  container: {
    height: height / 4,
    margin: 8,
    borderRadius: 10,
    elevation: 8,
    opacity: 0.93,
  },
  video: {
    borderRadius: 10,
    height: height / 4,
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
  favIconContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    position: "absolute",
    top: "98%",
    left: "98%",
    transform: [{ translateX: -30 }, { translateY: -30 }],
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
    top: "98%",
    left: "88%",
    transform: [{ translateX: -30 }, { translateY: -30 }],
    elevation: 6,
  },
});
