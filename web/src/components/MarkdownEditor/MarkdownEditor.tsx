import { useEffect, useState } from "react";

import useDebounce from "./useDebounce";
import { MarkdownEditor as ScriboEditor } from "../../libs/markdown-editor/src/main";

interface MarkdownEditorProps {
  data: string;
  onBlur?: (data: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

const MarkdownEditor = (props: MarkdownEditorProps): React.JSX.Element => {
  const [markdown, setMarkdown] = useState(props.data);
  const debouncedMarkdown = useDebounce(markdown, 500);

  useEffect(() => {
    if (props.onBlur && debouncedMarkdown !== props.data) {
      props.onBlur(debouncedMarkdown);
    }
  }, [debouncedMarkdown]);

  const handleChange = (newMarkdown: string): void => {
    setMarkdown(newMarkdown);
  };

  const handleBlur = (): void => {
    if (props.onBlur) {
      props.onBlur(markdown);
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
