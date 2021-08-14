import { onAuthStateChanged } from "@firebase/auth";
import { useRouter } from "next/router";
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, FirebaseUser } from "./core";

export enum AuthStatus {
  none,
  loading,
  logged,
  anonymous,
}

interface IAuthData {
  status: AuthStatus;
  user?: FirebaseUser;
}

const authContext = createContext<IAuthData>({ status: AuthStatus.none });

const AuthContextProvider = authContext.Provider;

export const AuthProvider: React.FC<{}> = ({ children }) => {
  const [status, setStatus] = useState<IAuthData>({ status: AuthStatus.none });

  useEffect(() => {
    const user = auth.currentUser;

    if (!user) {
      setStatus({ status: AuthStatus.loading });
    } else {
      setStatus({ status: AuthStatus.logged, user });
    }

    const unsub = onAuthStateChanged(auth, (user: FirebaseUser | null) => {
      if (!user) {
        setStatus({ status: AuthStatus.anonymous });
      } else {
        setStatus({ status: AuthStatus.logged, user });
      }
    });

    return unsub;
  }, [setStatus]);

  return <AuthContextProvider value={status}>{children}</AuthContextProvider>;
};

const AuthenticationError = () => {
  return new Error("AuthenticationError");
};

export const useAuthStatus = (): AuthStatus => {
  const c = useContext(authContext);
  return c.status;
};

export const useUser = (): FirebaseUser => {
  const c = useContext(authContext);

  const { user } = c;

  if (!user) {
    throw AuthenticationError();
  }

  return user;
};

export const userUserId = (): string => {
  const u = useUser();
  return u.uid
}

interface IProps {
  loading?: boolean;
  anonymous?: boolean;
  logged?: boolean;
  none?: boolean;
}

export const AuthSwitch: React.FC<IProps> = ({
  loading,
  anonymous,
  logged,
  none,
  children,
}) => {
  const status = useAuthStatus();

  if (loading && status === AuthStatus.loading) {
    return <>{children}</>;
  }
  if (anonymous && status === AuthStatus.anonymous) {
    return <>{children}</>;
  }
  if (logged && status === AuthStatus.logged) {
    return <>{children}</>;
  }
  if (none && status === AuthStatus.none) {
    return <>{children}</>;
  }

  return null;
};

export const requireAuthenticatedUser = <P extends object>(
  Component: React.ComponentType<P>
) => {
  const C: React.FC<P> = (props) => {
    const authStatus = useAuthStatus();
    const router = useRouter();

    useEffect(() => {
      if (authStatus === AuthStatus.anonymous) {
        router.replace("/");
      }
    }, [authStatus, router]);

    if (authStatus === AuthStatus.none || authStatus === AuthStatus.loading) {
      return <p>Loading...</p>;
    }

    if (authStatus === AuthStatus.anonymous) {
      return <p>Redirecting...</p>;
    }

    return <Component {...props} />;
  };

  return C;
};
