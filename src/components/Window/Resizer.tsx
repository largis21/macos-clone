import { useEventListener } from "@/hooks/useEventListener";
import { forwardRef, useCallback, useRef } from "react";

const resizeDirections = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"] as const;

export type ResizeDirection = (typeof resizeDirections)[number];

function getResizeStyle(
  direction: ResizeDirection,
  resizeWidth: number,
): React.HTMLAttributes<HTMLDivElement>["style"] {
  switch (direction) {
    case "N":
      return {
        position: "absolute",
        width: `calc(100% - ${resizeWidth}px)`,
        height: resizeWidth,
        top: `-${resizeWidth / 2}px`,
        left: 0,
        right: 0,
        margin: "0 auto 0 auto",
        zIndex: 2,
        cursor: "n-resize",
      };
    case "NE": {
      return {
        position: "absolute",
        width: resizeWidth,
        height: resizeWidth,
        top: `-${resizeWidth / 2}px`,
        right: `-${resizeWidth / 2}px`,
        zIndex: 3,
        cursor: "ne-resize",
      };
    }
    case "E": {
      return {
        position: "absolute",
        width: resizeWidth,
        height: `calc(100% - ${resizeWidth}px)`,
        right: `-${resizeWidth / 2}px`,
        top: 0,
        bottom: 0,
        margin: "auto 0 auto 0",
        zIndex: 2,
        cursor: "e-resize",
      };
    }
    case "SE": {
      return {
        position: "absolute",
        width: resizeWidth,
        height: resizeWidth,
        bottom: `-${resizeWidth / 2}px`,
        right: `-${resizeWidth / 2}px`,
        zIndex: 3,
        cursor: "se-resize",
      };
    }
    case "S": {
      return {
        position: "absolute",
        width: `calc(100% - ${resizeWidth}px)`,
        height: resizeWidth,
        bottom: `-${resizeWidth / 2}px`,
        left: 0,
        right: 0,
        margin: "0 auto 0 auto",
        zIndex: 2,
        cursor: "s-resize",
      };
    }
    case "SW": {
      return {
        position: "absolute",
        width: resizeWidth,
        height: resizeWidth,
        bottom: `-${resizeWidth / 2}px`,
        left: `-${resizeWidth / 2}px`,
        zIndex: 3,
        cursor: "sw-resize",
      };
    }
    case "W": {
      return {
        position: "absolute",
        width: resizeWidth,
        height: `calc(100% - ${resizeWidth}px)`,
        left: `-${resizeWidth / 2}px`,
        top: 0,
        bottom: 0,
        margin: "auto 0 auto 0",
        zIndex: 2,
        cursor: "w-resize",
      };
    }
    case "NW": {
      return {
        position: "absolute",
        width: resizeWidth,
        height: resizeWidth,
        top: `-${resizeWidth / 2}px`,
        left: `-${resizeWidth / 2}px`,
        zIndex: 3,
        cursor: "nw-resize",
      };
    }
  }
}

type ResizableProps = {
  resizeWidth?: number;
  children: React.ReactNode;
  onResize: (e: MouseEvent, resizeDirection: ResizeDirection) => void;
} & Omit<React.HTMLAttributes<HTMLDivElement>, "onResize">;

export const Resizeable = forwardRef<HTMLDivElement, ResizableProps>(
  function Resizable(
    { resizeWidth = 10, children, onResize, ...divAttributes },
    ref,
  ) {
    return (
      <div ref={ref} {...divAttributes}>
        <div className="h-full w-full relative">
          {resizeDirections.map((e) => (
            <Resizer
              direction={e}
              resizeWidth={resizeWidth}
              key={e}
              onResize={onResize}
            />
          ))}
          {children}
        </div>
      </div>
    );
  },
);

function Resizer(props: {
  direction: ResizeDirection;
  resizeWidth: number;
  onResize: (e: MouseEvent, resizeDirections: ResizeDirection) => void;
}) {
  const resizeRef = useRef(null);

  const onResize = useCallback(
    (e: MouseEvent) => {
      props.onResize(e, props.direction);
    },
    [props],
  );

  useEventListener("mousedown", resizeRef, () => {
    document?.addEventListener("mousemove", onResize);
  });

  useEventListener("mouseup", "__document", () => {
    document.removeEventListener("mousemove", onResize);
  });

  return (
    <div
      ref={resizeRef}
      style={getResizeStyle(props.direction, props.resizeWidth)}
    />
  );
}

export function resizeHandler(
  el: HTMLDivElement,
  e: MouseEvent,
  resizeDirection: ResizeDirection,
  mutableRect: {
    x: number;
    y: number;
    width: number;
    height: number;
  },
  minSize: {
    width: number;
    height: number;
  },
) {
  const windowRect = el.getBoundingClientRect();

  switch (resizeDirection) {
    case "N": {
      const heightChange = mutableRect.y - e.clientY;
      const newHeight = mutableRect.height + heightChange;
      if (newHeight >= minSize.height) {
        mutableRect.y = e.clientY;
        mutableRect.height = newHeight;
      }
      break;
    }
    case "NE": {
      const yChange = mutableRect.y - e.clientY;
      const newHeight = mutableRect.height + yChange;
      const newWidth = e.clientX - windowRect.x;
      if (newHeight >= minSize.height) {
        mutableRect.y = e.clientY;
        mutableRect.height = newHeight;
      }
      if (newWidth >= minSize.width) {
        mutableRect.width = newWidth;
      }
      break;
    }
    case "E": {
      const newWidth = e.clientX - windowRect.x;
      if (newWidth >= minSize.width) {
        mutableRect.width = newWidth;
      }
      break;
    }
    case "SE": {
      const newWidth = e.clientX - windowRect.x;
      const newHeight = e.clientY - windowRect.y;
      if (newWidth >= minSize.width) {
        mutableRect.width = newWidth;
      }
      if (newHeight >= minSize.height) {
        mutableRect.height = newHeight;
      }
      break;
    }
    case "S": {
      const newHeight = e.clientY - windowRect.y;
      if (newHeight >= minSize.height) {
        mutableRect.height = newHeight;
      }
      break;
    }
    case "SW": {
      const xChange = mutableRect.x - e.clientX;
      const newHeight = e.clientY - windowRect.y;
      const newWidth = mutableRect.width + xChange;
      if (newHeight >= minSize.height) {
        mutableRect.height = newHeight;
      }
      if (newWidth >= minSize.width) {
        mutableRect.x = e.clientX;
        mutableRect.width = newWidth;
      }
      break;
    }
    case "W": {
      const xChange = mutableRect.x - e.clientX;
      const newWidth = mutableRect.width + xChange;
      if (newWidth >= minSize.width) {
        mutableRect.x = e.clientX;
        mutableRect.width = newWidth;
      }
      break;
    }
    case "NW": {
      const heightChange = mutableRect.y - e.clientY;
      const newHeight = mutableRect.height + heightChange;
      const xChange = mutableRect.x - e.clientX;
      const newWidth = mutableRect.width + xChange;
      if (newHeight >= minSize.height) {
        mutableRect.y = e.clientY;
        mutableRect.height = newHeight;
      }
      if (newWidth >= minSize.width) {
        mutableRect.x = e.clientX;
        mutableRect.width = newWidth;
      }
      break;
    }
  }
}
