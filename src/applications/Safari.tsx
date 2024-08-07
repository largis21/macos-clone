import { Window, DragArea, TrafficLights } from "@/components/Window";
import { defineApplication } from "@/system/applications/defineApplication";

export const ApplicationSafari = defineApplication({
  name: "safari",
  title: "Safari",
  iconURL: "/safari-icon.png",
  component: SafariComponent,
});

export function SafariComponent(applicationProps: { instanceId: string }) {
  return (
    <Window {...applicationProps}>
      <div className="flex flex-col h-full">
        <DragArea>
          <div className="h-full flex items-center justify-between px-5">
            <TrafficLights />
          </div>
        </DragArea>
        <div className="flex-grow bg-[rgb(40,40,40)]/85 backdrop-blur-[20px] transform-gpu"></div>
      </div>
    </Window>
  );
}
