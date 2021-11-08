import React, { useContext, useEffect, useState } from "react";

const activityContext = React.createContext(false);

export const ActivityProvider = activityContext.Provider;

export const useIsActive = () => {
  return useContext(activityContext);
};

export const useActivitySignal = (
  inactivityTimeout: number = 700
): [boolean, () => void] => {
  const [lastInteraction, setLastInteraction_] = useState(0);
  const [isInactive, setIsInactive] = useState(false);

  const setLastInteraction = () => setLastInteraction_(Date.now());

  useEffect(() => {
    if (lastInteraction === 0) {
      return;
    }

    setIsInactive(false);

    const timer = window.setTimeout(() => {
      setIsInactive(true);
    }, inactivityTimeout);

    return () => window.clearTimeout(timer);
  }, [lastInteraction, inactivityTimeout]);

  return [!isInactive, setLastInteraction];
};
