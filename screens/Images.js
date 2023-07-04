import { Text, View } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StorageAccessFramework } from "expo-file-system";
import ImageGallery from "../components/ImageGallery";
import InfoComponent from "../components/InfoComponent";

function Images() {
  const [imageURIs, setimageURIs] = useState([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    const getImages = async () => {
      if (isFocused) {
        const statusFolder = await AsyncStorage.getItem("@statusFolder");
        if (statusFolder != null && statusFolder != undefined) {
          const folderContents =
            await StorageAccessFramework.readDirectoryAsync(statusFolder);
          const images = folderContents.filter((url) =>
            /\.(jpe?g|png|webp)$/.test(url)
          );
          setimageURIs(images);
        }
      }
    };
    getImages();
  }, [isFocused]);

  if (imageURIs.length == 0)
    return <InfoComponent>No Saved Images</InfoComponent>;

  return (
    <View>
      <ImageGallery
        imageURIs={imageURIs}
        enableHeaderActions={true}
        showDownloadActn={true}
        showFavActn={false}
        showDelActn={false}
      />
    </View>
  );
}
export default Images;
