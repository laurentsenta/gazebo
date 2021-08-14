import { TimeStore } from "@gazebo/mobx";
import React, { createContext, useContext, useMemo } from "react";

export class RootStore {
  public readonly timeStore: TimeStore;

  constructor() {
    this.timeStore = new TimeStore();
  }
}

// https://github.com/vercel/next.js/blob/master/examples/with-mobx/store.js
let store: RootStore | undefined;

function initializeStore(initialData = null) {
  const _store = store ?? new RootStore(/* initialData */);

  // If your page has Next.js data fetching methods that use a Mobx store, it will
  // get hydrated here, check `pages/ssg.js` and `pages/ssr.js` for more details
  if (initialData) {
    // _store.hydrate(initialData)
  }

  // For SSG and SSR always create a new store
  if (typeof window === "undefined") {
    return _store;
  }
  // Create the store once in the client
  if (!store) {
    store = _store;
  }

  return _store;
}

export const RootStoreProvider: React.FC<{}> = ({ children }) => {
  const store = useMemo(() => initializeStore(), []);

  return <Provider value={store}>{children}</Provider>;
};

const RootStoreContext = createContext<RootStore | null>(null);

const Provider = RootStoreContext.Provider;

export const useRootStore = (): RootStore => {
  const c = useContext(RootStoreContext);

  if (!c) {
    throw new Error("Invalid Context: Missing Root Store");
  }

  return c;
};