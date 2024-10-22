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

  return {
    id,
    title,
    path,
    type,
    isOpen: true,
    fullscreen: false,
    x: offset,
    y: offset,
    width,
    height,
    minWidth,
    minHeight,
    layer: id,
    content,
  };
}