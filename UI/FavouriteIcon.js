import { MaterialIcons } from "@expo/vector-icons";
import { Pressable } from "react-native";
import { StyleSheet } from "react-native";

function FavouriteIcon({ onPressHandler, iconName ,size}) {
  return (
    <Pressable
      onPress={onPressHandler}
      style={({ pressed }) => pressed && styles.pressed}
    >
      <MaterialIcons
        name={iconName}
        size={size}
        color="#f03709"
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
