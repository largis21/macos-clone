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
      className="w-[14px] h-[14px] rounded-full border-black/20 border box-content"
      onClick={props.onClick}
    >
      <span className="hidden group-hover:block">{props.icon}</span>
    </button>
  );
}

export function TrafficLights() {
  const windowContext = useWindowContext();

  const onClose = useCallback(() => {
    windowContext.close();
  }, [windowContext]);

  const onMinimize = useCallback(() => {
    windowContext.minimize();
  }, [windowContext]);

  const onZoom = useCallback(() => {
    windowContext.zoom()
  }, [windowContext])

  return (
    <div className="flex gap-2.5 group">
      <TrafficLight
        color="rgb(237, 106, 94)"
        onClick={onClose}
        icon={<CloseIcon />}
      />
      <TrafficLight
        color="rgb(245, 191, 79)"
        onClick={onMinimize}
        icon={<MinimizeIcon />}
      />
      <TrafficLight
        color="rgb(98, 197, 84)"
        onClick={onZoom}
        icon={<ZoomIcon />}
      />
    </div>
  );
}

function CloseIcon() {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 154 153"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="49.4853"
        y="41"
        width="88.528"
        height="12"
        transform="rotate(45 49.4853 41)"
        fill="#7F050A"
      />
      <rect
        x="41"
        y="103.599"
        width="88.528"
        height="12"
        transform="rotate(-45 41 103.599)"
        fill="#7F050A"
      />
    </svg>
  );
}

function MinimizeIcon() {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 154 153"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="28" y="70" width="97" height="13" fill="#9A5612" />
    </svg>
  );
}

function ZoomIcon() {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 154 153"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M39 114L40.5 115H95L39 58.5V114Z" fill="#0B650E" />
      <path d="M115 40L113.5 39L59 39L115 95.5L115 40Z" fill="#0B650E" />
    </svg>
  );
}
