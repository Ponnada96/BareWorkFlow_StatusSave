let url =
  "content://com.android.externalstorage.documents/tree/primary%3AAndroid%2Fmedia%2Fcom.whatsapp%2FWhatsApp%2FMedia%2F.Statuses";

// url =
// "content://com.android.externalstorage.documents/tree/primary%3AAndroid%2Fmedia%2Fcom.whatsapp%2FWhatsApp%2FMedia%2F.Statuses";
// url =
//   "content://com.android.externalstorage.documents/tree/primary%3AWhatsApp%2FMedia%2F.Statuses";
//url ="content://com.android.externalstorage.documents/tree/primary%3AAndroid%2Fmedia%2Fcom.whatsapp%2FWhatsApp%2FMedia%2F.Statuses";
const GetDirectoryPermission = async () => {
  try {
    const permissionRes =
      await StorageAccessFramework.requestDirectoryPermissionsAsync(url);
    const folderContents = await StorageAccessFramework.readDirectoryAsync(url);

    const result = folderContents;
    console.log(result);
    const fileUri = `${RNFS.DocumentDirectoryPath}/images/test.jpg`;
    console.log(fileUri);
    // const res = await FileSystem.copyAsync({ from: result[1], to: fileUri });
    const s = result.map((path) => saveFile(path));
    // console.log(res);
    return permissionRes.granted;
  } catch (err) {
    console.warn(err);
  }
};

const saveFile = async (uri) => {
  //const fileUri = uri.replace("content://", ""); // Removing 'content://' from the URI

  // Creating the destination file path
  console.log(uri);
  const extension = uri.substr(uri.lastIndexOf("%2F") + 1).split(".")[1];
  console.log("extension", extension);
  if (extension === "jpg" || extension === "nomedia") {
    return;
  }

  const destPath = `${RNFS.PicturesDirectoryPath}/SaveStatus/${
    Math.random() + Math.random()
  }}.${extension}`;

  console.log("destPath", destPath);
  // Checking if the destination directory exists, and creating it if not
  const dirExists = await RNFS.exists(
    RNFS.PicturesDirectoryPath + "/SaveStatus"
  );
  if (!dirExists) {
    await RNFS.mkdir(RNFS.PicturesDirectoryPath + "/SaveStatus");
  }

  console.log("copying file");
  // Copying the file to the destination path

  await RNFS.copyFile(uri, destPath);
  RNFS.scanFile(destPath);
  // Triggering a media scan on the saved file
  console.log("File saved successfully!");
};
useEffect(() => {
  const askPermission = async () => {
    const permissionRes = await GetDirectoryPermission();
    // if (permissionRes) {
    //   const folderContents = await StorageAccessFramework.readDirectoryAsync(
    //     url
    //   );
    //   const result = folderContents.filter((url) =>
    //     /\.(jpe?g|png|webp)$/.test(url)
    //   );
    //   setimageURIs(result);

    //   const directoryName = "MyImages";
    //   const fileName = "myImage.jpg";

    //   saveImageFromContentUri(folderContents[3], directoryName, fileName);
    //   //  console.log(rep);
    // }
  };
  askPermission();
}, [url]);
