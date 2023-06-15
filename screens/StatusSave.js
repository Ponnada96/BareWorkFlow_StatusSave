import { View, Text } from "react-native";
import { useEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StorageAccessFramework } from "expo-file-system";
import ImageSlides from "../components/ImageSlides";
import ImageGallery from "../components/ImageGallery";

function StatusSave() {
  const [imageURIs, setimageURIs] = useState([]);
  const isFocused = useIsFocused();
  let url =
    "content://com.android.externalstorage.documents/tree/primary%3AAndroid%2Fmedia%2Fcom.whatsapp%2FWhatsApp%2FMedia%2F.Statuses";

  const GetDirectoryPermission = async () => {
    try {
      const statusFolder = await AsyncStorage.getItem("@statusFolder");
      if (
        statusFolder != null &&
        statusFolder != undefined &&
        statusFolder === url
      ) {
        return true;
      }
      const permissionRes =
        await StorageAccessFramework.requestDirectoryPermissionsAsync(url);
      if (!permissionRes.directoryUri.includes(url)) {
        return;
      }
      if (permissionRes.granted) {
        await AsyncStorage.setItem(
          "@statusFolder",
          permissionRes.directoryUri.toString()
        );
      }
      return permissionRes.granted;
    } catch (err) {
      console.warn(err);
    }
  };

  useEffect(() => {
    const askUserPermission = async () => {
      if (isFocused) {
        const permissionRes = await GetDirectoryPermission();
        if (permissionRes) {
          const folderContents =
            await StorageAccessFramework.readDirectoryAsync(url);
          const images = folderContents.filter((url) =>
            /\.(jpe?g|png|webp)$/.test(url)
          );
          const videos = folderContents.filter((url) => /\.(mp4)$/.test(url));
          setimageURIs(images);
        }
      }
    };
    askUserPermission();
  }, [url, isFocused]);
  return (
    <View>
      {/* <ImageGallery imageURIs={imageURIs} /> */}
      {/* <ImageSlides imageURIs={imageURIs} /> */}
      <ImageGallery imageURIs={imageURIs} />
    </View>
  );
}
export default StatusSave;
