import React, { FocusEvent, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TreeContext } from '../../store/treeStore/treeStore';
import { Extension, QuestionnaireItem } from '../../types/fhir';
import {
    deleteItemAction,
    newItemHelpIconAction,
    updateItemAction,
    updateLinkIdAction,
} from '../../store/treeStore/treeActions';
import UndoIcon from '../../images/icons/arrow-undo-outline.svg';
import './AdvancedQuestionOptions.css';
import {
    IExtentionType,
    IItemProperty,
    IQuestionnaireItemType,
    IValueSetSystem,
} from '../../types/IQuestionnareItemType';
import SwitchBtn from '../SwitchBtn/SwitchBtn';
import Initial from './Initial/Initial';
import FormField from '../FormField/FormField';
import MarkdownEditor from '../MarkdownEditor/MarkdownEditor';
import { isItemControlHelp, isItemControlInline, ItemControlType } from '../../helpers/itemControl';
import GuidanceAction from './Guidance/GuidanceAction';
import GuidanceParam from './Guidance/GuidanceParam';
import FhirPathSelect from './FhirPathSelect/FhirPathSelect';
import CalculatedExpression from './CalculatedExpression/CalculatedExpression';
import { removeItemExtension, setItemExtension } from '../../helpers/extensionHelper';

type AdvancedQuestionOptionsProps = {
    item: QuestionnaireItem;
    parentArray: Array<string>;
};

