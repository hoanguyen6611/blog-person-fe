import { Post } from "./Post";

export interface PostListResponse {
  posts: Post[];
  hasMore: boolean;
  totalPages: number;
  totalPosts: number;
}
