import { MainPage } from "@c/MainPage";
import { AuthStatus, useAuthStatus } from "@gazebo/firebase/auth";
import type { NextPage } from "next";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

const SignupForm = dynamic(
  () => {
    return import("@c/SignupForm");
  },
  { ssr: false }
);

const Signin: NextPage = () => {
  const authStatus = useAuthStatus();
  const router = useRouter();

  useEffect(() => {
    if (authStatus === AuthStatus.logged) {
      router.replace("/");
    }
  }, [authStatus, router]);

  return (
    <MainPage>
      <main className="container" style={{ maxWidth: '780px' }}>
        <div className="box">
          <section className="content ">
            <p>When you Register:</p>
            <ul>
              <li>
                The application will sync with our cloud platform.
                This is a regular application for now, data is protected but not encrypted yet.
              </li>
              <li>
                You will receive email updates & notifications of important
                changes.
              </li>
              <li>
                You can send me questions & requests at any time at laurent [at]
                singulargarden [dot] com.
              </li>
            </ul>
            <p>If you agree, please continue:</p>
          </section>
          <SignupForm />
        </div>
      </main>
    </MainPage>
  );
};

export default Signin;
