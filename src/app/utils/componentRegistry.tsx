// componentRegistry.js
import Authentication from "@/app/pages/Authentication/page";
import NotFound from "@/app/pages/NotFound/page";
import Posts from "@/app/pages/Posts/page";

export const componentRegistry = {
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
