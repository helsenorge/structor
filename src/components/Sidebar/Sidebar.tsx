import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { createMarkdownExtension } from '../../helpers/extensionHelper';
import { ItemControlType } from '../../helpers/itemControl';
import { deleteItemAction, newItemSidebar, updateItemAction } from '../../store/treeStore/treeActions';
import { TreeContext } from '../../store/treeStore/treeStore';
import { Coding } from '../../types/fhir';
import {
    IExtentionType,
    IItemProperty,
    IQuestionnaireItemType,
    IValueSetSystem,
} from '../../types/IQuestionnareItemType';
import Accordion from '../Accordion/Accordion';
import Btn from '../Btn/Btn';
import FormField from '../FormField/FormField';
import MarkdownEditor from '../MarkdownEditor/MarkdownEditor';
import Select from '../Select/Select';

const Sidebar = (): JSX.Element => {
    const { t } = useTranslation();
    const { state, dispatch } = useContext(TreeContext);

    const dispatchNewSidebar = () => {
        dispatch(newItemSidebar([]));
    };

    const removeSidebar = (linkId: string) => {
        dispatch(deleteItemAction(linkId, []));
    };

    const sidebarItems = state.qOrder.filter(
        (x) =>
            state.qItems[x.linkId].type === IQuestionnaireItemType.text &&
            state.qItems[x.linkId].extension
                ?.find((ex) => ex.url === IExtentionType.itemControl)
                ?.valueCodeableConcept?.coding?.find((y) => y.code === ItemControlType.sidebar),
    );

    const findCurrentCode = (linkId: string) => {
        return state.qItems[linkId].code?.find((x) => x.system === IValueSetSystem.sotHeader);
    };

    const handleChangeCode = (code: string, linkId: string) => {
        const currentCode = findCurrentCode(linkId);
        const newCode = [{ ...currentCode, display: code, code }] as Coding[];
        dispatch(updateItemAction(linkId, IItemProperty.code, newCode));
    };

    const handleMarkdown = (linkId: string, value: string) => {
        const newValue = createMarkdownExtension(value);
        dispatch(updateItemAction(linkId, IItemProperty._text, newValue));
    };

    const getMarkdown = (linkId: string) => {
        return (
            state.qItems[linkId]?._text?.extension?.find((x) => x.url === IExtentionType.markdown)?.valueMarkdown ?? ''
        );
    };

    return (
        <Accordion title={t('Sidebar')}>
            {sidebarItems.map((x, index) => {
                return (
                    <div key={index}>
                        <FormField label={t('Sidebar heading')}>
                            <Select
                                placeholder={t('select sidebar heading:')}
                                options={[
                                    {
                                        code: 'SOT-1',
                                        display: t('Options regarding completion (SOT-1)'),
                                    },
                                    {
                                        code: 'SOT-2',
                                        display: t('Guidance and person responsible (SOT-2)'),
                                    },
                                    {
                                        code: 'SOT-3',
                                        display: t('Processing by the recipient (SOT-3)'),
                                    },
                                ]}
                                value={findCurrentCode(x.linkId)?.code}
                                onChange={(event) => handleChangeCode(event.target.value, x.linkId)}
                            />
                        </FormField>
                        <FormField label={t('Content')}>
                            <MarkdownEditor
                                data={getMarkdown(x.linkId)}
                                onBlur={(markdown) => handleMarkdown(x.linkId, markdown)}
                            />
                        </FormField>
                        <div className="center-text">
                            <Btn
                                title={t('- Remove element')}
                                type="button"
                                variant="secondary"
                                onClick={() => removeSidebar(x.linkId)}
                            />
                        </div>
                        <hr style={{ margin: '24px 0px' }} />
                    </div>
                );
            })}
            <div className="center-text">
                <Btn title={t('+ Add element')} type="button" variant="primary" onClick={dispatchNewSidebar} />
            </div>
        </Accordion>
    );
};

export default Sidebar;
