// windowFactory.tsx
import { Window } from "@/app/types/global"; // Import the Window interface

interface CreateWindowParams {
  id: number;
  title: string;
  path: string;
  type: string;
  existingWindowsCount?: number;
  initialX?: number;
  initialY?: number;
  offsetStep?: number;
  maxOffset?: number;
  width?: number;
  height?: number;
  minWidth?: number;
  minHeight?: number;
  componentType?: React.ComponentType<any>;
  componentProps?: Record<string, any>;
}

export function createWindow({
  id,
  title,
  path,
  type,
  existingWindowsCount = 0,
  initialX = 250,
  initialY = 300,
  offsetStep = 30,
  maxOffset = 300,
  width = 400,
  height = 400,
  minWidth = 300,
  minHeight = 200,
  componentType,
  componentProps,
}: CreateWindowParams): Window { // Typing the return value
  const offset = (existingWindowsCount * offsetStep) % maxOffset;

  let xPosition = initialX + offset;
  let yPosition = initialY + offset;

  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  if (xPosition + width > viewportWidth) {
    xPosition = viewportWidth - width - 20;
  }
  if (yPosition + height > viewportHeight) {
    yPosition = viewportHeight - height - 20;
  }

  // Return the window object, typed with the Window interface
  return {
    id,
    title,
    path,
    type,
    isOpen: true,
    fullscreen: false,
    x: xPosition,
    y: yPosition,
    width,
    height,
    minWidth,
    minHeight,
    layer: 0,
    componentType,
    componentProps,
  };
}
