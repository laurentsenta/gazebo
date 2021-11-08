import { Element, Node, NodeEntry, Transforms } from "slate";
import { CustomEditor, isParagraph } from "./types";

export const withParagraphs = (editor: CustomEditor) => {
  const { normalizeNode } = editor;

  editor.normalizeNode = (entry: NodeEntry) => {
    const [node, path] = entry;

    // If the element is a paragraph, ensure its children are valid.
    if (isParagraph(node)) {
      for (const [child, childPath] of Node.children(editor, path)) {
        if (Element.isElement(child) && !editor.isInline(child)) {
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
