import { useCallback, useRef } from "react";
import { useWindowContext } from "./WindowContext";
import { useEventListener } from "@/hooks/useEventListener";

export function DragArea({
  children,
  ...divProps
}: {
  children: React.ReactNode;
} & React.HtmlHTMLAttributes<HTMLDivElement>) {
  const draggableRef = useRef(null);
  const windowContext = useWindowContext()

  const onDrag = useCallback(
    (e: MouseEvent) => {
      windowContext.onDrag(e);
    },
    [windowContext],
  );

  useEventListener("mousedown", draggableRef, () => {
    document?.addEventListener("mousemove", onDrag);
  });

  useEventListener("mouseup", "__document", () => {
    document.removeEventListener("mousemove", onDrag);
    windowContext.onDragEnd()
  });

  return (
    <div
      className="h-16 bg-neutral-800 border-b-black/80 border-b"
      {...divProps}
      ref={draggableRef}
    >
      {children}
    </div>
  );
}
