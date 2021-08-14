import { useJSONState } from "@c/DemoUtils";
import { atLeastWithMore, joinComaAndAnd } from "@gazebo/utils";
import React from "react";

export const JoinComaAndDemo: React.FC<{}> = () => {
  const [value, setValue, jsonValue] = useJSONState(['Aaron', 'Bob', 'Charlie', 'Danny', "Elen", "Francis", "Gary"])

  return <>
    <div className="block">
      <input className="input" type="text" value={value} onChange={e => setValue(e.target.value)} />
    </div>
    <div className="block content">
      <ul>
        <li>
          <span>{JSON.stringify(joinComaAndAnd(jsonValue, ', ', ' and '), undefined, 2)}</span>
        </li>
        <li>
          <span>{JSON.stringify(joinComaAndAnd(jsonValue, ', ', ' and '), undefined, 2)}</span>
        </li>
        <li>
          <span>{JSON.stringify(joinComaAndAnd(atLeastWithMore(jsonValue, 3, 'more'), ', ', ' and '), undefined, 2)}</span>
        </li>
      </ul>
    </div>
  </>
}