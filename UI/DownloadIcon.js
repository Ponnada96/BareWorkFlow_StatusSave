import { Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet } from "react-native";

function DownloadIcon({ onPressHandler, iconName }) {
  return (
    <Pressable
      onPress={onPressHandler}
      style={({ pressed }) => pressed && styles.pressed}
    >
      <MaterialIcons name={iconName} size={22} color="#b11d1d"></MaterialIcons>
    </Pressable>
  );
}

export default DownloadIcon;

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.75,
  },
});
