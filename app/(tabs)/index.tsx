import {
  StyleSheet,
  View,
  FlatList,
  Text,
  Pressable,
  Modal,
} from "react-native";
import Toast from "react-native-toast-message";

import React, { useState, useCallback, useLayoutEffect } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { getAllPosts, addNewPost } from "@/utils/asyncPostData";
import { PostData } from "@/utils/postData";
import Post from "@/components/Post";
import Spacer from "@/components/Spacer";
import { Storage } from "@/utils/storage";
import PostForm from "@/components/PostForm";

export default function Index() {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [userName, setUserName] = useState<string | null>(null);
  const [isEmpty, setIsEmpty] = useState(true);
  const navigation = useNavigation();

  const [isFormOpen, setIsFormOpen] = useState(false);

  const checkIfStorageEmpty = async () => {
    const keys = await Storage.getAllKeys();
    setIsEmpty(keys.length === 0);
  };

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
            setIsFormOpen(true);
          }}
        >
          <Text style={{ color: "#007AFF" }}>+ Ny</Text>
        </Pressable>
      ),
    });
  }, [navigation]);

  const handleSubmitPost = async (post: PostData) => {
    try {
      setPosts((prev) => [post, ...prev]);

      await addNewPost(post);

      await checkIfStorageEmpty();
      setIsFormOpen(false);
      showToast("success", "Ny post lagret");
    } catch (e) {
      showToast("error", "Kunne ikke lagre innlegget", String(e));
    }
  };

  return (
    <View style={styles.titleContainer}>
      {userName && <Text style={styles.userNameText}>Hei, {userName}!</Text>}

      <FlatList
        style={{ width: "100%", paddingHorizontal: 20 }}
        data={posts}
        keyExtractor={(item) => item.id}
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

      {/* ⬅️ MODAL MED POSTFORM */}
      <Modal
        visible={isFormOpen}
        animationType="slide"
        onRequestClose={() => setIsFormOpen(false)}
      >
        <View style={{ flex: 1, backgroundColor: "#f2f2f2" }}>
          <View style={{ padding: 12 }}>
            <Pressable onPress={() => setIsFormOpen(false)}>
              <Text style={{ color: "#007AFF", fontSize: 16 }}>Lukk</Text>
            </Pressable>
          </View>
          <PostForm
            defaultAuthor={userName || "Anonym"}
            onSubmit={handleSubmitPost}
            onCancel={() => setIsFormOpen(false)}
          />
        </View>
      </Modal>
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
    backgroundColor: "red",
  },
  clearButtonDisabled: {
    backgroundColor: "gray",
  },
});
