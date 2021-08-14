import { AtLeastWithMoreDemo } from "@c/demo/AtLeastWithMoreDemo";
import { JoinComaAndDemo } from "@c/demo/JoinComaAndDemo";
import { WithMaxLengthDemo } from "@c/demo/WithMaxLengthDemo";
import { CardDemo, CardDescription, ContentDemoPage } from "@c/DemoUtils";
import { observer } from "mobx-react-lite";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";

const Page: NextPage = observer(() => {
  const { query } = useRouter();

  const tab = query.tab

  return <ContentDemoPage title="Utilities">
    <p>
      I love the web, we can do anything. But well... sometime it feels like we have to do EVERYTHING.<br />
      These are pieces of code you will find useful for any web app.<br />
      These are all the tiny pieces of code you will write again and again for a real app. Just copy and paste.
    </p>
    <hr />
    <div className="columns is-multiline">
      <CardDemo title="With Max Length" demo="components/demo/WithMaxLengthDemo.tsx" code="gazebo/utils/text.ts">
        <CardDescription>
          Often you want to display text and add an ellpsis at end.
          This does just that, and counts correctly the number of characters.
        </CardDescription>
        <div className="block">
          <WithMaxLengthDemo />
        </div>
        <p className="has-text-grey">
        </p>
      </CardDemo>
      <CardDemo title="Join Coma And" demo="components/demo/JoinComaAndDemo.tsx" code="gazebo/utils/text.ts">
        <CardDescription>
          When you display a list of <em>things</em> to the user, this piece of code adds nice looking separators.
        </CardDescription>
        <div className="block">
          <JoinComaAndDemo />
        </div>
        <p className="has-text-grey">
        </p>
      </CardDemo>
      <CardDemo title="At Least With More" demo="components/demo/AtLeastWithMoreDemo.tsx" code="gazebo/utils/text.ts">
        <CardDescription>
          Another text manipulation, when you want to show <em>at least</em> x items, <em>and more</em> when needed.
        </CardDescription>
        <div className="block">
          <AtLeastWithMoreDemo />
        </div>
        <p className="has-text-grey">
        </p>
      </CardDemo>
    </div>
  </ContentDemoPage>
});

export default Page;
