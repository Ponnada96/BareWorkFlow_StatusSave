import { Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet } from "react-native";

function DeleteIcon({ onPressHandler,color }) {
  return (
    <Pressable
      onPress={onPressHandler}
      style={({ pressed }) => pressed && styles.pressed}
    >
      <MaterialIcons name={"delete"} size={24} color={color}></MaterialIcons>
    </Pressable>
  );
}

export default DeleteIcon;

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.75,
  },
});
