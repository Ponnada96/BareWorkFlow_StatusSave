import { Text, View } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StorageAccessFramework } from "expo-file-system";
import ImageGallery from "../components/ImageGallery";

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

  return (
    <View>
      <ImageGallery imageURIs={videoUris} />
    </View>
  );
}
export default Videos;
