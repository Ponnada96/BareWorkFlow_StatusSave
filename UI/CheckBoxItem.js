import { View, Pressable, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

function CheckBoxItem({
  isMulSelectEnabled,
  onPressHandler,
  isFileSelecetd,
  checkBoxContainerStyle,
}) {
  if (isMulSelectEnabled) {
    if (isFileSelecetd) {
      return (
        <View style={checkBoxContainerStyle}>
          <Pressable
            onPress={onPressHandler}
            style={({ pressed }) => pressed && styles.pressed}
          >
            <MaterialIcons
              name={"check-box"}
              size={24}
              color="#f03709"
            ></MaterialIcons>
          </Pressable>
        </View>
      );
    } else {
      return (
        <View style={checkBoxContainerStyle}>
          <Pressable
            onPress={onPressHandler}
            style={({ pressed }) => pressed && styles.pressed}
          >
            <MaterialIcons
              name={"check-box-outline-blank"}
              size={24}
              color="#f03709"
            ></MaterialIcons>
          </Pressable>
        </View>
      );
    }
  }
}
export default CheckBoxItem;

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.75,
  },
});
