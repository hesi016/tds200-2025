import { PostData } from "./postData";

const globalPosts: PostData[] = [
    {
        title: "Min første post", 
        description: "Jeg har trua", 
        id: "p1", 
        hashtags: "#Kult! #fin", 
        author: "Ola Nordmann"
    },
    {
        title: "Min andre post", 
        description: "Hola", 
        id: "p2", 
        hashtags: "#Wow!", 
        author: "Tester"
    }
]
export const getPostById = (id: string) => {
    return globalPosts.find((post) => post.id === id);
}
export const getAllPosts = () => {
    return globalPosts;
}