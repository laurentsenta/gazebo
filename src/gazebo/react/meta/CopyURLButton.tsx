import ClipboardJS from "clipboard";
import React, { useEffect } from "react";

// TODO: generate a random target id.
export const CopyURLButton: React.FC<{
  url: string;
  targetID?: string;
  title?: string;
}> = ({ url, targetID, title }) => {
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
            data-tooltip="Copy a link to this timezone"
            data-clipboard-target={`#${id}`}
          >
            <span className="icon is-small">
              <i className="fa fa-files-o"></i>
            </span>
          </button>
        </p>
      </div>
    </div>
  );
};
