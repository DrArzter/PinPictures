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

export interface Notification {
  id: string;
  message: string;
  status: "info" | "success" | "warning" | "error";
  time?: number;
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
  isLiked: boolean;
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

export interface SummaryData {
  usersCount: number;
  postsCount: number;
  commentsCount: number;
  likesCount: number;
  messagesCount: number;
  chatsCount: number;
  newUsersCount: number;
  newPostsCount: number;
  newCommentsCount: number;
}

export interface ProfileData {
  id: number;
  name: string;
  background?: string;
  avatar?: string;
  description?: string;
  friends?: Friend[];
  Post?: Post[];
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
  ChatType: string;
  UsersInChats: UserInChat[];
}

export interface FullChat extends AdminChat {
  MessagesInChats: MessageInChat[];
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
  Comments: Comment[];
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

export interface Login {
  username: string;
  password: string;
}

export interface Registration {
  username: string;
  email: string;
  password: string;
}

export interface LoginProps {
  username: string;
  setUsername: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  toggleRegistration: () => void;
  toggleForgotPassword: () => void;
}

export interface RegistrationProps {
  username: string;
  setUsername: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  handleSubmit: (event: React.FormEvent) => void;
  toggleRegistration: () => void;
  setRecaptcha: (value: string | null) => void;
}

export interface Comment {
  id: number;
  userId: number;
  postId: number;
  comment: string;
  picpath: string | null;
  createdAt: string;
  User: ShortUser;
}

import { Server } from "socket.io";
import { Socket } from "net";
import { Server as NetServer } from "http";

declare global {
  var io: Server;
}

declare module "next/dist/server/api" {
  interface Socket extends NodeJS.Socket {
    server: NetServer;
  }
}

export {};
