import { useEffect, useState } from "react";
import { isClientSide } from "./utils";

export interface ConditionallyRenderProps {
  client?: boolean;
  server?: boolean;
}

export const ConditionallyRender: React.FC<ConditionallyRenderProps> = (
  { client, server, children }
) => {
  // https://github.com/vercel/next.js/issues/2473#issuecomment-587551234
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => setIsMounted(isClientSide() && true), []);

  if (!isMounted && !server) {
    return null;
  }

  if (isMounted && !client) {
    return null;
  }

  return <>{children}</>
};

export const OnlyClientSide: React.FC<{}> = ({ children }) => (
  <ConditionallyRender client>
    {children}
  </ConditionallyRender>
)