import {
  StyleSheet,
  View,
  Text,
  Pressable,
  FlatList,
  Modal,
} from "react-native";
import React, { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { Stack } from "expo-router";
import { Storage } from "@/utils/storage";
import PostForm from "@/components/PostForm";
import { PostData } from "@/utils/postData";
import { getAllPosts } from "@/utils/asyncPostData";
import Post from "@/components/Post";
import Spacer from "@/components/Spacer";

export default function Index() {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [userName, setUserName] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    }, [])
  );

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
});
