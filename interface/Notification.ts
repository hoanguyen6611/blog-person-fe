export interface Notification {
  _id: string;
  recipientId: string;
  type: string;
  postId: string;
  commentId: string;
  isRead: boolean;
  message: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
