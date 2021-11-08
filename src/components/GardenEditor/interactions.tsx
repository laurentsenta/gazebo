import React, { useContext } from "react";
import { IBlock, IInternalLink } from "./types";

type ClickEvent = React.MouseEvent<Element, MouseEvent>;

export interface Interaction {
  onClickInternalLink: (
    event: ClickEvent,
    element: IInternalLink | IBlock
  ) => void;
  resolveURL: (element: IBlock | IInternalLink) => string;
}

const InteractionContext = React.createContext<Interaction | null>(null);

export const InteractionProvider = InteractionContext.Provider;

export const useInteraction = (): Interaction => {
  const x = useContext(InteractionContext);

  if (!x) {
    throw new Error("invalid provider");
  }

  return x;
};

export const noopInteraction = () => {
  const interaction: Interaction = {
    onClickInternalLink: (
      event: ClickEvent,
      element: IInternalLink | IBlock
    ) => { },
    resolveURL: function (element: IBlock | IInternalLink): string {
      return "#not-implemented";
    },
  };

  return interaction;
};
