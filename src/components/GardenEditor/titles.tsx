import { Element, Node, NodeEntry, Transforms } from "slate";
import { baseBlock } from "./blocks";
import {
  childIndex as pathLeaf,
  parentPath,
  pathAfter,
  pathBefore,
  siblingNodeAfter
} from "./tools";
import { CustomEditor, isBlock, isParagraph, isTitle } from "./types";

/**
 * When you have
 *  block1
 *    item1
 *    item2
 *    item3
 *
 * path = [block1]
 * startingFromPath = [block1, item2]
 *
 * => moves all the items after startingFromPath to a new node after path
 *
 *  block1
 *    item1
 *  block2
 *    item2
 *    item3
 * @param editor
 * @param path
 * @param startingFromPath
 */
const splitBlock = (
  editor: CustomEditor,
  blockPath: number[],
  startingFromPath: number[]
) => {
  const newPath = pathAfter(blockPath);
  const startingFromIndex = pathLeaf(startingFromPath);

  Transforms.insertNodes(editor, baseBlock([]), { at: newPath });
  Transforms.moveNodes(editor, {
    at: blockPath,
    to: [...newPath, 0],
    match: (n, path) => {
      const isSibling = path.length === startingFromPath.length;
      const isOrAfter = pathLeaf(path)! >= startingFromIndex;
      return isSibling && isOrAfter;
    },
  });
};

const mergeBackToBlock = (
  editor: CustomEditor,
  fromBlock: number[],
  toBlock: number[]
) => {
  const toBlockChildren = [
    ...Node.children(editor, toBlock, { reverse: true }),
  ]; // TODO: slower than it should be.
  const [lastChild, ...rest] = toBlockChildren; // Note the reverse above, this makes sense.
  const lastChildrenPath = lastChild[1];
  const targetPath = pathAfter(lastChildrenPath);

  Transforms.moveNodes(editor, {
    at: fromBlock,
    to: targetPath,
    match: (n, nodePath) => {
      // Only consider direct children of the fromBlock
      return nodePath.length === fromBlock.length + 1;
    },
  });
  Transforms.removeNodes(editor, { at: fromBlock });
};

const isAnEmptyParagraph = (node: Node): boolean => {
  return isParagraph(node) && Node.string(node).length === 0;
};

const lastDirectChildren = (editor: CustomEditor, path: number[]) => {
  const g = Node.children(editor, path, { reverse: true });
  const lastEntry = g.next().value;

  if (!lastEntry) {
    return undefined;
  }

  return lastEntry;
};

export const withTitles = (editor: CustomEditor) => {
  const { normalizeNode } = editor;

  editor.normalizeNode = (entry: NodeEntry) => {
    const [node, path] = entry;

    if (isTitle(node)) {
      /**
       * Titles must start with '# ' else they are paragraphs.
       */
      const nodeText = Node.string(node);
      if (!nodeText.startsWith("# ")) {
        Transforms.setNodes(editor, { type: "paragraph" }, { at: path });
        return;
      }

      /**
       * Titles must contains text and inline elements only, else we unwrap their content.
       */
      for (const [child, childPath] of Node.children(editor, path)) {
        if (Element.isElement(child) && !editor.isInline(child)) {
          Transforms.unwrapNodes(editor, { at: childPath });
          return;
        }
      }
    }

    /**
     * Paragraph that starts with  '# ' are turned into titles.
     */
    if (isParagraph(node)) {
      const nodeString = Node.string(node);

      if (nodeString.startsWith("# ")) {
        Transforms.setNodes(editor, { type: "title" }, { at: path });
      }
    }

    normalizeNode(entry);
  };

  return editor;
};

export const withTitlesAsBlockStarters = (editor: CustomEditor) => {
  const { normalizeNode } = editor;

  editor.normalizeNode = (entry: NodeEntry) => {
    const [node, path] = entry;

    /**
     * When we find a title that is not at the beginning of the block,
     * we split the block to create a new one that STARTS with the title.
     *
     * NOTE: we have to recheck the title here else it tries to split a text that is not
     * a title, when you type enter in a title. Because it splits the title into another title, empty.
     * then it starts the editing and the text is turned back into a regular paragraph.
     */
    if (
      isTitle(node) &&
      Node.string(node).startsWith("# ") &&
      pathLeaf(path) > 0
    ) {
      splitBlock(editor, parentPath(path), path);
      return;
    }

    /**
     * When we find two empty paragraphs side by side,
     * we split them into the start of a new block
     */
    if (isAnEmptyParagraph(node)) {
      // const before = siblingNodeBefore(editor, path)
      const after = siblingNodeAfter(editor, path);

      if (after && isAnEmptyParagraph(after[0])) {
        splitBlock(editor, parentPath(path), after[1]);
      }
      // if (before && isAnEmptyParagraph(before[0])) {
      //   splitBlock(editor, parentPath(path), path)
      //   return;
      // } else if (after && isAnEmptyParagraph(after[0])) {
      //   splitBlock(editor, parentPath(path), after[1])
      //   return;
      // }
    }

    if (isBlock(node)) {
      /**
       * We might merge a block with the previous one if:
       * they don't have a title,
       * the previous one have no empty paragraph at the end.
       */
      // TODO: assert previous is also a block.
      const hasPrevious = pathLeaf(path) > 0;

      if (hasPrevious) {
        const hasTitle = blockStartsWithTitle(editor, path);

        if (!hasTitle) {
          // Check the previous one is a empty paragraph.
          const previousBlock = pathBefore(path);
          const lastChildren = lastDirectChildren(editor, previousBlock);
          const endsWithEmptyParagraph =
            lastChildren && isAnEmptyParagraph(lastChildren[0]);

          if (!endsWithEmptyParagraph) {
            // Merge!
            // Don't forget to return, because we should not try to normalize a node we just removed.
            mergeBackToBlock(editor, path, previousBlock);
            return;
          }
        }
      }

      /**
       * Blocks with a next might need to merge them too.
       *
       * If the node has no empty paragraph last,
       * and the following node doesn't start with a title,
       * we merge them.
       */
      const pathNext = pathAfter(path);
      const hasNext = Node.has(editor, pathNext);

      if (hasNext) {
        const nextHasTitle = blockStartsWithTitle(editor, pathNext);

        if (!nextHasTitle) {
          const lastChildren = lastDirectChildren(editor, path);
          const endsWithEmptyParagraph =
            lastChildren && isAnEmptyParagraph(lastChildren[0]);

          if (!endsWithEmptyParagraph) {
            // Merge next node back.
            mergeBackToBlock(editor, pathNext, path);
            return;
          }
        }
      }
    }

    normalizeNode(entry);
  };

  return editor;
};

const blockStartsWithTitle = (
  editor: CustomEditor,
  path: number[]
): boolean => {
  // Check it has a title.
  const children = [...Node.children(editor, path)]; // TODO: slower than it should be.
  const firstChild = children[0] ? children[0][0] : undefined;
  return !!firstChild && isTitle(firstChild);
};
