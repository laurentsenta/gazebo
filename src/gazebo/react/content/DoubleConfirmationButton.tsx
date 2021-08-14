import React, { useCallback, useEffect, useState } from "react";

export const DoubleConfirmationButton: React.FC<{
  children: [any, any];
  className: string;
  onClick: () => void;
  timeout: number;
}> = (props) => {
  const { className, children, timeout } = props;
  const [clicked, setClicked] = useState(false);

  const onClick = useCallback(() => {
    if (clicked) {
      props.onClick();
      setClicked(false);
    } else {
      setClicked(true);
    }
  }, [clicked, setClicked, props.onClick]);

  useEffect(() => {
    if (clicked) {
      const x = setTimeout(() => {
        setClicked(false);
      }, timeout);
      return () => clearTimeout(x);
    }
  }, [clicked, timeout]);

  return (
    <button className={className} onClick={onClick}>
      {clicked ? children[1] : children[0]}
    </button>
  );
};
