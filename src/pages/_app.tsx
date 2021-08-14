import { AuthProvider } from "@gazebo/firebase/auth";
import { withMobx } from "@gazebo/nextjs/utils";
import { isReleaseEnv, ReleaseModeProvider } from "@gazebo/release";
import { RootStoreProvider } from "@store";
import "intro.js/introjs.css";
import { enableStaticRendering } from "mobx-react-lite";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { analytics } from "src/analytics";
import "../styles/global.scss";
import "../styles/SignupForm.scss";

enableStaticRendering(typeof window === "undefined");

withMobx()

const NEXT_PUBLIC_RELEASE_MODE = process.env.NEXT_PUBLIC_RELEASE_MODE;

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  if (!isReleaseEnv(NEXT_PUBLIC_RELEASE_MODE)) {
    throw new Error(`missing or invalid release env: ${NEXT_PUBLIC_RELEASE_MODE}`)
  }

  const router = useRouter()

  useEffect(() => {
    router.events.on('routeChangeComplete', () => {
      analytics.page()
    })
  })

  return (
    <ReleaseModeProvider env={NEXT_PUBLIC_RELEASE_MODE}>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <RootStoreProvider>
            <DndProvider backend={HTML5Backend}>
              <Component {...pageProps} />
            </DndProvider>
          </RootStoreProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </AuthProvider>
    </ReleaseModeProvider >
  );
}
export default MyApp;
