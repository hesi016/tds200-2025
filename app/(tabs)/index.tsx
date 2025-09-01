import {
  StyleSheet,
  View,
  FlatList,
  Text,
  Pressable,
} from "react-native";
import Toast from 'react-native-toast-message';

import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { getAllPosts, addNewPost } from "@/utils/asyncPostData";
import { PostData } from "@/utils/postData";
import Post from "@/components/Post";
import Spacer from "@/components/Spacer";
import React from "react";
import { useLayoutEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { Storage } from "@/utils/storage";

export default function Index() {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [userName, setUserName] = useState<string | null>(null);
  const [isEmpty, setIsEmpty] = useState(true);
  const navigation = useNavigation();

  const checkIfStorageEmpty = async () => {
    const keys = await Storage.getAllKeys();
    setIsEmpty(keys.length === 0);
  };


    const showToast = (type: 'success' | 'error', text1: string, text2?: string) => {
      Toast.show({
        type,
        text1,
        text2,
        position: 'top',
        visibilityTime: 3000,
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
    await checkIfStorageEmpty();
  } catch (error) {
    console.error("Failed to clear storage:", error);
    showToast("error", "Failed to clear storage", String(error));
  }
};



const createDummyPost = async (): Promise<PostData> => {
  const existingUser = await Storage.getItem("currentUserEmail");
  const now = new Date();
  const formattedTime = now.toLocaleString(); 

  return {
    id: Date.now().toString(),
    title: `Post created at ${formattedTime}`,
    description: `Dette er en dummy post opprettet kl ${formattedTime}.`,
    hashtags: "#dummy #ny",
    author: existingUser || "Anonym",
  };
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

    useLayoutEffect(() => {
      navigation.setOptions({
        headerRight: () => (
          <Pressable
            style={{ paddingRight: 12 }}
            onPress={async () => {
              const newPost = await createDummyPost();
              setPosts((prev) => [...prev, newPost]);
              await addNewPost(newPost);
              await checkIfStorageEmpty();
              showToast("success", "Ny post lagt til");
            }}
          >
            <Text style={{ color: "#007AFF" }}>+ Ny</Text>
          </Pressable>
        ),
      });
    }, [navigation, setPosts]);

  return (
    <View style={styles.titleContainer}>
      {userName && (
        <Text style={styles.userNameText}>Hei, {userName}!</Text>
      )}

      <FlatList
        style={{ width: "100%", paddingHorizontal: 20 }}
        data={posts}
        ListHeaderComponent={() => <Spacer height={10} />}
        ListFooterComponent={() => <Spacer height={50} />}
        ItemSeparatorComponent={() => <Spacer height={8} />}
        renderItem={(post) => <Post postData={post.item} />}
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
  userNameText: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    color: "#333",
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
