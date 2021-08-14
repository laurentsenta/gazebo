import React, { MouseEventHandler, useCallback, useEffect, useState } from "react";

export const useDoubleClick = (onSimpleClick: React.MouseEventHandler, onDoubleClick: React.MouseEventHandler, timeout = 200) => {
    const [lastEvent, setLastEvent] = useState<null | React.MouseEvent>(null)

    const onClick: MouseEventHandler<any> = useCallback((e) => {
        if (lastEvent) {
            onDoubleClick(e)
            setLastEvent(null)
        } else {
            setLastEvent(e)
        }
    }, [lastEvent, setLastEvent, onDoubleClick])

    useEffect(() => {
        if (lastEvent) {
            const r = setTimeout(() => {
                onSimpleClick(lastEvent)
                setLastEvent(null)
            }, timeout)

            return () => clearTimeout(r)
        }
    }, [lastEvent, onSimpleClick])

    return onClick
}