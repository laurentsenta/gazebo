import React from "react";
import ReactDOM from "react-dom";

// https://github.com/ianstormtaylor/slate/blob/main/site/components.tsx
export const Portal: React.FC = ({ children }) => {
  return typeof document === "object"
    ? ReactDOM.createPortal(children, document.body)
    : null;
};
