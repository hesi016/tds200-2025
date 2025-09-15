
import { PostData } from "./postData";
import { Storage } from "./storage";

const STORAGE_KEY = "posts";

export const getAllPosts = async (): Promise<PostData[]> => {
  const data = await Storage.getObject<PostData[]>(STORAGE_KEY);
  if (data && Array.isArray(data)) {
    return data;
  } else {
    return [];
  }
};

// Get post by ID
export const getPostById = async (id: string): Promise<PostData | undefined> => {
  const posts = await getAllPosts();
  return posts.find((post) => post.id === id);
};

// Add new post
export const addNewPost = async (post: PostData): Promise<void> => {
  const posts = await getAllPosts();
  const updated = [post, ...posts];
  await Storage.setObject(STORAGE_KEY, updated);
};