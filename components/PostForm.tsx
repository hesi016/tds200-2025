import { PostData } from "../utils/postData";
import { useState, useEffect } from "react";
import { 
  Pressable, 
  TextInput, 
  Text, 
  View, 
  Modal, 
  ScrollView,
  Image 
} from "react-native";
import React from "react";
import SelectImageModal from "./SelectImageModal";
import { EvilIcons } from "@expo/vector-icons";
import { Storage } from "../utils/storage";

type PostFormProps = {
  addNewPost: (post: PostData) => void;
  closeModal: () => void;
};

export default function PostForm({ addNewPost, closeModal }: PostFormProps) {
  const [titleText, setTitleText] = useState("");
  const [descriptionText, setDescriptionText] = useState("");
  const [hashtagText, setHashtagText] = useState("");
  const [existingUser, setExistingUser] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([]); 
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const email = await Storage.getItem("currentUserEmail");
      setExistingUser(email);
    };
    fetchUser();
  }, []);

  return (
    <View className="flex-1 bg-gray-100">
      <ScrollView 
        keyboardDismissMode="interactive" 
        automaticallyAdjustKeyboardInsets 
        className="px-6 py-8"
      >
        {/* Container Card */}
        <View className="bg-white rounded-2xl shadow-md p-6">
          {/* Camera Modal */}
          <Modal visible={isCameraOpen} animationType="slide">
            <SelectImageModal
              closeModal={() => setIsCameraOpen(false)}
              setImages={setImages}
              currentImages={images}
            />
          </Modal>

          {/* Add image box */}
          <Pressable
            onPress={() => setIsCameraOpen(true)}
            className="rounded-xl border-2 border-dashed border-gray-400 bg-gray-50 h-52 justify-center items-center mb-6"
          >
            <EvilIcons name="image" size={80} color="gray" />
            <Text className="text-gray-500 mt-2">Trykk for å legge til bilder</Text>
          </Pressable>

          {/* Preview images */}
          {images.length > 0 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row mb-6">
              {images.map((image, index) => (
                <Image
                  key={index}
                  source={{ uri: image }}
                  className="w-28 h-28 rounded-lg mr-3 border border-gray-300"
                  resizeMode="cover"
                />
              ))}
            </ScrollView>
          )}

          {/* Title */}
          <View className="mb-4">
            <Text className="text-gray-700 font-semibold">Tittel</Text>
            <TextInput
              onChangeText={setTitleText}
              value={titleText}
              className="border border-gray-300 rounded-lg p-3 mt-1 bg-gray-50"
              placeholder="Skriv inn tittel"
            />
          </View>

          {/* Description */}
          <View className="mb-4">
            <Text className="text-gray-700 font-semibold">Beskrivelse</Text>
            <TextInput
              multiline
              numberOfLines={3}
              onChangeText={setDescriptionText}
              value={descriptionText}
              className="border border-gray-300 rounded-lg p-3 mt-1 bg-gray-50 h-24"
              placeholder="Skriv inn beskrivelse"
            />
          </View>

          {/* Hashtags */}
          <View className="mb-6">
            <Text className="text-gray-700 font-semibold">Hashtags</Text>
            <TextInput
              onChangeText={setHashtagText}
              value={hashtagText}
              className="border border-gray-300 rounded-lg p-3 mt-1 bg-gray-50"
              placeholder="#kultur #natur #mat"
            />
          </View>

          {/* Buttons */}
          <View className="flex-row justify-between">
            <Pressable
              className="flex-1 bg-emerald-600 py-3 rounded-lg mr-2 shadow-md"
              onPress={() => {
                addNewPost({
                  title: titleText,
                  description: descriptionText,
                  id: `postName-${Date.now().toString()}-${titleText}`,
                  hashtags: hashtagText,
                  author: existingUser || "Anonym",
                  isLiked: false,
                  images,
                });
                setTitleText("");
                setDescriptionText("");
                setHashtagText("");
              }}
            >
              <Text className="text-white font-semibold text-center">Legg til post</Text>
            </Pressable>

            <Pressable 
              className="flex-1 border border-gray-400 py-3 rounded-lg ml-2"
              onPress={closeModal}
            >
              <Text className="text-gray-700 font-semibold text-center">Avbryt</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
