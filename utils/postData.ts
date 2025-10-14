export interface PostData {
    title: string;
    description: string;
    id: string;
    hashtags: string;
    author: string;
    imageURI: string | null;
    isLiked?: boolean;
    comments?: CommentData[];
  }

  export interface CommentData {
  id: string;
  authorId: string;
  comment: string;
}