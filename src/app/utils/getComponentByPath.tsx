import Authentication from "@/app/pages/Authentication/page";

export function getComponentByPath(path: string, windowId: number) {
  const trustedComponents = new Map<string, () => Window>([
    [
      "/authentication",
      () => ({
        id: windowId,
        title: "Authentication",
        path: "/authentication",
        type: "Authentication",
        isOpen: true,
        fullscreen: false,
        x: 250,
        y: 250,
        width: 545,
        height: 700,
        minWidth: 545,
        minHeight: 700,
        layer: windowId,
        content: <Authentication />,
      }),
    ],
  ]);

  const componentFactory = trustedComponents.get(path);
  if (componentFactory) {
    return componentFactory();
  }
  

  console.warn(`No trusted component found for path: ${path}`);
  return null;
}
