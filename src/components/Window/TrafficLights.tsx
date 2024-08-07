import { useTaskManager } from "@/system/taskManager";
import { useCallback } from "react";
import { useWindowContext } from "./WindowContext";

function TrafficLight(props: {
  onClick: React.MouseEventHandler;
  color: string;
  icon: React.ReactNode;
}) {
  return (
    <button
      style={{ backgroundColor: props.color }}
      className="w-[14px] h-[14px] rounded-full"
      onClick={props.onClick}
    >
      {props.icon}
    </button>
  );
}

export function TrafficLights() {
  const windowContext = useWindowContext()
  const taskManager = useTaskManager()

  /* const onClose = useCallback(() => {
    taskManager.closeInstance(windowContext.instanceId)
  }, [windowContext., taskManager]) */

  const onMinimize = useCallback(() => {
    windowContext.minimize()
  }, [windowContext])

  return (
    <div className="flex gap-2.5 group">
      <TrafficLight color="rgb(237, 106, 94)" onClick={() => {}} />
      <TrafficLight color="rgb(245, 191, 79)" onClick={onMinimize} />
      <TrafficLight color="rgb(98, 197, 84)" />
    </div>
  );
}
