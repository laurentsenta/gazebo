import { CardDemo, ContentDemoPage } from "@c/DemoUtils";
import { GardenEditor } from "@c/GardenEditor";
import { baseBlock, baseParagraph } from "@c/GardenEditor/blocks";
import {
  InteractionProvider,
  noopInteraction
} from "@c/GardenEditor/interactions";
import { DummySearchStore } from "@c/GardenEditor/SearchStore";
import { toMarkdown } from "@c/GardenEditor/types";
import { useStoredJSON } from "@gazebo/nextjs/useStoredJSON";
import { observer } from "mobx-react-lite";
import type { NextPage } from "next";
import React from "react";
import { Descendant } from "slate";

// TODO: explain the interactions
// TODO: explain the portal in the components
// TODO: make an interactive demonstration that types itself.

const dummyInteraction = noopInteraction();
const dummySearch = new DummySearchStore();

const BASE_CONTENT: Descendant[] = [
  baseBlock([
    baseParagraph(["This is a fancy markdown editor I built."]),
    baseParagraph(["You can type things,"]),
    baseParagraph([
      "and you can also create titles, and the editor will understand they are part of a new concept, a new block.",
    ]),
  ]),
  baseBlock([
    baseParagraph(["# Block are concepts"]),
    baseParagraph(["When you create a new block, the editor will try to infer the concept you are writing about."]),
    baseParagraph(["Note this is a demonstration. There is an active / inactive mode that hides the noise of concepts decorations."]),
  ]),
  baseBlock([
    baseParagraph(["# You can add content to a concept"]),
    baseParagraph(["I add more details to this concept."]),
    baseParagraph(["You can also use [[internal links]] like this one. wikistyle!"]),
    baseParagraph([""]),
  ]),
  baseBlock([
    baseParagraph([
      'When you have multiple blank lines, the editor assumes you are going to talk about a new concept!',
    ]),
    baseParagraph([""]),
  ]),
  baseBlock([
    baseParagraph([
      '[[this is a different concept]], note how the editor assumes you are making a break in your train of thoughts to talk about something else.',
    ]),
  ]),
  baseBlock([
    baseParagraph([
      '# Autocomplete',
    ]),
    baseParagraph([
      'Finally, it has autocomplete for titles and internal links. For example, try to write a title with the name Helloworld.'
    ]),
  ]),
];


const Page: NextPage = observer(() => {
  const [value, setValue] = useStoredJSON<Descendant[]>(
    "slate-demo-content",
    BASE_CONTENT
  );

  return (
    <ContentDemoPage title="Slate Editor">
      <div className="columns is-centered">
        <CardDemo title="Slate Editor" demo="pages/slate.tsx" code="components/GardenEditor/index.tsx">
          <p className="block">
            This is a smart editor. After some hours spent hacking around contenteditable, and libraries like draftjs,
            I believe making "ergonomic" and "smart" editors is probably in the top 3 of difficult problems on the web.
          </p>
          <p className="block">
            I'm a big fan of Tools for Thinking. I agree with Stewart Brand when he said that we don't change people;
            we change the tools they use. And the better tools we have, the better our thinking and progress.
          </p>
          <p className="block">
            I have this crazy idea of building a smart markdown editor. Something as pretty and comfortable as Ulysse (pretty markdown),
            as powerful as Notion (blocks), and privacy preserving (logseq).
          </p>
          <p className="block content">
            <h3>Features</h3>
            <ul>
              <li>Markdown decorations as you type,</li>
              <li>"Implicit" blocks that converts to and from markdown,</li>
              <li>Internal links ala Roam, and</li>
              <li>Autocomplete.</li>
            </ul>
          </p>
        </CardDemo>
      </div>
      <hr />
      <div style={{ maxWidth: '860px', margin: 'auto' }}>
        <h2 className="title">Smart Markdown Editor</h2>
        <InteractionProvider value={dummyInteraction}>
          <GardenEditor
            value={value}
            setValue={setValue}
            searchStore={dummySearch}
          />
        </InteractionProvider>
      </div>
      <hr />
      <div style={{ maxWidth: '860px', margin: 'auto', marginTop: '2rem' }}>
        <h2 className="title">It's always markdown</h2>
        <pre>
          {toMarkdown(value)}
        </pre>
      </div>
    </ContentDemoPage>
  );
});

export default Page;
