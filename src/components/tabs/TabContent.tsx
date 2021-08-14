import { CardDemo, CardDescription, ExternalLink } from "@c/DemoUtils";
import { TextareaAutosize } from "@gazebo/react";
import { DoubleConfirmationButton } from "@gazebo/react/content/DoubleConfirmationButton";
import React, { useCallback } from "react";

export const TabContent: React.FC<{}> = () => {
    const onClick = useCallback(() => window.alert('Thanks for double clicking!'), [])

    return <div className="columns is-multiline">
        <CardDemo title="Double Confirmation Button" demo="tabs/TabContent.tsx#15" code="gazebo/react/content/DoubleConfirmationButton.tsx">
            <CardDescription>
                I really like this button: instead of showing a modal for a confirmation, just show a nice <em>are you sure</em> state.<br />
                This might be against some UX rule, but I find modals ugly and annoying. Especially when you try to
                delete multiple things at the same time.
            </CardDescription>
            <div className="block has-text-centered">
                <DoubleConfirmationButton className="button is-danger" onClick={onClick} timeout={1000}>
                    <>Click to show an alert.</>
                    <>Are you sure?</>
                </DoubleConfirmationButton>
            </div>
            <p className="has-text-grey">
                I use it on <ExternalLink href="https://whena.re/">whena.re</ExternalLink>: when
                you remove a user, there is a micro-interaction with this button.<br />
                An important improvement here would be to have a timeout so that if the user double click by mistake, we
                do not take this as a confirmation.
            </p>
        </CardDemo>
        <CardDemo title="Textarea that auto-resize" demo="tabs/TabContent.tsx#26" code="gazebo/react/content/TextareaAutosize.tsx">
            <CardDescription>
                This is a <em>egular</em> text area but it will resize itself when you type.
            </CardDescription>
            <div className="block">
                <TextareaAutosize className="textarea" placeholder="Tell me more... this will resize as you type." />
            </div>
            <p className="has-text-grey">
                I used this countless time in forms: one thing I find very important when I design a UI is that
                every component looks like it was designed exactly for the content it contains.<br />
                Weird whitespaces and overflow are ugly and that is often what you get when you go from <em>nice figma mockup</em> to <em>real use case</em>.
                This is helpful.
            </p>
        </CardDemo>
    </div>
}