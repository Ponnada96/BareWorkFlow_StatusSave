import { useIsFocused } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { View } from "react-native";
import * as RNFS from "react-native-fs";
import InfoComponent from "../components/InfoComponent";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFileNameFromPath } from "../components/Common/Utils";
import ImageGallery from "../components/ImageGallery";

function FavImages() {
  const [favImages, setFavImages] = useState([]);
  const isFocused = useIsFocused();
  const appDirPath = `${RNFS.PicturesDirectoryPath}/StatusSave`;

  useEffect(() => {
    const getFavImages = async () => {
      if (isFocused && (await RNFS.exists(appDirPath))) {
        const folderContents = (await RNFS.readDir(appDirPath)).map(
          (item) => `file://${item.path}`
        );
        const images = folderContents.filter((url) =>
          /^(?!.*trashed-).*\.(jpe?g|png|webp)$/.test(url)
        );
        console.log("Images", images);
        if (images.length > 0) {
          const favImgFileNames = await AsyncStorage.getItem("favImages");
          console.log("favImgFileNames", favImgFileNames);
          if (favImgFileNames != null && favImgFileNames.length > 0) {
            const favImages = images.filter((item) =>
              favImgFileNames.includes(getFileNameFromPath(item))
            );
           setFavImages(favImages);
          }
        }
      }
    };
    getFavImages();
  }, [isFocused]);

  if (favImages.length == 0)
    return <InfoComponent>No Favourite Images</InfoComponent>;

  return (
    <View>
      <ImageGallery imageURIs={favImages} enableHeaderActions={false} />
    </View>
  );
}
export default FavImages;
