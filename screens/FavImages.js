import { useIsFocused } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { View } from "react-native";
import * as RNFS from "react-native-fs";
import InfoComponent from "../components/InfoComponent";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFileNameFromPath } from "../components/Common/Utils";
import ImageGallery from "../components/ImageGallery";

function FavImages() {
  const [imageURIs, setImageURIs] = useState([]);
  const [favImages, setFavImages] = useState([]);
  const isFocused = useIsFocused();
  const appDirPath = `${RNFS.PicturesDirectoryPath}/StatusSave`;

  useEffect(() => {
    const getSavedImages = async () => {
      if (isFocused && (await RNFS.exists(appDirPath))) {
        const folderContents = (await RNFS.readDir(appDirPath))
          .sort((a, b) => {
            return new Date(b.mtime) - new Date(a.mtime);
          })
          .map((item) => `file://${item.path}`);
          
        const images = folderContents.filter((url) =>
          /^(?!.*trashed-).*\.(jpe?g|png|webp)$/.test(url)
        );
        setImageURIs(images);
      }
    };
    getSavedImages();
  }, [isFocused]);

  useEffect(() => {
    const getFavImages = async () => {
      if (imageURIs.length > 0) {
        console.log("imageURIs");
        const favImgFileNames = await AsyncStorage.getItem("favImages");
        if (favImgFileNames != null && favImgFileNames.length > 0) {
          const favImages = imageURIs.filter((item) =>
            favImgFileNames.includes(getFileNameFromPath(item))
          );
          setFavImages(favImages);
        }
      } else {
        setFavImages([]);
      }
    };
    getFavImages();
  }, [imageURIs]);



  if (favImages.length == 0)
    return <InfoComponent>No Favourite Images</InfoComponent>;
  
  console.log("favImages.length", favImages.length);
  return (
    <View>
      <ImageGallery
        imageURIs={favImages}
        enableHeaderActions={false}
        showDownloadActn={false}
        showFavActn={true}
        showDelActn={true}
      />
    </View>
  );
}
export default FavImages;
