import { signout } from "@gazebo/firebase";
import { AuthSwitch, userUserId as useUserId } from "@gazebo/firebase/auth";
import { HideInProd } from "@gazebo/release";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useCallback, useState } from "react";
import { ExternalLink } from "./DemoUtils";
import { BulmaLink } from "./link";

const NEXT_PUBLIC_SITE_TITLE = process.env.NEXT_PUBLIC_SITE_TITLE;
const NEXT_PUBLIC_APP_VERSION = "0.1.0";

const PublicGarden = () => {
  const userId = useUserId();

  return (
    <BulmaLink href={`/user/${userId}`}>
      <a className="navbar-item">Public Garden</a>
    </BulmaLink>
  );
};

export const Header: React.FC = () => {
  const [visible, setVisible] = useState(false);

  const router = useRouter();

  const doSignout = useCallback(async () => {
    await signout();
    router.replace("/");
  }, [router]);

  const toggle = useCallback(() => {
    setVisible((x) => !x);
  }, [setVisible]);

  return (
    <nav
      className="navbar is-light"
      role="navigation"
      aria-label="main navigation"
    >
      <div className="container">
        <div className="navbar-brand">
          <Link href="/">
            <a className="navbar-item">
              <img src="/logo.png" width="32" height="32" />
              <span>{NEXT_PUBLIC_SITE_TITLE}</span>
            </a>
          </Link>
          <a
            role="button"
            className={`navbar-burger ${visible ? "is-active" : ""}`}
            aria-label="menu"
            aria-expanded="false"
            onClick={toggle}
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>
        <div className={`navbar-menu ${visible ? "is-active" : ""}`}>
          <div className="navbar-start">
            <BulmaLink href="/theme">
              <a className="navbar-item">Theme</a>
            </BulmaLink>
            <BulmaLink href="/slate">
              <a className="navbar-item">Slate</a>
            </BulmaLink>
            <BulmaLink href="/react">
              <a className="navbar-item">React</a>
            </BulmaLink>
            <BulmaLink href="/utils">
              <a className="navbar-item">Utils</a>
            </BulmaLink>
          </div>
          <div className="navbar-end">
            <AuthSwitch logged>
              <PublicGarden />
            </AuthSwitch>
            <HideInProd>
              <AuthSwitch logged>
                <BulmaLink href="/account">
                  <a className="navbar-item">Account</a>
                </BulmaLink>
              </AuthSwitch>
            </HideInProd>
            <ExternalLink
              href="https://github.com/laurentsenta/gazebo"
              className="navbar-item"
            >
              <i className="fab fa-github"></i>
            </ExternalLink>
            <div className={`navbar-item has-dropdown is-hoverable`}>
              <a className="navbar-link">
                <i className="fas fa-cog"></i>
              </a>
              <div className="navbar-dropdown is-right">
                <div className="navbar-item">
                  <AuthSwitch none loading>
                    <button
                      className="button is-small is-primary is-light is-loading"
                      style={{ width: "100%" }}
                    >
                      Loading
                    </button>
                  </AuthSwitch>
                  <AuthSwitch anonymous>
                    <BulmaLink href="/signin">
                      <a
                        className="button is-small is-primary"
                        style={{ width: "100%" }}
                      >
                        <strong>Sign up</strong>
                      </a>
                    </BulmaLink>
                  </AuthSwitch>
                  <AuthSwitch logged>
                    <button
                      className="button is-small is-primary is-light"
                      style={{ width: "100%" }}
                      onClick={doSignout}
                    >
                      Signout
                    </button>
                  </AuthSwitch>
                </div>
                <hr className="navbar-divider" />
                <div className="navbar-item">
                  Version {NEXT_PUBLIC_APP_VERSION}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
