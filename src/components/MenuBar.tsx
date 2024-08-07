import { AppleLogo } from "@/icons/AppleLogo";

export function MenuBar(props: {}) {
  return (
    <div
      className="absolute w-full top-0 h-8 bg-white/50 backdrop-blur-[50px] --shadow-sm --shadow-black/5 flex items-center justify-between px-5"
      style={{}}
    >
      <div className="h-full">
        <MenuBarLeft />
      </div>
    </div>
  );
}

function MenuBarLeft() {
  return (
    <div className="flex items-center gap-2 h-full">
      <AppleLogo height={18} className="pr-5"/>
      <button className="h-fit font-bold leading-[16px]">
        Finder
      </button>
    </div>
  );
}
