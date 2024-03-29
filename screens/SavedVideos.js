import { useIsFocused } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { View } from "react-native";
import * as RNFS from "react-native-fs";
import VideosGallery from "../components/VideosGallery";
import InfoComponent from "../components/InfoComponent";

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

  if (videoUris.length == 0)
    return <InfoComponent>No Saved Videos</InfoComponent>;

  return (
    <View>
      <VideosGallery
        videoURIs={videoUris}
        setVideoURIs={setVideoUris}
        showHeaderActions={false}
        showDownloadActn={false}
        showFavActn={true}
        showDelActn={true}
      />
    </View>
  );
}
export default SavedVideos;
