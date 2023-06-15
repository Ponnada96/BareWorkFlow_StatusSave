import { View, StyleSheet } from "react-native";
import IconButton from "../UI/IconButton";
import { IconTypes } from "../constants/IconTypes";
import Button from "../UI/Button";

function HeaderBtns({
  saveAllHandler,
  showSaveAllBtn,
  saveImgByIndexHandler,
  isFileDownload,
  displayInfoHandler,
}) {
  return (
    <View style={styles.btnContainer}>
      {showSaveAllBtn && (
        <Button
          style={styles.btn}
          onPress={saveAllHandler}
          showIcon={true}
          iconName="download"
        >
          Save All
        </Button>
      )}
      {isFileDownload ? (
        <IconButton
          name="check"
          size={24}
          color="#b62323"
          onPress={displayInfoHandler.bind(this, "File Already Saved!")}
          iconType={IconTypes.Entypo}
        ></IconButton>
      ) : (
        <IconButton
          name="download"
          size={24}
          color="green"
          onPress={saveImgByIndexHandler}
          iconType={IconTypes.Entypo}
        ></IconButton>
      )}
    </View>
  );
}

export default HeaderBtns;

const styles = StyleSheet.create({
  btnContainer: {
    alignItems: "center",
    marginRight: 10,
    flexDirection: "row",
  },
  btn: {
    marginHorizontal: 10,
  },
});
