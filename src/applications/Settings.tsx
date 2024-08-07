import { Window, DragArea, TrafficLights } from "@/components/Window";
import { defineApplication } from "@/system/applications/defineApplication";

export const ApplicationSettings = defineApplication({
  name: "systemSettings",
  title: "Settings",
  iconURL: "/settings-icon.png",
  component: SettingsComponent,
});

export function SettingsComponent(applicationProps: { instanceId: string }) {
  return (
    <Window {...applicationProps}>
      <div className="flex flex-col h-full">
        <DragArea className="h-16 bg-neutral-800 border-b-black/80 border-b">
          <div className="h-full flex items-center justify-between px-5">
            <TrafficLights />
          </div>
        </DragArea>
        <div className="flex-grow bg-[rgb(40,40,40)]/85 backdrop-blur-[20px] transform-gpu"></div>
      </div>
    </Window>
  );
}
