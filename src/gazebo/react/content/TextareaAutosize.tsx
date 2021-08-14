import autosize from "autosize";
import defaults from "lodash/defaults";
import pick from "lodash/pick";
import * as React from "react";
import {
  ChangeEvent,
  ChangeEventHandler,
  KeyboardEventHandler,
  useCallback,
  useEffect,
  useState
} from "react";

const RESIZED = "autosize:resized";

interface IProps {
  onChange?: ChangeEventHandler<HTMLTextAreaElement>;
  onKeyDown?: KeyboardEventHandler<HTMLTextAreaElement>;
  onResize?: (e: React.SyntheticEvent<HTMLTextAreaElement>) => void;
  style?: React.CSSProperties;
  className?: string;
  value?: string;
  placeholder?: string;
  name?: string;
  ref?: React.Ref<HTMLTextAreaElement>; // that's weird, this looks like a typing issue with our code.
  rows?: number;
}

export const TextareaAutosize: React.FC<IProps> = React.forwardRef(
  (props, ref: React.Ref<HTMLTextAreaElement> | null) => {
    const [textarea, setTextarea] = useState<HTMLTextAreaElement | null>(null);
    const { onResize, onChange } = props;

    const onResizeCallback = useCallback(
      (e) => {
        onResize && onResize(e);
      },
      [onResize]
    );

    const internalRef = useCallback(
      (x: HTMLTextAreaElement) => {
        setTextarea(x);

        if (ref) {
          if (typeof ref === "function") {
            ref(x);
          } else {
            // @ts-ignore
            ref.current = x;
          }
        }
      },
      [setTextarea, ref]
    );

    useEffect(() => {
      if (textarea) {
        autosize(textarea);
        textarea.addEventListener(RESIZED, onResizeCallback);
        autosize.update(textarea);
      }

      return () => {
        if (!textarea) {
          return;
        }

        textarea.removeEventListener(RESIZED, onResizeCallback);
        autosize.destroy(textarea);
      };
    }, [textarea, onResizeCallback]);

    const onChangeCallback = useCallback(
      (e: ChangeEvent<HTMLTextAreaElement>) => {
        onChange && onChange(e);
      },
      [onChange]
    );

    const more = defaults(
      pick(props, [
        "style",
        "className",
        "value",
        "placeholder",
        "name",
        "onKeyDown",
        "rows",
      ]),
      { rows: 1 }
    );

    return (
      <textarea onChange={onChangeCallback} ref={internalRef} {...more}>
        {props.children}
      </textarea>
    );
  }
);
