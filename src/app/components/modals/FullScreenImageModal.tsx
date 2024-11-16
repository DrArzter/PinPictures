// ./src/app/components/modals/FullScreenImageModal.tsx
import React, { useEffect } from 'react';

export default function FullScreenImage({ imageUrl, onClose }: any) {

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  function handleClickOutside(event) {
    if (event.target.id === 'FullScreenImage') {
      onClose();
    }
  }

  return (
    <div id='FullScreenImage' className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-80 z-50" >
      <img src={imageUrl} alt="FullScreenImage" className="max-h-full max-w-full object-contain p-10" />
    </div>
  );
}
