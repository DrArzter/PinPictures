// Windows.tsx
import React from 'react';
import Window from './Window';
import { useWindowContext } from '@/app/contexts/WindowContext';

export default function Windows({ mouseDown, mousePosition }) {
  const { windows } = useWindowContext();

  return (
    <div>
      {windows.map((win, index) => (
        <Window
          key={index}
          windowData={win}
          mouseDown={mouseDown}
          mousePosition={mousePosition}
        />
      ))}
    </div>
  );
}