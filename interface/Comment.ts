import { User } from "./User";

export interface Comment {
  _id: string;
  user: User;
  post: string;
  desc: string;
  createdAt: string;
  updatedAt: string;
}
