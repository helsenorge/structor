/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react';
// @ts-ignore
import { CKEditor } from '@ckeditor/ckeditor5-react';
// @ts-ignore
import Editor from '@helsenorge/ckeditor5-build-markdown';

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
    return (
        <CKEditor
            data={props.data}
            onChange={(event: Event, editor: Editor) => props.onChange(editor.getData())}
            editor={Editor}
            config={editorConfiguration}
        />
    );
};

export default MarkdownEditor;
