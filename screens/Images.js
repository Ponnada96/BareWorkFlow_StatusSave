import { Text, View } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StorageAccessFramework } from "expo-file-system";
import ImageGallery from "../components/ImageGallery";
import ImageSlides from "../components/ImageSlides";

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

  return (
    <View>
      <ImageGallery imageURIs={imageURIs} />
    </View>
  );
}
export default Images;
