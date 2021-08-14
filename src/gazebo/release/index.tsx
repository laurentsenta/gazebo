import isString from "lodash-es/isString";
import React, { useCallback, useContext, useState } from "react";


export type ReleaseEnv = 'dev' | 'test' | 'staging' | 'prod'

export const isReleaseEnv = (x: any): x is ReleaseEnv => {
    return isString(x) && ['dev', 'test', 'staging', 'prod'].includes(x)
}

export interface IReleaseMode {
    env: ReleaseEnv
    currentEnv: ReleaseEnv
}

type SetMode = React.Dispatch<React.SetStateAction<IReleaseMode>>

export interface IReleaseContext {
    mode: IReleaseMode
    setMode: SetMode
}

const releaseModeContext = React.createContext<IReleaseContext | null>(null)

const P = releaseModeContext.Provider;

export const ToggleReleaseMode: React.FC = () => {
    const { mode, setMode } = useReleaseContext()

    const toggle = useCallback(() => {
        setMode(x => {
            if (x.currentEnv === x.env) {
                if (x.env === 'prod') {
                    return { ...x, currentEnv: 'dev' }
                } else {
                    return { ...x, currentEnv: 'prod' }
                }
            } else {
                return { ...x, currentEnv: x.env }
            }
        })
    }, [setMode])

    return <HideInActualProd>
        <button className={`button floating ${mode.currentEnv === 'prod' ? 'is-primary' : 'is-outlined'}`} onClick={toggle}>
            {mode.currentEnv}
        </button>
    </HideInActualProd>
}

export const ReleaseModeProvider: React.FC<{ env: ReleaseEnv }> = ({ env, children }) => {
    const [mode, setMode] = useState<IReleaseMode>({ env, currentEnv: env })

    return <P value={{ mode, setMode: setMode }}>
        {children}
    </P>
}
const useReleaseContext = (): IReleaseContext => {
    const r = useContext(releaseModeContext)
    if (!r) {
        throw new Error('missing release mode')
    }
    return r
}

const useReleaseMode = (): IReleaseMode => {
    return useReleaseContext().mode
}

export const ShowInRelease: React.FC<{ dev?: boolean }> = ({ dev, children }) => {
    const r = useReleaseMode()

    if (r.currentEnv === 'dev') {
        return <>{children}</>
    }

    return null
}

export const HideInActualProd: React.FC = ({ children }) => {
    const r = useReleaseMode()

    if (r.env === 'dev') {
        return <>{children}</>
    }

    return null
}

export const HideInProd: React.FC = ({ children }) => {
    return <ShowInRelease dev>
        {children}
    </ShowInRelease>
}