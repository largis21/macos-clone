import { useTaskManager } from "@/system/taskManager";
import { useWindowManager } from "@/system/windowManager/WindowManager";
import { createContext, useCallback, useContext, useMemo } from "react";
import { ResizeDirection, resizeHandler } from "./Resizer";

export type WindowContext = {
  onDrag: (e: MouseEvent) => void;
  onDragEnd: () => void;
  setWindowElement: (element: HTMLDivElement) => void;
  minimize: () => void;
  close: () => void;
  onResize: (e: MouseEvent, direction: ResizeDirection) => void;
  zoom: () => void;
};

// Cheating because it is a hassle to keep checking if its null or not,
// Can't do optional chaining in many places because I set values directly
// `context?.element = el` is not allowed
const WindowContext = createContext<WindowContext>(null as any);

export function useWindowContext() {
  return useContext(WindowContext);
}

export function WindowContextProvider(props: {
  instanceId: string;
  children: React.ReactNode;
}) {
  // WindowState is handled outside of reacts rendercycle because of performance
  const windowManager = useWindowManager();
  const taskManager = useTaskManager();

  const winState = useMemo(
    () => windowManager.getWindowStateForInstance(props.instanceId),
    [windowManager, props.instanceId],
  );

  const instance = useMemo(
    () => taskManager.getInstance(props.instanceId),
    [taskManager, props.instanceId],
  );

  const draw = useCallback(
    (animate: boolean = false) => {
      windowManager.drawInstance(props.instanceId, animate);
    },
    [props.instanceId, windowManager],
  );

  const onDrag: WindowContext["onDrag"] = useCallback(
    (e) => {
      const el = winState?.element;
      if (!el) {
        console.error("Could not find window element");
        return;
      }

      if (!winState.dragging) {
        winState.dragging = true;
        const elPos = el.getBoundingClientRect();

        winState.dragOffset = {
          x: e.clientX - elPos.x,
          y: e.clientY - elPos.y,
        };

        el.style.pointerEvents = "none";
      }

      winState.state = "floating"
      winState.rect.x = e.clientX - (winState.dragOffset?.x || 0);
      winState.rect.y = e.clientY - (winState.dragOffset?.y || 0);

      draw();
    },
    [draw, winState],
  );

  const onDragEnd: WindowContext["onDragEnd"] = useCallback(() => {
    const el = winState?.element;
    if (!el) {
      console.error("Could not find window element");
      return;
    }

    winState.dragging = false;
    el.style.pointerEvents = "auto";
  }, [winState]);

  const setWindowElement: WindowContext["setWindowElement"] = useCallback(
    (element) => {
      if (!winState) return null;

      winState.element = element;

      element.style.pointerEvents = "auto";

      draw();
    },
    [winState, draw],
  );

  const minimize: WindowContext["minimize"] = useCallback(() => {
    if (!winState?.state) {
      throw new Error("No window to minimize");
    }

    winState.state = "minimized";
    draw(true)
  }, [winState, draw]);

  const close: WindowContext["close"] = useCallback(() => {
    if (!instance) {
      throw new Error("No instance to close");
    }

    taskManager.closeInstance(instance.instanceId);
  }, [instance, taskManager]);

  const onResize: WindowContext["onResize"] = useCallback(
    (e, resizeDirection) => {
      if (!winState?.element) {
        throw new Error("No window element to resize");
      }

      resizeHandler(
        winState.element,
        e,
        resizeDirection,
        winState.rect,
        winState.minSize,
      );
      draw();
    },
    [winState?.element, draw, winState?.rect, winState?.minSize],
  );

  const zoom: WindowContext["zoom"] = useCallback(() => {
    if (!winState) {
      throw new Error("There is no window to zoom");
    }

    winState.state = "maximized"

    draw(true)
  }, [winState, draw]);


  const contextValue = useMemo<WindowContext>(
    () => ({
      onDrag,
      onDragEnd,
      setWindowElement,
      minimize,
      close,
      onResize,
      zoom,
    }),
    [onDrag, onDragEnd, setWindowElement, minimize, close, onResize, zoom],
  );

  return (
    <WindowContext.Provider value={contextValue}>
      {props.children}
    </WindowContext.Provider>
  );
}
