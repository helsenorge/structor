import {
  $convertFromMarkdownString,
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
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";

import EditorNodes from "../../libs/markdown-editor/src/nodes/EditorNodes";
import EditorTheme from "../../libs/markdown-editor/src/themes/EditorTheme";
import ContentEditable from "../../libs/markdown-editor/src/ui/ContentEditable";
import "./ReadOnlyMarkdown.css";

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

interface ReadOnlyMarkdownProps {
  data: string;
}

export const ReadOnlyMarkdown = ({
  data,
}: ReadOnlyMarkdownProps): React.JSX.Element => {
  const initialConfig = {
    namespace: "ReadOnlyMarkdown",
    nodes: [...EditorNodes],
    editable: false,
    onError: (error: Error): void => {
      throw error;
    },
    theme: EditorTheme,
    editorState: (): void => {
      $convertFromMarkdownString(data, TRANSFORMERS);
    },
  };

  return (
    <div className="readonly-markdown">
      <LexicalComposer initialConfig={initialConfig}>
        <RichTextPlugin
          contentEditable={
            <div>
              <ContentEditable />
            </div>
          }
          placeholder={null}
          ErrorBoundary={LexicalErrorBoundary}
        />
      </LexicalComposer>
    </div>
  );
};
