import { Descendant, Element, Node, NodeEntry, Text, Transforms } from "slate";
import { v4 as uuid } from "uuid";
import {
  CustomEditor,
  IBlock,
  IInternalLink,
  IParagraph,
  isBlock,
  isInternalLink,
  isParagraph,
  isTitle,
} from "./types";

export const baseParagraph = (texts?: string[]): IParagraph => ({
  type: "paragraph",
  children: (texts || [""]).map((x) => ({ text: x })),
});

export const baseBlock = (children?: Descendant[]): IBlock => ({
  type: "block",
  blockID: uuid(),
  children: children || [baseParagraph()],
});

const firstNonEmptyDirectChildren = (
  editor: CustomEditor,
  path: number[]
): NodeEntry<Descendant> | null => {
  for (const [child, childPath] of Node.children(editor, path)) {
    if (Node.string(child).length > 0) {
      return [child, childPath];
    }
  }
  return null;
};

const firstInternalLink = (
  editor: CustomEditor,
  path: number[]
): NodeEntry<IInternalLink> | null => {
  for (const [child, childPath] of Node.children(editor, path)) {
    if (isInternalLink(child)) {
      return [child, childPath];
    }
  }
  return null;
};

export const withBlocks = (editor: CustomEditor) => {
  const { normalizeNode } = editor;

  editor.normalizeNode = (entry: NodeEntry) => {
    const [node, path] = entry;

    /**
     * If an editor is empty,
     * We force the existence of a block with a paragraph.
     */
    if (path.length === 0) {
      if (editor.children.length < 1) {
        Transforms.insertNodes(editor, baseBlock(), { at: path.concat(0) });
      }
    } else if (path.length === 1) {
      /**
       * We force any content to live in a block.
       */
      if (Element.isElement(node) && node.type !== "block") {
        Transforms.wrapNodes(editor, baseBlock(), { at: path });
      }
    } else if (path.length > 1 && isBlock(node)) {
      /**
       * We don't allow block to live outside of the root
       * of the document.
       */
      Transforms.unwrapNodes(editor, { at: path });
      return;
    }

    if (isBlock(node)) {
      let subject: string | undefined = undefined;

      // Make sure all child are elements
      for (const [child, childPath] of Node.children(editor, path)) {
        if (Text.isText(child)) {
          Transforms.wrapNodes(editor, baseParagraph(), { at: childPath });
        }
      }

      // Extract the subject from the first title or the first internal link.
      const child = firstNonEmptyDirectChildren(editor, path);

      if (child) {
        if (isTitle(child[0])) {
          subject = Node.string(child[0]).substring(2);
        } else if (isParagraph(child[0])) {
          const link = firstInternalLink(editor, child[1]);
          if (link) {
            subject = link[0].target;
          }
        }
      }

      if (subject) {
        Transforms.setNodes(editor, { subject }, { at: path });
      } else {
        Transforms.setNodes(editor, { subject: undefined }, { at: path });
      }
    }

    // Fall back to the original `normalizeNode` to enforce other constraints.
    normalizeNode(entry);
  };

  return editor;
};
