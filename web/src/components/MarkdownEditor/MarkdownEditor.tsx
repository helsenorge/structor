/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useState } from "react";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import { EventInfo } from "ckeditor5";

import Editor from "./Editor";

import "./MarkdownEditor.css";

interface MarkdownEditorProps {
  data: string;
  onBlur?: (data: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

const MarkdownEditor = (props: MarkdownEditorProps): React.JSX.Element => {
  const [value, setValue] = useState<string>(props.data);
  const handleChange = (
    _event: EventInfo<string, unknown>,
    editor: Editor,
  ): void => {
    setValue(editor.getData());
  };
  const handleBlur = (
    _event: EventInfo<string, unknown>,
    editor: Editor,
  ): void => {
    if (props.onBlur) {
      props.onBlur(editor.getData());
    }
  };

  const editorConfiguration = {
    toolbar: [
      "heading",
      "|",
      "bold",
      "italic",
      "link",
      "bulletedList",
      "numberedList",
      "|",
      "blockQuote",
      "|",
      "undo",
      "redo",
    ],
    language: "no-nb",
    placeholder: props.placeholder || "",
  };

  return (
    <CKEditor
      data={value}
      onChange={handleChange}
      onBlur={handleBlur}
      editor={Editor}
      config={editorConfiguration}
      disabled={props.disabled}
    />
  );
};

export default MarkdownEditor;
