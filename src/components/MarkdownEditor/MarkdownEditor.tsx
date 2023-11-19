import { EditorState, Modifier, RichUtils, convertFromRaw, convertToRaw } from 'draft-js';
import { draftToMarkdown, markdownToDraft } from 'markdown-draft-js';
import React, { useState } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './MarkdownEditor.css';
interface MarkdownEditorProps {
    data: string;
    onBlur?: (data: string) => void;
    disabled?: boolean;
    placeholder?: string;
}

const MarkdownEditor = (props: MarkdownEditorProps): JSX.Element => {
    const rawData = markdownToDraft(props.data);
    const contentState = convertFromRaw(rawData);

    const [editorState, setEditorState] = useState(() => EditorState.createWithContent(contentState));

    const content = editorState.getCurrentContent();

    const handleBlur = () => {
        const rawObject = convertToRaw(content);
        const markdownString = draftToMarkdown(rawObject);

        if (props.onBlur) {
            props.onBlur(markdownString);
        }
    };

    const removeSelectedBlocksStyle = (editorState: EditorState) => {
        const newContentState = RichUtils.tryToRemoveBlockStyle(editorState);
        if (newContentState) {
            return EditorState.push(editorState, newContentState, 'change-block-type');
        }
        return editorState;
    };

    const getResetEditorState = (editorState: EditorState) => {
        const blocks = editorState.getCurrentContent().getBlockMap().toList();
        const updatedSelection = editorState.getSelection().merge({
            anchorKey: blocks.first().get('key'),
            anchorOffset: 0,
            focusKey: blocks.last().get('key'),
            focusOffset: blocks.last().getLength(),
        });
        const newContentState = Modifier.removeRange(editorState.getCurrentContent(), updatedSelection, 'forward');

        const newState = EditorState.push(editorState, newContentState, 'remove-range');
        return removeSelectedBlocksStyle(newState);
    };

    function getCurrentBlock(editorState: EditorState) {
        const currentSelection = editorState.getSelection();
        const blockKey = currentSelection.getStartKey();
        return editorState.getCurrentContent().getBlockForKey(blockKey);
    }

    function getCurrentLetter(editorState: EditorState) {
        const currentBlock = getCurrentBlock(editorState);
        const blockText = currentBlock.getText();
        return blockText[editorState.getSelection().getStartOffset() - 1];
    }

    const handleEditorStateChange = (newEditorState: EditorState) => {
        const letter = getCurrentLetter(newEditorState);
        const lastChangedType = newEditorState.getLastChangeType();

        if (!letter && lastChangedType === 'backspace-character') {
            const reset = getResetEditorState(editorState);
            setEditorState(reset);
            return;
        }

        setEditorState(newEditorState);
    };

    return (
        <Editor
            editorState={editorState}
            toolbarClassName="draft-js-editor-toolbar"
            editorClassName="draft-js-editor-container"
            wrapperClassName="draft-js-container"
            onEditorStateChange={handleEditorStateChange}
            toolbar={{
                options: ['blockType', 'inline', 'link', 'list', 'history'],
                inline: {
                    inDropdown: false,
                    options: ['bold', 'italic'],
                    className: 'draft-js-editor-toolbar-separator',
                },
                list: {
                    inDropdown: false,
                    options: ['unordered', 'ordered'],
                    className: 'draft-js-editor-toolbar-separator',
                },
                history: {
                    className: 'draft-js-editor-toolbar-separator',
                },
                link: {
                    inDropdown: false,
                    options: ['link'],
                    className: 'draft-js-editor-toolbar-separator',
                },
                blockType: {
                    inDropdown: true,
                    options: ['Normal', 'H1', 'H2', 'H3', 'Blockquote'],
                },
            }}
            placeholder={props.placeholder}
            onBlur={handleBlur}
            localization={{ locale: 'ar', translations: editorLabels }}
        />
    );
};

const editorLabels = {
    'components.controls.blocktype.h1': 'Heading 1',
    'components.controls.blocktype.h2': 'Heading 2',
    'components.controls.blocktype.h3': 'Heading 3',
    'components.controls.blocktype.blockquote': 'Blockquote',
    'components.controls.blocktype.normal': 'Paragraph',
};
export default MarkdownEditor;
