import ClipboardJS from "clipboard";
import React, { useEffect } from "react";

// TODO: generate a random target id.
export const CopyURLButton: React.FC<{
  url: string;
  targetID?: string;
  title?: string;
  tooltip?: string;
}> = ({ url, targetID, title, tooltip }) => {
  useEffect(() => {
    const clipboard = new ClipboardJS(".copyToClipboard");
    return () => clipboard.destroy();
  }, []);

  const id = targetID || "shareURL";

  return (
    <div className="CopyURLButton">
      {title ? <p className="title has-text-centered">{title}</p> : null}
      <div className="field has-addons">
        <p className="control is-expanded">
          <input
            id={id}
            className="input is-primary"
            type="text"
            value={url}
            readOnly={true}
          />
        </p>
        <p className="control">
          <button
            className="button is-primary is-outlined copyToClipboard"
            data-tooltip={tooltip}
            data-clipboard-target={`#${id}`}
          >
            <span className="icon is-small">
              <i className="fa fa-copy"></i>
            </span>
          </button>
        </p>
      </div>
    </div>
  );
};
