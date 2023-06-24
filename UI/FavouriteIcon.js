import { MaterialIcons } from "@expo/vector-icons";
import { Pressable } from "react-native";
import { StyleSheet } from "react-native";

function FavouriteIcon({ onPressHandler, iconName }) {
  return (
    <Pressable
      onPress={onPressHandler}
      style={({ pressed }) => pressed && styles.pressed}
    >
      <MaterialIcons
        name={iconName}
        size={22}
        color="#b11d1d"
      ></MaterialIcons>
    </Pressable>
  );
}
export default FavouriteIcon;

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.75,
  },
});
