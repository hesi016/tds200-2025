import { Storage } from "../../utils/storage";
import { Stack, useLocalSearchParams } from "expo-router";
import { Text, View, Image, ScrollView } from "react-native";
import { useState, useEffect } from "react";
import { PostData } from "../../utils/postData";

export default function PostDetails() {
  const { id } = useLocalSearchParams();
  const [post, setPost] = useState<PostData | null>(null);

  useEffect(() => {
    const fetchPostData = async () => {
      if (id) {
        try {
          const posts = await Storage.getItem("posts");
          if (posts !== null) {
            const parsedPosts = JSON.parse(posts);
            const foundPost = parsedPosts.find((p: any) => p.id === id);
            setPost(foundPost || null);
          }
        } catch (e) {
          console.error(e);
        }
      }
    };

    fetchPostData();
  }, [id]);

  return (
    <View className="flex-1 bg-gray-50">
      <Stack.Screen
        options={{
          headerTitle: () => (
            <Text className="text-lg font-semibold">PostDetaljer</Text>
          ),
        }}
      />

    <ScrollView contentContainerClassName="p-5">
      {/* Post content */}
      <View className="bg-white rounded-2xl shadow-md p-6 mb-6">
        {/* Title */}
        <Text className="text-3xl font-extrabold text-gray-900 mb-3">
          {post?.title}
        </Text>

        {/* Description */}
        <Text className="text-base text-gray-700 leading-relaxed mb-4">
          {post?.description}
        </Text>

        {/* Hashtags as pills */}
        <View className="flex-row flex-wrap mb-3">
          {post?.hashtags?.split(" ").map((tag: string, i: number) => (
            <Text
              key={i}
              className="text-xs bg-sky-100 text-sky-700 px-2 py-1 rounded-full mr-2 mb-2"
            >
              {tag}
            </Text>
          ))}
        </View>

        {/* Divider */}
        <View className="h-[1px] bg-gray-200 my-3" />

        {/* Author */}
        <Text className="text-sm text-gray-500 italic underline">
          {post?.author}
        </Text>
      </View>

      {/* Images */}
      {post?.images && post.images.length > 0 ? (
        <View>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            className="w-full h-80 rounded-xl overflow-hidden shadow-md"
          >
            {post.images.map((uri: string, index: number) => (
              <Image
                key={index}
                source={{ uri }}
                className="w-96 h-80"
                resizeMode="cover"
              />
            ))}
          </ScrollView>

          {/* Indicator dots */}
          <View className="flex-row justify-center mt-2">
            {post.images.map((_, index) => (
              <View
                key={index}
                className="w-2 h-2 bg-gray-300 rounded-full mx-1"
              />
            ))}
          </View>
        </View>
      ) : (
        <Text className="mt-5 text-gray-400 text-center italic">
          Ingen bilder 📷
        </Text>
      )}
    </ScrollView>

    </View>
  );
}
