import { UseDoubleClickDemo } from "@c/demo/UseDoubleClickDemo";
import { UseLocalStorageDemo } from "@c/demo/UseLocalStorageDemo";
import { CardDemo, CardDescription, ExternalLink } from "@c/DemoUtils";
import { OnlyClientSide } from "@gazebo/nextjs";
import React from "react";


export const TabHooks: React.FC<{}> = () => {
    return <div className="columns is-multiline">
        <CardDemo title="useDoubleClick" demo="components/demo/UseDoubleClickDemo.tsx" code="gazebo/react/useDoubleClick.ts">
            <CardDescription>
                This hook lets you add simple click and double click event to any dom element.
            </CardDescription>
            <UseDoubleClickDemo />
            <p className="has-text-grey">
                When you click on this component, it starts a timer. If you click a second
                time quickly, we register a double click. If the timer ends and the user
                clicked once then we register a single click. Simple.<br />
                The tricky part is to find the right balance for the timeout.
            </p>
            <div className="block">
                <h3 className="is-size-5 mt-3 mb-2">With a shorter timeout:</h3>
                <UseDoubleClickDemo timeout={120} />
                <h3 className="is-size-5 mt-3 mb-2">With a longer timeout:</h3>
                <UseDoubleClickDemo timeout={500} />
            </div>
        </CardDemo>
        <CardDemo title="useLocalStorage" demo="components/demo/UseLocalStorageDemo.tsx" code="gazebo/react/useLocalStorage.ts">
            <CardDescription>
                This hook is similar to <code>useState</code> but adds persistance thanks to local storage.<br />
                If you refresh this page the number of clicks will stay the same.
            </CardDescription>
            <OnlyClientSide>
                {/* Note that we have to render this only on client side. Because this would mess up nextjs. */}
                <UseLocalStorageDemo />
            </OnlyClientSide>
            <p className="has-text-grey">
                I use this for quick prototypes, when I want to store user inputs without taking out a database immediately.<br />
                I use it <ExternalLink href="https://whena.re/">whena.re</ExternalLink> too: if you have not visited
                the <em>Slack Integration</em> page you will see a notification badge in the navbar. It is simple and it
                does not require an account.<br />
                The only limitation is due to privacy feature in some browser which might break it.
            </p>
        </CardDemo>
    </div>
}