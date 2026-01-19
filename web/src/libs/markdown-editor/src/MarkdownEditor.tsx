import { useState, type FC } from "react";

import {
  $convertFromMarkdownString,
  $convertToMarkdownString,
  BOLD_ITALIC_STAR,
  BOLD_ITALIC_UNDERSCORE,
  BOLD_STAR,
  BOLD_UNDERSCORE,
  HEADING,
  ITALIC_STAR,
  ITALIC_UNDERSCORE,
  LINK,
  ORDERED_LIST,
  QUOTE,
  STRIKETHROUGH,
  UNORDERED_LIST,
} from "@lexical/markdown";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { $getRoot, type EditorState } from "lexical";

import EditorNodes from "./nodes/EditorNodes";
import FloatingLinkEditorPlugin from "./plugins/FloatingLinkEditorPlugin";
import LinkPlugin from "./plugins/LinkPlugin";
import ToolbarPlugin from "./plugins/ToolbarPlugin";
import EditorTheme from "./themes/EditorTheme";
import ContentEditable from "./ui/ContentEditable";
import Placeholder from "./ui/Placeholder";
import "./MarkdownEditor.css";

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

export type onChangeMisc = {
  plainText: string;
};
export interface MarkdownEditorProps {
  initialMarkdown?: string;
  className?: string;
  onChange?: (markdown: string, misc: onChangeMisc) => void;
  onBlur?: () => void;
  placeholder?: string;
  "data-testid"?: string;
  id?: string;
}

const MarkdownEditor: FC<MarkdownEditorProps> = (props) => {
  const [isLinkEditMode, setIsLinkEditMode] = useState<boolean>(false);

  const [floatingAnchorElem, setFloatingAnchorElem] = useState<
    HTMLDivElement | undefined
  >(undefined);

  const onRef = (_floatingAnchorElem: HTMLDivElement): void => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };

  const internalOnChange = (editorState: EditorState): void => {
    editorState.read(() => {
      const markdown = $convertToMarkdownString(TRANSFORMERS);
      const plainText = $getRoot().getTextContent();
      if (props.onChange) {
        props.onChange(markdown, { plainText });
      }
    });
  };

  const initialConfig = {
    namespace: "ScriboMarkdown",
    nodes: [...EditorNodes],
    onError: (error: Error): void => {
      throw error;
    },
    theme: EditorTheme,
    editorState: (): void => {
      $convertFromMarkdownString(props.initialMarkdown ?? "", TRANSFORMERS);
    },
  };

  return (
    <div className={`scribo-markdown-editor ${props.className || ""}`}>
      <LexicalComposer initialConfig={initialConfig}>
        <div
          className="editor-shell"
          onBlur={props.onBlur}
          data-testid={props["data-testid"]}
          id={props.id}
        >
          <ToolbarPlugin setIsLinkEditMode={setIsLinkEditMode} />
          <div className="editor-container rich-text">
            <HistoryPlugin />
            <ListPlugin />
            <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
            <LinkPlugin />
            <FloatingLinkEditorPlugin
              anchorElem={floatingAnchorElem}
              isLinkEditMode={isLinkEditMode}
              setIsLinkEditMode={setIsLinkEditMode}
            />
            <RichTextPlugin
              contentEditable={
                <div className="editor-scroller">
                  <div
                    className="editor"
                    ref={onRef}
                    id={props.id ? `${props.id}-editable` : undefined}
                  >
                    <ContentEditable />
                  </div>
                </div>
              }
              placeholder={<Placeholder>{props.placeholder}</Placeholder>}
              ErrorBoundary={LexicalErrorBoundary}
            />
          </div>
          {props.onChange && <OnChangePlugin onChange={internalOnChange} />}
        </div>
      </LexicalComposer>
    </div>
  );
};

export default MarkdownEditor;
