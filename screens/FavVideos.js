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
  const [videoURIs, setvideoURIs] = useState([]);
  const [favVideos, setFavVideos] = useState([]);
  const isFocused = useIsFocused();
  const appDirPath = `${RNFS.PicturesDirectoryPath}/StatusSave`;

  useEffect(() => {
    const getSavedVideos = async () => {
      if (isFocused && (await RNFS.exists(appDirPath))) {
        const folderContents = (await RNFS.readDir(appDirPath))
          .sort((a, b) => {
            return new Date(b.mtime) - new Date(a.mtime);
          })
          .map((item) => `file://${item.path}`);

        const videos = folderContents.filter((url) =>
          /^(?!.*trashed-).*\.(mp4)$/.test(url)
        );

        setvideoURIs(videos);
      }
    };
    getSavedVideos();
  }, [isFocused]);

  useEffect(() => {
    const getFavVideos = async () => {
      if (videoURIs.length > 0) {
        const favVideoFileNames = await AsyncStorage.getItem("favVideos");
        if (favVideoFileNames != null && favVideoFileNames.length > 0) {
          const favVideos = videoURIs.filter((item) =>
            favVideoFileNames.includes(getFileNameFromPath(item))
          );
          setFavVideos(favVideos);
        }
      } else {
        setFavVideos([]);
      }
    };
    getFavVideos();
  }, [videoURIs]);

  if (favVideos.length == 0)
    return <InfoComponent>No Favourite Videos</InfoComponent>;

  return (
    <View>
      <VideosGallery
        videoURIs={favVideos}
        setVideoURIs={setFavVideos}
        enableHeaderActions={false}
        showDownloadActn={false}
        showFavActn={true}
        showDelActn={true}
      />
    </View>
  );
}
export default FavVideos;
