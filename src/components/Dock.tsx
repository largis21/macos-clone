import {
  Application,
  useApplicationRegistry,
} from "@/system/applications/ApplicationRegistry";
import { useTaskManager } from "@/system/taskManager";
import { useWindowManager } from "@/system/windowManager/WindowManager";
import cn from "classnames";
import Image from "next/image";
import { useCallback } from "react";

export function Dock() {
  // const [dockApplications, setDockApplications] = useState(["safari"]);
  const appRegistry = useApplicationRegistry();

  return (
    <div className="absolute mx-auto left-0 right-0 bottom-3 w-fit h-[100px] bg-[rgb(25,23,5)]/80 backdrop-blur-[10px] border-[rgb(40,40,20)] border rounded-[1.5rem] z-50">
      {/* This div could be omitted but there are so many classes on the one above this is cleaner */}
      <div className="w-full h-full flex items-center px-4 pt-3 pb-5 gap-5">
        {appRegistry.applicationRegistry.map((app) => (
          <DockApp app={app} key={app.name} />
        ))}
      </div>
    </div>
  );
}

function DockApp(props: { app: Application }) {
  const windowManager = useWindowManager();
  const taskManager = useTaskManager();

  const onOpen = useCallback(() => {
    windowManager.requestAppOpen(props.app.name)
  }, [windowManager, props.app.name]);

  const active = taskManager.instances.find(
    (e) => e.application.name === props.app.name,
  );

  return (
    <div
      // This is used to get the dock icon position for the minimize animation
      id={`macos-dock-app-${props.app.name}`}
      className={cn(
        "h-full aspect-square rounded-2xl bg-gray-700/90 relative p-0 group select-none pointer-events-auto",
        active &&
          "after:block after:absolute after:w-[5px] after:h-[5px] after:left-0 after:right-0 after:mx-auto after:-bottom-4 after:bg-neutral-500 after:rounded-full",
      )}
    >
      <span
        className={cn(
          // Functional
          "absolute block opacity-0 left-0 right-0 mx-auto -top-12 group-hover:opacity-100 group-hover:-translate-y-2 transition-all pointer-events-none",
          // Visual
          "flex items-center justify-center whitespace-nowrap bg-[rgb(25,23,5)]/80 backdrop-blur-[10px] border-[rgb(40,40,20)] border text-white px-4 py-1 rounded-lg",
          // TODO: Add the notch (its a pain because of the border)
        )}
      >
        {props.app.title}
      </span>
      <button onClick={onOpen}>
        <Image
          src={props.app.iconURL}
          width={66}
          height={66}
          alt="logo"
          className="w-full h-full pointer-events-none"
        />
      </button>
    </div>
  );
}
