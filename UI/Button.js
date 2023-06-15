import { Pressable, View, Text, StyleSheet } from "react-native";
import { GlobalStyles } from "../constants/Colors";
import { Feather } from "@expo/vector-icons";

function Button({ children, onPress, mode, style, showIcon, iconName }) {
  return (
    <View style={style}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => pressed && styles.pressed}
      >
        <View style={[styles.buttons, mode === "flat" && styles.flat]}>
          <Text style={[styles.buttonText, mode === "flat" && styles.flatText]}>
            {children}
          </Text>
          {showIcon && (
            <Feather name={iconName} size={18} color="#ffffff"></Feather>
          )}
        </View>
      </Pressable>
    </View>
  );
}

export default Button;

const styles = StyleSheet.create({
  buttons: {
    flexDirection: "row",
    borderRadius: 8,
    padding: 6,
    backgroundColor: "#40a79b",
  },
  flat: {
    backgroundColor: "transparent",
  },
  buttonText: {
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    paddingRight: 4,
  },
  flatText: {
    color: GlobalStyles.colors.primary200,
  },
  pressed: {
    opacity: 0.75,
    backgroundColor: GlobalStyles.colors.primary200,
    borderRadius: 8,
  },
});
