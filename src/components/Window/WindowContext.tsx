import { useTaskManager } from "@/system/taskManager";
import {
  useWindowManager,
  WindowManagerContext,
} from "@/system/windowManager/WindowManager";
import { createContext, useCallback, useContext, useMemo } from "react";
import { ResizeDirection, resizeHandler } from "./Resizer";

export type WindowContext = {
  onDrag: (e: MouseEvent) => void;
  onDragEnd: () => void;
  setWindowElement: (element: HTMLDivElement) => void;
  minimize: () => void;
  onResize: (e: MouseEvent, direction: ResizeDirection) => void;
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

  const animateToDock = useCallback(() => {
    const el = winState?.element;
    if (!el) {
      throw new Error("Could not find window element");
    }

    if (!instance) {
      throw new Error("Instance does not exist");
    }

    const dockAppElement = document.getElementById(
      `macos-dock-app-${instance.application.name}`,
    );

    if (!dockAppElement) {
      throw new Error("Could not find app in dock");
    }

    const appRect = dockAppElement.getBoundingClientRect();
    const windowRect = el.getBoundingClientRect();

    el.style.transitionProperty = "all";
    el.style.transitionDuration = 400 + "ms";
    el.style.transform = `
      translateX(${appRect.x - windowRect.width / 2 + appRect.width / 2}px) 
      translateY(${appRect.y - windowRect.height / 2 + appRect.height / 2}px)
      scale(0.05)
    `;

    setTimeout(() => {
      el.style.transitionProperty = "none";
    }, 400);
  }, [instance, winState?.element]);

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
    animateToDock();
  }, [winState, animateToDock]);

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

  const contextValue = useMemo<WindowContext>(
    () => ({
      onDrag,
      onDragEnd,
      setWindowElement,
      minimize,
      onResize,
    }),
    [onDrag, onDragEnd, setWindowElement, minimize, onResize],
  );

  return (
    <WindowContext.Provider value={contextValue}>
      {props.children}
    </WindowContext.Provider>
  );
}
