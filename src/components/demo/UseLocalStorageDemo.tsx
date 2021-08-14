import { useLocalStorage } from "@gazebo/react";
import React, { useCallback } from "react";

export const UseLocalStorageDemo: React.FC<{}> = ({ }) => {
    const [count, setCount] = useLocalStorage('gazebo-test-count', 0)

    const onClick = useCallback(() => {
        setCount(count + 1)
    }, [count, setCount])

    const onReset = useCallback(() => {
        setCount(0)
    }, [setCount])

    return <>
        <div className="level">
            <div className="level-item">
                <button className="button is-primary" onClick={onClick}>
                    Click Me
                </button>
            </div>
            <div className="level-item">
                <span className="tag is-light is-large">
                    Clicked: {count}
                </span>
            </div>
            <div className="level-item">
                <button className="button is-warning" onClick={onReset}>
                    Reset
                </button>
            </div>
        </div>
    </>
}
