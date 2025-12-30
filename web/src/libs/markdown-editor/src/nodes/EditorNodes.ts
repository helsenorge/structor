import { CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import { MarkNode } from "@lexical/mark";
import { OverflowNode } from "@lexical/overflow";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import type { Klass, LexicalNode } from "lexical";

const EditorNodes: Array<Klass<LexicalNode>> = [
  HeadingNode,
  QuoteNode,
  ListNode,
  ListItemNode,
  AutoLinkNode,
  LinkNode,
  OverflowNode,
  MarkNode,
  CodeNode,
] as any;

export default EditorNodes;
