import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { TreeContext } from '../../../store/treeStore/treeStore';
import FormField from '../../FormField/FormField';
import MarkdownEditor from '../../MarkdownEditor/MarkdownEditor';
import { findElementInTreeArray } from '../../../helpers/treeHelper';
import { IItemProperty } from '../../../types/IQuestionnareItemType';
import { updateItemAction } from '../../../store/treeStore/treeActions';
import { createMarkdownExtension } from '../../../helpers/extensionHelper';

type InlineProps = {
    linkId: string;
    parentArray: Array<string>;
};

const Inline = ({ linkId, parentArray }: InlineProps): JSX.Element => {
    const { t } = useTranslation();
    const {
        state: { qItems, qOrder },
        dispatch,
    } = useContext(TreeContext);

    const dispatchUpdateMarkdown = (markdown: string) => {
        const markdownValue = createMarkdownExtension(markdown);
        dispatch(updateItemAction(currentItem.linkId, IItemProperty._text, markdownValue));
        dispatch(updateItemAction(currentItem.linkId, IItemProperty.text, markdown));
    };

    const searchPath = [...parentArray, linkId];
    const children = findElementInTreeArray(searchPath, qOrder);
    // Inline elements should always have only one child item and it must contain markdown
    const currentItem = qItems[children[0].linkId];
    const markdownText = currentItem._text?.extension ? currentItem._text.extension[0].valueMarkdown || '' : '';

    return (
        <FormField label={t('Expanded text')}>
            <MarkdownEditor data={markdownText} onBlur={dispatchUpdateMarkdown} />
        </FormField>
    );
};

export default Inline;
