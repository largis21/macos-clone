import { Window, DragArea, TrafficLights } from "@/components/Window";
import { defineApplication } from "@/system/applications/defineApplication";

export const ApplicationSettings = defineApplication({
  name: "systemSettings",
  title: "Settings",
  iconURL: "/safari-logo.png",
  component: SettingsComponent
})

export function SettingsComponent(applicationProps: { instanceId: string }) {
  return (
    <Window {...applicationProps}>
      <DragArea>
        <div className="h-full flex items-center justify-between px-5">
          <TrafficLights />
        </div>
      </DragArea>
      <div className="h-[40rem] bg-[rgb(40,40,40)]/85 backdrop-blur-[20px] transform-gpu"></div>
    </Window>
  );
}
