import { LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import { MarkNode } from "@lexical/mark";
import {
  HEADING,
  QUOTE,
  UNORDERED_LIST,
  ORDERED_LIST,
  LINK,
  BOLD_ITALIC_STAR,
  BOLD_ITALIC_UNDERSCORE,
  BOLD_STAR,
  BOLD_UNDERSCORE,
  ITALIC_STAR,
  ITALIC_UNDERSCORE,
  STRIKETHROUGH,
  $convertFromMarkdownString,
} from "@lexical/markdown";
import { OverflowNode } from "@lexical/overflow";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { $getRoot, createEditor } from "lexical";

const TRANSFORMERS = [
  HEADING,
  QUOTE,
  UNORDERED_LIST,
  ORDERED_LIST,
  LINK,
  BOLD_ITALIC_STAR,
  BOLD_ITALIC_UNDERSCORE,
  BOLD_STAR,
  BOLD_UNDERSCORE,
  ITALIC_STAR,
  ITALIC_UNDERSCORE,
  STRIKETHROUGH,
];

const editorConfig = {
  namespace: "MarkdownToPlainText",
  nodes: [
    HeadingNode,
    QuoteNode,
    ListNode,
    ListItemNode,
    LinkNode,
    OverflowNode,
    MarkNode,
  ],
  onError: (error: Error): void => {
    throw error;
  },
};

/**
 * Strip leftover markdown characters that Lexical could not parse
 * (e.g. malformed bold/italic like `**a*b***`).
 */
const stripResidualMarkdown = (text: string): string =>
  text
    .replace(/\*+([^*\n]+?)\*+/g, "$1") // *wrapped* or **wrapped**
    .replace(/_+([^_\n]+?)_+/g, "$1") // _wrapped_ or __wrapped__
    .replace(/(?:^|\n)#{1,6}\s+/g, "\n") // leftover heading markers
    .replace(/~~(.+?)~~/g, "$1") // leftover strikethrough
    .replace(/\*+/g, "") // any remaining stray asterisks
    .replace(/(?:^|(?<=\s))_+|_+(?=\s|$)/g, "") // stray underscores at word edges
    .trim();

export const markdownToPlainText = (markdown: string): string => {
  const editor = createEditor(editorConfig);
  let plainText = "";
  editor.update(
    () => {
      $convertFromMarkdownString(markdown, TRANSFORMERS);
      plainText = $getRoot().getTextContent();
    },
    { discrete: true },
  );
  return stripResidualMarkdown(plainText);
};
