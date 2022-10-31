import React, { FocusEvent, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { findTreeArray, TreeContext } from '../../store/treeStore/treeStore';
import { Extension, QuestionnaireItem } from '../../types/fhir';
import {
    deleteItemAction,
    newItemHelpIconAction,
    updateItemAction,
    updateLinkIdAction,
} from '../../store/treeStore/treeActions';
import HyperlinkTargetElementToggle from './HyperlinkTargetElementToggle';
import UriField from '../FormField/UriField';
import UndoIcon from '../../images/icons/arrow-undo-outline.svg';
import './AdvancedQuestionOptions.css';
import { ICodeSystem, IExtentionType, IItemProperty, IValueSetSystem } from '../../types/IQuestionnareItemType';
import SwitchBtn from '../SwitchBtn/SwitchBtn';
import Initial from './Initial/Initial';
import FormField from '../FormField/FormField';
import MarkdownEditor from '../MarkdownEditor/MarkdownEditor';
import {
    getHelpText,
    isItemControlHelp,
    isItemControlSummary,
    isItemControlSummaryContainer,
    ItemControlType,
    setItemControlExtension,
} from '../../helpers/itemControl';
import GuidanceAction from './Guidance/GuidanceAction';
import GuidanceParam from './Guidance/GuidanceParam';
import FhirPathSelect from './FhirPathSelect/FhirPathSelect';
import CalculatedExpression from './CalculatedExpression/CalculatedExpression';
import { createMarkdownExtension, removeItemExtension, setItemExtension } from '../../helpers/extensionHelper';
import InputField from '../InputField/inputField';
import {
    canTypeBeBeriket,
    canTypeBeReadonly,
    canTypeBeRepeatable,
    canTypeHaveCalculatedExpressionExtension,
    canTypeHaveHelp,
    canTypeHaveInitialValue,
    canTypeHavePlaceholderText,
    canTypeHavePrefix,
    canTypeHaveSummary,
} from '../../helpers/questionTypeFeatures';
import RadioBtn from '../RadioBtn/RadioBtn';
import { elementSaveCapability } from '../../helpers/QuestionHelper';
import { renderingOptions, removeItemCode, addItemCode, RenderingOptionsEnum } from '../../helpers/codeHelper';

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

    const dispatchUpdateItem = (name: IItemProperty, value: boolean) => {
        dispatch(updateItemAction(item.linkId, name, value));
    };

    const dispatchUpdateItemHelpText = (id: string, value: string) => {
        const newValue = createMarkdownExtension(value);
        dispatch(updateItemAction(id, IItemProperty._text, newValue));
    };

    const dispatchHelpText = () => {
        const helpItem = getHelpTextItem();
        if (helpItem) {
            dispatch(deleteItemAction(helpItem.linkId, [...parentArray, item.linkId]));
        } else {
            dispatch(newItemHelpIconAction([...parentArray, item.linkId]));
        }
    };

    function dispatchUpdateLinkId(event: FocusEvent<HTMLInputElement>): void {
        // Verify no duplicates
        if (isDuplicateLinkId || event.target.value === item.linkId) {
            return;
        }
        dispatch(updateLinkIdAction(item.linkId, event.target.value, parentArray));
    }

    function validateLinkId(linkIdToValidate: string): void {
        const hasLinkIdConflict = !(qItems[linkIdToValidate] === undefined || linkIdToValidate === item.linkId);
        setDuplicateLinkId(hasLinkIdConflict);
    }

    function resetLinkId(): void {
        setLinkId(item.linkId);
        validateLinkId(item.linkId);
    }

    const handleHelpText = (markdown: string): void => {
        const helpItem = getHelpTextItem();
        if (helpItem) {
            dispatchUpdateItemHelpText(helpItem.linkId, markdown);
        }
    };

    const getHelpTextForItem = (): string => {
        const helpItem = getHelpTextItem();
        return helpItem ? getHelpText(helpItem) : '';
    };

    const getHelpTextItem = (): QuestionnaireItem | undefined => {
        const selfArray = findTreeArray(parentArray, qOrder);
        const selfOrder = selfArray.find((node) => node.linkId === item.linkId)?.items || [];
        const helpItem = selfOrder.find((child) => isItemControlHelp(qItems[child.linkId]));
        return helpItem ? qItems[helpItem.linkId] : undefined;
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
    const hasSummaryExtension = isItemControlSummary(item);
    const hasSummaryContainerExtension = isItemControlSummaryContainer(item);

    const helpTextItem = getHelpTextItem();
    const checkedView = () => {
        return item.extension?.find((ex) => ex.url === IExtentionType.hidden)?.valueBoolean
            ? RenderingOptionsEnum.Hidden
            : item.code?.find((codee) => codee.system === ICodeSystem.renderOptionsCodeSystem)?.code ??
                  RenderingOptionsEnum.None;
    };
    const onChangeView = (newValue: string) => {
        removeItemExtension(item, IExtentionType.hidden, dispatch);
        removeItemCode(item, ICodeSystem.renderOptionsCodeSystem, dispatch);
        switch (newValue) {
            case RenderingOptionsEnum.Hidden:
                const extension = {
                    url: IExtentionType.hidden,
                    valueBoolean: true,
                };
                setItemExtension(item, extension, dispatch);
                break;
            default:
                addItemCode(item, newValue, dispatch);
                break;
        }
    };

    return (
        <>
            {canTypeBeReadonly(item) && (
                <div className="horizontal equal">
                    <FormField>
                        <SwitchBtn
                            onChange={() => dispatchUpdateItem(IItemProperty.readOnly, !item.readOnly)}
                            value={item.readOnly || false}
                            label={t('Read-only')}
                        />
                    </FormField>
                </div>
            )}
            {canTypeBeRepeatable(item) && (
                <FormField>
                    <SwitchBtn
                        onChange={(): void => {
                            if (item.repeats) {
                                removeItemExtension(
                                    item,
                                    [IExtentionType.repeatstext, IExtentionType.minOccurs, IExtentionType.maxOccurs],
                                    dispatch,
                                );
                            }
                            dispatchUpdateItem(IItemProperty.repeats, !item.repeats);
                        }}
                        value={item.repeats || false}
                        label={t('Repeatable')}
                    />
                    {item.repeats && (
                        <>
                            <FormField label={t('Repeat button text')}>
                                <InputField
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
                                <FormField label={t('Min answers')}>
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
                                </FormField>
                                <FormField label={t('max answers')}>
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
                                </FormField>
                            </div>
                        </>
                    )}
                </FormField>
            )}
            <HyperlinkTargetElementToggle item={item} />
            {canTypeHaveCalculatedExpressionExtension(item) && (
                <CalculatedExpression item={item} updateExtension={handleExtension} removeExtension={removeExtension} />
            )}
            {canTypeBeBeriket(item) && <FhirPathSelect item={item} />}
            {canTypeHavePlaceholderText(item) && (
                <FormField label={t('Placeholder text')}>
                    <InputField
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
            {canTypeHaveInitialValue(item) && (
                <div className="horizontal full">
                    <Initial item={item} />
                </div>
            )}
            <div className="horizontal full">
                <div className={`form-field ${isDuplicateLinkId ? 'field-error' : ''}`}>
                    <label>{t('LinkId')}</label>
                    <InputField
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
            {canTypeHavePrefix(item) && (
                <div className="horizontal full">
                    <FormField label={t('Prefix')} isOptional>
                        <InputField
                            defaultValue={item.prefix}
                            onBlur={(e) => {
                                dispatch(updateItemAction(item.linkId, IItemProperty.prefix, e.target.value));
                            }}
                        />
                    </FormField>
                </div>
            )}
            <div className="horizontal full">
                <FormField label={t('Definition')} isOptional>
                    <UriField
                        value={item.definition}
                        onBlur={(e) => {
                            dispatch(updateItemAction(item.linkId, IItemProperty.definition, e.target.value));
                        }}
                    />
                </FormField>
            </div>
            {canTypeHaveHelp(item) && (
                <div>
                    <FormField>
                        <SwitchBtn
                            onChange={() => dispatchHelpText()}
                            value={!!helpTextItem}
                            label={t('Enable help button')}
                        />
                    </FormField>
                    {!!helpTextItem && (
                        <FormField label={t('Enter a helping text')}>
                            <MarkdownEditor data={getHelpTextForItem()} onBlur={handleHelpText} />
                        </FormField>
                    )}
                </div>
            )}
            <GuidanceAction item={item} />
            <GuidanceParam item={item} />
            {canTypeHaveSummary(item) && (
                <div>
                    <FormField>
                        <SwitchBtn
                            onChange={() => {
                                setItemControlExtension(item, ItemControlType.summary, dispatch);
                            }}
                            value={hasSummaryExtension}
                            label={t('Put in PDF first')}
                        />
                    </FormField>
                    <FormField>
                        <SwitchBtn
                            onChange={() => {
                                setItemControlExtension(item, ItemControlType.summaryContainer, dispatch);
                            }}
                            value={hasSummaryContainerExtension}
                            label={t('Mark group in PDF')}
                        />
                    </FormField>
                </div>
            )}
            <FormField label={t('View')}>
                <RadioBtn
                    onChange={onChangeView}
                    checked={checkedView()}
                    options={renderingOptions}
                    name={'elementView-radio'}
                />
            </FormField>
            <FormField label={t('Save capabilities')}>
                <RadioBtn
                    onChange={(newValue: string) => {
                        if (newValue === '0') {
                            removeExtension(IExtentionType.saveCapability);
                        } else {
                            setItemExtension(
                                item,
                                {
                                    url: IExtentionType.saveCapability,
                                    valueCoding: {
                                        system: IValueSetSystem.saveCapabilityValueSet,
                                        code: newValue,
                                    },
                                },
                                dispatch,
                            );
                        }
                    }}
                    checked={
                        item.extension?.find((ex) => ex.url === IExtentionType.saveCapability)?.valueCoding?.code ?? '0'
                    }
                    options={elementSaveCapability}
                    name={'elementSaveCapability-radio'}
                />
            </FormField>
        </>
    );
};

export default AdvancedQuestionOptions;
