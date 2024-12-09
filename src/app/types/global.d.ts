/* eslint-disable no-var */
declare module "next" {
  interface NextApiRequest {
    user: ClientSelfUser | null;
    friend: Friend;
    notifications: Notification;
  }
}

export interface ApiResponse<T> {
  status: "success" | "error";
  message: string;
  data: T;
}

// Notification Interfaces
export interface Notification {
  id: string;
  message: string;
  status: "info" | "success" | "warning" | "error";
  time?: number;
  clickable: boolean;
  sound?: string;
  soundRequired?: boolean;
  link_to?: string;
}

export interface ShortUser {
  id: number;
  name: string;
  avatar: string;
}

export interface AdminShortUser extends ShortUser {
  email: string;
  banned: boolean;
  bananaLevel: number;
}

export interface Image {
  id: number;
  picpath: string;
}

export interface PostCounts {
  Comments: number;
  Likes: number;
}

export interface Like {
  id: number;
  userId: number;
  postId: number;
}

export interface Post {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  authorId: number;
  likesCount: number;
  User: ShortUser;
  ImageInPost: Image[];
  Likes: Like[];
  _count: PostCounts;
}

export interface Friends {
  friend: ShortUser;
  status: "confirmed" | "pending" | "blocked";
}

export interface MiniFriend {
  friend: ShortUser;
  status: "confirmed" | "pending" | "blocked";
}

export interface Friend {
  id: number;
  friend: ShortUser;
  status: "confirmed" | "pending" | "blocked";
}

export interface ClientSelfUser {
  id: number;
  name: string;
  description: string | null;
  bananaLevel: number;
  email: string;
  password: string;
  avatar: string;
  createdAt: Date;
  lastLoginAt: Date;
  banned: boolean;
  background: string;
  settings: Record<string, unknown> | null; // Allow null here
  uiBackground: string;
  friends: Friends[];
  Friendships_Friendships_user1IdToUser: Array<{
    status: "confirmed" | "pending" | "blocked";
    User_Friendships_user2IdToUser: ShortUser;
  }>;
  Friendships_Friendships_user2IdToUser: Array<{
    status: "confirmed" | "pending" | "blocked";
    User_Friendships_user1IdToUser: ShortUser;
  }>;
}

export interface ClientSelfUserContextType {
  user: ClientSelfUser | undefined;
  setUser: (user: ClientSelfUser | undefined) => void;
  fetchUser: () => Promise<void>;
  userLoading: boolean;
  setUserLoading: (loading: boolean) => void;
}

export interface AdminChat {
  id: number;
  name: string;
  createdAt: string;
  avatar: string;
  lastMessage: MessageInChat;
  picpath: string;
  chatType: string;
  usersInChats: UserInChat[];
}

export interface FullChat extends AdminChat {
  messagesInChat: MessageInChat[];
}

export interface UserInChat {
  id: number;
  userId: number;
  chatId: number;
  joinedAt: string;
  User: ShortUser;
}

export interface MessageInChat {
  id: number;
  chatId: number;
  message: string;
  createdAt: string;
  User: ShortUser;
  imagesInMessages: Image[];
}

export interface Socket {
  on(event: string, callback: (...args: unknown[]) => void): void;
  emit(event: string, ...args: unknown[]): void;
  off(event: string): void;
}

export interface FullPost extends Post {
  comments: Comment[];
}

export interface NewPost {
  name: string;
  description: string;
  images: file[];
}

export interface NewPostRequest {
  name: string;
  description: string;
  images: File[]; // На запрос мы отправляем файлы
}

export interface Comment {
  id: number;
  comment: string;
  createdAt: string;
  User: ShortUser;
}

import { Server } from "socket.io";

declare global {
  var io: Server;
}

export {};
