import { useIsFocused } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { View } from "react-native";
import * as RNFS from "react-native-fs";
import InfoComponent from "../components/InfoComponent";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFileNameFromPath } from "../components/Common/Utils";
import ImageGallery from "../components/ImageGallery";
import VideosGallery from "../components/VideosGallery";

function FavVideos() {
  const [favVideos, setFavVideos] = useState([]);
  const isFocused = useIsFocused();
  const appDirPath = `${RNFS.PicturesDirectoryPath}/StatusSave`;

  useEffect(() => {
    const getFavVideos = async () => {
      if (isFocused && (await RNFS.exists(appDirPath))) {
        const folderContents = (await RNFS.readDir(appDirPath)).map(
          (item) => `file://${item.path}`
        );
        const videos = folderContents.filter((url) =>
          /^(?!.*trashed-).*\.(mp4)$/.test(url)
        );
        console.log("videos", videos);
        if (videos.length > 0) {
          const favVideoFileNames = await AsyncStorage.getItem("favVideos");
          console.log("favVideoFileNames", favVideoFileNames);
          if (favVideoFileNames != null && favVideoFileNames.length > 0) {
            const favImages = videos.filter((item) =>
              favVideoFileNames.includes(getFileNameFromPath(item))
            );
            setFavVideos(favImages);
          }
        }
      }
    };
    getFavVideos();
  }, [isFocused]);

  if (favVideos.length == 0)
    return <InfoComponent>No Favourite Videos</InfoComponent>;

  return (
    <View>
      <VideosGallery videoURIs={favVideos} enableHeaderActions={false} />
    </View>
  );
}
export default FavVideos;
