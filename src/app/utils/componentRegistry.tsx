import Authentication from "@/app/pages/Authentication";
import NotFound from "@/app/pages/NotFound";
import Posts from "@/app/pages/Posts";
import CreatePost from "@/app/pages/CreatePost";
import Post from "@/app/pages/Post";
import Settings from "@/app/pages/Settings";
import Search from "@/app/pages/Search";
import Chats from "@/app/pages/Chats";
import Profile from "@/app/pages/Profile";
import Friends from "@/app/pages/Friends";

interface ComponentProps {
  width: number;
  height: number;
  minWidth: number;
  minHeight: number;
  initialX: number;
  initialY: number;
}

interface ComponentEntry {
  component: React.ComponentType<any>;
  defaultProps: ComponentProps;
  title?: string;
}

interface ComponentRegistry {
  [route: string]: ComponentEntry;  // Allow dynamic routes as keys
}

// Define the component registry with correct type definitions
export const componentRegistry: ComponentRegistry = {
  "/chats": {
    component: Chats,
    defaultProps: {
      width: 545,
      height: 700,
      minWidth: 545,
      minHeight: 700,
      initialX: 200,
      initialY: 200,
    },
  },
  "/search": {
    component: Search,
    defaultProps: {
      width: 545,
      height: 700,
      minWidth: 545,
      minHeight: 700,
      initialX: 200,
      initialY: 200,
    },
  },
  "/authentication": {
    component: Authentication,
    defaultProps: {
      width: 545,
      height: 700,
      minWidth: 545,
      minHeight: 700,
      initialX: 200,
      initialY: 200,
    },
  },
  "/posts": {
    component: Posts,
    defaultProps: {
      width: 545,
      height: 700,
      minWidth: 545,
      minHeight: 700,
      initialX: 200,
      initialY: 200,
    },
  },
  "/post/create": {
    component: CreatePost,
    defaultProps: {
      width: 600,
      height: 850,
      minWidth: 600,
      minHeight: 850,
      initialX: 200,
      initialY: 200,
    },
  },
  "/settings": {
    component: Settings,
    defaultProps: {
      width: 800,
      height: 980,
      minWidth: 770,
      minHeight: 980,
      initialX: 200,
      initialY: 200,
    },
  },
  "/post/[id]": {
    component: Post,
    defaultProps: {
      width: 600,
      height: 800,
      minWidth: 600,
      minHeight: 800,
      initialX: 200,
      initialY: 200,
    },
  },
  "/friends/[name]": {
    component: Friends,
    defaultProps: {
      width: 600,
      height: 800,
      minWidth: 600,
      minHeight: 800,
      initialX: 200,
      initialY: 200,
    },
  },
  "/profile/[name]": {
    component: Profile,
    defaultProps: {
      width: 600,
      height: 800,
      minWidth: 600,
      minHeight: 800,
      initialX: 200,
      initialY: 200,
    },
  },
  "*": {
    component: NotFound,
    defaultProps: {
      width: 545,
      height: 700,
      minWidth: 545,
      minHeight: 700,
      initialX: 200,
      initialY: 200,
    },
  },
};
