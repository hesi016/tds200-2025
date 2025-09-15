import {
  StyleSheet,
  View,
  Text,
  Pressable,
  FlatList,
  Modal,
} from "react-native";
import Toast from 'react-native-toast-message';
import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { Stack } from "expo-router";
import { Storage } from "@/utils/storage";
import PostForm from "@/components/PostForm";
import { PostData } from "@/utils/postData";
import { getAllPosts } from "@/utils/asyncPostData";
import Post from "@/components/Post";
import Spacer from "@/components/Spacer";
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

  const showToast = (type: 'success' | 'error', text1: string, text2?: string) => {
      Toast.show({
        type, // "success" | "error" | "info" (toast style)
        text1, // main title
        text2, // optioal subtitle
        position: 'top', // where the toast will appear
        visibilityTime: 3000, // how long it stays visible
        onHide: () => {
          console.log("Toast is gone, you can trigger something now.");
        },
      });
    };
const clearStorage = async () => {
  try {
    await Storage.clearStorage();
    showToast("success", "Storage cleared");
    setPosts([]);
    setUserName(null);
    //await checkIfStorageEmpty();
    setIsEmpty(true);
  } catch (error) {
    console.error("Failed to clear storage:", error);
    showToast("error", "Failed to clear storage", String(error));
  }
};
  return (
    <View style={styles.titleContainer}>
      <Stack.Screen
        options={{
          headerRight: () => (
            <Pressable
              style={{ paddingRight: 6 }}
              onPress={() => setIsModalOpen(true)}
            >
              <Text>Nytt innlegg</Text>
            </Pressable>
          ),
        }}
      />
      <Modal visible={isModalOpen} animationType="slide">
        <PostForm
          addNewPost={async (post) => {
            console.log("New post from modal:", post);
            try {
              const updatedPosts = [post, ...posts];
              setPosts(updatedPosts);
              await Storage.setItem("posts", JSON.stringify(updatedPosts));
              setIsModalOpen(false);
            } catch (error) {
              console.error("Error saving posts to SecureStore:", error);
            }
          }}
          closeModal={() => setIsModalOpen(false)}
        />
      </Modal>
      <FlatList
        style={{
          width: "100%",
          paddingHorizontal: 20,
        }}
        data={posts}
        ListHeaderComponent={() => <Spacer height={10} />}
        ListFooterComponent={() => <Spacer height={50} />}
        ItemSeparatorComponent={() => <Spacer height={8} />}
        renderItem={(post) => (
          <Post
            key={post.index}
            postData={post.item}
            toggleLike={async(id) => {
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
      <Pressable
          style={[
            styles.clearButton,
            isEmpty ? styles.clearButtonDisabled : styles.clearButtonActive,
          ]}
            onPress={() => clearStorage()}
            disabled={isEmpty}
          >
            <Text>Clear Storage</Text>
      </Pressable>
    </View>

  );
}

const styles = StyleSheet.create({
  titleContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  textFieldContainer: {
    width: "100%",
    flexDirection: "column",
    gap: 10,
    paddingHorizontal: 20,
  },
  textfield: {
    borderWidth: 1,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  clearButton: {
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center",
    width: "100%",
  },
  clearButtonActive: {
    backgroundColor: "red", // active state
  },
  clearButtonDisabled: {
    backgroundColor: "gray", // disabled state
  },
});

