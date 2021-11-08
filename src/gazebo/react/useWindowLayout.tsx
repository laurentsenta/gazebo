import { isClientSide, isServerSide } from "@gazebo/nextjs/utils";
import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react";

const xy = (x: number, y: number) => ({ x, y });

// TODO: Deal with dom changes to trigger a new layout event.
export const useWindowLayout = () => {
  const [scrolls, setScrolls] = useState(
    isServerSide() ? xy(1, 1) : xy(window.scrollX, window.scrollY)
  );
  const [sizes, setSizes] = useState(
    isServerSide() ? xy(1, 1) : xy(window.innerWidth, window.innerHeight)
  );

  const onLayout = useCallback(() => {
    setScrolls(xy(window.scrollX, window.scrollY));
    setSizes(xy(window.innerWidth, window.innerHeight));
  }, [setScrolls, setSizes]);

  const observer = useMemo(() => isClientSide() ? new MutationObserver(mutation => {
    onLayout()
  }) : null, [onLayout]);

  useEffect(() => {
    const ob = observer?.observe(document.body, {
      childList: true,
      attributes: true,
      subtree: true,
      characterData: true
    });
    return () => observer?.disconnect()
  })

  useLayoutEffect(() => {
    window.addEventListener("resize", onLayout);
    return () => window.removeEventListener("resize", onLayout);
  }, [onLayout]);

  return { scrolls, sizes };
};
