import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Favourites from "./screens/Favourites";
import PrivateGallary from "./screens/PrivateGallary";
import Downloads from "./screens/Downloads";
import Icon from "react-native-vector-icons/FontAwesome";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import { GlobalStyles } from "./constants/Colors";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StorageAccessFramework } from "expo-file-system";
import { Alert } from "react-native";
import Images from "./screens/Images";
import Videos from "./screens/Videos";
import { createStackNavigator } from "@react-navigation/stack";
import ImageSlides from "./components/ImageSlides";
import VideoPlayerComp from "./components/VideoPlayerComp";

const BottomTabs = createBottomTabNavigator();
const TopTabs = createMaterialTopTabNavigator();
const Stack = createStackNavigator();
let url =
  "content://com.android.externalstorage.documents/tree/primary%3AAndroid%2Fmedia%2Fcom.whatsapp%2FWhatsApp%2FMedia%2F.Statuses";

const GetDirectoryPermission = async () => {
  try {
    const statusFolder = await AsyncStorage.getItem("@statusFolder");
    if (
      statusFolder != null &&
      statusFolder != undefined &&
      statusFolder === url
    ) {
      return true;
    }
    const permissionRes =
      await StorageAccessFramework.requestDirectoryPermissionsAsync(url);
    if (!permissionRes.directoryUri.includes(url)) {
      return;
    }
    if (permissionRes.granted) {
      await AsyncStorage.setItem(
        "@statusFolder",
        permissionRes.directoryUri.toString()
      );
    }
    return permissionRes.granted;
  } catch (err) {
    console.warn(err);
  }
};

function TopTabNavigator() {
  return (
    <TopTabs.Navigator>
      <TopTabs.Screen name="Images" component={Images} />
      <TopTabs.Screen name="Videos" component={Videos} />
    </TopTabs.Navigator>
  );
}

function BottomTabNavigator() {
  return (
    <BottomTabs.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: GlobalStyles.colors.primary500 },
        headerTintColor: "white",
        tabBarStyle: {
          backgroundColor: GlobalStyles.colors.primary500,
          height: 80,
        },
        tabBarLabelStyle: {
          fontSize: 13,
          alignItems: "center",
          justifyContent: "center",
          marginVertical: 4,
        },
        tabBarActiveTintColor: "#0fe9cf",
        tabBarInactiveTintColor: GlobalStyles.colors.white,
      }}
    >
      <BottomTabs.Screen
        name="StatusSave"
        component={TopTabNavigator}
        options={{
          title: "Save Status",
          tabBarLabel: "Save Status",
          tabBarIcon: ({ color, size, focused }) => (
            <Icon
              name="download"
              color={focused ? "#0fe9cf" : color}
              size={24}
            />
          ),
        }}
      ></BottomTabs.Screen>
      <BottomTabs.Screen
        name="Downloads"
        component={Downloads}
        options={{
          title: "Downloads",
          tabBarLabel: "Downloads",
          tabBarIcon: ({ color, size, focused }) => (
            <Icon
              name="image"
              color={focused ? "#0fe9cf" : color}
              size={size}
            />
          ),
        }}
      ></BottomTabs.Screen>
      <BottomTabs.Screen
        name="Favourites"
        component={Favourites}
        options={{
          title: "Favourites",
          tabBarLabel: "Favourites",
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialIcon
              name="favorite"
              color={focused ? "#0fe9cf" : color}
              size={size}
            />
          ),
        }}
      ></BottomTabs.Screen>
      <BottomTabs.Screen
        name="PrivateGallary"
        component={PrivateGallary}
        options={{
          title: "Private Gallary",
          tabBarLabel: "Private Gallary",
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialIcon
              name="security"
              color={focused ? "#0fe9cf" : color}
              size={size}
            />
          ),
        }}
      ></BottomTabs.Screen>
    </BottomTabs.Navigator>
  );
}

export default function App() {
  useEffect(() => {
    const askUserPermission = async () => {
      const permissionRes = await GetDirectoryPermission();
      if (!permissionRes) {
        Alert.alert("Permission Denied", "Provide Access to External Storage");
      }
    };
    askUserPermission();
  }, [url]);

  return (
    <>
      <StatusBar style="auto" />
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="StatusSaveTabs"
            component={BottomTabNavigator}
            options={{ headerShown: false }}
          ></Stack.Screen>
          <Stack.Screen
            name="ImageSlides"
            component={ImageSlides}
            options={{ title: "Images" }}
          ></Stack.Screen>
          <Stack.Screen
            name="VideoPlayer"
            component={VideoPlayerComp}
            options={{ title: "Video" }}
          ></Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
