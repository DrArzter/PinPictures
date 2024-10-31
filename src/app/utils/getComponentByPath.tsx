// getComponentByPath.ts
import { componentRegistry } from "./componentRegistry";
import { createWindow } from "./windowFactory";

export function getComponentByPath(
  path: string,
  windowId: number,
  existingWindowsCount: number
) {
  const matchedRoute = Object.keys(componentRegistry).find((route) => {
    if (route.includes("[id]")) {
      const baseRoute = route.replace("[id]", "");
      return path.startsWith(baseRoute) && path.slice(baseRoute.length).match(/^\d+$/);
    }
    return route === path;
  });

  const registryEntry = matchedRoute ? componentRegistry[matchedRoute] : undefined;

  if (registryEntry) {
    const { component, defaultProps } = registryEntry;
    const Component = component;

    let dynamicProps = {};
    if (matchedRoute.includes("[id]")) {
      const id = path.split("/").pop();
      dynamicProps = { postId: id };
    }

    return createWindow({
      id: windowId,
      title: registryEntry.title || Component.name || "Untitled Window",
      path,
      type: Component.name || "Component",
      componentType: Component,
      componentProps: { ...defaultProps, ...dynamicProps },
      existingWindowsCount,
      ...defaultProps,
    });
  } else {
    // If no matching route is found, check for a NotFound handler
    const notFoundEntry = componentRegistry["*"];
    if (notFoundEntry) {
      const { component, defaultProps } = notFoundEntry;
      const Component = component;
      return createWindow({
        id: windowId,
        title: "Not Found",
        path,
        type: "NotFound",
        componentType: Component,
        componentProps: defaultProps,
        existingWindowsCount,
        ...defaultProps,
      });
    } else {
      console.warn(
        `No component found for path: ${path}, and no NotFound handler.`
      );
      return null;
    }
  }
}

