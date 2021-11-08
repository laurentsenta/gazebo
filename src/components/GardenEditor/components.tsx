import { Portal } from "@c/Portal";
import { useCoordinates } from "@gazebo/react/useCoordinates";
import React, { useCallback } from "react";
import { RenderElementProps, RenderLeafProps } from "slate-react";
import { useIsActive } from "../../gazebo/react/useIsActive";
import { useInteraction } from "./interactions";
import { IInternalLink, isBlock } from "./types";

export const Title: React.FC<RenderElementProps> = (props) => {
  return <h1 {...props.attributes}>{props.children}</h1>;
};

export const Code: React.FC<RenderElementProps> = (props) => {
  return (
    <pre {...props.attributes}>
      <code>{props.children}</code>
    </pre>
  );
};

export const Block: React.FC<RenderElementProps> = (props) => {
  const element = props.element;
  const i = useInteraction();

  // TODO: reword slate type system to use a generic instead.
  if (!isBlock(element)) {
    throw new Error("invalid element");
  }

  const { ref } = props.attributes;

  const { position } = useCoordinates(ref);

  const onClick: React.MouseEventHandler = useCallback(
    (event) => {
      return i.onClickInternalLink(event, element);
    },
    [i, element]
  );

  const url = i.resolveURL(element);
  const isActive = useIsActive();

  return (
    <>
      <div
        className={`block ${element.hasChanges ? "needs-refresh" : ""}`}
        {...props.attributes}
      >
        {props.children}
      </div>
      <Portal>
        {position && element.subject && (
          // TODO: Note this is a hackish way to get cascading in a portal. Refactor and clean this out.
          <div className={`garden-editor ${isActive ? "is-active" : "is-inactive"}`}>
            <div
              className={`block-subject`}
              style={{
                position: "absolute",
                left: position.left + 12,
                top: position.top - 10,
              }}
            >
              <a
                href={url}
                onClick={isActive ? (e) => e.preventDefault() : onClick}
              >
                {element.subject}
              </a>
            </div>
          </div>
        )}
      </Portal>
    </>
  );
};

export const InternalLink: React.FC<RenderElementProps> = (props) => {
  const e = props.element as IInternalLink;
  const { ref } = props.attributes;

  const i = useInteraction();
  const url = i.resolveURL(e);

  const onClick: React.MouseEventHandler = useCallback(
    (event) => {
      return i.onClickInternalLink(event, e);
    },
    [i, e]
  );

  const { position, offsets } = useCoordinates(ref);

  return (
    <>
      <a {...props.attributes} href={url} onClick={(e) => e.preventDefault()}>
        {props.children}
      </a>
      <Portal>
        {e.focused && offsets && position && url && (
          <div
            className="internallink-open"
            style={{
              position: "absolute",
              left: position.left,
              top: position.top - 30,
              width: offsets.width,
              transform: `translateY(-50%)`,
              zIndex: 10000,
            }}
          >
            <a className="button" href={url} onClick={onClick}>
              <span>{"Open"}</span>
            </a>
          </div>
        )}
      </Portal>
    </>
  );
};

export const Paragraph: React.FC<RenderElementProps> = (props) => {
  return <p {...props.attributes}>{props.children}</p>;
};

export const Leaf: React.FC<RenderLeafProps> = (props) => {
  return (
    <span
      {...props.attributes}
      style={{ fontWeight: props.leaf.bold ? "bold" : "normal" }}
    >
      {props.children}
    </span>
  );
};
