export interface Comment {
  _id: string;
  user: User;
  post: string;
  desc: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  _id: string;
  clerkUserId: string;
  username: string;
  email: string;
  img: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
