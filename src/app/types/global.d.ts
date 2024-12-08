// src/app/types/global.d.ts
import { NextApiRequest } from "next";

declare module "next" {
  interface NextApiRequest {
    user: clientSelfUser | null;
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
  time: number;
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

export interface Image {
  id: number;
  picpath: string;
}

export interface PostCounts {
  Comments: number;
  Likes: number;
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
  Likes: any;
  _count: PostCounts;
}

export interface friends {
  friend: ShortUser;
  status: "confirmed" | "pending" | "blocked";
}

export interface Friend {
  id: number;
  friend: ShortUser;
  status: "confirmed" | "pending" | "blocked";
}

export interface clientSelfUser {
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
  settings: any;
  uiBackground: string;
  Friendships_Friendships_user1IdToUser: any[];
  Friendships_Friendships_user2IdToUser: any[];
}

export interface clientSelfUserContextType {
  user: clientSelfUser | undefined;
  setUser: (user: clientSelfUser | undefined) => void;
  fetchUser: () => Promise<void>;
  userLoading: boolean;
  setUserLoading: (loading: boolean) => void;
}

export interface FullChat {}

export interface UserInChat {}

export interface Message {}
export interface Socket {
  on(event: string, callback: (...args: any[]) => void): void;
  emit(event: string, ...args: any[]): void;
  off(event: string): void;
}

interface FullPost extends Post {
  Comments: Comment[];
}

interface NewPost {
  name: string;
  description: string;
  images: string[];
}

export interface Comment {
  id: number;
  comment: string;
  createdAt: string;
  User: ShortUser;
}
