import { useLayoutEffect, useState } from "react";
import { useWindowLayout } from "./useWindowLayout";

export const useCoordinates = (ref: any) => {
  const [offsets, setOffets] = useState<null | DOMRect>(null);
  const { scrolls, sizes } = useWindowLayout();

  useLayoutEffect(() => {
    const el = ref?.current;

    if (el) {
      setOffets(el.getBoundingClientRect() as DOMRect);
    }
  }, [ref, sizes, scrolls]);

  const position = offsets
    ? {
        left: offsets.left + scrolls.x,
        right: offsets.right + scrolls.x,
        top: offsets.top + scrolls.y,
        bottom: offsets.bottom + scrolls.y,
      }
    : null;

  return { offsets, scrolls, position };
};
