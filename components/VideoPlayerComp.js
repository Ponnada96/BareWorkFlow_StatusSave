import { StyleSheet, Dimensions, ToastAndroid } from "react-native";
import Video from "react-native-video";
import InfoComponent from "./InfoComponent";
import { useEffect, useLayoutEffect, useState } from "react";
import HeaderBtns from "./HeaderBtns";
import * as RNFS from "react-native-fs";

const screenHeight = Dimensions.get("window").height;

function VideoPlayerComp({ route, navigation }) {
  const videoUri = route.params?.videoUri;
  const [isFileDownload, setFileDownload] = useState(false);

  function saveAll() {
    console.log("save All");
  }

  function getFileDestPath() {
    const fileName = videoUri.substr(videoUri.lastIndexOf("%2F") + 1);
    const dirPath = `${RNFS.PicturesDirectoryPath}/StatusSave`;
    const destPath = `${dirPath}/${fileName}`;
    return { dirPath, destPath };
  }

  async function saveVideo() {
    const { dirPath, destPath } = getFileDestPath();
    if (await RNFS.exists(destPath)) {
      return;
    }
    const isDirExists = await RNFS.exists(dirPath);
    if (!isDirExists) {
      await RNFS.mkdir(dirPath);
    }
    await RNFS.copyFile(videoUri, destPath);
    RNFS.scanFile(destPath);
    setFileDownload(true);
    displayFileSavedToastMsg("Video Saved");
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

  
  useLayoutEffect(() => {
    async function verifyFileExistense() {
      const { destPath } = getFileDestPath();
      const isFileExists = await RNFS.exists(destPath);
      setFileDownload(isFileExists);
      console.log("isFileExists", isFileExists);
    }
    verifyFileExistense();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderBtns
          showSaveAllBtn={false}
          saveAllHandler={saveAll}
          saveImgByIndexHandler={saveVideo}
          isFileDownload={isFileDownload}
          displayInfoHandler={displayFileSavedToastMsg}
        />
      ),
    });
  }, [isFileDownload]);


  if (videoUri === undefined) {
    return <InfoComponent>Unable to play video!</InfoComponent>;
  }

  return (
    <Video
      controls={true}
      source={{ uri: videoUri }}
      style={styles.fullScreen}
      resizeMode="contain"
      onEnd={() => {
        console.log("Completed!");
      }}
    ></Video>
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
