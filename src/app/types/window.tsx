export interface Window {
  id: number;
  title: string;
  path: string;
  type: string;
  isOpen?: boolean;
  fullscreen?: boolean;
  layer?: number;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  minWidth?: number;
  minHeight?: number;
  content: JSX.Element;
}
