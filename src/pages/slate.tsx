import { ContentDemoPage } from "@c/DemoUtils";
import { observer } from "mobx-react-lite";
import type { NextPage } from "next";
import React from "react";

// const noopInteraction = () => {
//   const interaction: Interaction = {
//     onClickInternalLink: (event: ClickEvent, element: IInternalLink | IBlock) => { },
//     resolveURL: function (element: IBlock | IInternalLink): string {
//       return '/not-implemented'
//     }
//   }

//   return interaction
// }

// TODO: explain the interactions
// TODO: explain the portal in the components
// TODO: make an interactive demonstration that types itself.

const Page: NextPage = observer(() => {
  // const interaction = useMemo(() => noopInteraction(), [])
  // const [value, setValue] = useState<Descendant[]>([baseBlock()])

  return <ContentDemoPage title="Slate Editor">
    <p>
      I have a lot of hope for Personal Knowledgemnt Management apps.
      I have a dream to build one myself.
    </p>
    <p>
      The first step is the text editor.
    </p>
    <p>
      Around the web you are used to see these kind of text inputs:<br />
      <input type="text" placeholder="a simple text input" />
      They might be styled, but in the end they are always the same, an editable input.
      <input className="input" type="text" placeholder="with some style" />
      <textarea className="textarea" />
    </p>
    <p>
      These are great to get a few informations from a user, like a phone number, a title for a blog post, etc.
      But when it comes to PKM applications, and other application involving media, like a social network post tool, you want
      something that is as powerful as the DOM.
    </p>
    <p>
      TODO: what is contenteditable.
    </p>
    <p>
      There are TinyMCE, DraftJS, etc. Some are very optiniated, they tell you exactly what you can do with them, and they usually try to mimick the
      &quot;best&quot; features of a Microsoft Word. Others are less optiniated and might give you some way to customize the content. I wanted a tool
      that would let me be completely customaizable, ideally the ability to build from scratch a complete IDE.
    </p>
    <p>
      Slate details
    </p>
    <p>
      This is my crazy bet, implement my own markdown block editor.
    </p>
    <p>
      First the data type looks like this:
      Each document is a Note. A Note will contains block at the root level. Then a Block will containt markdown content.
      A Block is basically a piece of knowledge, I try to be clever here and try to discover what is the start and the end of a block from the content in markdown.
    </p>
    <p>
      A piece of content is something that is meant to &quot;live by itself&quot;, which I note as something with a title. Or something separated from the rest of the document.
      This mimics the way I write and think and I believe this would mimick a lot of other people way of writing.
    </p>
    <p>
      <div>
        {/* <InteractionProvider value={interaction}>
            <Editor1 value={value} setValue={setValue} />
          </InteractionProvider> */}
      </div>

    </p>
  </ContentDemoPage>
});

export default Page;
