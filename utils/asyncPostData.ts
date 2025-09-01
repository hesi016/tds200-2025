
import { PostData } from "./postData";
import { Storage } from "./storage";

const STORAGE_KEY = "posts";
/* 
// Default posts (used if nothing exists yet)
const defaultPosts: PostData[] = [
  {
    title: "Min første post",
    description: "Jeg har trua",
    id: "p1",
    hashtags: "#Kult! #fin",
    author: "Ola Nordmann",
  },
  {
    title: "Min andre post",
    description: "Hola",
    id: "p2",
    hashtags: "#Wow!",
    author: "Tester",
  },
];
 */
export const getAllPosts = async (): Promise<PostData[]> => {
  const data = await Storage.getObject<PostData[]>(STORAGE_KEY);
  if (data && Array.isArray(data)) {
    return data;
  } else {
/*     await Storage.setObject(STORAGE_KEY, defaultPosts);
    return defaultPosts; */
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