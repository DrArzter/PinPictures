// Window.tsx
import React, { useEffect, useState } from "react";
import { FaRegWindowClose, FaRegMinusSquare } from "react-icons/fa";
import { BsArrowsFullscreen } from "react-icons/bs";
import { RiDraggable } from "react-icons/ri";
import { useWindowContext } from "@/app/contexts/WindowContext";
import { getComponentByPath } from "@/app/utils/getComponentByPath";
import { useUserContext } from "../contexts/userContext";

import IconList from "./IconList";

export default function Window({ windowData, mouseDown, mousePosition }) {
  const { user } = useUserContext();
  const { windows, setWindows, removeWindow } = useWindowContext();

  const getWindowDimensions = () => {

    if (typeof window !== "undefined") {
      const width = document.documentElement.clientWidth * 0.995;
      const height = document.documentElement.clientHeight * 0.9;
      return { width: width, height: height };
    }
    return { width: 800, height: 600 };
  };

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
              windows.map((w) => {
                if (w.id === windowData.id) {
                  return { ...w, isOpen: !w.isOpen };
                }
                return w;
              })
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
            const { width: windowWidth, height: windowHeight } = getWindowDimensions();
            setWindows(
              windows.map((w) => {
                if (w.id === windowData.id) {
                  if (!w.fullscreen) {
                    return {
                      ...w,
                      x: (document.documentElement.clientWidth - windowWidth) / 2,
                      y: (document.documentElement.clientHeight - windowHeight) / 2.75,
                      width: windowWidth,
                      height: windowHeight,
                      fullscreen: true,
                    };
                  } else {
                    return {
                      ...w,
                      x: 100,
                      y: 100,
                      width: w.minWidth,
                      height: w.minHeight,
                      fullscreen: false,
                    };
                  }
                }
                return w;
              })
            );
          }}
        />
      ),
    },
  ];

  const [isDragging, setIsDragging] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState(false);
  const [resizeStart, setResizeStart] = useState({
    width: windowData.width,
    height: windowData.height,
    x: 0,
    y: 0,
  });

  const [pathInput, setPathInput] = useState(windowData.path);

  const handlePathChange = (event) => {
    const newPath = event.target.value;
    setPathInput(newPath);
  };

  const handlePathSubmit = (event) => {
    if (event.key === "Enter") {
      updateWindowPath(windowData.id, pathInput);
    }
  };

  const updateWindowPath = (windowId, newPath) => {
    setWindows(
      windows.map((w) => {
        if (w.id === windowId) {
          console.log(w);
          return { ...w, path: newPath };
        }
        return w;
      })
    );
  };

  useEffect(() => {
    const updatedWindow = getComponentByPath(windowData.path, windowData.id, windows.length);
    if (updatedWindow) {
      setWindows(
        windows.map((w) => {
          if (w.id === windowData.id) {
            return {
              ...w,
              componentType: updatedWindow.componentType,
              componentProps: updatedWindow.componentProps,
              width: windowData.fullscreen ? windowData.width : updatedWindow.width,
              height: windowData.fullscreen ? windowData.height : updatedWindow.height,
              minWidth: updatedWindow.minWidth,
              minHeight: updatedWindow.minHeight,
              title: updatedWindow.title,
            };
          }
          return w;
        })
      );
    }
  }, [windowData.path]);

  const handleMouseDown = (event) => {
    if (event.button === 0) {
      setIsDragging(true);
      setStartPosition({
        x: event.clientX - windowData.x,
        y: event.clientY - windowData.y,
      });
    }
  };

  useEffect(() => {
    if (!mouseDown) {
      setIsDragging(false);
      setIsResizing(false);
    }
  }, [mouseDown]);

  useEffect(() => {
    if (isDragging && mouseDown) {
      setWindows(
        windows.map((w) => {
          if (w.id === windowData.id) {
            return {
              ...w,
              x: mousePosition.clientX - startPosition.x,
              y: mousePosition.clientY - startPosition.y,
            };
          }
          return w;
        })
      );
    } else if (isResizing && mouseDown) {
      const newWidth = resizeStart.width + (mousePosition.clientX - resizeStart.x);
      const newHeight = resizeStart.height + (mousePosition.clientY - resizeStart.y);

      const { width: maxWidth, height: maxHeight } = getWindowDimensions();

      setWindows(
        windows.map((w) => {
          if (w.id === windowData.id) {
            return {
              ...w,
              width: Math.min(Math.max(newWidth, w.minWidth), maxWidth),
              height: Math.min(Math.max(newHeight, w.minHeight), maxHeight),
            };
          }
          return w;
        })
      );
    }
  }, [mousePosition]);

  const handleResizeStart = (event) => {
    setIsResizing(true);
    setResizeStart({
      width: windowData.width,
      height: windowData.height,
      x: event.clientX,
      y: event.clientY,
    });
  };

  const backgroundColor = user && user.settings?.bgColor ? `rgba(${user.settings.bgColor})` : 'rgba(255,255,255,0.3)';

  if (!windowData.isOpen) {
    return (
      <div
        style={{
          top: `${windowData.y}px`,
          left: `${windowData.x}px`,
          backgroundColor: backgroundColor,
        }}
        className={`absolute bg-white bg-opacity-30 backdrop-blur-md border-2 rounded-lg shadow-2xl ${mouseDown ? "select-none pointer-events-none" : ""
          }`}
        onMouseDown={handleMouseDown}
      >
        <div className="w-full flex flex-row justify-between items-center border-b-2 border-dotted">
          <div className="w-full text-end">
            <h1
              className="cursor-pointer select-auto pointer-events-auto"
              onClick={(event) => {
                event.stopPropagation();
                setWindows(
                  windows.map((w) => {
                    if (w.id === windowData.id) {
                      return { ...w, isOpen: !w.isOpen };
                    }
                    return w;
                  })
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
      style={{
        width: `${windowData.width}px`,
        height: `${windowData.height}px`,
        top: `${windowData.y}px`,
        left: `${windowData.x}px`,
        zIndex: windowData.layer,
        backgroundColor: backgroundColor,
      }}
      className={`absolute bg-white bg-opacity-30 backdrop-blur-md border-2 rounded-lg shadow-2xl`}
      onMouseDown={() => {
        setWindows(
          windows.map((w) => {
            if (w.id !== windowData.id) {
              return {
                ...w,
                layer: Math.max(0, w.layer - 1),
              };
            }
            return {
              ...w,
              layer: Math.max(...windows.map((w2) => w2.layer)) + 1,
            };
          })
        );
      }}
    >
      <div
        className="w-full flex flex-row justify-between items-center border-b-2 border-dotted cursor-move"
        onMouseDown={handleMouseDown}
      >
        <div className="p-2 flex justify-start">
          <IconList iconList={iconList} />
        </div>
        <div className="flex flex-row text-end py-1 px-4 bg-gray-200 rounded bg-opacity-30">
          <input
            type="text"
            value={pathInput}
            onChange={handlePathChange}
            onKeyDown={handlePathSubmit}
            className="bg-transparent border-none outline-none text-white"
          />
        </div>
        <div className="text-end py-2 px-4">
          <h1>{windowData.title}</h1>
        </div>
      </div>

      {ContentComponent && (
        <ContentComponent
          {...windowData.componentProps}
          windowHeight={windowData.height}
          windowWidth={windowData.width}
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
