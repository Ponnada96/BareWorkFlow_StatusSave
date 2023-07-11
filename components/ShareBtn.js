import { Pressable } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { StyleSheet } from "react-native";
import * as RNFS from "react-native-fs";
import Share from "react-native-share";

function ShareBtn({ fileItems, fileType, setIsShareCompleted, color }) {
  const shareItem = async () => {
    try {
      setIsShareCompleted != null && setIsShareCompleted(false);
      const result = await Promise.all(
        fileItems.map(async (item) => {
          const base64Image = await RNFS.readFile(item, "base64");
          const url = `data:${fileType};base64,${base64Image}`;
          return url;
        })
      );
      const shareOptions = {
        type: fileType,
        urls: result,
      };
      Share.open(shareOptions);
      setIsShareCompleted != null && setIsShareCompleted(true);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Pressable
      onPress={shareItem}
      style={({ pressed }) => pressed && styles.pressed}
    >
      <Entypo name="share" size={22} color={color}></Entypo>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.75,
  },
});

export default ShareBtn;
