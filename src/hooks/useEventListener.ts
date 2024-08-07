import { type MutableRefObject, useEffect } from "react";

export function useEventListener(
  eventType: keyof DocumentEventMap,
  refOrQuery: MutableRefObject<HTMLElement | undefined | null> | string | "__document",
  cb: (..._: any) => any,
) {
  useEffect(() => {
    if (typeof refOrQuery === "string" && refOrQuery !== "__document") {
      const query = refOrQuery

      const element = document.querySelector(query)

      element?.addEventListener(eventType, cb)

      return () => {
        element?.removeEventListener(eventType, cb)
      }
    } else if (refOrQuery === "__document") {
      document?.addEventListener(eventType, cb)

      return () => {
        document?.removeEventListener(eventType, cb)
      }
    } else {
      const ref = refOrQuery

      ref.current?.addEventListener(eventType, cb)

      return () => {
        ref.current?.removeEventListener(eventType, cb)
      }
    }
  }, [refOrQuery, cb]);
}
