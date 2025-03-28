import { useState, useEffect, useCallback } from "react";

interface UseColumnCountOptions {
  minColumnWidth: number;
  maxColumns: number;
  containerRef?: React.RefObject<HTMLElement>;
}

export function useColumnCount({
  minColumnWidth,
  maxColumns,
  containerRef,
}: UseColumnCountOptions): number {
  const [columns, setColumns] = useState<number>(1);

  const calculateColumns = useCallback(() => {
    const containerWidth = containerRef?.current
      ? containerRef.current.offsetWidth
      : typeof window !== "undefined"
      ? window.innerWidth
      : minColumnWidth;

    const newColumns = Math.max(
      1,
      Math.min(maxColumns, Math.floor(containerWidth / minColumnWidth))
    );
    setColumns(newColumns);
  }, [minColumnWidth, maxColumns, containerRef]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    calculateColumns();

    const handleResize = () => calculateColumns();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [calculateColumns]);

  return columns;
}
