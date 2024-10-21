import Authentication from "@/app/pages/Authentication/page";

// componentRegistry.js
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
    // Other components...
  };
  
