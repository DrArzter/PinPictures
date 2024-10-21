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
    console.warn(`No component found for path: ${path}`);
    return null;
  }
}
