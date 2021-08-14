import { enableStaticRendering } from "mobx-react-lite";
import { NextApiRequest } from "next";

export const isServerSide = () => typeof window === "undefined";
export const isClientSide = () => !isServerSide();

export const withMobx = () => {
  enableStaticRendering(isServerSide());
};

export const pullBody = async (req: NextApiRequest): Promise<string> => {
  req.setEncoding("utf8");
  let data = "";

  return new Promise((resolve) => {
    req.on("data", (chunk: string) => {
      data += chunk;
    });
    req.on("end", () => {
      resolve(data);
    });
  });
};
