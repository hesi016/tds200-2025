import {
  StyleSheet,
  View,
  FlatList,
  Text,
} from "react-native";

import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { getAllPosts } from "@/utils/dummyPostData";
import { PostData } from "@/utils/postData";
import Post from "@/components/Post";
import Spacer from "@/components/Spacer";
import React from "react";

export default function Index() {
  const [posts, setPosts] = useState<PostData[]>([]);

useFocusEffect(
  useCallback(() => {
    const fetchData = async () => {
      const postsData = await getAllPosts();
      setPosts(postsData);
    };

    fetchData();
  }, [])
);

  return (
    <View style={styles.titleContainer}>

      <FlatList
        style={{ width: "100%", paddingHorizontal: 20 }}
        data={posts}
        ListHeaderComponent={() => <Spacer height={10} />}
        ListFooterComponent={() => <Spacer height={50} />}
        ItemSeparatorComponent={() => <Spacer height={8} />}
        renderItem={(post) => <Post 
            postData={post.item}
              toggleLike={async(id) => {
              const tempPosts = posts.map((tempPost) => {
                if (tempPost.id === id) {
                  return { ...tempPost, isLiked: !tempPost.isLiked };
                }
                return tempPost;
              });

              setPosts(tempPosts);
            }} />}
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
  userNameText: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    color: "#333",
  },
});
