import { MaterialIcons } from "@expo/vector-icons";

function FavouriteIcon({ onPressHandler, iconName }) {
  return (
    <MaterialIcons
      name={iconName}
      size={22}
      color="#b11d1d"
      onPress={onPressHandler}
    ></MaterialIcons>
  );
}
export default FavouriteIcon;
