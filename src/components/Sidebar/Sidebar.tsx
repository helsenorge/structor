import React, { useContext } from 'react';
import { deleteItemAction, newItemSidebar, updateItemAction } from '../../store/treeStore/treeActions';
import { TreeContext } from '../../store/treeStore/treeStore';
import { Coding } from '../../types/fhir';
import { IExtentionType, IItemProperty, IQuestionnaireItemType } from '../../types/IQuestionnareItemType';
import Accordion from '../Accordion/Accordion';
import Btn from '../Btn/Btn';
import FormField from '../FormField/FormField';
import MarkdownEditor from '../MarkdownEditor/MarkdownEditor';

const Sidebar = (): JSX.Element => {
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
                ?.find((x) => x.url === IExtentionType.itemControl)
                ?.valueCodeableConcept?.coding?.find((y) => y.code === 'sidebar'),
    );

    const findCurrentCode = (linkId: string) => {
        return state.qItems[linkId].code?.find((x) => x.system === IExtentionType.sotHeader);
    };

    const handleChangeCode = (code: string, linkId: string) => {
        const currentCode = findCurrentCode(linkId);
        const newCode = [{ ...currentCode, code }] as Coding[];
        dispatch(updateItemAction(linkId, IItemProperty.code, newCode));
    };

    const handleChangeDisplay = (display: string, linkId: string) => {
        const currentCode = findCurrentCode(linkId);
        const newCode = [{ ...currentCode, display }] as Coding[];
        dispatch(updateItemAction(linkId, IItemProperty.code, newCode));
    };

    const handleMarkdown = (linkId: string, value: string) => {
        const newValue = {
            extension: [
                {
                    url: IExtentionType.markdown,
                    valueMarkdown: value,
                },
            ],
        };

        dispatch(updateItemAction(linkId, IItemProperty._text, newValue));
    };

    const getMarkdown = (linkId: string) =>
        state.qItems[linkId]?.extension?.find((x) => x.url === IExtentionType.markdown)?.valueMarkdown ?? '';

    return (
        <Accordion title="Sidebar">
            {sidebarItems.map((x, index) => {
                return (
                    <div key={index}>
                        <div className="horizontal equal">
                            <FormField label="Gruppe kode">
                                <input
                                    placeholder="legg inn en kode (f.eks) SOT-2"
                                    defaultValue={findCurrentCode(x.linkId)?.code}
                                    onBlur={(event) => handleChangeCode(event.target.value, x.linkId)}
                                />
                            </FormField>
                            <FormField label="Overskrift">
                                <input
                                    placeholder="Legg inn overskrift"
                                    defaultValue={findCurrentCode(x.linkId)?.display}
                                    onBlur={(event) => handleChangeDisplay(event.target.value, x.linkId)}
                                />
                            </FormField>
                        </div>
                        <FormField label="Innhold">
                            <MarkdownEditor
                                data={getMarkdown(x.linkId)}
                                onChange={(markdown) => handleMarkdown(x.linkId, markdown)}
                            />
                        </FormField>
                        <div className="center-text">
                            <Btn
                                title="- Fjern element"
                                type="button"
                                size="small"
                                variant="secondary"
                                onClick={() => removeSidebar(x.linkId)}
                            />
                        </div>
                        <hr style={{ margin: '24px 0px' }} />
                    </div>
                );
            })}
            <div className="center-text">
                <Btn
                    title="+ Legg til element"
                    type="button"
                    size="small"
                    variant="primary"
                    onClick={dispatchNewSidebar}
                />
            </div>
        </Accordion>
    );
};

export default Sidebar;
