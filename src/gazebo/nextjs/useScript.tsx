import { RefObject, useEffect, useRef } from "react";

// https://github.com/vercel/next.js/issues/4477#issuecomment-655677351

export const useScript = (
    url: string,
    ref: RefObject<HTMLDivElement>,
    props: any
) => {
    useEffect(() => {
        const script = document.createElement("script");

        Object.entries(props).forEach(([k, v]) => {
            if (k === 'src') {
                return
            }
            // @ts-ignore
            script.setAttribute(k, v)
        })

        script.src = url;
        script.async = true;

        if (ref.current) {
            ref.current.appendChild(script);
        }

        return () => {
            ref.current?.removeChild(script);
        };
    }, [url, ref]);
};

export const ConvertScript: React.FC<any> = (props) => {
    const src = props.src;
    const ref = useRef<HTMLDivElement>(null);
    useScript(src, ref, props);
    return <div ref={ref}></div>
}