import { Storage } from "@/utils/storage";
import { Stack, useLocalSearchParams } from "expo-router";
import { 
  Text, 
  View, 
  StyleSheet, 
  TextInput,
  Pressable,
  ActivityIndicator,
  FlatList
 } from "react-native";
import { useState, useEffect } from "react";
import { CommentData, PostData } from "@/utils/postData";

export default function postDetails() {
  const { id } = useLocalSearchParams();
  const [posts, setPosts] = useState<PostData[]>([]);
  const [post, setPost] = useState<PostData | null>(null);
  const [commentText, setCommentText] = useState("");
  const [isLoadingAddComment, setIsLoadingAddComment] = useState(false);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const fetchPostData = async () => {
      if (id) {
        try {
          const storedPosts = await Storage.getItem("posts");
          const allPosts = storedPosts ? JSON.parse(storedPosts) : [];
          setPosts(allPosts);
          const currentPost = allPosts.find((p: any) => p.id === id) || null;
          setPost(currentPost);
        } catch (e) {
            console.error(e);
        }
      }
    };

    fetchPostData();
    fetchUser();
  }, [id]);

    const fetchUser = async () => {
      const email = await Storage.getItem("currentUserEmail");
      setUserName(email);
    };

  const handleAddComment = async () => {
    if (!post || commentText.trim() === "") return;

    setIsLoadingAddComment(true);
    try {
      const newComment:CommentData = {
        id: Date.now().toString(),
        authorId: userName ?? "Anonym",
        comment: commentText,
      };
    const updatedPost: PostData = {
      ...post,
      comments: [newComment, ...(post.comments ?? [])],
    };
    setPost(updatedPost);
    setCommentText("");
//update posts array
    const updatedPosts = posts.map((post) =>
      post.id === id ? updatedPost : post
    );
    setPosts(updatedPosts); 
    await Storage.setItem("posts", JSON.stringify(updatedPosts));

    } catch (error) {
      console.error("Error adding comment:", error);
    }
    setIsLoadingAddComment(false);
  };

  return (
    <View
      style={styles.screenContainer}
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

{/* Comments Section */}
        <Text style={styles.sectionTitle}>Comments</Text>
        {isLoadingComments ? (
          <ActivityIndicator size="large" />
        ) : (
        <View style={styles.commentListContainer}>
          <FlatList
            data={post?.comments || []}
            keyExtractor={(item : CommentData) => item.id}
            renderItem={({ item }) => (
              <View style={styles.comment}>
                <View style={styles.commentContent}>
                  <Text style={styles.commentAuthor}>{item.authorId}:</Text>
                  <Text style={styles.commentText}>{item.comment}</Text>
                </View>
              </View>
            )}
          />
        </View>
        )}

         {/* Add Comment Section */}
        <View style={styles.commentInputContainer}>
          <TextInput
            value={commentText}
            onChangeText={setCommentText}
            placeholder="Write a comment..."
            style={styles.commentInput}
          />
          <Pressable onPress={handleAddComment} style={styles.addCommentButton}>
            {isLoadingAddComment ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.addCommentButtonText}>add comment</Text>
            )}
          </Pressable>
        </View>
    </View>
  );
}
const styles = StyleSheet.create({ 
  screenContainer: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  textContainer: {
    backgroundColor: "#fff",
    padding: 16,
    margin: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  postHashtags: {
    fontSize: 13,
    color: "#2563EB",
    marginBottom: 4,
  },
  authorText: {
    fontSize: 12,
    color: "gray",
    textDecorationLine: "underline",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 10,
    marginLeft: 16,
    color: "#111827",
  },
  comment: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 1,
  },
  commentAuthor: {
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
    fontSize: 14,
  },
  commentText: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 18,
  },
  commentInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    padding: 12,
    backgroundColor: "#fff",
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 8,
    backgroundColor: "#F9FAFB",
  },
  addCommentButton: {
    backgroundColor: "#2563EB",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  addCommentButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  commentContent: {
    flex: 1,
  },
  commentListContainer: {
    width: "60%",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
});