import { Text, View, StyleSheet, Dimensions } from "react-native";
import { FlatList } from "react-native-gesture-handler";
const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

function VideoPlayer({ videoUri }) {
  const RenderVideo = ({ item, index }) => {
    return (
      <View style={styles.container}>
        <Text>{item}</Text>
      </View>
    );
  };

  return (
    <View style={{ backgroundColor: "#fff" }}>
      <FlatList
        data={videoUri}
        renderItem={RenderVideo}
        keyExtractor={(_, index) => index}
      />
    </View>
  );
}
export default VideoPlayer;

var styles = StyleSheet.create({
  container: {
    backgroundColor: "yellow",
    height: screenHeight / 4,
    margin: 8,
    borderRadius: 12,
    elevation: 4,
  },
});
