import { FlatList } from "react-native";
import { View, StyleSheet, Dimensions, Image } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Pressable } from "react-native";
import InfoComponent from "./InfoComponent";
import { GlobalStyles } from "../constants/Colors";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import HeaderBtns from "./HeaderBtns";
import { SaveAllFiles, displayFileSavedToastMsg } from "./Common/Utils";

const height = Dimensions.get("window").height;

function VideosGallery({ videoURIs }) {
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  useEffect(() => {
    navigation.getParent().setOptions({
      headerRight: () => (
        <HeaderBtns
          showSaveAllBtn={true}
          saveAllHandler={SaveAllFiles.bind(this, videoURIs)}
          saveImgByIndexHandler={null}
          isFileDownload={false}
          displayInfoHandler={displayFileSavedToastMsg}
        />
      ),
    });
  }, [videoURIs, isFocused]);

  const renderVideoThumbnail = ({ item, _ }) => {
    return (
      <Pressable
        onPress={play.bind(this, item)}
        style={({ pressed }) => pressed && styles.pressed}
      >
        <View style={styles.container}>
          <Image source={{ uri: item }} style={styles.video}></Image>
          <View style={styles.button}>
            <Pressable
              onPress={play.bind(this, item)}
              style={({ pressed }) => pressed && styles.pressed}
            >
              <FontAwesome
                name="play-circle-o"
                color={GlobalStyles.colors.primary1000}
                size={50}
              />
            </Pressable>
          </View>
        </View>
      </Pressable>
    );
  };

  const play = (uri) => {
    navigation.navigate("VideoPlayer", { videoUri: uri });
  };

  if (videoURIs.length > 0) {
    return (
      <View style={styles.mainConatiner}>
        <FlatList
          data={videoURIs}
          renderItem={renderVideoThumbnail}
          keyExtractor={(_, index) => index}
        />
      </View>
    );
  } else {
    return <InfoComponent>No Videos</InfoComponent>;
  }
}

export default VideosGallery;

const styles = StyleSheet.create({
  mainConatiner: {
    backgroundColor: GlobalStyles.colors.primary900,
  },
  container: {
    height: height / 4,
    margin: 8,
    borderRadius: 10,
    elevation: 8,
    opacity: 0.93,
  },
  video: {
    borderRadius: 10,
    flex: 1,
  },
  button: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -25 }, { translateY: -25 }],
  },
  pressed: {
    opacity: 0.75,
  },
});
