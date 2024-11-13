// src/app/types/global.d.ts
import { NextApiRequest } from "next";


declare module "next" {
  interface NextApiRequest {
    user: User | null;
  }
}
// Notification Interfaces
export interface Notification {
  message: string;
  status: "info" | "success" | "warning" | "error";
  time: number;
  clickable: boolean;
  link_to?: string;
}

// User Interfaces
export interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
  background: string;
  uiBackground: string;
  uiBgPicPath: string;
  createdAt: string;
  lastLoginAt: string;
  banned: boolean;
  settings: {
    bgColor: string;
  };
}

export interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  fetchUser: () => Promise<void>;
  userLoading: boolean;
  setUserLoading: (loading: boolean) => void;
}

// Window Interfaces
export interface Window {
  id: number;
  title: string;
  path: string;
  type: string;
  isOpen: boolean;
  fullscreen: boolean;
  layer: number;
  x: number;
  y: number;
  width: number;
  height: number;
  minWidth: number;
  minHeight: number;
  content?: JSX.Element;
  componentType?: React.ComponentType<any>;
  componentProps?: Record<string, any>;
}

export interface WindowContextType {
  windows: Window[];
  setWindows: React.Dispatch<React.SetStateAction<Window[]>>;
  addWindow: (window: Window) => void;
  removeWindow: (id: number) => void;
  openWindowByPath: (path: string) => void;
  updateWindowPath: (windowId: number, newPath: string) => void;
}

// API Response Interfaces
export interface ApiResponse<T = any> {
  status: string;
  message: string;
  data: T;
}

// Post Interfaces
export interface Author {
  name: string;
  avatar: string;
}

export interface PostImage {
  id: number;
  picpath: string;
  bucketkey: string;
  postId: number;
}

export interface PostCount {
  comments: number;
  likes: number;
}

export interface Post {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  authorId: number;
  likesCount: number;
  author: Author;
  images: PostImage[];
  likes: { userId: number }[];
  _count: PostCount;
}

export interface PostData {
  images: File[];
  name: string;
  description: string;
}

export interface NewPost {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  authorId: number;
  likesCount: number;
}

export interface CreatePostResponse {
  status: string;
  message: string;
  newPost: NewPost;
}

export interface GetPostResponse {
  status: string;
  message: string;
  post: Post;
}


