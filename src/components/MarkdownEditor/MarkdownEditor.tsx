/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react';
// @ts-ignore
import { CKEditor } from '@ckeditor/ckeditor5-react';
// @ts-ignore
import Editor from 'ckeditor5-custom-build/build/ckeditor';

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
        'indent',
        'outdent',
        '|',
        'blockQuote',
        'insertTable',
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
            onChange={(event: any, editor: any) => props.onChange(editor.getData())}
            editor={Editor}
            config={editorConfiguration}
            onReady={(editor: any) => {
                const plugins = [...editor.plugins._availablePlugins.values()].map((plugin: any) => plugin.pluginName);
                console.log(editor, plugins);
            }}
        />
    );
};

export default MarkdownEditor;
