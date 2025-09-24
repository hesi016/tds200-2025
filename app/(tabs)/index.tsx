import {
  View,
  Text,
  Pressable,
  FlatList,
  Modal,
} from "react-native";
import Toast from "react-native-toast-message";
import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { Stack } from "expo-router";
import { Storage } from "../../utils/storage";
import PostForm from "../../components/PostForm";
import { PostData } from "../../utils/postData";
import { getAllPosts } from "../../utils/asyncPostData";
import Post from "../../components/Post";
import Spacer from "../../components/Spacer";
import React from "react";

export default function Index() {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [userName, setUserName] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);

  const checkIfStorageEmpty = async () => {
    const keys = await Storage.getAllKeys();
    setIsEmpty(keys.length === 0);
  };

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        const postsData = await getAllPosts();
        setPosts(postsData);

        const storedEmail = await Storage.getItem("currentUserEmail");
        if (storedEmail) {
          const storedUser = await Storage.getItem(`user:${storedEmail}`);
          if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUserName(parsedUser.email || storedEmail);
          } else {
            setUserName(null);
          }
        } else {
          setUserName(null);
        }
      };

      fetchData();
      checkIfStorageEmpty();
    }, [])
  );

  const showToast = (
    type: "success" | "error",
    text1: string,
    text2?: string
  ) => {
    Toast.show({
      type,
      text1,
      text2,
      position: "top",
      visibilityTime: 3000,
    });
  };

  const clearStorage = async () => {
    try {
      await Storage.clearStorage();
      showToast("success", "Storage cleared");
      setPosts([]);
      setUserName(null);
      setIsEmpty(true);
    } catch (error) {
      console.error("Failed to clear storage:", error);
      showToast("error", "Failed to clear storage", String(error));
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-gray-50">
      <Stack.Screen
        options={{
          headerRight: () => (
            <Pressable
              className="pr-4"
              onPress={() => setIsModalOpen(true)}
            >
              <Text className="text-blue-600 font-semibold">Nytt innlegg</Text>
            </Pressable>
          ),
        }}
      />

      {/* Modal for PostForm */}
      <Modal visible={isModalOpen} animationType="slide">
        <PostForm
          addNewPost={async (post) => {
            try {
              const updatedPosts = [post, ...posts];
              setPosts(updatedPosts);
              await Storage.setItem("posts", JSON.stringify(updatedPosts));
              setIsModalOpen(false);
              showToast("success", "Innlegg lagt til!");
            } catch (error) {
              console.error("Error saving posts to SecureStore:", error);
              showToast("error", "Kunne ikke lagre innlegget", String(error));
            }
          }}
          closeModal={() => setIsModalOpen(false)}
        />
      </Modal>

      {/* Posts List */}
      <FlatList
        className="w-full px-5"
        data={posts}
        ListHeaderComponent={() => <Spacer height={10} />}
        ListFooterComponent={() => <Spacer height={50} />}
        ItemSeparatorComponent={() => <Spacer height={8} />}
        renderItem={(post) => (
          <Post
            key={post.index}
            postData={post.item}
            toggleLike={async (id) => {
              const tempPosts = posts.map((tempPost) => {
                if (tempPost.id === id) {
                  return { ...tempPost, isLiked: !tempPost.isLiked };
                }
                return tempPost;
              });

              setPosts(tempPosts);
              await Storage.setItem("posts", JSON.stringify(tempPosts));
            }}
          />
        )}
      />

      {/* Clear storage button */}
      <Pressable
        className={`w-full py-3 rounded-md mt-4 ${
          isEmpty ? "bg-gray-400" : "bg-rose-600"
        }`}
        onPress={clearStorage}
        disabled={isEmpty}
      >
        <Text className="text-white font-semibold text-center">
          Clear Storage
        </Text>
      </Pressable>
    </View>
  );
}
