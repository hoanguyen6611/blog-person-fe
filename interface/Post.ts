import { User } from "./User";

export interface Post {
  _id: string;
  user: User;
  title: string;
  slug: string;
  content: string;
  desc: string;
  isFeature: boolean;
  category: string;
  visit: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
  img: string;
}
