import { useIsFocused } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { View } from "react-native";
import * as RNFS from "react-native-fs";
import ImageGallery from "../components/ImageGallery";
import InfoComponent from "../components/InfoComponent";

function SavedImages() {
  const [imageURIs, setImageURIs] = useState([]);
  const isFocused = useIsFocused();
  const appDirPath = `${RNFS.PicturesDirectoryPath}/StatusSave`;

  useEffect(() => {
    const getSavedImages = async () => {
      if (isFocused && (await RNFS.exists(appDirPath))) {
        const folderContents = (await RNFS.readDir(appDirPath)).map(
          (item) => `file://${item.path}`
        );
        const images = folderContents.filter((url) =>
          /^(?!.*trashed-).*\.(jpe?g|png|webp)$/.test(url)
        );
        setImageURIs(images);
      }
    };
    getSavedImages();
  }, [isFocused]);

  if (imageURIs.length == 0)
    return <InfoComponent>No Saved Images</InfoComponent>;

  return (
    <View>
      <ImageGallery imageURIs={imageURIs} enableHeaderActions={false} />
    </View>
  );
}
export default SavedImages;
