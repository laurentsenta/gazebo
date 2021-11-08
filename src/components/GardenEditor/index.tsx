import { ActivityProvider, useActivitySignal } from "@gazebo/react/useIsActive";
import { dbg, makeLogger } from "@gazebo/utils";
import isEqual from "lodash/isEqual";
import { action } from "mobx";
import { observer } from "mobx-react-lite";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  createEditor,
  Descendant,
  Editor,
  Node,
  NodeEntry,
  Transforms
} from "slate";
import { withHistory } from "slate-history";
import {
  Editable,
  ReactEditor,
  RenderElementProps,
  RenderLeafProps,
  Slate,
  withReact
} from "slate-react";
import { Autocomplete, AutocompleteUI } from "./autocomplete";
import { withBlocks } from "./blocks";
import { Block, InternalLink, Leaf, Paragraph, Title } from "./components";
import { withInternalLinks } from "./internalLinks";
import { withParagraphs } from "./paragraphs";
import { ISearchStore } from "./SearchStore";
import { withTitles, withTitlesAsBlockStarters } from "./titles";
import { IBlock, isBlock, isInternalLink } from "./types";

const logger = makeLogger("gardeneditor");

const renderElement = (props: RenderElementProps): JSX.Element => {
  switch (props.element.type) {
    case "title":
      return <Title {...props} />;
    case "internalLink":
      return <InternalLink {...props} />;
    case "paragraph":
      return <Paragraph {...props} />;
    case "block":
      return <Block {...props} />;
    default:
      // @ts-ignore
      throw new Error(`missing: ${props.element.type}`);
  }
};

const renderLeaf = (props: RenderLeafProps): JSX.Element => {
  return <Leaf {...props} />;
};

const hasDifferentPaths = (a: NodeEntry, b: NodeEntry): boolean => {
  return !isEqual(a[1], b[1]);
};

export const GardenEditor: React.FC<{
  value: Descendant[];
  setValue: (x: Descendant[]) => void;
  searchStore: ISearchStore;
}> = observer(({ searchStore, value, setValue }) => {
  const editor = useMemo(
    () =>
      dbg(
        "creating editor:",
        withTitlesAsBlockStarters(
          withTitles(
            withInternalLinks(
              withParagraphs(withBlocks(withHistory(withReact(createEditor()))))
            )
          )
        )
      ),
    []
  );

  const autoComplete = useMemo(
    () => new Autocomplete(editor, searchStore),
    [editor, searchStore]
  );

  const [focused, setFocused_] = useState<NodeEntry<Node> | null>(null);

  // Hackish "normalize on load"
  // see: https://github.com/ianstormtaylor/slate/issues/3465#issuecomment-655592962
  useEffect(() => {
    // Slate throws an error if the value on the initial render is invalid
    // so we directly set the value on the editor in order
    // to be able to trigger normalization on the initial value before rendering
    editor.children = value;
    Editor.normalize(editor, { force: true });
    // We set the internal value so that the rendering can take over from here
    setValue(editor.children);
  }, []);

  const setFocused = useCallback(
    (newValue: NodeEntry<Node> | null) => {
      setFocused_((prevState: NodeEntry<Node> | null) => {
        if (prevState) {
          // Unfocus the previous state.
          if (!newValue || hasDifferentPaths(newValue, prevState)) {
            Transforms.setNodes(
              editor,
              { focused: undefined },
              { at: prevState[1] }
            );
          }
        }

        // Focus the new state.
        if (newValue) {
          Transforms.setNodes(editor, { focused: true }, { at: newValue[1] });
        }

        return newValue;
      });
    },
    [setFocused_, editor]
  );

  const [editorWasFocused, setEditorWasFocused_] = useState(
    ReactEditor.isFocused(editor)
  );
  const editorIsFocused = ReactEditor.isFocused(editor);

  useEffect(() => {
    setEditorWasFocused_((previous: boolean) => {
      if (previous !== editorIsFocused) {
        if (editorIsFocused) {
          ReactEditor.toDOMNode(editor, editor).scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "center",
          });
        }
      }
      return editorIsFocused;
    });
  }, [setEditorWasFocused_, editor, editorIsFocused]);

  useEffect(() => {
    const { selection } = editor;

    if (!selection || !ReactEditor.isFocused(editor)) {
      setFocused(null);
      return;
    }

    const [m] = Editor.nodes(editor, { match: (n) => isInternalLink(n) });

    if (m) {
      setFocused(m);
    } else {
      setFocused(null);
    }
  }, [editor.selection, setFocused, editor]);

  const [isActive, signalActivity] = useActivitySignal();

  logger.inTestEnv("editor content:", value);

  return (
    <>
      <Slate
        editor={editor}
        value={value}
        onChange={action((newValue) => {
          const { operations } = editor;

          logger.inTestEnv("processing change:", newValue);

          const isASTChange = operations.some(
            (op) => "set_selection" !== op.type
          );

          setValue(newValue);

          signalActivity();

          autoComplete.onValueChange(isASTChange);
        })}
      >
        <ActivityProvider value={isActive}>
          <AutocompleteUI autocomplete={autoComplete} />
          <Editable
            placeholder="What's on your mind..."
            className={`content garden-editor ${!isActive ? "is-inactive" : "is-active"
              }`}
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            onKeyDown={(event) => {
              if (autoComplete.onKeyDown(event)) {
                return;
              }

              if (event.key === "Enter") {
                const [m] = Editor.nodes<IBlock>(editor, {
                  match: (n, path) => isBlock(n),
                });
                const s = Node.string(m[0]);
                if (s.length === 0) {
                  Transforms.move(editor, { unit: "line" });
                  event.preventDefault();
                }
                return true;
              }
            }}
          />
        </ActivityProvider>
      </Slate>
    </>
  );
});
