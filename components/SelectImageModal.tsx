import { CameraView, useCameraPermissions } from "expo-camera";
import * as Device from "expo-device";
import * as ImagePicker from "expo-image-picker";
import React, { useRef } from "react";
import {
  Button,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

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
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const isIOSSimulator = Platform.OS === "ios" && !Device.isDevice;

  if (!permission && !isIOSSimulator) {
    console.log("No permission object");
    // Camera permissions are still loading.
    return <View />;
  }

  if (!isIOSSimulator && permission && !permission.granted) {
    console.log("Permission not granted");
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
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
      setImages([...currentImages, ...uris]);
      closeModal();
    }
  };

  return (
    <View style={styles.container}>
      {/* preview */}
      {!isIOSSimulator ? (
        <CameraView
          ref={(r) => {
            cameraRef.current = r;
          }}
          style={styles.camera}
        />
      ) : (
        <View style={[StyleSheet.absoluteFill, styles.simPanel]}>
          <Text style={styles.text}>iOS Simulator — use “Velg bilde”</Text>
        </View>
      )}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => pickImage()}>
          <Text style={styles.text}>Velg bilde</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, isIOSSimulator && styles.buttonDisabled]}
          disabled={isIOSSimulator}
          onPress={!isIOSSimulator ? captureImage : undefined}
          accessibilityState={{ disabled: isIOSSimulator }}
        >
          <Text style={styles.text}>Snap!</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => closeModal()}>
          <Text style={styles.text}>Avbryt</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    justifyContent: "space-between",
    marginBottom: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  previewWrapper: { flex: 1, position: "relative" },
  overlay: { ...StyleSheet.absoluteFillObject, justifyContent: "flex-end" },
  simPanel: {
    backgroundColor: "#111",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonDisabled: { opacity: 0.4 },
});
