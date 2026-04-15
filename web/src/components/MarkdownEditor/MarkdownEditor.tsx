import { useEffect, useState } from "react";

import useDebounce from "./useDebounce";
import {
  MarkdownEditor as ScriboEditor,
  type onChangeMisc,
} from "../../libs/markdown-editor/src/main";

interface MarkdownEditorProps {
  data: string;
  onBlur?: (data: string, plainText?: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

const MarkdownEditor = (props: MarkdownEditorProps): React.JSX.Element => {
  const [markdown, setMarkdown] = useState(props.data);
  const [plainText, setPlainText] = useState("");
  const debouncedMarkdown = useDebounce(markdown, 250);

  useEffect(() => {
    if (props.onBlur && debouncedMarkdown !== props.data) {
      props.onBlur(debouncedMarkdown, plainText);
    }
  }, [debouncedMarkdown]);

  const handleChange = (newMarkdown: string, misc: onChangeMisc): void => {
    setMarkdown(newMarkdown);
    setPlainText(misc.plainText);
  };

  const handleBlur = (): void => {
    if (props.onBlur) {
      props.onBlur(markdown, plainText);
    }
  };

  if (props.disabled) {
    return <div className="markdown-preview">{props.data}</div>;
  }

  return (
    <ScriboEditor
      initialMarkdown={props.data}
      onChange={handleChange}
      onBlur={handleBlur}
      placeholder={props.placeholder || ""}
    />
  );
};

export default MarkdownEditor;
