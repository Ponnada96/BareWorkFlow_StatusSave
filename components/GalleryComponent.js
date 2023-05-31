import React, { useState } from "react";
import { View, TouchableOpacity, Image, Dimensions } from "react-native";
import ImageGallery from "react-native-image-gallery";

const GalleryComponent = ({ images }) => {
  const [showSlideshow, setShowSlideshow] = useState(false);
  const [initialPage, setInitialPage] = useState(0);

  const openSlideshow = (index) => {
    setInitialPage(index);
    setShowSlideshow(true);
  };

  const closeSlideshow = () => {
    setShowSlideshow(false);
  };

  return (
    <View>
      {images.map((image, index) => (
        <TouchableOpacity key={index} onPress={() => openSlideshow(index)}>
          <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
        </TouchableOpacity>
      ))}
      {showSlideshow && (
        <View style={{ flex: 1 }}>
          <ImageGallery
            initialPage={initialPage}
            style={{ flex: 1, backgroundColor: "black" }}
            onPageSelected={(page) => setInitialPage(page)}
            onPageScrollStateChanged={(state) => {
              if (state === "idle") {
                // Set the current page as the initialPage when the user has finished scrolling
                setInitialPage(1);
              }
            }}
            images={images.map((image) => ({ source: { uri: image } }))}
            onSingleTapConfirmed={closeSlideshow}
          />
        </View>
      )}
    </View>
  );
};

export default GalleryComponent;