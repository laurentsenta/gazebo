import Head from "next/head";
import React from "react";
import { Footer } from "./Footer";
import { Header } from "./Header";

const NEXT_PUBLIC_SITE_TITLE = process.env.NEXT_PUBLIC_SITE_TITLE
const NEXT_PUBLIC_SITE_DESCRIPTION = process.env.NEXT_PUBLIC_SITE_DESCRIPTION

export const MainPage: React.FC<{ isEditor?: boolean }> = ({ children, isEditor }) => {
  return (
    <>
      <Head>
        <title>{NEXT_PUBLIC_SITE_TITLE}</title>
        <meta name="description" content={NEXT_PUBLIC_SITE_DESCRIPTION} />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://pro.fontawesome.com/releases/v5.15.4/css/all.css"
          integrity="sha384-rqn26AG5Pj86AF4SO72RK5fyefcQ/x32DNQfChxWvbXIyXFePlEktwD18fEz+kQU"
          crossOrigin="anonymous"
        />
      </Head>
      <Header />
      {isEditor
        ? <>{children}</>
        : <div className="my-4">
          {children}
        </div>
      }
      <Footer />
    </>
  );
};
