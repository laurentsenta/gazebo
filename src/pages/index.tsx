import { ExternalLink } from "@c/DemoUtils";
import { MainPage } from "@c/MainPage";
import { ConvertScript } from "@gazebo/nextjs/useScript";
import type { NextPage } from "next";
import Link from "next/link";
import React from "react";

const NEXT_PUBLIC_CONVERTKIT_SCRIPT_SRC = process.env.NEXT_PUBLIC_CONVERTKIT_SCRIPT_SRC
const NEXT_PUBLIC_CONVERTKIT_DATA_UID = process.env.NEXT_PUBLIC_CONVERTKIT_DATA_UID

const GetStarted = () => {
  return (
    <Link href="/react">
      <a className="button is-medium is-primary" role="button" data-scroll="">
        <span>Check the React Components</span>
      </a>
    </Link>
  );
};

const Content = () => {
  return (
    <div className="p-4">
      <section className="hero is-medium">
        <div className="hero-body">
          <div className="container">
            <div className="columns is-vcentered is-centered">
              <div className="column has-text-centered is-8">
                <h1 className="title is-1">Gazebo, A loosely structured toolbox<br />for web app dev.</h1>
                <h2 className="subtitle my-3 is-5">
                  A portfolio of tools you may use to build webapps.<br />
                  <ExternalLink href="https://laurentsenta.com">me</ExternalLink> hope this helps.
                </h2>
              </div>
            </div>
            <div className="columns my-2">
              <div className="column has-text-centered">
                <GetStarted />
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="container">
        <div className="columns" id="benefits">
          <div className="column">
            <h2 className="title">
              Slate Editor,
            </h2>
            <p>
              A Slate Editor (not public yet).
              <br />
            </p>
          </div>
          <div className="column">
            <h2 className="title">
              React Components,
            </h2>
            <p>
              Lots of components I end up writing again and again.
            </p>
          </div>
          <div className="column">
            <h2 className="title">
              More…
            </h2>
            <p>
              Utilities and more.
            </p>
          </div>
        </div>
        <div className="columns is-vcentered is-centered my-4">
          <div className="column is-8">
            <ConvertScript async data-uid={NEXT_PUBLIC_CONVERTKIT_DATA_UID} src={NEXT_PUBLIC_CONVERTKIT_SCRIPT_SRC} />
          </div>
        </div>
      </div>
    </div>
  );
};


const Home: NextPage = () => {
  return (
    <MainPage>
      <main className="container">
        <Content />
      </main>
    </MainPage>
  );
};

export default Home;
