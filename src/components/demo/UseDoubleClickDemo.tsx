import { useDoubleClick } from "@gazebo/react/useDoubleClick";
import React, { useCallback, useState } from "react";

export const UseDoubleClickDemo: React.FC<{ timeout?: number }> = ({ timeout }) => {
    const [click, setClick] = useState<number>(0)

    const onSimpleClick = useCallback(() => setClick(1), [setClick])
    const onDoubleClick = useCallback(() => setClick(2), [setClick])

    const onClick = useDoubleClick(onSimpleClick, onDoubleClick, timeout)

    return <div className="level">
        <div className="level-item">
            <button className="button is-primary" onClick={onClick}>
                Click Me
            </button>
        </div>
        <div className="level-item">
            {click === 0 ? 'Never Clicked' : click === 1 ? 'Simple Click' : 'Double Click'}
        </div>
    </div>
}