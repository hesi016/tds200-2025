import { View, Text, Pressable } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Link } from "expo-router";
import { PostData } from "@/utils/postData";
import React from "react";
import "../global.css";

type PostProps = {
  postData: PostData;
  toggleLike: (id: string) => void;
};

export default function Post({ postData, toggleLike }: PostProps) {
  return (
    <View className="bg-white rounded-2xl mb-5 shadow-md overflow-hidden">
      {/* Content */}
      <View className="px-4 pt-4">
        {/* Title + description wrapped in Link */}
        <Link
          href={{
            pathname: "/postDetails/[id]",
            params: { id: postData.id },
          }}
          className="flex-1"
        >
          <View>
            <Text className="text-xl font-extrabold text-gray-800">
              {postData.title}
            </Text>
            <Text className="text-sm text-gray-600 mt-1 leading-snug">
              {postData.description}
            </Text>
          </View>
        </Link>

        {/* Like button */}
        <Pressable
          onPress={() => toggleLike(postData.id)}
          className="self-end mt-3 active:scale-95"
        >
          <AntDesign
            name="smile-circle"
            size={28}
            color={postData.isLiked ? "#0ea5e9" : "gray"}
          />
        </Pressable>
      </View>

      {/* Footer */}
      <View className="flex-row justify-between items-center px-4 py-3 border-t border-gray-100 bg-gray-50">
        <Text className="text-xs text-sky-600 font-medium">
          {postData.hashtags}
        </Text>
        <Text className="text-xs text-gray-500 italic underline">
          {postData.author}
        </Text>
      </View>
    </View>
  );
}
