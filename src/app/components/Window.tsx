import React, { useEffect, useState } from "react";
import { FaRegWindowClose, FaRegMinusSquare } from "react-icons/fa";
import { BsArrowsFullscreen } from "react-icons/bs";
import { RiDraggable } from "react-icons/ri";
import { useWindowContext } from "@/app/contexts/WindowContext";

import IconList from "./IconList";

export default function Window({
  window,
  mouseDown,
  mousePosition,
}) {

  const { windows, setWindows, addWindow, removeWindow } = useWindowContext();
  const iconList = [
    {
      name: "Close",
      icon: (
        <FaRegWindowClose
          className="w-8 h-8 text-white hover:scale-110 hover:cursor-pointer transition duration-300"
          onClick={(event) => {
            event.stopPropagation();
            removeWindow(window.id);
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
                if (w.id === window.id) {
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
            setWindows(
              windows.map((w) => {
                if (w.id === window.id) {
                  if (!w.fullscreen) {
                    return {
                      ...w,
                      x:
                        (document.body.clientWidth -
                          document.body.clientWidth / 1.05) /
                        2,
                      y: document.body.clientHeight >= 1100 ? 40 : 10,
                      width: document.body.clientWidth / 1.05,
                      height:
                        document.body.clientHeight >= 1100
                          ? document.body.clientHeight / 1.3
                          : document.body.clientHeight / 1.4,
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
    width: window.width,
    height: window.height,
    x: 0,
    y: 0,
  });

  // Handle window dragging
  const handleMouseDown = (event) => {
    if (event.button === 0) {
      setIsDragging(true);
      setStartPosition({
        x: event.clientX - window.x,
        y: event.clientY - window.y,
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
          if (w.id === window.id) {
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
      const newWidth =
        resizeStart.width + (mousePosition.clientX - resizeStart.x);
      const newHeight =
        resizeStart.height + (mousePosition.clientY - resizeStart.y);

      setWindows(
        windows.map((w) => {
          if (w.id === window.id) {
            return {
              ...w,
              width: Math.min(
                Math.max(newWidth, window.minWidth),
                document.body.clientWidth / 1.05
              ),
              height: Math.min(
                Math.max(newHeight, window.minHeight),
                document.body.clientHeight / 1.2
              ),
            };
          }
          return w;
        })
      );
    }
  }, [mousePosition]);

  // Handle resizing
  const handleResizeStart = (event) => {
    setIsResizing(true);
    setResizeStart({
      width: window.width,
      height: window.height,
      x: event.clientX,
      y: event.clientY,
    });
  };

  if (!window.isOpen) {
    return (
      <div
        style={{
          top: `${window.y}px`,
          left: `${window.x}px`,
        }}
        className={`absolute bg-white bg-opacity-30 backdrop-blur-md border-2 rounded-lg shadow-2xl p-2 ${mouseDown ? "select-none pointer-events-none" : ""
          }`}
        onMouseDown={handleMouseDown}
      >
        <div className="w-full flex flex-row justify-between items-center border-b-2 border-dotted">
          <div className="w-full text-end py-2 px-4">
            <h1
              className="cursor-pointer select-auto pointer-events-auto"
              onClick={(event) => {
                event.stopPropagation();
                setWindows(
                  windows.map((w) => {
                    if (w.id === window.id) {
                      return { ...w, isOpen: !w.isOpen };
                    }
                    return w;
                  })
                );
              }}
            >
              {window.title}
            </h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        width: `${window.width}px`,
        height: `${window.height}px`,
        top: `${window.y}px`,
        left: `${window.x}px`,
        zIndex: window.layer,
      }}
      className={`absolute bg-white bg-opacity-30 backdrop-blur-md border-2 rounded-lg shadow-2xl`}
      onMouseDown={() => {
        setWindows(
          windows.map((w) => {
            if (w.id !== window.id) {
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
        <div className="flex flex-row text-end py-1 px-4 bg-gray-200 rounded bg-opacity-30 ">
        <h1>{window.path}</h1>
        </div>
        <div className="text-end py-2 px-4">
          <h1>{window.title}</h1>
        </div>
      </div>
      {window.content}

      <div
        className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
        onMouseDown={handleResizeStart}
      >
        <RiDraggable />
      </div>
    </div>
  );
}
