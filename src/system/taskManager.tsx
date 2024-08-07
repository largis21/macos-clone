import { generateUUID } from "@/lib/generateUUID";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import {
  Application,
  useApplicationRegistry,
} from "./applications/ApplicationRegistry";
import { debug } from "@/debug";

type Instance = {
  instanceId: string;
  application: Application;
};

export type TaskManagerContext = {
  instances: Instance[];
  createInstance: (applicationName: string) => Instance;
  closeInstance: (instanceId: string) => any;
  getInstance: (instanceId: string) => Instance | null;
  existsInstanceOfApp: (applicationName: string) => Instance | false;
};

const TaskManagerContext = createContext<TaskManagerContext>(null as any);

export function TaskManagerContextProvider(props: {
  children: React.ReactNode;
}) {
  const [instances, setInstances] = useState<Instance[]>([]);
  const { applicationRegistry } = useApplicationRegistry();

  const createInstance: TaskManagerContext["createInstance"] = useCallback(
    (applicationName) => {
      const application = applicationRegistry.find(
        (e) => e.name === applicationName,
      );
      if (!application) {
        throw new Error(`Could not find application: '${applicationName}'`);
      }

      const newInstance: Instance = {
        instanceId: generateUUID(),
        application: application,
      };

      debug.log("Created new instance: ", newInstance)

      setInstances((prev) => [...prev, newInstance]);

      return newInstance;
    },
    [applicationRegistry],
  );

  const closeInstance: TaskManagerContext["closeInstance"] = useCallback(
    (instanceId) => {
      const instance = instances.find((e) => e.instanceId === instanceId);
      if (!instance) {
        throw new Error(`Could not find instance: '${instanceId}'`);
      }

      setInstances((prev) => prev.filter((e) => e.instanceId !== instanceId));
    },
    [instances],
  );

  const getInstance: TaskManagerContext["getInstance"] = useCallback(
    (instanceId) => {
      return instances.find((e) => e.instanceId === instanceId) || null;
    },
    [instances],
  );

  const existsInstanceOfApp: TaskManagerContext["existsInstanceOfApp"] =
    useCallback(
      (applicationName) => {
        return instances.find((e) => e.application.name === applicationName) || false
      },
      [instances],
    );

  const contextValue = useMemo<TaskManagerContext>(
    () => ({
      instances,
      createInstance,
      closeInstance,
      getInstance,
      existsInstanceOfApp,
    }),
    [
      instances,
      createInstance,
      closeInstance,
      getInstance,
      existsInstanceOfApp,
    ],
  );

  return (
    <TaskManagerContext.Provider value={contextValue}>
      {props.children}
    </TaskManagerContext.Provider>
  );
}

export function useTaskManager() {
  return useContext(TaskManagerContext);
}

export function useInstance(instanceId: string) {
  const taskManager = useTaskManager();

  const close = useCallback(
    () => taskManager.closeInstance(instanceId),
    [taskManager, instanceId],
  );

  return useMemo(
    () => ({
      instance: taskManager.getInstance(instanceId),
      close,
    }),
    [taskManager, close, instanceId],
  );
}
