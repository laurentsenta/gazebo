import { CopyURLButton } from "@gazebo/react";
import React from "react";

export const CopyURLButtonDemo: React.FC<{ timeout?: number }> = ({ timeout }) => {
    return <div style={{ maxWidth: '300px', margin: 'auto' }} >
        <CopyURLButton url="https://gazebo.laurentsenta.com" tooltip="Copy a link to this amazing website" />
    </div>
}