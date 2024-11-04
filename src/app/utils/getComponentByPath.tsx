// getComponentByPath.tsx
import { componentRegistry } from "./componentRegistry";
import { createWindow } from "./windowFactory";

/**
 * Retrieves a component configuration based on the given path, and creates a window instance.
 * 
 * @param path - The path used to identify and retrieve the corresponding component.
 * @param windowId - Unique ID for the window instance being created.
 * @param existingWindowsCount - The count of currently open windows.
 * @returns A configured window instance or null if no matching component or fallback is found.
 */
export function getComponentByPath(
  path: string,
  windowId: number,
  existingWindowsCount: number
) {
  // Utility function to escape special characters in a string for use in a regular expression
  const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); 

  // Find a matching route in the component registry by converting each route with dynamic parameters to a regular expression
  const matchedRoute = Object.keys(componentRegistry).find((route) => {
    try {
      // Escape route, then replace dynamic segments
      const regexRoute = new RegExp("^" + route.replace(/\[([^\]]+)\]/g, "([^/]+)") + "$");
      return regexRoute.test(path);
    } catch (error) {
      console.warn(`Error processing route "${route}":`, error);
      return false;
    }
  });

  // Retrieve the component entry from the registry based on the matched route or fall back to NotFound
  const registryEntry = matchedRoute ? componentRegistry[matchedRoute] : componentRegistry["*"];

  // If no component matches and no NotFound handler exists, log a warning and return null
  if (!registryEntry) {
    console.warn(`No component found for path: ${path}, and no NotFound handler.`);
    return null;
  }

  // Destructure component and defaultProps from the registry entry
  const { component: Component, defaultProps } = registryEntry;
  const title = registryEntry.title || Component.name || "Untitled Window";
  const windowType = matchedRoute ? Component.name || "Component" : "NotFound";

  // Extract dynamic route parameters from the path
  let dynamicProps: { [key: string]: string | null } = {};
  const paramMatches = matchedRoute?.match(/\[([^\]]+)\]/g);

  if (paramMatches) {
    // Create regex to match the path and extract dynamic parameter values
    const routeRegex = new RegExp("^" + matchedRoute.replace(/\[([^\]]+)\]/g, "([^/]+)") + "$");
    const pathParams = path.match(routeRegex);

    // Map matched parameters to their names and values from the path
    paramMatches.forEach((param, index) => {
      const paramName = param.replace("[", "").replace("]", "");
      dynamicProps[paramName] = pathParams ? pathParams[index + 1] : null;
    });
  }

  // Call createWindow to generate a new window instance with all required properties and settings
  return createWindow({
    id: windowId,
    title,
    path,
    type: windowType,
    componentType: Component,
    componentProps: { ...defaultProps, dynamicProps },
    existingWindowsCount,
    ...defaultProps,
  });
}
