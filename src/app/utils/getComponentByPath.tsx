// getComponentByPath.js
import { componentRegistry } from "./componentRegistry";
import { createWindow } from "./windowFactory";
import React from "react";

export function getComponentByPath(path, windowId, existingWindowsCount) {
  const registryEntry = componentRegistry[path];
  if (registryEntry) {
    const { component, defaultProps } = registryEntry;
    const Component = component; // Ensure uppercase

    return createWindow({
      id: windowId,
      title: component.name || "Untitled Window",
      path,
      type: component.name || "Component",
      content: <Component />,
      existingWindowsCount,
      ...defaultProps,
    });
  } else {
    const notFoundEntry = componentRegistry["*"];
    if (notFoundEntry) {
      const { component, defaultProps } = notFoundEntry;
      const Component = component;
      return createWindow({
        id: windowId,
        title: "Not Found",
        path,
        type: "NotFound",
        content: <Component />,
        existingWindowsCount,
        ...defaultProps,
      });
    } else {
      console.warn(`No component found for path: ${path}, and no NotFound handler.`);
      return null;
    }
  }
}
