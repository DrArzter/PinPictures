// Window.tsx
import React, { useEffect, useRef, useState } from "react";
import { FaRegWindowClose, FaRegMinusSquare } from "react-icons/fa";
import { BsArrowsFullscreen } from "react-icons/bs";
import { RiDraggable } from "react-icons/ri";

import { useWindowContext } from "@/app/contexts/WindowContext";
import { getComponentByPath } from "@/app/utils/getComponentByPath";
import { useUserContext } from "@/app/contexts/UserContext";
import { componentRegistry } from "@/app/utils/componentRegistry";

import IconList from "./IconList";

export default function Window({
  windowData: initialWindowData,
  mouseDown,
  mousePosition,
} : any) {
  const { user } = useUserContext() as any;
  const { windows, setWindows, removeWindow, updateWindowPath } =
    useWindowContext() as any;

  const windowData =
    windows.find((w : any) => w.id === initialWindowData.id) || initialWindowData;

  const [pathInput, setPathInput] = useState(windowData.path);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const inputRef = useRef(null);
  const suggestionsListRef = useRef(null);

  const getWindowDimensions = () => {
    if (typeof window !== "undefined") {
      const width = document.documentElement.clientWidth * 0.995;
      const height = document.documentElement.clientHeight * 0.9;
      return { width, height };
    }
    return { width: 800, height: 600 };
  };

  const handlePathChange = (event : any) => {
    const newPath = event.target.value;
    setPathInput(newPath);

    const allPaths = Object.keys(componentRegistry);
    const filteredSuggestions = allPaths.filter((path) =>
      path.toLowerCase().startsWith(newPath.toLowerCase())
    );

    setSuggestions(filteredSuggestions as any);
    setShowSuggestions(true);
  };

  const handlePathSubmit = (event : any) => {
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

  const handleSuggestionClick = (suggestion : any) => {
    setPathInput(suggestion);
    setShowSuggestions(false);
    updateWindowPath(windowData.id, suggestion);
  };

  const [isDragging, setIsDragging] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState(false);
  const [resizeStart, setResizeStart] = useState({
    width: windowData.width,
    height: windowData.height,
    x: 0,
    y: 0,
  });

  const handleDragMouseDown = (event : any) => {
    if (event.button === 0) {
      setIsDragging(true);
      setStartPosition({
        x: event.clientX - windowData.x,
        y: event.clientY - windowData.y,
      });
    }
  };

  const handleResizeStart = (event : any) => {
    setIsResizing(true);
    setResizeStart({
      width: windowData.width,
      height: windowData.height,
      x: event.clientX,
      y: event.clientY,
    });
  };

  useEffect(() => {
    const handleClickOutside = (event : any) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target) &&
        (!suggestionsListRef.current ||
          !suggestionsListRef.current.contains(event.target))
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
        windows.map((w : any) =>
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
    if (!mouseDown) {
      setIsDragging(false);
      setIsResizing(false);
    }
  }, [mouseDown]);

  useEffect(() => {
    if (isDragging && mouseDown) {
      setWindows(
        windows.map((w : any) =>
          w.id === windowData.id
            ? {
                ...w,
                x: mousePosition.clientX - startPosition.x,
                y: mousePosition.clientY - startPosition.y,
              }
            : w
        )
      );
    } else if (isResizing && mouseDown) {
      const newWidth =
        resizeStart.width + (mousePosition.clientX - resizeStart.x);
      const newHeight =
        resizeStart.height + (mousePosition.clientY - resizeStart.y);

      const { width: maxWidth, height: maxHeight } = getWindowDimensions();

      setWindows(
        windows.map((w : any) =>
          w.id === windowData.id
            ? {
                ...w,
                width: Math.min(Math.max(newWidth, w.minWidth), maxWidth),
                height: Math.min(Math.max(newHeight, w.minHeight), maxHeight),
              }
            : w
        )
      );
    }
  }, [mousePosition]);

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
            setWindows(
              windows.map((w) =>
                w.id === windowData.id ? { ...w, isOpen: !w.isOpen } : w
              )
            );
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
            setWindows(
              windows.map((w : any) =>
                w.id === windowData.id
                  ? w.fullscreen
                    ? {
                        ...w,
                        x: 100,
                        y: 100,
                        width: w.minWidth,
                        height: w.minHeight,
                        fullscreen: false,
                      }
                    : {
                        ...w,
                        x:
                          (document.documentElement.clientWidth - windowWidth) /
                          2,
                        y:
                          (document.documentElement.clientHeight -
                            windowHeight) *
                          0.05,
                        width: windowWidth,
                        height: windowHeight,
                        fullscreen: true,
                      }
                  : w
              )
            );
          }}
        />
      ),
    },
  ];

  const backgroundColor = user?.settings?.bgColor || "#FFFFFF5";

  if (!windowData.isOpen) {
    return (
      <div
        style={{
          top: `${windowData.y}px`,
          left: `${windowData.x}px`,
          backgroundColor,
        }}
        className={`absolute bg-white bg-opacity-30 backdrop-blur-xl border-2 rounded-lg shadow-2xl ${
          mouseDown ? "select-none pointer-events-none" : ""
        }`}
        onMouseDown={handleDragMouseDown}
      >
        <div className="w-full flex flex-row justify-between items-center border-b-2 border-dotted">
          <div className="w-full text-end">
            <h1
              className="cursor-pointer select-auto pointer-events-auto"
              onClick={(event) => {
                event.stopPropagation();
                setWindows(
                  windows.map((w : any) =>
                    w.id === windowData.id ? { ...w, isOpen: !w.isOpen } : w
                  )
                );
              }}
            >
              {windowData.title}
            </h1>
          </div>
        </div>
      </div>
    );
  }

  const ContentComponent = windowData.componentType;

  return (
    <div
      key={windowData.path} // Add path as key to trigger rerender on path change
      style={{
        width: `${windowData.width}px`,
        height: `${windowData.height}px`,
        top: `${windowData.y}px`,
        left: `${windowData.x}px`,
        zIndex: windowData.layer,
        backgroundColor,
      }}
      className="absolute bg-white bg-opacity-30 backdrop-blur-3xl border-2 rounded-lg shadow-2xl"
      onMouseDown={(event) => {
        setWindows(
          windows.map((w : any) =>
            w.id !== windowData.id
              ? { ...w, layer: Math.max(0, w.layer - 1) }
              : {
                  ...w,
                  layer: Math.max(...windows.map((w2 : any) => w2.layer)) + 1,
                }
          )
        );
      }}
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
}
