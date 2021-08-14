import { withMaxLength } from "@gazebo/utils";
import React, { useState } from "react";

export const WithMaxLengthDemo: React.FC<{}> = () => {
    const [value, setValue] = useState('this is a very long text')

    return <>
        <div className="block">
            <input className="input" type="text" value={value} onChange={e => setValue(e.target.value)} />
        </div>
        <div className="block content">
            <ul>
                <li>
                    <span>{withMaxLength(value, 20)}</span>
                </li>
                <li>
                    <span>{withMaxLength(value, 20, ' and more')}</span>
                </li>
                <li>
                    <span>{withMaxLength(value, 20, '...')}</span>
                </li>
            </ul>
        </div>
    </>
}