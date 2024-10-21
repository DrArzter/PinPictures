// windowFactory.js
export function createWindow({
  id,
  title,
  path,
  type,
  existingWindowsCount = 0,
  initialX = 250,
  initialY = 250,
  offsetStep = 30,
  maxOffset = 300,
  width = 400,
  height = 400,
  minWidth = 300,
  minHeight = 200,
  content,
}) {
  const offset = (existingWindowsCount * offsetStep) % maxOffset;
  return {
    id,
    title,
    path,
    type,
    isOpen: true,
    fullscreen: false,
    x: initialX + offset,
    y: initialY + offset,
    width,
    height,
    minWidth,
    minHeight,
    layer: id,
    content,
  };
}
