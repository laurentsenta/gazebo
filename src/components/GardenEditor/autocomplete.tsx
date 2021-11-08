import { Portal } from "@c/Portal";
import { withMaxLength } from "@gazebo/utils";
import isEqual from "lodash/isEqual";
import { action, computed, makeObservable, observable } from "mobx";
import { observer } from "mobx-react-lite";
import React, { useEffect, useRef } from "react";
import { Editor, Element, Node, NodeEntry, Path, Range } from "slate";
import { ReactEditor, useSlate } from "slate-react";
import { ISearchStore } from "./SearchStore";
import { setContent } from "./tools";
import {
  CustomEditor,
  CustomElement,
  IInternalLink,
  ITitleElement
} from "./types";

// TODO: this node type should be matched automatically with the Autocomplete.canAutocomplete field.
const extractText = (node: IInternalLink | ITitleElement): string => {
  const text = Node.string(node);

  if (node.type === "title") {
    return text.substring(2);
  }
  if (node.type === "internalLink") {
    return text.substring(2, text.length - 2);
  }
  throw new Error("unhandled");
};

export class Autocomplete {
  public readonly editor: CustomEditor;
  public readonly searchStore: ISearchStore;
  public selected_: number;
  public target_: NodeEntry<Node> | null;
  public rejectTarget: NodeEntry<Node> | null;

  // @ts-ignore: TODO: Figure out a way to define this nicely.
  public canAutocomplete: CustomElement["type"] = ["internalLink", "title"];

  constructor(editor: CustomEditor, searchStore: ISearchStore) {
    this.editor = editor;
    this.searchStore = searchStore;

    this.selected_ = 0;
    this.target_ = null;
    this.rejectTarget = null;

    makeObservable(this, {
      selected_: observable,
      target_: observable,
      rejectTarget: observable,
      start: action,
      end: action,
      set: action,
      previous: action,
      next: action,
      updateSelection: action,
      options: computed,
      searched: computed,
      selected: computed,
      target: computed,
      current: computed,
      onKeyDown: action,
      onValueChange: action,
    });
  }

  public get selected(): number {
    return this.selected_;
  }

  public get target() {
    if (!this.rejectTarget || !this.target_) {
      return this.target_;
    }

    if (isEqual(this.target_[1], this.rejectTarget[1])) {
      return null;
    }

    return this.target_;
  }

  public updateSelection(path: Path | undefined) {
    const rejectTarget = this.rejectTarget;

    if (!rejectTarget) {
      return;
    }

    if (!path || path.length < rejectTarget.length) {
      this.rejectTarget = null;
      return;
    }

    const targetPath = rejectTarget[1];

    for (let i = 0; i < targetPath.length; i++) {
      if (targetPath[i] !== path[i]) {
        this.rejectTarget = null;
        return;
      }
    }
  }

  public start(target: NodeEntry<IInternalLink | ITitleElement>) {
    this.selected_ = 0;
    this.target_ = target;

    if (!this.rejectTarget || !isEqual(this.target_[1], this.rejectTarget[1])) {
      this.rejectTarget = null;
    }

    this.searchStore.searched = extractText(target[0]);
  }

  public get searched(): string {
    return this.searchStore.searched;
  }

  public end() {
    this.selected_ = 0;
    this.rejectTarget = this.target_;
    this.target_ = null;
  }

  public set(index: number) {
    this.selected_ = index;
  }

  public previous() {
    this.selected_ -= 1;

    if (this.selected_ < 0) {
      this.selected_ = this.options.length + this.selected_;
    }
  }

  public next() {
    this.selected_ += 1;
    this.selected_ = this.selected_ % this.options.length;
  }

  public get current(): string {
    return this.options[this.selected_];
  }

  public get options(): string[] {
    return this.searchStore.hits;
  }

  public confirm(index?: number) {
    const confirmed = index !== undefined ? index : this.selected;

    if (!this.target) {
      console.error('something went wrong with the autocomplete but that is just a demo.')
      // throw new Error("something went wrong with the autocomplete");
    } else {
      setContent(this.editor, this.target, this.options[confirmed]);
    }
    this.end();
  }

  public escape() {
    this.end();
    // setEscaped(target)
    // setTarget(null);
  }

  public onKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (this.target_ && this.options.length > 0) {
      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          this.next();
          return true;
        case "ArrowUp":
          event.preventDefault();
          this.previous();
          return true;
        case "Tab":
        case "Enter":
          event.preventDefault();
          this.confirm();
          return true;
        case "Escape":
          event.preventDefault();
          this.escape();
          return true;
      }
    }

    return false;
  }

  public onValueChange(isASTChange: boolean) {
    const { selection } = this.editor;

    if (selection && Range.isCollapsed(selection)) {
      const [match] = Editor.nodes(this.editor, {
        match: (n) =>
          Element.isElement(n) && this.canAutocomplete.includes(n.type),
      });
      if (match) {
        // if there is something related to autocomplete AND the users typed / changed the ast (not simply changed selection)
        if (isASTChange) {
          // @ts-ignore: TODO match this type with the canAutocomplete and the extractText methods.
          this.start(match);
        }
      } else {
        this.end();
      }
    } else {
      this.end();
    }
  }
}

export const AutocompleteUI: React.FC<{
  autocomplete: Autocomplete;
}> = observer(({ autocomplete }) => {
  const editor = useSlate();
  const ref = useRef<HTMLDivElement | undefined>();

  useEffect(() => {
    if (autocomplete.target) {
      try {
        const range = Editor.range(editor, autocomplete.target[1]);
        const domRange = ReactEditor.toDOMRange(editor, range);
        const rect = domRange.getBoundingClientRect();
        const el = ref.current;

        if (el) {
          el.style.top = `${rect.top + rect.height + window.pageYOffset + 2}px`;
          el.style.left = `${rect.left + window.pageXOffset}px`;
          el.style.width = `${Math.max(rect.width, 350)}px`;
        }
      } catch (error) {
        console.error(error);
        return;
      }
    }
  }, [editor, autocomplete.target, ref]);

  useEffect(() => {
    const { selection } = editor;
    const path = selection?.anchor.path || selection?.focus.path;

    if (path) {
      autocomplete.updateSelection(path);
    }
  });

  if (!autocomplete.target || autocomplete.options.length === 0) {
    return null;
  }

  return (
    <Portal>
      <div
        // @ts-ignore
        ref={ref}
        style={{
          top: "-9999px",
          left: "-9999px",
          position: "absolute",
          zIndex: 10000,
          padding: "3px",
          background: "white",
          borderRadius: "4px",
          boxShadow: "0 1px 5px rgba(0,0,0,.2)",
        }}
        onClick={() => window.alert("flute")}
        data-cy="autocomplete-portal"
        className="autocomplete-portal"
      >
        {autocomplete.options.map((note, i) => (
          <div
            className="autocomplete-item"
            key={note}
            // TODO: figure out a way to use onClick,
            // I guess slate captures the onClick because it happens "outside" content, so it deselect the item we are autocompleting,
            // so the autocomplete disappear before it was clicked.
            // onClick={() => {
            //     autocomplete.confirm(i);
            // }}
            onMouseDown={() => autocomplete.confirm(i)}
            onMouseEnter={() => autocomplete.set(i)}
            style={{
              padding: "1px 3px",
              borderRadius: "3px",
              background:
                i === autocomplete.selected ? "#B4D5FF" : "transparent",
            }}
          >
            {withMaxLength(
              note,
              Math.max(autocomplete.searched.length + 3, 40)
            )}
          </div>
        ))}
      </div>
    </Portal>
  );
});
