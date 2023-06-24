import { StyleSheet, Dimensions, ToastAndroid } from "react-native";
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
} from "./Common/Utils";

const screenHeight = Dimensions.get("window").height;

function VideoPlayerComp({ route, navigation }) {
  const videoUri = route.params?.videoUri;
  const showHeaderActions = route.params?.showHeaderActions;
  const [isFileDownload, setFileDownload] = useState(false);
  const [showVideo, setIsShowVideo] = useState(true);
  const isFocused = useIsFocused();

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
            />
          ),
      });
    }, [isFileDownload]);
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
});
