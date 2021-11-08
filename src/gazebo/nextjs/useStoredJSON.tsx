import { isClientSide } from "@gazebo/nextjs/utils";
import { useCallback, useEffect, useState } from "react";

export const useStoredJSON = <T,>(
  key: string,
  initialValue: T
): [T, (x: T) => void] => {
  const [value, setValue_] = useState<T>(initialValue);

  useEffect(() => {
    if (isClientSide()) {
      const s = localStorage.getItem(key);
      if (s) {
        setValue_(JSON.parse(s));
      }
    }
  }, [key, setValue_]);

  const setValue = useCallback(
    (newValue: T) => {
      const newS = JSON.stringify(newValue, undefined, 2);
      localStorage.setItem(key, newS);
      setValue_(newValue);
    },
    [key, setValue_]
  );

  return [value, setValue];
};
