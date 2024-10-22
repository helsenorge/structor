/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useState } from 'react';
// @ts-ignore
import { CKEditor, EventInfo  } from '@ckeditor/ckeditor5-react';
// @ts-ignore
import Editor from './Editor';

import './MarkdownEditor.css';

interface MarkdownEditorProps {
    data: string;
    onBlur?: (data: string) => void;
    disabled?: boolean;
    placeholder?: string;
}

const MarkdownEditor = (props: MarkdownEditorProps): React.JSX.Element => {
    const [value, setValue] = useState<string>(props.data);
    const handleChange = (event: EventInfo, editor: Editor) => {
        setValue(editor.getData());
    };
    const handleBlur = (event: EventInfo, editor: Editor) => {
        if (props.onBlur) {
            props.onBlur(editor.getData());
        }
    };

    const editorConfiguration = {
        toolbar: [
            'heading',
            '|',
            'bold',
            'italic',
            'link',
            'bulletedList',
            'numberedList',
            '|',
            'blockQuote',
            '|',
            'undo',
            'redo',
        ],
        language: 'no-nb',
        placeholder: props.placeholder || '',
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
