// Window.tsx
import React, { useEffect, useRef, useState, memo, useMemo } from "react";
import { FaRegWindowClose, FaRegMinusSquare } from "react-icons/fa";
import { BsArrowsFullscreen } from "react-icons/bs";
import { RiDraggable } from "react-icons/ri";

import { useWindowContext } from "@/app/contexts/WindowContext";
import { useUserContext } from "@/app/contexts/UserContext";
import { getComponentByPath } from "@/app/utils/getComponentByPath";
import { componentRegistry } from "@/app/utils/componentRegistry";

import IconList from "./IconList";
import { Window as WindowType } from "@/app/types/global";

interface WindowProps {
  initialWindowData: WindowType;
}

const Window = memo(({ initialWindowData }: WindowProps) => {
  const { user } = useUserContext();
  const { windows, setWindows, removeWindow, updateWindowPath } = useWindowContext();

  // Локальное состояние для позиции и размеров
  const [windowData, setWindowData] = useState(initialWindowData);
  const [mouseDown, setMouseDown] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({
    width: initialWindowData.width || 800,
    height: initialWindowData.height || 600,
    x: 0,
    y: 0,
  });

  const [pathInput, setPathInput] = useState(windowData.path || "");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const suggestionsListRef = useRef<HTMLUListElement | null>(null);

  const getWindowDimensions = () => {
    if (typeof window !== "undefined") {
      const width = document.documentElement.clientWidth * 0.995;
      const height = document.documentElement.clientHeight * 0.9;
      return { width, height };
    }
    return { width: 800, height: 600 };
  };

  // Перемещение окна
  const handleDragMouseDown = (event: React.MouseEvent) => {
    if (event.button === 0) {
      setIsDragging(true);
      setMouseDown(true);
      setStartPosition({
        x: event.clientX - windowData.x,
        y: event.clientY - windowData.y,
      });
    }
  };

  // Изменение размеров окна
  const handleResizeStart = (event: React.MouseEvent) => {
    if (event.button === 0) {
      setIsResizing(true);
      setMouseDown(true);
      setResizeStart({
        width: windowData.width,
        height: windowData.height,
        x: event.clientX,
        y: event.clientY,
      });
    }
  };

  const bringToFront = () => {
    const maxLayer = Math.max(...windows.map((w) => w.layer || 0));
    setWindows((prevWindows) =>
      prevWindows.map((w) =>
        w.id !== windowData.id
          ? { ...w, layer: Math.max(0, (w.layer || 0) - 1) }
          : { ...w, layer: maxLayer + 1 }
      )
    );
  };

  const handlePathChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPath = event.target.value;
    setPathInput(newPath);

    const allPaths = Object.keys(componentRegistry);
    const filteredSuggestions = allPaths.filter((path) =>
      path.toLowerCase().startsWith(newPath.toLowerCase())
    );

    setSuggestions(filteredSuggestions);
    setShowSuggestions(true);
  };

  const handlePathSubmit = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      const matchingComponent = getComponentByPath(
        pathInput,
        windowData.id,
        windows.length
      );
      if (matchingComponent) {
        updateWindowPath(windowData.id, pathInput);
      } else {
        console.warn(
          `Component for path "${pathInput}" does not exist, but opening as custom path.`
        );
        updateWindowPath(windowData.id, pathInput);
      }
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setPathInput(suggestion);
    setShowSuggestions(false);
    updateWindowPath(windowData.id, suggestion);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        (!suggestionsListRef.current ||
          !suggestionsListRef.current.contains(event.target as Node))
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const updatedWindow = getComponentByPath(
      windowData.path,
      windowData.id,
      windows.length
    );
    if (updatedWindow) {
      setWindows(
        windows.map((w) =>
          w.id === windowData.id
            ? {
                ...w,
                componentType: updatedWindow.componentType,
                componentProps: updatedWindow.componentProps,
                width: windowData.fullscreen
                  ? windowData.width
                  : updatedWindow.width,
                height: windowData.fullscreen
                  ? windowData.height
                  : updatedWindow.height,
                minWidth: updatedWindow.minWidth,
                minHeight: updatedWindow.minHeight,
                title: updatedWindow.title,
              }
            : w
        )
      );
    }
  }, [windowData.path]);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (mouseDown) {
        if (isDragging) {
          setWindowData((prev) => ({
            ...prev,
            x: event.clientX - startPosition.x,
            y: event.clientY - startPosition.y,
          }));
        } else if (isResizing) {
          const newWidth = resizeStart.width + (event.clientX - resizeStart.x);
          const newHeight =
            resizeStart.height + (event.clientY - resizeStart.y);

          const { width: maxWidth, height: maxHeight } = getWindowDimensions();

          setWindowData((prev) => ({
            ...prev,
            width: Math.min(Math.max(newWidth, prev.minWidth), maxWidth),
            height: Math.min(Math.max(newHeight, prev.minHeight), maxHeight),
          }));
        }
      }
    };

    const handleMouseUp = () => {
      setMouseDown(false);
      setIsDragging(false);
      setIsResizing(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [mouseDown, isDragging, isResizing, startPosition, resizeStart]);

  const iconList = [
    {
      name: "Close",
      icon: (
        <FaRegWindowClose
          className="w-8 h-8 text-white hover:scale-110 hover:cursor-pointer transition duration-300"
          onClick={(event) => {
            event.stopPropagation();
            removeWindow(windowData.id);
          }}
        />
      ),
    },
    {
      name: "Minimize",
      icon: (
        <FaRegMinusSquare
          className="w-8 h-8 text-white hover:scale-110 hover:cursor-pointer transition duration-300"
          onClick={(event) => {
            event.stopPropagation();
            setWindowData((prev) => ({ ...prev, isOpen: !prev.isOpen }));
          }}
        />
      ),
    },
    {
      name: "Maximize",
      icon: (
        <BsArrowsFullscreen
          className="w-7 h-7 text-white hover:scale-110 hover:cursor-pointer transition duration-300"
          onClick={(event) => {
            event.stopPropagation();
            const { width: windowWidth, height: windowHeight } =
              getWindowDimensions();
            setWindowData((prev) => ({
              ...prev,
              x: prev.fullscreen
                ? 100
                : (document.documentElement.clientWidth - windowWidth) / 2,
              y: prev.fullscreen
                ? 100
                : (document.documentElement.clientHeight - windowHeight) * 0.05,
              width: prev.fullscreen ? prev.minWidth : windowWidth,
              height: prev.fullscreen ? prev.minHeight : windowHeight,
              fullscreen: !prev.fullscreen,
            }));
          }}
        />
      ),
    },
  ];

  const ContentComponent = windowData.componentType;

  const layer = useMemo(() => {
    return windows.find((w) => w.id === windowData.id)?.layer || 0;
  }, [windows, windowData.id]);

  if (!windowData.isOpen) {
    return (
      <div
        style={{
          top: `${windowData.y}px`,
          left: `${windowData.x}px`,
          backgroundColor: user?.settings?.bgColor || "#FFFFFF5",
        }}
        className="absolute bg-white bg-opacity-30 backdrop-blur-xl border-2 rounded-lg shadow-2xl"
        onMouseDown={bringToFront}
      >
        <div
          className="w-full flex justify-end items-center p-2 cursor-pointer"
          onClick={() =>
            setWindowData((prev) => ({ ...prev, isOpen: true }))
          }
        >
          <h1>{windowData.title}</h1>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        width: `${windowData.width}px`,
        height: `${windowData.height}px`,
        top: `${windowData.y}px`,
        left: `${windowData.x}px`,
        zIndex: layer,
        backgroundColor: user?.settings?.bgColor || "#FFFFFF5",
      }}
      className="absolute bg-white bg-opacity-30 backdrop-blur-3xl border-2 rounded-lg shadow-2xl"
      onMouseDown={bringToFront}
    >
      <div
        className="w-full flex flex-row justify-between items-center border-b-2 border-dotted cursor-move"
        onMouseDown={handleDragMouseDown}
      >
        <div className="p-2 flex justify-start">
          <IconList iconList={iconList} />
        </div>

        <div
          className="flex flex-row text-end py-1 px-4 bg-gray-200 rounded bg-opacity-30 relative"
          onMouseDown={(event) => event.stopPropagation()}
        >
          <input
            ref={inputRef}
            type="text"
            value={pathInput}
            onChange={handlePathChange}
            onKeyDown={handlePathSubmit}
            className="bg-transparent border-none outline-none text-white no-drag"
          />
          {showSuggestions && suggestions.length > 0 && (
            <ul
              ref={suggestionsListRef}
              className="absolute border border-gray-300 rounded mt-1 max-h-60 overflow-y-auto z-[999] bg-opacity-90 backdrop-blur-md"
              style={{
                top: "100%",
                left: 0,
                right: 0,
                backgroundColor: "rgba(50, 50, 50, 0.9)",
              }}
            >
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="px-4 py-2 hover:text-white cursor-pointer text-white"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="text-end py-2 px-4">
          <h1 style={{ userSelect: "none" }}>{windowData.title}</h1>
        </div>
      </div>

      {ContentComponent && (
        <ContentComponent
          {...windowData.componentProps}
          windowHeight={windowData.height}
          windowWidth={windowData.width}
          windowId={windowData.id}
          user={user}
        />
      )}

      <div
        className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
        onMouseDown={handleResizeStart}
      >
        <RiDraggable />
      </div>
    </div>
  );
});

export default Window;
