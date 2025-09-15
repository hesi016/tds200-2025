import { Storage } from "@/utils/storage";
import { Stack, useLocalSearchParams } from "expo-router";
import { Text, View, StyleSheet, Image } from "react-native";
import { useState, useEffect } from "react";
import { PostData } from "@/utils/postData";

export default function postDetails() {
  const { id } = useLocalSearchParams();
  const [post, setPost] = useState<PostData | null>(null);

  useEffect(() => {
    const fetchPostData = async () => {
      if (id) {
        try {
          const posts = await Storage.getItem("posts");
          if (posts !== null) {
              const parsedPosts = JSON.parse(posts);
              const post = parsedPosts.find((post: any) => post.id === id);
              setPost(post || null);
          }
        } catch (e) {
            console.error(e);
        }
      }
    };

    fetchPostData();
  }, [id]);


  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Stack.Screen
        options={{
          headerTitle: (props) => <Text>PostDetaljer</Text>,
          //headerShown: false
        }}
      />
          <View style={styles.textContainer}>
            <Text>{post?.title}</Text>
            <Text style={styles.postHashtags}>{post?.hashtags}</Text>
            <Text style={styles.authorText}>{post?.author}</Text>
          </View>
          <Image
            source={{ uri: post?.image }}
            style={{ resizeMode: "cover", width: "100%", height: 300 }}
            alt="Hmmmmm"
            />

    </View>
  );
}
const styles = StyleSheet.create({
  textContainer: {
    paddingHorizontal: 10,
    paddingTop: 16,
  },
  postHashtags: {
    fontSize: 12,
    color: "gray",
  },
  authorText: {
    fontSize: 12,
    color: "gray",
    textDecorationLine: "underline",
  },
});