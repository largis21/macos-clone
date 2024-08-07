"use client"

import { Desktop } from "@/components/Desktop";
import { MenuBar } from "@/components/MenuBar";
import { ScreenOverlay } from "@/components/ScreenOverlay";
import { SystemProvider } from "@/system/SystemProvider";

export default function Home() {
  return (
    <div className="w-screen h-screen overflow-hidden">
      <ScreenOverlay />
      <SystemProvider>
        <Desktop />
        <MenuBar />
      </SystemProvider>
    </div>
  );
}

