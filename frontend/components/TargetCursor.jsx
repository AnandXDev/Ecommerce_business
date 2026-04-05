"use client";
import { useEffect, useRef } from "react";

const TargetCursor = ({ hideDefaultCursor }) => {
  const cursorRef = useRef(null);

  useEffect(() => {
    const cursor = document.createElement("div");
    cursorRef.current = cursor;

    document.body.appendChild(cursor);

    const moveCursor = (e) => {
      cursor.style.left = e.pageX + "px";
      cursor.style.top = e.pageY + "px";
    };

    document.addEventListener("mousemove", moveCursor);

    return () => {
      document.removeEventListener("mousemove", moveCursor);

      if (cursorRef.current && document.body.contains(cursorRef.current)) {
        document.body.removeChild(cursorRef.current);
      }
    };
  }, []);

  return null;
};

export default TargetCursor;