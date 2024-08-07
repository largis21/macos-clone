"use client";

import cn from "classnames";
import { useWindowContext, WindowContextProvider } from "./WindowContext";
import { Resizeable } from "./Resizer";

export function Window(props: {
  instanceId: string;
  children: React.ReactNode;
}) {
  return (
    <WindowContextProvider instanceId={props.instanceId}>
      <InnerWindow id={props.instanceId}>{props.children}</InnerWindow>
    </WindowContextProvider>
  );
}

function InnerWindow(props: { children: React.ReactNode; id: string }) {
  const windowContext = useWindowContext();

  return (
    <Resizeable
      id={props.id}
      className={cn(
        "absolute z-10 translate-y-52 transform-gpu",
      )}
      ref={(el) => {
        if (el) windowContext.setWindowElement(el);
      }}
      onResize={windowContext.onResize}
    >
      <div className="h-full w-full relative border-neutral-600/90 border rounded-xl overflow-hidden">
        {props.children}
        </div>
    </Resizeable>
  );
}
