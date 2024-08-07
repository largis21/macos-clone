import cn from "classnames"

const notchClassesBefore = "before:absolute before:w-2 before:h-4 before:block before:rounded-tr-full before:right-full before:shadow-[0_-8px_0_0_black]"
const notchClassesAfter = "after:absolute after:w-2 after:h-4 after:block after:rounded-tl-full after:left-full after:shadow-[0_-8px_0_0_black]"

export function ScreenOverlay() {
  return (
    <div className="absolute top-0 w-full h-[40px] z-50 flex justify-between">
      {/* hacky but ok */}
      <div className="h-full aspect-square shadow-[22px_22px_0_0_black] rounded-full rotate-180" />

      <div className={cn("w-[220px] h-[90%] bg-black relative rounded-b-xl", notchClassesBefore, notchClassesAfter)} />

      <div className="h-full aspect-square shadow-[22px_22px_0_0_black] rounded-full rotate-[-90deg]" />
    </div>
  );
}
