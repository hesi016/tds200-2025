import { PostData } from "@/utils/postData";
import { Storage } from "@/utils/storage";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as Device from "expo-device";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useRef, useState } from "react";
import {
  Image,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type PostFormProps = {
  addNewPost: (post: PostData) => void;
  closeModal: () => void;
};

export default function PostForm({ addNewPost, closeModal }: PostFormProps) {
  const [titleText, setTitleText] = useState("");
  const [descriptionText, setDescriptionText] = useState("");
  const [hashtagText, setHashtagText] = useState("");
  const [existingUser, setExistingUser] = useState<string | null>(null);

  // Bilde tilstand
  const [imageUri, setImageUri] = useState<string | null>(null);

  // Kamera modal og tillatelse
  const [showCamera, setShowCamera] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView | null>(null);

  // IOS-simulatoren støtter ikke kamera
  const isIOSSimulator = Platform.OS === "ios" && !Device.isDevice;

  useEffect(() => {
    const fetchUser = async () => {
      const email = await Storage.getItem("currentUserEmail");
      setExistingUser(email);
    };

    fetchUser();

    ImagePicker.requestCameraPermissionsAsync().catch(() => null);
  }, []);

  const openCamera = async () => {
    if (!permission?.granted) {
      const res = await requestPermission();
      if (!res.granted) return;
    }
    setShowCamera(true);
  };
  const closeCamera = () => setShowCamera(false);

  // funksjonen for kameraet
  const captureImage = async () => {
    const photo = await cameraRef.current?.takePictureAsync();
    if (photo?.uri) {
      setImageUri(photo.uri);
      closeCamera();
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.mainContainer}>
        <ScrollView
          keyboardDismissMode="interactive"
          automaticallyAdjustKeyboardInsets
        >
          <View style={styles.contentContainer}>
            <View style={styles.textFieldContainer}>
              <Text style={styles.text}>Tittel</Text>
              <TextInput
                onChangeText={setTitleText}
                value={titleText}
                style={styles.textfield}
                placeholder="Skriv inn tittel"
              />
            </View>

            <View style={styles.textFieldContainer}>
              <Text style={styles.text}>Beskrivelse</Text>
              <TextInput
                multiline
                numberOfLines={3}
                onChangeText={setDescriptionText}
                value={descriptionText}
                style={[styles.textfield, { height: 84 }]}
                placeholder="Skriv inn beskrivelse"
              />
            </View>

            <View style={styles.textFieldContainer}>
              <Text style={styles.text}>Hashtags</Text>
              <TextInput
                onChangeText={setHashtagText}
                value={hashtagText}
                style={styles.textfield}
                placeholder="#kultur #natur #mat"
              />
            </View>

            {/* Image / Camera Box + forhåndsvisning */}
            <View style={{ paddingTop: 16 }}>
              <Text style={styles.text}>Bilde</Text>

              <View style={styles.addImageBox}>
                {imageUri ? (
                  <Image
                    source={{ uri: imageUri }}
                    style={{ width: "100%", height: "100%" }}
                    resizeMode="cover"
                  />
                ) : (
                  <Text style={{ color: "gray" }}>
                    Ingen bilde valgt. Velg eller ta et bilde.
                  </Text>
                )}
              </View>

              <View style={{ flexDirection: "row", gap: 12, marginTop: 12 }}>
                <Pressable style={styles.uploadButton} onPress={pickImage}>
                  <Text style={styles.uploadButtonText}>Velg fra galleri</Text>
                </Pressable>

                <Pressable
                  style={[
                    styles.uploadButton,
                    { backgroundColor: isIOSSimulator ? "#9bbcf5" : "#007BFF" },
                  ]}
                  disabled={isIOSSimulator}
                  onPress={openCamera}
                >
                  <Text style={styles.uploadButtonText}>
                    {isIOSSimulator ? "Kamera ikke støttet" : "Åpne kamera"}
                  </Text>
                </Pressable>
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <Pressable
                style={styles.primaryButton}
                onPress={() => {
                  addNewPost({
                    title: titleText.trim(),
                    description: descriptionText.trim(),
                    id: `postName-${Date.now().toString()}-${titleText.trim()}`,
                    hashtags: hashtagText,
                    imageURI: imageUri, // ✅ lagre URI
                    author: existingUser || "Anonym",
                    isLiked: false,
                  });
                  setTitleText("");
                  setDescriptionText("");
                  setHashtagText("");
                  setImageUri(null);
                  closeModal();
                }}
              >
                <Text style={{ color: "white" }}>Legg til post</Text>
              </Pressable>

              <Pressable style={styles.secondaryButton} onPress={closeModal}>
                <Text style={{ color: "#412E25" }}>Avbryt</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </View>

      {/* Kamera-modal */}
      <Modal
        visible={showCamera}
        animationType="slide"
        onRequestClose={closeCamera}
      >
        <View style={{ flex: 1, backgroundColor: "black" }}>
          <CameraView ref={cameraRef} style={{ flex: 1 }} />
          <View style={{ padding: 16, flexDirection: "row", gap: 12 }}>
            <Pressable
              onPress={captureImage}
              style={[styles.primaryButton, { flex: 1 }]}
            >
              <Text style={{ color: "white", textAlign: "center" }}>
                Ta bilde
              </Text>
            </Pressable>
            <Pressable
              onPress={closeCamera}
              style={[styles.secondaryButton, { flex: 1 }]}
            >
              <Text style={{ color: "#412E25", textAlign: "center" }}>
                Lukk
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    width: "100%",
    flexDirection: "column",
    paddingHorizontal: 20,
  },
  textFieldContainer: { paddingTop: 8 },
  text: { fontWeight: "600", marginBottom: 4 },
  textfield: {
    borderWidth: 1,
    padding: 10,
    marginTop: 2,
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 16,
  },
  primaryButton: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 4,
    backgroundColor: "#0096C7",
    alignItems: "center",
    flex: 1,
    marginRight: 8,
  },
  secondaryButton: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "gray",
    alignItems: "center",
    flex: 1,
    marginLeft: 8,
  },
  uploadButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#007BFF",
  },
  uploadButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  addImageBox: {
    borderRadius: 10,
    overflow: "hidden",
    width: "100%",
    height: 300,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "gray",
    backgroundColor: "#fafafa",
  },
});
