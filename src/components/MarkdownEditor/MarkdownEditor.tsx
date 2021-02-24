/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useEffect, useState } from 'react';
// @ts-ignore
import { CKEditor } from '@ckeditor/ckeditor5-react';
// @ts-ignore
import Editor from '@helsenorge/ckeditor5-build-markdown';

import './MarkdownEditor.css';
import useDebounce from './useDebounce';

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
};

interface MarkdownEditorProps {
    data: string;
    onChange: (data: string) => void;
}

const MarkdownEditor = (props: MarkdownEditorProps): JSX.Element => {
    const [value, setValue] = useState<string>(props.data);
    const debouncedValue = useDebounce<string>(value, 500);
    const handleChange = (event: Event, editor: Editor) => {
        setValue(editor.getData());
    };

    useEffect(() => {
        props.onChange(debouncedValue);
    }, [debouncedValue]);

    return <CKEditor data={value} onChange={handleChange} editor={Editor} config={editorConfiguration} />;
};

export default MarkdownEditor;
