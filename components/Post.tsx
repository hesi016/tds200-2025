import { View, Text, StyleSheet, Pressable } from "react-native";
import React, { useState } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Link } from "expo-router";
import { PostData } from "@/utils/postData";

type PostProps = {
  postData: PostData;
};

export default function Post({ postData }: PostProps) {
  const [liked, setLiked] = useState(false);

  return (
    <View style={styles.postContainer}>
      <View style={styles.textContainer}>
        <View style={styles.titleContainer}>
          <Link
            href={{
              pathname: "/postDetails/[id]",
              params: { id: postData.id },
            }}
            asChild
          >
            <Pressable>
              <Text style={styles.postTitle}>{postData.title}</Text>
            </Pressable>
          </Link>

          <Pressable
            onPress={(event) => {
              setLiked(!liked);
            }}
          >
            <AntDesign
              name="smileo"
              size={24}
              color={liked ? "#23C9FF" : "gray"}
            />
          </Pressable>
        </View>

        <Text style={styles.postContent}>{postData.description}</Text>
      </View>
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
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  postTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  postContent: {
    fontSize: 14,
    paddingTop: 6,
    color: "gray",
  },
});
