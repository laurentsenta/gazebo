import { BaseEditor, Element, Node, Text } from "slate";
import { HistoryEditor } from "slate-history";
import { ReactEditor } from "slate-react";

export interface INote {
  content: IBlock[];
}

export interface IBlock {
  type: "block";
  children: Descendant[];
  subject?: string;
  blockID: string;
  hasChanges?: boolean;
}

export interface IParagraph {
  type: "paragraph";
  children: Descendant[];
}

export interface IInternalLink {
  type: "internalLink";
  target: string;
  children: Descendant[];
  focused?: boolean;
}

export interface ITitleElement {
  type: "title";
  children: Descendant[];
}

export type CustomText = { text: string; bold?: true };

export type CustomElement = IBlock | IParagraph | IInternalLink | ITitleElement;

export type Descendant = CustomText | CustomElement;

export type CustomEditor = BaseEditor & ReactEditor & HistoryEditor;

declare module "slate" {
  interface CustomTypes {
    Editor: CustomEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

export const isTitle = (x: Node | Descendant): x is ITitleElement =>
  Element.isElement(x) && x.type === "title";
export const isBlock = (x: Node | Descendant): x is IBlock =>
  Element.isElement(x) && x.type === "block";
export const isParagraph = (x: Node | Descendant): x is IParagraph =>
  Element.isElement(x) && x.type === "paragraph";
export const isInternalLink = (x: Node | Descendant): x is IInternalLink =>
  Element.isElement(x) && x.type === "internalLink";


export const toMarkdown = (x: Descendant | Descendant[]): string => {
  if (Array.isArray(x)) {
    return x.map(toMarkdown).join('')
  }
  else if (isBlock(x)) {
    return toMarkdown(x.children) + '\n' + '\n'
  }
  else if (isTitle(x) || isParagraph(x)) {
    return toMarkdown(x.children) + '\n'
  }
  else if (isInternalLink(x)) {
    return toMarkdown(x.children)
  } else if (Text.isText(x)) {
    return x.text
  }
  else {
    throw new Error('not supported')
  }
}