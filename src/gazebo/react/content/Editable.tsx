import classNames from "classnames";
// TODO: imports used for typing throw a unused var error. find a solution
// eslint-disable-next-line no-unused-vars
import React, {
  ChangeEventHandler,
  CSSProperties,
  KeyboardEventHandler
} from "react";
import { TextareaAutosize } from "./TextareaAutosize";

const STYLE: CSSProperties = {
  border: "none",
  borderRadius: 0,
  backgroundColor: "transparent",
  resize: "none",
  outline: "none",
};

interface IProps<T> {
  name: string;
  value: any;
  className?: string;
  type?: string;
  onChange: ChangeEventHandler<T>;
  onKeyDown?: KeyboardEventHandler<T>;
  placeholder?: string;
  rows?: number;
}

export const ContentEditableInlineInput = React.forwardRef(
  (props: IProps<HTMLInputElement>, ref: React.Ref<HTMLInputElement>) => {
    const { value, type, className, name, onChange, onKeyDown, placeholder } =
      props;
    const className_ = classNames({ empty: !value, ContentEditable: true });

    return (
      <input
        type={type || "text"}
        className={`${className_} ${className || ""}`}
        ref={ref}
        style={{ width: (value.toString().length + 4) * 0.6 + `em` }}
        onChange={onChange}
        onKeyDown={onKeyDown}
        name={name}
        value={value}
        placeholder={placeholder}
      />
    );
  }
);

export const EditableP = React.forwardRef(
  (props: IProps<HTMLTextAreaElement>, ref: React.Ref<HTMLTextAreaElement>) => {
    const { value, name, placeholder, onChange, onKeyDown, rows } = props;
    const className = classNames({
      empty: !value,
      Editable: true,
      EditableP: true,
    });

    return (
      <TextareaAutosize
        className={className}
        style={STYLE}
        ref={ref}
        value={value}
        placeholder={placeholder}
        name={name}
        onChange={onChange}
        onKeyDown={onKeyDown}
        rows={rows}
      />
    );
  }
);

export const EditableH2 = React.forwardRef(
  (props: IProps<HTMLTextAreaElement>, ref: React.Ref<HTMLTextAreaElement>) => {
    const { value, name, placeholder, onChange, onKeyDown, rows } = props;
    const className = classNames({
      empty: !value,
      Editable: true,
      EditableH2: true,
    });

    return (
      <TextareaAutosize
        className={className}
        style={STYLE}
        ref={ref}
        value={value}
        placeholder={placeholder}
        name={name}
        onChange={onChange}
        onKeyDown={onKeyDown}
        rows={rows}
      />
    );
  }
);

export const EditableH1 = React.forwardRef(
  (props: IProps<HTMLTextAreaElement>, ref: React.Ref<HTMLTextAreaElement>) => {
    const { value, name, placeholder, onChange, onKeyDown, rows } = props;
    const className = classNames({
      empty: !value,
      Editable: true,
      EditableH1: true,
    });

    return (
      <TextareaAutosize
        className={className}
        style={STYLE}
        ref={ref}
        value={value}
        placeholder={placeholder}
        name={name}
        onChange={onChange}
        onKeyDown={onKeyDown}
        rows={rows}
      />
    );
  }
);
