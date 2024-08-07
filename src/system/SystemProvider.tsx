import { ApplicationRegistryProvider } from "./applications/ApplicationRegistry";
import { TaskManagerContextProvider } from "./taskManager";
import { WindowManagerContextProvider } from "./windowManager/WindowManager";

export function SystemProvider(props: { children: React.ReactNode }) {
  return (
    <ApplicationRegistryProvider>
      <TaskManagerContextProvider>
        <WindowManagerContextProvider>
          {props.children}
        </WindowManagerContextProvider>
      </TaskManagerContextProvider>
    </ApplicationRegistryProvider>
  );
}