const AdvancedQuestionOptions = ({ item, parentArray }: AdvancedQuestionOptionsProps): JSX.Element => {
    const { t } = useTranslation();
    const { state, dispatch } = useContext(TreeContext);
    const [isDuplicateLinkId, setDuplicateLinkId] = useState(false);
    const [linkId, setLinkId] = useState(item.linkId);
    const { qItems, qOrder } = state;

    const isInitialApplicable =
        item.type !== IQuestionnaireItemType.display && item.type !== IQuestionnaireItemType.group;

    const isCalculatedExpressionApplicable =
        item.type === IQuestionnaireItemType.integer ||
        item.type === IQuestionnaireItemType.decimal ||
        item.type === IQuestionnaireItemType.quantity;

    const dispatchUpdateItem = (name: IItemProperty, value: boolean) => {
        dispatch(updateItemAction(item.linkId, name, value));
    };

    const dispatchUpdateItemHelpText = (id: string, value: string) => {
        const newValue = {
            extension: [
                {
                    url: IExtentionType.markdown,
                    valueMarkdown: value,
                },
            ],
        };

        dispatch(updateItemAction(id, IItemProperty._text, newValue));
    };

    const dispatchHelpText = () => {
        const textItem = getHelpTextItem();
        if (textItem.exist && textItem.linkId) {
            dispatch(deleteItemAction(textItem.linkId, [...parentArray, item.linkId]));
        } else {
            dispatch(newItemHelpIconAction([...parentArray, item.linkId]));
        }
    };

    function dispatchUpdateLinkId(event: FocusEvent<HTMLInputElement>) {
        // Verify no duplicates
        if (isDuplicateLinkId || event.target.value === item.linkId) {
            return;
        }
        dispatch(updateLinkIdAction(item.linkId, event.target.value, parentArray));
    }

    function validateLinkId(linkIdToValidate: string) {
        if (qItems[linkIdToValidate] === undefined || linkIdToValidate === item.linkId) {
            setDuplicateLinkId(false);
        } else {
            setDuplicateLinkId(true);
        }
    }

    function resetLinkId() {
        setLinkId(item.linkId);
        validateLinkId(item.linkId);
    }

    function search(value: string, reverse = false) {
        const parrentLinkID = parentArray.length > 0 ? parentArray[0] : item.linkId;
        const hierarchyToSearch = qOrder.findIndex((x) => x.linkId === parrentLinkID);
        const stack = [qOrder[hierarchyToSearch]];
        while (stack.length) {
            const node = stack[reverse ? 'pop' : 'shift']();
            if (node && node['linkId'] === value) return node;
            node && node.items && stack.push(...node.items);
        }
        return null;
    }

    const handleHelpText = (markdown: string) => {
        const children = search(item.linkId)?.items;
        children?.forEach((x) => {
            if (isItemControlHelp(qItems[x.linkId])) {
                dispatchUpdateItemHelpText(qItems[x.linkId].linkId, markdown);
            }
        });
    };

    const getHelpTextItem = () => {
        const children = search(item.linkId)?.items;
        let _text = '';
        let exist = false;
        let helpTextLinkId = '';
        children?.forEach((x) => {
            if (isItemControlHelp(qItems[x.linkId])) {
                _text =
                    qItems[x.linkId]._text?.extension?.find((ex) => ex.url === IExtentionType.markdown)
                        ?.valueMarkdown ?? '';
                exist = true;
                helpTextLinkId = x.linkId;
            }
        });

        return { exist, linkId: helpTextLinkId, _text };
    };

    const handleExtension = (extension: Extension) => {
        setItemExtension(item, extension, dispatch);
    };

    const removeExtension = (extensionUrl: IExtentionType) => {
        removeItemExtension(item, extensionUrl, dispatch);
    };

    const getPlaceholder = item?.extension?.find((x) => x.url === IExtentionType.entryFormat)?.valueString ?? '';
    const getRepeatsText = item?.extension?.find((x) => x.url === IExtentionType.repeatstext)?.valueString ?? '';
    const minOccurs = item?.extension?.find((x) => x.url === IExtentionType.minOccurs)?.valueInteger;
    const maxOccurs = item?.extension?.find((x) => x.url === IExtentionType.maxOccurs)?.valueInteger;
    const hasSummaryExtension = !!item?.extension?.find((x) =>
        x.valueCodeableConcept?.coding?.filter((y) => y.code === ItemControlType.summary),
    );

    const isInlineItem = isItemControlInline(item);
    const helpTextItem = getHelpTextItem();
    const isHiddenItem = item.extension?.some((ext) => ext.url === IExtentionType.hidden && ext.valueBoolean);
    const isBerikingSupported =
        item.type === IQuestionnaireItemType.string ||
        item.type === IQuestionnaireItemType.boolean ||
        item.type === IQuestionnaireItemType.quantity ||
        item.type === IQuestionnaireItemType.integer ||
        item.type === IQuestionnaireItemType.decimal;

    return (
        <>
            {item.type !== IQuestionnaireItemType.display && (
                <>
                    <div className="horizontal equal">
                        <div className="form-field">
                            <SwitchBtn
                                onChange={() => dispatchUpdateItem(IItemProperty.readOnly, !item.readOnly)}
                                value={item.readOnly || false}
                                label={t('Read-only')}
                                initial
                            />
                        </div>
                        <div className="form-field">
                            <SwitchBtn
                                onChange={() => {
                                    if (isHiddenItem) {
                                        removeItemExtension(item, IExtentionType.hidden, dispatch);
                                    } else {
                                        const extension = {
                                            url: IExtentionType.hidden,
                                            valueBoolean: true,
                                        };
                                        setItemExtension(item, extension, dispatch);
                                    }
                                }}
                                value={isHiddenItem || false}
                                label={t('Hidden field')}
                                initial
                            />
                        </div>
                    </div>
                    <div className="form-field">
                        <SwitchBtn
                            onChange={(): void => {
                                if (item.repeats) {
                                    removeItemExtension(
                                        item,
                                        [
                                            IExtentionType.repeatstext,
                                            IExtentionType.minOccurs,
                                            IExtentionType.maxOccurs,
                                        ],
                                        dispatch,
                                    );
                                }
                                dispatchUpdateItem(IItemProperty.repeats, !item.repeats);
                            }}
                            value={item.repeats || false}
                            label={t('Repeatable')}
                            initial
                        />
                        {item.repeats && (
                            <>
                                <FormField label={t('Repeat button text')}>
                                    <input
                                        defaultValue={getRepeatsText}
                                        onBlur={(e) => {
                                            if (e.target.value) {
                                                handleExtension({
                                                    url: IExtentionType.repeatstext,
                                                    valueString: e.target.value,
                                                });
                                            } else {
                                                removeExtension(IExtentionType.repeatstext);
                                            }
                                        }}
                                    />
                                </FormField>
                                <div className="horizontal equal">
                                    <div className="form-field">
                                        <label className="#">{t('Min answers')}</label>
                                        <input
                                            type="number"
                                            defaultValue={minOccurs}
                                            onBlur={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                if (!event.target.value) {
                                                    removeExtension(IExtentionType.minOccurs);
                                                } else {
                                                    const extension = {
                                                        url: IExtentionType.minOccurs,
                                                        valueInteger: parseInt(event.target.value),
                                                    };
                                                    handleExtension(extension);
                                                }
                                            }}
                                        />
                                    </div>
                                    <div className="form-field">
                                        <label className="#">{t('Max answers')}</label>
                                        <input
                                            type="number"
                                            defaultValue={maxOccurs}
                                            onBlur={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                if (!event.target.value) {
                                                    removeExtension(IExtentionType.maxOccurs);
                                                } else {
                                                    const extension = {
                                                        url: IExtentionType.maxOccurs,
                                                        valueInteger: parseInt(event.target.value),
                                                    };
                                                    handleExtension(extension);
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </>
            )}
            {isCalculatedExpressionApplicable && (
                <CalculatedExpression item={item} updateExtension={handleExtension} removeExtension={removeExtension} />
            )}
            {isBerikingSupported && <FhirPathSelect item={item} />}
            {(item.type === IQuestionnaireItemType.string || item.type === IQuestionnaireItemType.text) && (
                <FormField label={t('Placeholder text')}>
                    <input
                        defaultValue={getPlaceholder}
                        onBlur={(e) => {
                            if (e.target.value) {
                                handleExtension({
                                    url: IExtentionType.entryFormat,
                                    valueString: e.target.value,
                                });
                            } else {
                                removeExtension(IExtentionType.entryFormat);
                            }
                        }}
                    />
                </FormField>
            )}
            {isInitialApplicable && (
                <div className="horizontal full">
                    <Initial item={item} />
                </div>
            )}
            <div className="horizontal full">
                <div className={`form-field ${isDuplicateLinkId ? 'field-error' : ''}`}>
                    <label>{t('LinkId')}</label>
                    <input
                        value={linkId}
                        onChange={(event) => {
                            const {
                                target: { value: newLinkId },
                            } = event;
                            validateLinkId(newLinkId);
                            setLinkId(event.target.value);
                        }}
                        onBlur={dispatchUpdateLinkId}
                    />
                    {isDuplicateLinkId && (
                        <div className="msg-error" aria-live="polite">
                            {`${t('LinkId is already in use')} `}
                            <button onClick={resetLinkId}>
                                <img src={UndoIcon} height={16} />
                                {` ${t('Sett tilbake til opprinnelig verdi')}`}
                            </button>
                        </div>
                    )}
                </div>
            </div>
            {!isInlineItem && (
                <div>
                    <FormField>
                        <SwitchBtn
                            onChange={() => dispatchHelpText()}
                            value={helpTextItem.exist}
                            label={t('Enable help button')}
                            initial
                        />
                    </FormField>
                    {helpTextItem.exist && (
                        <FormField label={t('Enter a helping text')}>
                            <MarkdownEditor data={helpTextItem._text} onBlur={handleHelpText} />
                        </FormField>
                    )}
                </div>
            )}
            <GuidanceAction item={item} />
            <GuidanceParam item={item} />
            {item.type === IQuestionnaireItemType.group && (
                <FormField>
                    <SwitchBtn
                        onChange={() => {
                            if (hasSummaryExtension) {
                                removeExtension(IExtentionType.itemControl);
                            } else {
                                handleExtension({
                                    url: IExtentionType.itemControl,
                                    valueCodeableConcept: {
                                        coding: [
                                            {
                                                system: IValueSetSystem.itemControlValueSet,
                                                code: ItemControlType.summary,
                                            },
                                        ],
                                    },
                                });
                            }
                        }}
                        value={hasSummaryExtension}
                        label={t('Enable summary')}
                        initial
                    />
                </FormField>
            )}
        </>
    );
};

export default AdvancedQuestionOptions;
