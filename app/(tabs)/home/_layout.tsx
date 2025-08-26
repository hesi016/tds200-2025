import { Stack } from "expo-router";
import React = require("react");

export default function HomeLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerTitle: "Posts" }} />
      <Stack.Screen name="postDetails/[id]" options={{ headerTitle: "Post Details" }} />
    </Stack>
  );
}
