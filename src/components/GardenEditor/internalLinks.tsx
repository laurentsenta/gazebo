import last from "lodash-es/last";
import {
  Descendant,
  Editor,
  Element,
  Node,
  NodeEntry,
  Path,
  Point,
  Text,
  Transforms,
} from "slate";
import {
  CustomEditor,
  CustomElement,
  IInternalLink,
  isInternalLink,
} from "./types";

export const withInternalLinks = (editor: CustomEditor) => {
  const { normalizeNode, isInline } = editor;

  editor.isInline = (element: CustomElement) => {
    return element.type === "internalLink" ? true : isInline(element);
  };

  const lastChildren = (path: Path): NodeEntry<Descendant> | undefined => {
    const c = Node.children(editor, path);
    const l = last([...c]); // TODO: slow
    return l;
  };

  const moveToLastChildren = ({ at, to }: { at: NodeEntry; to: NodeEntry }) => {
    const l = lastChildren(to[1]);

    if (!l) {
      throw new Error("unhandled configuration");
    }

    const [_, lastChildrenPath] = l;

    const targetPath = [...lastChildrenPath];
    targetPath[targetPath.length - 1] += 1;

    Transforms.moveNodes(editor, { at: at[1], to: targetPath });
  };

  editor.normalizeNode = (entry: NodeEntry) => {
    const [node, path] = entry;

    /**
     * TODO: deal with the case where you have a link, add a line break, then remove the line break.
     * This operation triggers an update on the containing paragraph but not on the text items. So the link is not updated correctly:
     *
     * hello [[world
     *
     * >
     *
     * hello [[wo
     * rld
     *
     * >
     *
     * hello [[world
     *
     * (here "rld" is not in the link anymore)
     */

    if (Text.isText(node)) {
      const { text } = node;

      /**
       * When a piece of text contains a [[ we wrap this part into an internalLink
       */
      const hasOpen = text.includes("[[");

      if (hasOpen) {
        const offset = text.indexOf("[[");
        const start: Point = { path, offset };
        const end: Point = { path, offset: text.length };

        const match = Editor.above(editor, {
          at: path,
          match: (n) => Element.isElement(n) && n.type === "internalLink",
        });

        if (!match) {
          const element: IInternalLink = {
            type: "internalLink",
            children: [],
            target: "",
          };

          const range = { anchor: start, focus: end };

          Transforms.wrapNodes(editor, element, { at: range, split: true });
          return;
        }
      }

      /**
       * When a piece of text contains a ]] that is not at the end of the text,
       * we split the internal link.
       *
       * We don't need to tweak the text if the ]] is at the end, because the link
       * is correct.
       */
      const includesClose = text.includes("]]") && !text.endsWith("]]");

      if (includesClose) {
        const offset = text.indexOf("]]") + 2;
        const start: Point = { path, offset };
        Transforms.splitNodes(editor, {
          at: start,
          match: (n) => Element.isElement(n) && n.type === "internalLink",
        });
        return;
      }

      /**
       * If a text is AFTER an OPEN internal link: we move the text to the internal link.
       *
       *                   node
       *                     v
       * [[helloworld | this is the text |
       */
      const previous = Editor.previous(editor, { at: path });
      if (previous) {
        const [prevNode, prevNodePath] = previous;

        if (
          Element.isElement(prevNode) &&
          prevNode.type === "internalLink" &&
          text.length
        ) {
          const prevText = Editor.string(editor, prevNodePath);
          const isClosed = prevText.endsWith("]]");

          if (!isClosed) {
            moveToLastChildren({ at: entry, to: previous });
            return;
          }
        }
      }
    } else if (isInternalLink(node)) {
      let nodeString = Node.string(node);

      /**
       * An internal link without an opening [[ is NOT an internal link,
       * we unwrap it to remove the internalLink node.
       */
      if (!nodeString.startsWith("[[")) {
        Transforms.unwrapNodes(editor, { at: path });
        return;
      }

      /**
       * An internal link with a closing ]] is complete, we update its target.
       */
      if (nodeString.endsWith("]]")) {
        const target = nodeString.substring(2, nodeString.length - 2);
        Transforms.setNodes(editor, { target }, { at: path });
      } else {
        Transforms.setNodes(editor, { target: undefined }, { at: path });
      }

      /**
       * When we have an internal link without a closing ]]
       * We move the following text nodes to the link.
       */
      if (!nodeString.endsWith("]]")) {
        const next = Editor.next(editor, { at: path });

        if (next && Text.isText(next[0]) && next[0].text.length > 0) {
          moveToLastChildren({ at: next, to: entry });
        }
      }

      /**
       * Make sure the internalLink contains only inline / text items,
       * and NO nested internalLinks
       */
      for (const [child, childPath] of Node.children(editor, path)) {
        if (Element.isElement(child) && !editor.isInline(child)) {
          Transforms.unwrapNodes(editor, { at: childPath });
          return;
        }
        if (isInternalLink(child)) {
          Transforms.unwrapNodes(editor, { at: childPath });
          return;
        }
      }
    }

    // Fall back to the original `normalizeNode` to enforce other constraints.
    normalizeNode(entry);
  };

  return editor;
};
