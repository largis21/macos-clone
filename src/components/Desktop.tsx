"use client";

import Image from "next/image";
import { Dock } from "./Dock";
import { useTaskManager } from "@/system/taskManager";
import { useMemo } from "react";
import { useWindowManager } from "@/system/windowManager/WindowManager";

export function Desktop() {
  const taskManager = useTaskManager();
  const windowManager = useWindowManager();

  const applications = useMemo(() => {
    return windowManager.instances.map((instance) =>
      taskManager
        .getInstance(instance.instanceId)
        ?.application.renderApplication({
          instanceId: instance.instanceId,
        }),
    );
  }, [taskManager, windowManager.instances]);

  return (
    <div className="w-full h-full overflow-hidden pointer-events-none select-none">
      <Image
        src="/background.jpg"
        alt="Background image"
        priority
        width={3840}
        height={2160}
        quality={100}
        className="absolute w-full h-full object-cover brightness-[0.88] pointer-events-none select-none"
        onDragStart={(e) => e.preventDefault()}
      />

      <Dock />

      {applications}
    </div>
  );
}
