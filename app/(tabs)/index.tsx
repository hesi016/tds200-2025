import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Pressable
} from "react-native";
import { useState } from "react";
import Spacer from "@/components/Spacer"; // If Spacer is still needed
import React from "react";
import { getAllPosts } from "@/utils/dummyPostData";
import { PostData } from "@/utils/postData";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function Index() {
  const posts: PostData[] = getAllPosts();
  const [likes, setLikes] = useState<string[]>([]);

  const toggleLike = (id: string) => {
      setLikes((prev) =>
        prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
      );
    };

  return (
    <View style={styles.titleContainer}>
      <FlatList
        style={{
          width: "100%",
          paddingHorizontal: 20,
        }}
        data={posts}
        ListHeaderComponent={() => <Spacer height={10} />}
        ListFooterComponent={() => <Spacer height={50} />}
        ItemSeparatorComponent={() => <Spacer height={8} />}
        renderItem={({ item }) => {
           return (
            <View style={styles.postContainer}>
              <View style={styles.textContainer}>
                <View style={styles.titleContainer}>
                  <Text style={styles.postTitle}>{item.title}</Text>
                  <Pressable onPress={() => toggleLike(item.id)}>
                    <AntDesign
                    name="smileo"
                    size={24}
                    color={likes.includes(item.id) ? "#23C9FF" : "gray"}
                    />
                  </Pressable>
                 </View>
                <Text style={styles.postContent}>{item.description}</Text>
                <View style={styles.bottomContainer}>
                  <Text style={styles.postHashtags}>{item.hashtags}</Text>
                  <Text style={styles.authorText}>{item.author}</Text>
                </View>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  postContainer: {
    backgroundColor: "white",
    shadowOffset: { width: 0, height: 6 },
    shadowColor: "black",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    borderRadius: 10,
  },
  textContainer: {
    paddingHorizontal: 10,
    paddingTop: 16,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  postTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  postContent: {
    fontSize: 14,
    paddingTop: 6,
    color: "gray",
  },
  bottomContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 10,
  },
  postHashtags: {
    paddingTop: 16,
    fontSize: 12,
    color: "gray",
  },
  authorText: {
    fontSize: 12,
    color: "gray",
    textDecorationLine: "underline",
  },
});
