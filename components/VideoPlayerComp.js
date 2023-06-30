import { StyleSheet, Dimensions, ToastAndroid, View } from "react-native";
import Video from "react-native-video";
import InfoComponent from "./InfoComponent";
import { useEffect, useState } from "react";
import HeaderBtns from "./HeaderBtns";
import * as RNFS from "react-native-fs";
import { useIsFocused } from "@react-navigation/native";
import {
  displayFileSavedToastMsg,
  SaveFile,
  getFileDestPath,
  getFileNameFromPath,
  markFileAsFavourite,
} from "./Common/Utils";
import FavouriteIcon from "../UI/FavouriteIcon";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ShareBtn from "./ShareBtn";

const screenHeight = Dimensions.get("window").height;

function VideoPlayerComp({ route, navigation }) {
  const videoUri = route.params?.videoUri;
  const showHeaderActions = route.params?.showHeaderActions;
  const showFavActn = route.params?.showFavActn;
  const [isFileDownload, setFileDownload] = useState(false);
  const [showVideo, setIsShowVideo] = useState(true);
  const isFocused = useIsFocused();
  const [favourites, setFavorites] = useState([]);

  async function saveVideo() {
    await SaveFile(videoUri);
    displayFileSavedToastMsg("Video Saved");
    setFileDownload(true);
  }

  useEffect(() => {
    async function verifyFileExistense() {
      const { destPath } = getFileDestPath(videoUri);
      const isFileExists = await RNFS.exists(destPath);
      setFileDownload(isFileExists);
    }
    verifyFileExistense();
  }, []);

  useEffect(() => {
    if (isFocused) {
      const getFavourites = async () => {
        // await AsyncStorage.setItem("favVideos", JSON.stringify(favourites));
        const data = await AsyncStorage.getItem("favVideos");
        if (data != null && data.length > 0) {
          setFavorites(JSON.parse(data));
        }
      };
      getFavourites();
    }
  }, [isFocused]);

  useEffect(() => {
    const updateFavourites = async () => {
      await AsyncStorage.setItem("favVideos", JSON.stringify(favourites));
    };
    updateFavourites();
  }, [favourites]);

  if (showHeaderActions) {
    useEffect(() => {
      navigation.setOptions({
        headerRight: () =>
          isFocused && (
            <HeaderBtns
              showSaveAllBtn={false}
              saveAllHandler={null}
              saveImgByIndexHandler={saveVideo}
              isFileDownload={isFileDownload}
              displayInfoHandler={displayFileSavedToastMsg}
              showShareBtnActn={true}
              shareItemFileType={"video/mp4"}
              fileItem={videoUri}
            />
          ),
      });
    }, [isFileDownload]);
  }

  if (showFavActn) {
    useEffect(() => {
      navigation.setOptions({
        headerRight: () => (
          <View style={styles.favContainer}>
            <View style={{ marginHorizontal: 10 }}>
              <FavouriteIcon
                iconName={
                  favourites.includes(getFileNameFromPath(videoUri))
                    ? "favorite"
                    : "favorite-border"
                }
                size={26}
                onPressHandler={markFileAsFavourite.bind(
                  this,
                  videoUri,
                  favourites,
                  setFavorites
                )}
              />
            </View>
            <View>
              <ShareBtn fileType={"video/mp4"} fileItem={videoUri} />
            </View>
          </View>
        ),
      });
    }, [favourites]);
  }

  useEffect(() => {
    if (!isFocused) {
      setIsShowVideo(false);
    }
  }, [isFocused]);

  if (videoUri === undefined) {
    return <InfoComponent>Unable to play video!</InfoComponent>;
  }

  return (
    showVideo && (
      <Video
        controls={true}
        source={{ uri: videoUri }}
        style={styles.fullScreen}
        resizeMode="contain"
        onEnd={() => {
          console.log("Completed!");
        }}
        ref={(ref) => {
          this.player = ref;
        }}
      ></Video>
    )
  );
}

export default VideoPlayerComp;

var styles = StyleSheet.create({
  container: {
    height: screenHeight,
  },
  fullScreen: {
    flex: 1,
  },
  favContainer: {
    alignItems: "center",
    marginRight: 10,
    flexDirection: "row",
  },
});
