import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useTaskManager } from "../taskManager";

// 1.  A user clicks on a application in the dock or desktop
// 2.  The app button asks the WindowManager to handle it
// 3.1 If there is no instance of app: ask TaskManager to create an instance
// 3.2 If there is an instance of app: set the status of the instance to its beforeMinimized value

// 1. A User rightclicks on an application and clicks on New window
// 2. The app button asks the WindowManager to handle it
// 3. taskManager.createInstance(app)

const animationDuration = 200;

type WindowManagerState = {
  instances: {
    instanceId: string;
    windowState: WindowState;
  }[];
};

type WindowState = {
  element: HTMLDivElement | null;
  rect: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  minSize: {
    width: number;
    height: number;
  };
  state: "floating" | "maximized" | "minimized";
  dragging: boolean;
  dragOffset: { x: number; y: number };
};

function generateDefaultWindowState(): WindowState {
  return {
    element: null,
    rect: {
      x: 100,
      y: 100,
      width: 1500,
      height: 800,
    },
    minSize: {
      width: 480,
      height: 320,
    },
    state: "floating",
    dragging: false,
    dragOffset: { x: 0, y: 0 },
  };
}

export type WindowManagerContext = {
  instances: WindowManagerState["instances"];
  requestAppOpen: (applicationName: string) => void;
  getWindowStateForInstance: (instanceId: string) => WindowState | null;
  drawInstance: (instanceId: string, animate?: boolean) => void;
};

const WindowManagerContext = createContext<WindowManagerContext>(null as any);

export function WindowManagerContextProvider(props: {
  children: React.ReactNode;
}) {
  const taskManager = useTaskManager();

  const [wmState, setWmState] = useState<WindowManagerState>({
    instances: [],
  });

  const drawInstance: WindowManagerContext["drawInstance"] = useCallback(
    (instanceId, animate = false) => {
      const winState = wmState.instances.find(
        (e) => e.instanceId === instanceId,
      )?.windowState;
      const el = winState?.element;
      if (!el) {
        console.error("Could not find window element");
        return;
      }

      requestAnimationFrame(() => {
        switch (winState.state) {
          case "floating": {
            if (animate) {
              el.style.transitionProperty = "all";
              el.style.transitionDuration = animationDuration + "ms";
            }

            el.style.display = "block";
            setTimeout(() => {
              el.style.transform = `translateX(${winState.rect.x}px) translateY(${winState.rect.y}px)`;
              el.style.width = `${winState.rect.width}px`;
              el.style.height = `${winState.rect.height}px`;
            }, 0);

            setTimeout(() => {
              el.style.transitionProperty = "none";
            }, animationDuration);
            break;
          }
          case "minimized": {
            const instance = taskManager.getInstance(instanceId);
            if (!instance) return;

            const dockAppElement = document.getElementById(
              `macos-dock-app-${instance.application.name}`,
            );

            if (!dockAppElement) {
              throw new Error("Could not find app in dock");
            }

            const appRect = dockAppElement.getBoundingClientRect();
            const windowRect = el.getBoundingClientRect();

            el.style.transitionProperty = "all";
            el.style.transitionDuration = 300 + "ms";
            el.style.transform = `
              translateX(${appRect.x - windowRect.width / 2 + appRect.width / 2}px) 
              translateY(${appRect.y - windowRect.height / 2 + appRect.height / 2}px)
              scale(0.05)
            `;

            setTimeout(() => {
              el.style.transitionProperty = "none";
              el.style.display = "none";
            }, 300);
          }
          case "maximized": {
            const margin = 10;
            el.style.transitionProperty = "all";
            el.style.transitionDuration = 300 + "ms";
            el.style.transform = `
              translateX(${margin}px) 
              translateY(${32 + margin}px)
            `;
            el.style.width = `${window.innerWidth - margin * 2}px`;
            el.style.height = `${window.innerHeight - margin * 2 - 140}px`;

            setTimeout(() => {
              el.style.transitionProperty = "none";
            }, 300);
          }
        }
      });
    },
    [wmState.instances, taskManager],
  );

  // Used on rightclick->open or doubleclick on app icon
  const requestAppOpen: WindowManagerContext["requestAppOpen"] = useCallback(
    (applicationName) => {
      const existingInstance = taskManager.existsInstanceOfApp(applicationName);
      if (!!existingInstance) {
        const winState = wmState.instances.find(
          (e) => e.instanceId === existingInstance.instanceId,
        )?.windowState;
        if (!winState) {
          throw new Error("No window state for instance");
        }

        winState.state = "floating";

        drawInstance(existingInstance.instanceId, true);
      } else {
        taskManager.createInstance(applicationName);
      }
    },
    [taskManager, wmState.instances, drawInstance],
  );

  const getWindowStateForInstance: WindowManagerContext["getWindowStateForInstance"] =
    useCallback(
      (instanceId) => {
        const instance = wmState.instances.find(
          (e) => e.instanceId === instanceId,
        );
        if (!instance) {
          throw new Error(
            `Couldn't get windowState for instance, because there is not instance with id: '${instanceId}'`,
          );
        }

        return instance.windowState;
      },
      [wmState.instances],
    );

  const contextValue = useMemo<WindowManagerContext>(
    () => ({
      instances: wmState.instances,
      requestAppOpen,
      getWindowStateForInstance,
      drawInstance,
    }),
    [
      wmState.instances,
      requestAppOpen,
      getWindowStateForInstance,
      drawInstance,
    ],
  );

  useEffect(() => {
    const newInstances = taskManager.instances
      .filter(
        (tmInstance) =>
          tmInstance.instanceId !==
          wmState.instances.find(
            (wmInstance) => wmInstance.instanceId === tmInstance.instanceId,
          )?.instanceId,
      )
      .filter(Boolean);

    setWmState((prev) => ({
      instances: [
        ...prev.instances,
        ...newInstances.map((instance) => ({
          instanceId: instance.instanceId,
          windowState: generateDefaultWindowState(),
        })),
      ],
    }));
    // eslint-disable-next-line
  }, [taskManager.instances]);

  return (
    <WindowManagerContext.Provider value={contextValue}>
      {props.children}
    </WindowManagerContext.Provider>
  );
}

export function useWindowManager() {
  return useContext(WindowManagerContext);
}
