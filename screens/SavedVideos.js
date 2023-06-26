import { useIsFocused } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { View } from "react-native";
import * as RNFS from "react-native-fs";
import VideosGallery from "../components/VideosGallery";

function SavedVideos() {
  const [videoUris, setVideoUris] = useState([]);
  const isFocused = useIsFocused();
  const appDirPath = `${RNFS.PicturesDirectoryPath}/StatusSave`;

  useEffect(() => {
    const getSavedVideos = async () => {
      if (isFocused && (await RNFS.exists(appDirPath))) {
        const folderContents = (await RNFS.readDir(appDirPath)).map(
          (item) => `file://${item.path}`
        );
        const videos = folderContents.filter((url) =>
          /^(?!.*trashed-).*\.(mp4)$/.test(url)
        );
        setVideoUris(videos);
      }
    };
    getSavedVideos();
  }, [isFocused]);

  return (
    <View>
      <VideosGallery
        videoURIs={videoUris}
        showHeaderActions={false}
        showDownloadActn={false}
        showFavActn={true}
      />
    </View>
  );
}
export default SavedVideos;
