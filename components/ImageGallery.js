import { useIsFocused, useNavigation } from "@react-navigation/native";
import React from "react";
import { Pressable } from "react-native";
import { StyleSheet, Image, FlatList, View } from "react-native";
import { useEffect } from "react";
import HeaderBtns from "./HeaderBtns";
import { displayFileSavedToastMsg, SaveAllFiles } from "./Common/Utils";
import InfoComponent from "./InfoComponent";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import FavouriteIcon from "../UI/FavouriteIcon";
import { markFileAsFavourite, getFileNameFromPath } from "./Common/Utils";

function ImageGallery({ imageURIs, enableHeaderActions }) {
  const navigation = useNavigation();
  const [favourites, setFavorites] = useState([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      const getFavourites = async () => {
        // await AsyncStorage.setItem("favourites", JSON.stringify(favourites));
        const data = await AsyncStorage.getItem("favourites");
        if (data != null && data.length > 0) {
          setFavorites(JSON.parse(data));
        }
      };
      getFavourites();
    }
  }, [isFocused]);

  if (enableHeaderActions) {
    useEffect(() => {
      navigation.getParent().setOptions({
        headerRight: () => (
          <HeaderBtns
            showSaveAllBtn={true}
            saveAllHandler={SaveAllFiles.bind(this, imageURIs)}
            saveImgByIndexHandler={null}
            isFileDownload={false}
            displayInfoHandler={displayFileSavedToastMsg}
          />
        ),
      });
    }, [imageURIs, isFocused]);
  }

  useEffect(() => {
    const updateFavourites = async () => {
      await AsyncStorage.setItem("favourites", JSON.stringify(favourites));
    };
    updateFavourites();
  }, [favourites]);

  const RenderImage = ({ item, index }) => {
    if (imageURIs.length > 0) {
      return (
        <View style={styles.container}>
          <Pressable
            onPress={openGallery.bind(this, index)}
            style={({ pressed }) => [styles.flex, pressed && styles.pressed]}
          >
            <Image
              source={{ uri: item }}
              style={styles.image}
              resizeMode="cover"
            />
            <View style={styles.imageActIconsContainer}>
              <FavouriteIcon
                onPressHandler={markFileAsFavourite.bind(
                  this,
                  item,
                  favourites,
                  setFavorites
                )}
                iconName={
                  favourites.includes(getFileNameFromPath(item))
                    ? "favorite"
                    : "favorite-border"
                }
              />
            </View>
          </Pressable>
        </View>
      );
    } else {
      return <InfoComponent>No Videos</InfoComponent>;
    }
  };

  const openGallery = (index) => {
    navigation.navigate("ImageSlides", {
      imageURIs: imageURIs,
      selectdImgIndex: index,
      showHeaderActions: enableHeaderActions,
    });
  };

  return (
    <FlatList
      data={imageURIs}
      renderItem={RenderImage}
      keyExtractor={(item) => item}
      horizontal={false}
      numColumns={2}
    />
  );
}

export default ImageGallery;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    margin: 8,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: 240,
  },
  imageActIconsContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    position: "absolute",
    top: "95%",
    left: "90%",
    transform: [{ translateX: -22 }, { translateY: -22 }],
    elevation: 6,
  },
  image: {
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: 200,
  },
  pressed: {
    opacity: 0.75,
  },
  flex: {
    flex: 1,
  },
});
