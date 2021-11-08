import last from "lodash-es/last";
import isEqual from "lodash/isEqual";
import {
  Descendant,
  Editor,
  Element,
  Node,
  NodeEntry,
  Transforms
} from "slate";
import { CustomEditor } from "./types";

/**
 * @param path [x, y, z]
 * @returns [x, y]
 */
export const parentPath = (path: number[]): number[] => {
  return path.slice(0, -1);
};

/**
 * @param path [x, y, z]
 * @returns [x, y, z + 1]
 */
export const pathAfter = (path: number[]): number[] => {
  const newPath = [...path];
  newPath[newPath.length - 1] += 1;
  return newPath;
};

/**
 * @param path [x, y, z]
 * @returns [x, y, z - 1]
 */
export const pathBefore = (path: number[]): number[] => {
  const newPath = [...path];
  newPath[newPath.length - 1] -= 1;

  if (newPath[newPath.length - 1] < 0) {
    throw new Error("trying to compute the path before the first item.");
  }

  return newPath;
};

/**
 * @param path [x, y, z]
 * @returns z
 */
export const childIndex = (path: number[]): number => {
  return last(path)!;
};

/**
 * Return the sibling (same root) after the current path.
 * 
 * block1
 *  itema
 *  itemb
 *  itemc
 * block2
 *  item2
 * 
 * siblingNodeAfter(['block1', 'itemb']) => 'itemc'
 * siblingNodeAfter(['block1', 'itemc']) => none
 */
export const siblingNodeAfter = (
  editor: CustomEditor,
  path: number[]
): NodeEntry<Descendant> | undefined => {
  const entry = Editor.next(editor, { at: path });
  if (!entry) {
    return undefined;
  }
  // If the next node has the same parent, they are siblings.
  const [nextNode, nextPath] = entry;
  if (isEqual(parentPath(path), parentPath(nextPath))) {
    return entry;
  }
  return undefined;
};

export const siblingNodeBefore = (
  editor: CustomEditor,
  path: number[]
): NodeEntry<Descendant> | undefined => {
  const entry = Editor.previous(editor, { at: path });
  if (!entry) {
    return undefined;
  }
  // If the next node has the same parent, they are siblings.
  const [nextNode, nextPath] = entry;
  if (isEqual(parentPath(path), parentPath(nextPath))) {
    // TODO: this cast is not super nice.
    // We know we can't get an editor because it wouldn't have the same parent path.
    return entry as any;
  }
  return undefined;
};

export const isEmpty = (node: NodeEntry<Descendant> | undefined): boolean => {
  if (!node) {
    return true;
  }

  if (Node.string(node[0]).length > 0) {
    return false;
  }

  return true;
};

/**
 * Set a node content, used after autocompletion.
 *
 * @param editor
 * @param target
 * @param value
 */
export const setContent = (
  editor: CustomEditor,
  target: NodeEntry<Node>,
  value: string
) => {
  const [node, path] = target;

  Transforms.select(editor, target[1]);

  if (Element.isElement(node) && node.type === "title") {
    Transforms.insertText(editor, `# ${value}`, { at: path });

    if (!siblingNodeAfter(editor, path)) {
      Editor.insertBreak(editor);
    }
  } else if (Element.isElement(node) && node.type === "internalLink") {
    Transforms.insertText(editor, `[[${value}]]`, { at: path });
    const s = Editor.after(editor, path);
    Transforms.move(editor, { distance: 0, unit: "character" });
  }
};
