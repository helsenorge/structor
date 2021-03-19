import React, { useContext } from 'react';
import { TreeContext } from '../../../store/treeStore/treeStore';
import FormField from '../../FormField/FormField';
import MarkdownEditor from '../../MarkdownEditor/MarkdownEditor';
import { findElementInTreeArray } from '../../../helpers/treeHelper';
import { IExtentionType, IItemProperty } from '../../../types/IQuestionnareItemType';
import { updateExtensionValue } from '../../../helpers/extensionHelper';
import { updateItemAction } from '../../../store/treeStore/treeActions';

type InlineProps = {
    linkId: string;
    parentArray: Array<string>;
};

const Inline = ({ linkId, parentArray }: InlineProps): JSX.Element => {
    const {
        state: { qItems, qOrder },
        dispatch,
    } = useContext(TreeContext);

    const dispatchUpdateMarkdown = (markdown: string) => {
        const markdownValue = {
            url: IExtentionType.markdown,
            valueMarkdown: markdown,
        };
        const newExtension = updateExtensionValue(currentItem._text, markdownValue);
        dispatch(updateItemAction(currentItem.linkId, IItemProperty._text, { extension: newExtension }));
        dispatch(updateItemAction(currentItem.linkId, IItemProperty.text, markdown));
    };

    const searchPath = [...parentArray, linkId];
    const children = findElementInTreeArray(searchPath, qOrder);
    // Inline elements should always have only one child item and it must contain markdown
    const currentItem = qItems[children[0].linkId];
    const markdownText = currentItem._text?.extension ? currentItem._text.extension[0].valueMarkdown || '' : '';

    return (
        <FormField label="Tekst">
            <MarkdownEditor data={markdownText} onBlur={dispatchUpdateMarkdown} />
        </FormField>
    );
};

export default Inline;
