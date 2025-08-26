import { View, Text, StyleSheet, Pressable } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Link } from "expo-router";
import { PostData } from "@/utils/postData";
import React = require("react");

type PostProps = {
  postData: PostData;
  toggleLike: (id: string) => void;
};

export default function Post({ postData, toggleLike }: PostProps) {
  return (
    <View style={styles.postContainer}>
      <View style={styles.textContainer}>
        {/* Title and content wrapped with a Link for navigation */}
        <Link
          href={{
            pathname: "/home/postDetails/[id]",
            params: { id: postData.id },
          }}
          style={styles.linkContainer}
        >
          <View>
            <Text style={styles.postTitle}>{postData.title}</Text>
            <Text style={styles.postContent}>{postData.description}</Text>
          </View>
        </Link>

        {/* Like button separate from navigation */}
        <Pressable
          onPress={async () => {
              toggleLike(postData.id);

          }}
          style={styles.likeButton}
        >
          <AntDesign
            name="smileo"
            size={24}
            color={postData.isLiked ? "#23C9FF" : "gray"}
          />
        </Pressable>
      </View>

      {/* Footer information (hashtags and author) */}
      <View style={styles.bottomContainer}>
        <Text style={styles.postHashtags}>{postData.hashtags}</Text>
        <Text style={styles.authorText}>{postData.author}</Text>
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
    marginBottom: 16,
  },
  textContainer: {
    paddingHorizontal: 10,
    paddingTop: 16,
  },
  linkContainer: {
    flex: 1,
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
  likeButton: {
    alignSelf: "flex-end",
    marginTop: 8,
  },
  bottomContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingBottom: 10,
    paddingTop: 8,
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
