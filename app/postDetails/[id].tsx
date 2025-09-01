import { getPostById } from "@/utils/asyncPostData";
import { PostData } from "@/utils/postData";
import { Stack, useLocalSearchParams } from "expo-router";
import {React, useEffect, useState} from "react";
import { Text, View, StyleSheet } from "react-native";

export default function postDetails() {
  const { id } = useLocalSearchParams();
  const [post, setPost] = useState<PostData | null>(null);

  useEffect(() => {
    const fetchPostData = async () => {
      if (id) {
        const post = await getPostById(id as string);
        setPost(post || null);
      }
    };

    fetchPostData();
  }, [id]);

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: (props) => <Text style={styles.headerTitle}>PostDetaljer</Text>,
        }}
      />
        <>
          <Text style={styles.title}>{post?.title}</Text>
          <Text style={styles.author}>Author: {post?.author}</Text>
          <Text style={styles.description}>{post?.description}</Text>
          <Text style={styles.hashtags}>Hashtags: {post?.hashtags}</Text>
        </>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5", // Light background for better readability
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  author: {
    fontSize: 18,
    color: "#555",
    marginBottom: 5,
  },
  description: {
    fontSize: 16,
    color: "#666",
    marginBottom: 10,
    textAlign: "center",
  },
  hashtags: {
    fontSize: 14,
    color: "#888",
    fontStyle: "italic",
  },

});