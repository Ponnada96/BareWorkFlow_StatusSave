import { Text, View } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StorageAccessFramework } from "expo-file-system";
import VideosGallery from "../components/VideosGallery";
import InfoComponent from "../components/InfoComponent";

function Videos() {
  const [videoUris, setVideoURIs] = useState([]);
  const isFocused = useIsFocused();
  useEffect(() => {
    const getVideos = async () => {
      if (isFocused) {
        const statusFolder = await AsyncStorage.getItem("@statusFolder");
        if (statusFolder != null && statusFolder != undefined) {
          const folderContents =
            await StorageAccessFramework.readDirectoryAsync(statusFolder);
          const videos = folderContents.filter((url) => /\.(mp4)$/.test(url));
          setVideoURIs(videos);
        }
      }
    };
    getVideos();
  }, [isFocused]);

   if (videoUris.length == 0)
     return <InfoComponent>No videos to download!</InfoComponent>;

  return (
    <View>
      <VideosGallery
        videoURIs={videoUris}
        showHeaderActions={true}
        showFavActn={false}
        showDownloadActn={true}
      />
    </View>
  );
}
export default Videos;
