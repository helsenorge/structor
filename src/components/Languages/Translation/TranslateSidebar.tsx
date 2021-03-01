import React from 'react';
import { ActionType, Items, Languages } from '../../../store/treeStore/treeStore';
import { isItemControlSidebar } from '../../../helpers/itemControl';
import FormField from '../../FormField/FormField';
import MarkdownEditor from '../../MarkdownEditor/MarkdownEditor';
import { updateSidebarTranslationAction } from '../../../store/treeStore/treeActions';
import { TranslatableSidebarProperty } from '../../../types/LanguageTypes';

type TranslateSidebarProps = {
    targetLanguage: string;
    translations: Languages;
    items: Items;
    dispatch: React.Dispatch<ActionType>;
};

const TranslateSidebar = ({
    targetLanguage,
    translations,
    items,
    dispatch,
}: TranslateSidebarProps): JSX.Element | null => {
    const sidebarItems = Object.values(items).filter((item) => isItemControlSidebar(item));
    if (!sidebarItems || sidebarItems.length < 1) {
        return null;
    }

    const translatedSidebarItems = translations[targetLanguage].sidebarItems;
    const getTranslation = (linkId: string, propName: TranslatableSidebarProperty) => {
        if (translatedSidebarItems[linkId]) {
            return translatedSidebarItems[linkId][propName] || '';
        }
        return '';
    };

    const dispatchTranslation = (linkId: string, propName: TranslatableSidebarProperty, value: string) => {
        dispatch(updateSidebarTranslationAction(targetLanguage, linkId, propName, value));
    };

    return (
        <div>
            <div className="translation-section-header">Sidebar</div>
            {sidebarItems.map((item) => {
                if (!item.code || !item._text || !item._text.extension) {
                    return null;
                }
                const { code, display } = item.code[0];
                const { valueMarkdown } = item._text.extension[0];

                return (
                    <div key={item.linkId} className="translation-group">
                        <div className="translation-group-header">{code}</div>
                        <div className="translation-row">
                            <FormField>
                                <input defaultValue={display} disabled={true} />
                            </FormField>
                            <FormField>
                                <input
                                    defaultValue={getTranslation(item.linkId, TranslatableSidebarProperty.display)}
                                    onBlur={(event) =>
                                        dispatchTranslation(
                                            item.linkId,
                                            TranslatableSidebarProperty.display,
                                            event.target.value,
                                        )
                                    }
                                />
                            </FormField>
                        </div>
                        <div className="translation-row">
                            <FormField>
                                <MarkdownEditor data={valueMarkdown || ''} disabled={true} />
                            </FormField>
                            <FormField>
                                <MarkdownEditor
                                    data={getTranslation(item.linkId, TranslatableSidebarProperty.markdown)}
                                    onChange={(value) =>
                                        dispatchTranslation(item.linkId, TranslatableSidebarProperty.markdown, value)
                                    }
                                />
                            </FormField>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default TranslateSidebar;
