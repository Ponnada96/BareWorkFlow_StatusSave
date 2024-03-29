import * as RNFS from "react-native-fs";
import { ToastAndroid } from "react-native";

export function SaveAllFiles(filesUris) {
  filesUris.map(async (file, _) => {
    await SaveFile(file);
  });
  displayFileSavedToastMsg("Saved All Successfully!");
}

export async function SaveFile(fileUri) {
  const { dirPath, destPath } = getFileDestPath(fileUri);
  if (await RNFS.exists(destPath)) {
    return;
  }
  const isDirExists = await RNFS.exists(dirPath);
  if (!isDirExists) {
    await RNFS.mkdir(dirPath);
  }
  await RNFS.copyFile(fileUri, destPath);
  RNFS.scanFile(destPath);
}

export function getFileDestPath(fileUri) {
  const fileName = getFileNameFromPath(fileUri);
  const dirPath = `${RNFS.PicturesDirectoryPath}/StatusSave`;
  const destPath = `${dirPath}/${fileName}`;
  return { dirPath, destPath };
}

export async function isFileExistsInSystem(fileUri) {
  const { destPath } = getFileDestPath(fileUri);
  const isFileExists = await RNFS.exists(destPath);
  return isFileExists;
}

export function displayFileSavedToastMsg(text) {
  ToastAndroid.showWithGravityAndOffset(
    text,
    ToastAndroid.SHORT,
    ToastAndroid.BOTTOM,
    150,
    50
  );
}

export async function markFileAsFavourite(fileUri, favourites, setFavorites) {
  const fileName = getFileNameFromPath(fileUri);
  if (favourites.includes(fileName)) {
    const itemIndex = favourites.indexOf(fileName);
    if (itemIndex > -1) {
      favourites.splice(itemIndex, 1);
      setFavorites([...favourites]);
      displayFileSavedToastMsg("Removed from Favourites");
    }
  } else {
    setFavorites((items) =>
      items.length === 0 ? [fileName] : [...items, fileName]
    );
    displayFileSavedToastMsg("Marked as favorite");
  }
}

export function getFileNameFromPath(fileUri) {
  if (fileUri.includes("%2F")) {
    return fileUri.substr(fileUri.lastIndexOf("%2F") + 1);
  } else {
    return fileUri.replace(/^.*(\\|\/|\:)/, "");
  }
}


 export async function deleteSelectedItemHandler(
   fileUri,
   index,
   setDeletedFiles,
   favourites,
   setFavorites,
   appDirPath
 ) {
   const fileName = getFileNameFromPath(fileUri);
   const fileFullPath = appDirPath + "/" + fileName;

   await RNFS.unlink(fileFullPath);
   await RNFS.scanFile(fileFullPath);
   setDeletedFiles((items) => [...items, fileName]);
   if (favourites.includes(fileName)) {
     const itemIndex = favourites.indexOf(fileName);
     if (itemIndex > -1) {
       favourites.splice(itemIndex, 1);
       setFavorites([...favourites]);
     }
   }
 };