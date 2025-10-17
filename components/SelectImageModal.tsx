import { CameraView, useCameraPermissions } from "expo-camera";
import { Text, TouchableOpacity, View, Button, Platform } from "react-native";
import { useRef } from "react";
import * as ImagePicker from "expo-image-picker";
import * as Device from "expo-device";
import "../global.css";

type SelectImageModalProps = {
  closeModal: () => void;
  setImages: (images: string[]) => void;
  currentImages: string[];
};

export default function SelectImageModal({
  closeModal,
  setImages,
  currentImages,
}: SelectImageModalProps) {
  const cameraRef = useRef<CameraView | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const isOSSimulator =
    (Platform.OS === "ios" && !Device.isDevice) ||
    (Platform.OS === "android" && !Device.isDevice);

  if (!permission && !isOSSimulator) {
    console.log("No permission object");
    // Camera permissions are still loading.
    return <View />;
  }

  if (!isOSSimulator && permission && !permission.granted) {
    console.log("Permission not granted");
    // Camera permissions are not granted yet.

    // Her og ned skal du style
    return (
      <View className="flex-1 justify-center">
        <Text className="text-center mb-2.5">
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  let camera: CameraView | null = null;

  const captureImage = async () => {
    const photo = await cameraRef.current?.takePictureAsync();
    if (photo?.uri) {
      // setImage(photo.uri);
      setImages([...currentImages, photo.uri]);
      closeModal();
    }
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      allowsMultipleSelection: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const uris = result.assets.map((a) => a.uri);
      setImages([...currentImages, ...uris]); // append selected
      closeModal();
    }
  };

  return (
    <View className="flex-1 justify-center">
      {/* preview  */}
      {!isOSSimulator ? (
        <CameraView
          ref={cameraRef}
          className="absolute inset-0 justify-end"
          facing="back"
        />
      ) : (
        <View className="absolute inset-0 bg-[#111] items-center justify-center">
          <Text className="text-2xl font-bold text-white">
            iOS Simulator — use “Velg bilde”
          </Text>
        </View>
      )}
      <View className="flex-1 flex-row bg-transparent justify-between mb-16">
        <TouchableOpacity
          className="flex-1 self-end items-center"
          onPress={() => pickImage()}
        >
          <Text className="text-2xl font-bold color-white">Velg bilde</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-1 self-end items-center mx-4 rounded bg-blue-600 py-3 ${isOSSimulator ? "opacity-40" : "opacity-100"}`}
          disabled={isOSSimulator}
          onPress={!isOSSimulator ? captureImage : undefined}
          accessibilityState={{ disabled: isOSSimulator }}
        >
          <Text className="text-2xl font-bold color-white">Snap!</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-1 self-end items-center"
          onPress={() => closeModal()}
        >
          <Text className="text-2xl font-bold color-white">Avbryt</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
