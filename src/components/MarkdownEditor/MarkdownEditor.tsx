import React, { useState } from 'react';
import ReactMde from 'react-mde';
import * as Showdown from 'showdown';

import 'react-mde/lib/styles/css/react-mde-all.css';

const converter = new Showdown.Converter({
    tables: true,
    simplifiedAutoLink: true,
    strikethrough: true,
    tasklists: true,
});

interface MarkdownEditorProps {
    data: string;
    onChange: (data: string) => void;
}

const MarkdownEditor = (props: MarkdownEditorProps): JSX.Element => {
    const [selectedTab, setSelectedTab] = useState<'write' | 'preview'>('write');

    return (
        <ReactMde
            value={props.data}
            onChange={props.onChange}
            selectedTab={selectedTab}
            onTabChange={setSelectedTab}
            generateMarkdownPreview={(markdown) => Promise.resolve(converter.makeHtml(markdown))}
        />
    );
};

export default MarkdownEditor;
