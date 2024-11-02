// getComponentByPath.ts
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
  // Find a matching route in the component registry by converting each route with dynamic parameters to a regular expression
  const matchedRoute = Object.keys(componentRegistry).find((route) => {
    const regexRoute = new RegExp("^" + route.replace(/\[([^\]]+)\]/g, "([^/]+)") + "$");
    return regexRoute.test(path);
  });

  // Retrieve the component entry from the registry based on the matched route or fall back to a wildcard ("*") route
  const registryEntry = matchedRoute ? componentRegistry[matchedRoute] : componentRegistry["*"];

  // If no component matches and no wildcard handler exists, log a warning and return null
  if (!registryEntry) {
    console.warn(`No component found for path: ${path}, and no NotFound handler.`);
    return null;
  }

  // Destructure component and defaultProps from the registry entry
  const { component: Component, defaultProps } = registryEntry;
  const title = registryEntry.title || Component.name || "Untitled Window";  // Determine the title, defaulting to the component's name or a placeholder
  const windowType = matchedRoute ? Component.name || "Component" : "NotFound"; // Set the window type, either the component's name or "NotFound"

  // Initialize an object to store dynamic route parameters extracted from the path
  let dynamicProps: { [key: string]: string | null } = {};
  const paramMatches = matchedRoute?.match(/\[([^\]]+)\]/g); // Capture dynamic segments in the route

  if (paramMatches) {
    // Create a regular expression to match the actual path and extract dynamic parameter values
    const routeRegex = new RegExp("^" + matchedRoute.replace(/\[([^\]]+)\]/g, "([^/]+)") + "$");
    const pathParams = path.match(routeRegex);

    // Map matched parameters to their names and values from the path
    paramMatches.forEach((param, index) => {
      const paramName = param.replace("[", "").replace("]", "");  // Remove brackets around parameter name
      dynamicProps[paramName] = pathParams ? pathParams[index + 1] : null;  // Set the parameter value, or null if missing
    });
  }


  // Call createWindow to generate a new window instance with all required properties and settings
  return createWindow({
    id: windowId,
    title,
    path,
    type: windowType,
    componentType: Component,
    componentProps: { ...defaultProps, dynamicProps }, // Include both defaultProps and dynamic route parameters
    existingWindowsCount,
    ...defaultProps, // Spread additional properties defined in defaultProps directly onto the window
  });
}
