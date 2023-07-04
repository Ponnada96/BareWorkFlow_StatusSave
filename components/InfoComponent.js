import { View, Text, StyleSheet } from "react-native";
import { GlobalStyles } from "../constants/Colors";

function InfoComponent({ children }) {
  return (
    <View style={styles.infoContainer}>
      <Text style={styles.infoText}>{children}</Text>
    </View>
  );
}

export default InfoComponent;

const styles = StyleSheet.create({
  infoContainer: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  infoText: {
    fontSize: 18,
    textAlign: "center",
    fontWeight: "500",
    color: GlobalStyles.colors.primary800,
  },
});
