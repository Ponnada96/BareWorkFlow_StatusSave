import { Pressable } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { StyleSheet } from "react-native";
import * as RNFS from "react-native-fs";
import Share from "react-native-share";

function ShareBtn({ fileItem, fileType }) {
  const shareItem = async () => {
    try {
      console.log("shareItem called");
      const base64Image = await RNFS.readFile(fileItem, "base64");
      const shareOptions = {
        url: `data:${fileType};base64,${base64Image}`,
        type: `${fileType}`,
      };
      const shareResponse = await Share.open(shareOptions);
      console.log("shareResponse", shareResponse);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Pressable
      onPress={shareItem}
      style={({ pressed }) => pressed && styles.pressed}
    >
      <Entypo name="share" size={24} color="#f03709"></Entypo>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.75,
  },
});

export default ShareBtn;
