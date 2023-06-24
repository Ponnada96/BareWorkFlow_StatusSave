import { Pressable, View, StyleSheet } from "react-native";
import { Ionicons, Entypo, MaterialIcons } from "@expo/vector-icons";

function IconButton({ name, size, color, onPress, iconType }) {
  let icon;

  switch (iconType) {
    case "VectorIcons":
      icon = <Ionicons name={name} size={size} color={color}></Ionicons>;
      break;
    case "Entypo":
      icon = <Entypo name={name} size={size} color={color}></Entypo>;
      break;
    case "MaterialIcons":
      icon = (
        <MaterialIcons name={name} size={size} color={color}></MaterialIcons>
      );
      break;
  }

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => pressed && styles.pressed}
    >
      <View style={styles.buttonContainer}>{icon}</View>
    </Pressable>
  );
}
export default IconButton;

const styles = StyleSheet.create({
  buttonContainer: {
    padding: 6,
    borderRadius: 24,
    marginHorizontal: 8,
    marginVertical: 2,
  },
  pressed: {
    opacity: 0.75,
  },
});
