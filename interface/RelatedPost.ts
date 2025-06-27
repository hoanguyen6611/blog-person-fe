import { Post } from "./Post";

export type RelatedPost = {
  _id: string;
  title: string;
  slug: string;
  img?: string;
  createdAt: string;
};

export type PostDetailResponse = {
  post: Post;
  relatedPosts: RelatedPost[];
};
