import { Window, DragArea, TrafficLights } from "@/components/Window";
import { defineApplication } from "@/system/applications/defineApplication";

export const ApplicationTerminal = defineApplication({
  name: "terminal",
  title: "Terminal",
  iconURL: "/terminal-icon.png",
  component: TerminalComponent,
});

export function TerminalComponent(applicationProps: { instanceId: string }) {
  return (
    <Window {...applicationProps}>
      <div className="flex flex-col h-full">
        <DragArea>
          <div className="h-full flex items-center justify-between px-3">
            <TrafficLights />
          </div>
        </DragArea>
        <div className="flex-grow bg-[rgb(40,40,40)]/85 backdrop-blur-[20px] transform-gpu">
        </div>
      </div>
    </Window>
  );
}
