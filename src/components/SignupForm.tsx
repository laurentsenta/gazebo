import { FirebaseUser, FIREBASE_CONFIG } from "@gazebo/firebase/core";
import firebaseui from "firebaseui";
import Head from "next/head";
import Script from 'next/script';
import React, { useCallback, useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    firebase: any;
    _hack_firebase_ui: any;
    firebaseui: any;
  }
}

const loadAuthUI = (container: HTMLDivElement, signInSuccessUrl: string = '/') => {
  const signInFlow = "popup"

  const uiConfig: firebaseui.auth.Config = {
    callbacks: {
      signInSuccessWithAuthResult: function (authResult) {
        const user = authResult.user as FirebaseUser;
        const isNewUser = authResult.additionalUserInfo.isNewUser;
        //     if (onSignIn) {
        //       onSignIn(user)
        //       return false
        //     }
        //     const params = new URLSearchParams(window.location.search)
        //     if (params.has('after')) {
        //       // @ts-ignore: TODO: fix that using the firebase config, see below
        //       window.location = params.get('after')
        //       return false
        //     }
        //     return true
        // Do something with the returned AuthResult.
        // Return type determines whether we continue the redirect automatically
        // or whether we leave that to developer to handle.
        return true;
      },
      // signInFailure: function (error) {
      //   // Some unrecoverable error occurred during sign-in.
      //   // Return a promise when error handling is completed and FirebaseUI
      //   // will reset, clearing any UI. This commonly occurs for error code
      //   // 'firebaseui/anonymous-upgrade-merge-conflict' when merge conflict
      //   // occurs. Check below for more details on this.
      //   // return handleUIError(error);
      // },
      // uiShown: () => (loading = false),
    },
    // disabling for moment if it makes harder with redirect (is ok if works through popup)
    // credentialHelper: firebaseui.auth.CredentialHelper.NONE,
    // tosUrl: '/terms-of-service',
    // privacyPolicyUrl: '/privacy-policy',
    signInFlow,
    signInSuccessUrl,
    signInOptions: [
      window.firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      {
        // emailLinkSignIn: () => ({
        //   // TODO: according to firebase ui doc there's a mode + signinSuccessUrl overload, I couldn't make it work.
        //   url: `${window.location.href}?after=${signInSuccessUrl}`
        // }),
        provider: window.firebase.auth.EmailAuthProvider.PROVIDER_ID,
        signInMethod: window.firebase.auth.EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD,
      },
    ],
  };

  if (window._hack_firebase_ui) {
    window._hack_firebase_ui.reset();
    window._hack_firebase_ui.start(container, uiConfig);
  } else {
    window._hack_firebase_ui = new window.firebaseui.auth.AuthUI(window.firebase.auth());
    window._hack_firebase_ui.start(container, uiConfig);
  }
}

const AuthUI = () => {
  const [loaded, setLoaded] = useState(0)
  const [loading, setLoading] = useState(false)
  const ref = useRef<HTMLDivElement | null>(null)

  const onLoad = useCallback(() => setLoaded(x => x + 1), [setLoaded])

  useEffect(() => {
    if (ref.current && (loaded > 2 || !!window._hack_firebase_ui) && window && window.firebase && window.firebase.apps) {
      if (window.firebase.apps.length === 0) {
        window.firebase.initializeApp(FIREBASE_CONFIG);
      }
      loadAuthUI(ref.current)
      setLoading(false)
    }
  }, [loaded, ref])

  return <>
    <Script type="text/javascript" src="https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js" onLoad={onLoad} />
    <Script type="text/javascript" src="https://www.gstatic.com/firebasejs/8.10.0/firebase-auth.js" onLoad={onLoad} />
    <Script type="text/javascript" src="https://www.gstatic.com/firebasejs/ui/4.8.1/firebase-ui-auth.js" onLoad={onLoad} />
    <Head>
      <link type="text/css" rel="stylesheet" href="https://www.gstatic.com/firebasejs/ui/4.8.1/firebase-ui-auth.css" />
    </Head>
    <div ref={ref} />
  </>
}

const SignUpForm: React.FC = () => {
  return (
    <AuthUI />
  );
};

export default SignUpForm;
