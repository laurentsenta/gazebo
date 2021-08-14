import { ContentDemoPage } from "@c/DemoUtils";
import { BulmaTab } from "@c/link";
import { TabContent, TabHooks } from "@c/tabs";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";

const Page: NextPage = () => {
  const { query } = useRouter();

  const tab = query.tab

  return <ContentDemoPage title="React">
    <p>
      I love the web, we can do anything. But well... sometime it feels like we have to do EVERYTHING.<br />
      These are pieces of code you will find useful for a React web app. Do not bother looking for a library,
      just copy and paste these components code.
    </p>
    <hr />
    <div className="tabs">
      <ul>
        <BulmaTab href="?tab=hooks" isActive={(tab === 'hooks' || !tab)}>
          <a>
            <span>Hooks</span>
          </a>
        </BulmaTab>
        <BulmaTab href="?tab=content" isActive={(tab === 'content')}>
          <a>
            <span>Content</span>
          </a>
        </BulmaTab>
      </ul>
    </div>
    <div>
      {(tab === 'hooks' || !tab) && <TabHooks />}
      {(tab === 'content') && <TabContent />}
    </div>
  </ContentDemoPage>
};

export default Page;
