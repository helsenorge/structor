import React, { FocusEvent, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { findTreeArray, TreeContext } from '../../store/treeStore/treeStore';
import { Extension, QuestionnaireItem, ValueSetComposeIncludeConcept } from '../../types/fhir';
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
    isItemControlDataReceiver,
} from '../../helpers/itemControl';
import GuidanceAction from './Guidance/GuidanceAction';
import GuidanceParam from './Guidance/GuidanceParam';
import FhirPathSelect from './FhirPathSelect/FhirPathSelect';
import CalculatedExpression from './CalculatedExpression/CalculatedExpression';
import CopyFrom from './CopyFrom/CopyFrom';
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
    conditionalArray: ValueSetComposeIncludeConcept[];
    getItem: (linkId: string) => QuestionnaireItem;
};

const AdvancedQuestionOptions = (props: AdvancedQuestionOptionsProps): JSX.Element => {
    const { t } = useTranslation();
    const { state, dispatch } = useContext(TreeContext);
    const [isDuplicateLinkId, setDuplicateLinkId] = useState(false);
    const [linkId, setLinkId] = useState(props.item.linkId);
    const { qItems, qOrder } = state;
    const [isDataReceiver, setDataReceiverState] = useState(isItemControlDataReceiver(props.item));

    const dispatchUpdateItem = (name: IItemProperty, value: boolean) => {
        dispatch(updateItemAction(props.item.linkId, name, value));
    };

    const dispatchUpdateItemHelpText = (id: string, value: string) => {
        const newValue = createMarkdownExtension(value);
        dispatch(updateItemAction(id, IItemProperty._text, newValue));
    };

    const dispatchHelpText = () => {
        const helpItem = getHelpTextItem();
        if (helpItem) {
            dispatch(deleteItemAction(helpItem.linkId, [...props.parentArray, props.item.linkId]));
        } else {
            dispatch(newItemHelpIconAction([...props.parentArray, props.item.linkId]));
        }
    };

    function dispatchUpdateLinkId(event: FocusEvent<HTMLInputElement>): void {
        // Verify no duplicates
        if (isDuplicateLinkId || event.target.value === props.item.linkId) {
            return;
        }
        dispatch(updateLinkIdAction(props.item.linkId, event.target.value, props.parentArray));
    }

    function validateLinkId(linkIdToValidate: string): void {
        const hasLinkIdConflict = !(qItems[linkIdToValidate] === undefined || linkIdToValidate === props.item.linkId);
        setDuplicateLinkId(hasLinkIdConflict);
    }

    function resetLinkId(): void {
        setLinkId(props.item.linkId);
        validateLinkId(props.item.linkId);
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
        const selfArray = findTreeArray(props.parentArray, qOrder);
        const selfOrder = selfArray.find((node) => node.linkId === props.item.linkId)?.items || [];
        const helpItem = selfOrder.find((child) => isItemControlHelp(qItems[child.linkId]));
        return helpItem ? qItems[helpItem.linkId] : undefined;
    };

    const handleExtension = (extension: Extension) => {
        setItemExtension(props.item, extension, dispatch);
    };

    const removeExtension = (extensionUrl: IExtentionType) => {
        removeItemExtension(props.item, extensionUrl, dispatch);
    };

    const getPlaceholder = props.item?.extension?.find((x) => x.url === IExtentionType.entryFormat)?.valueString ?? '';
    const getRepeatsText = props.item?.extension?.find((x) => x.url === IExtentionType.repeatstext)?.valueString ?? '';
    const minOccurs = props.item?.extension?.find((x) => x.url === IExtentionType.minOccurs)?.valueInteger;
    const maxOccurs = props.item?.extension?.find((x) => x.url === IExtentionType.maxOccurs)?.valueInteger;
    const hasSummaryExtension = isItemControlSummary(props.item);
    const hasSummaryContainerExtension = isItemControlSummaryContainer(props.item);

    const helpTextItem = getHelpTextItem();
    const checkedView = () => {
        return props.item.extension?.find((ex) => ex.url === IExtentionType.hidden)?.valueBoolean
            ? RenderingOptionsEnum.Hidden
            : props.item.code?.find((codee) => codee.system === ICodeSystem.renderOptionsCodeSystem)?.code ??
                  RenderingOptionsEnum.None;
    };
    const onChangeView = (newValue: string) => {
        removeItemExtension(props.item, IExtentionType.hidden, dispatch);
        removeItemCode(props.item, ICodeSystem.renderOptionsCodeSystem, dispatch);
        switch (newValue) {
            case RenderingOptionsEnum.Hidden:
                const extension = {
                    url: IExtentionType.hidden,
                    valueBoolean: true,
                };
                setItemExtension(props.item, extension, dispatch);
                break;
            default:
                addItemCode(props.item, newValue, dispatch);
                break;
        }
    };

    return (
        <>
            {canTypeBeReadonly(props.item) && (
                <div className="horizontal equal">
                    <FormField>
                        <SwitchBtn
                            onChange={() => dispatchUpdateItem(IItemProperty.readOnly, !props.item.readOnly)}
                            value={props.item.readOnly || false}
                            label={t('Read-only')}
                            disabled={isDataReceiver}
                        />
                    </FormField>
                </div>
            )}
            <CopyFrom
                item={props.item}
                conditionalArray={props.conditionalArray}
                isDataReceiver={isDataReceiver}
                canTypeBeReadonly={canTypeBeReadonly(props.item)}
                dataReceiverStateChanger={setDataReceiverState}
                getItem={props.getItem}
            />
            {canTypeHaveCalculatedExpressionExtension(props.item) && (
                <CalculatedExpression
                    item={props.item}
                    disabled={isDataReceiver}
                    updateExtension={handleExtension}
                    removeExtension={removeExtension}
                />
            )}
            {canTypeBeBeriket(props.item) && <FhirPathSelect item={props.item} />}
            {canTypeHavePlaceholderText(props.item) && (
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
            {canTypeHaveInitialValue(props.item) && (
                <div className="horizontal full">
                    <Initial item={props.item} />
                </div>
            )}
            <div className="horizontal full">
                <FormField
                    label={t('Links')}
                    sublabel={t('Choose whether the links in the components should be opened in an external window')}
                ></FormField>
            </div>
            <HyperlinkTargetElementToggle item={props.item} />
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
            {canTypeHavePrefix(props.item) && (
                <div className="horizontal full">
                    <FormField label={t('Prefix')} isOptional>
                        <InputField
                            defaultValue={props.item.prefix}
                            onBlur={(e) => {
                                dispatch(updateItemAction(props.item.linkId, IItemProperty.prefix, e.target.value));
                            }}
                        />
                    </FormField>
                </div>
            )}
            <div className="horizontal full">
                <FormField label={t('Definition')} isOptional>
                    <UriField
                        value={props.item.definition}
                        onBlur={(e) => {
                            dispatch(updateItemAction(props.item.linkId, IItemProperty.definition, e.target.value));
                        }}
                    />
                </FormField>
            </div>
            {canTypeBeRepeatable(props.item) && (
                <>
                    <div className="horizontal full">
                        <FormField
                            label={t('Repetition')}
                            sublabel={t('Choose whether the question group can be repeated')}
                        ></FormField>
                    </div>
                    <FormField>
                        <SwitchBtn
                            onChange={(): void => {
                                if (props.item.repeats) {
                                    removeItemExtension(
                                        props.item,
                                        [
                                            IExtentionType.repeatstext,
                                            IExtentionType.minOccurs,
                                            IExtentionType.maxOccurs,
                                        ],
                                        dispatch,
                                    );
                                }
                                dispatchUpdateItem(IItemProperty.repeats, !props.item.repeats);
                            }}
                            value={props.item.repeats || false}
                            label={t('Repeatable')}
                        />
                        {props.item.repeats && (
                            <>
                                <FormField label={t('Repeat button text')} sublabel={t('Default is set to "Add"')}>
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
                                    <FormField
                                        label={t('Min answers')}
                                        sublabel={t(
                                            'Enter the minimum number of times the question group can be repeated',
                                        )}
                                    >
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
                                    <FormField
                                        label={t('Max answers')}
                                        sublabel={t(
                                            'Enter the maximum number of times the question group can be repeated',
                                        )}
                                    >
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
                </>
            )}
            <div className="horizontal full">
                <FormField
                    label={t('After completing the form')}
                    sublabel={t('Choose what should happen after the user has completed the form')}
                ></FormField>
            </div>
            <GuidanceAction item={props.item} />
            <GuidanceParam item={props.item} />
            {canTypeHaveSummary(props.item) && (
                <div>
                    <FormField>
                        <SwitchBtn
                            onChange={() => {
                                setItemControlExtension(props.item, ItemControlType.summary, dispatch);
                            }}
                            value={hasSummaryExtension}
                            label={t('Put in PDF first')}
                        />
                    </FormField>
                    <FormField>
                        <SwitchBtn
                            onChange={() => {
                                setItemControlExtension(props.item, ItemControlType.summaryContainer, dispatch);
                            }}
                            value={hasSummaryContainerExtension}
                            label={t('Mark group in PDF')}
                        />
                    </FormField>
                </div>
            )}
            {canTypeHaveHelp(props.item) && (
                <>
                    <div className="horizontal full">
                        <FormField
                            label={t('Help')}
                            sublabel={t('Select whether you want to give the user a help text')}
                        ></FormField>
                    </div>
                    <FormField>
                        <SwitchBtn onChange={() => dispatchHelpText()} value={!!helpTextItem} label={t('Help icon')} />
                    </FormField>
                    {!!helpTextItem && (
                        <FormField label={t('Enter a helping text')}>
                            <MarkdownEditor data={getHelpTextForItem()} onBlur={handleHelpText} />
                        </FormField>
                    )}
                </>
            )}
            <FormField label={t('View')} sublabel={t('Choose if/where the component should be displayed')}>
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
                                props.item,
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
                        props.item.extension?.find((ex) => ex.url === IExtentionType.saveCapability)?.valueCoding
                            ?.code ?? '0'
                    }
                    options={elementSaveCapability}
                    name={'elementSaveCapability-radio'}
                />
            </FormField>
        </>
    );
};

export default AdvancedQuestionOptions;
