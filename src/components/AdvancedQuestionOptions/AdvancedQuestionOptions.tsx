import React, { FocusEvent, useContext, useEffect, useState } from 'react';
import { OrderItem, TreeContext } from '../../store/treeStore/treeStore';
import { Extension, QuestionnaireItem, ValueSetComposeIncludeConcept } from '../../types/fhir';
import {
    newItemHelpIconAction,
    updateItemAction,
    updateLinkIdAction,
    deleteItemAction,
    removeItemAttributeAction,
    moveItemAction,
} from '../../store/treeStore/treeActions';
import UndoIcon from '../../images/icons/arrow-undo-outline.svg';
import './AdvancedQuestionOptions.css';
import { IExtentionType, IItemProperty, IQuestionnaireItemType } from '../../types/IQuestionnareItemType';
import SwitchBtn from '../SwitchBtn/SwitchBtn';
import Initial from './Initial/Initial';
import FormField from '../FormField/FormField';
import MarkdownEditor from '../MarkdownEditor/MarkdownEditor';
import Select from '../Select/Select';
import { EnrichmentSet } from '../../helpers/QuestionHelper';
import Btn from '../Btn/Btn';
import { isIgnorableItem } from '../../helpers/itemControl';

type AdvancedQuestionOptionsProps = {
    item: QuestionnaireItem;
    parentArray: Array<string>;
};

interface FlattOrder extends ValueSetComposeIncludeConcept {
    parent: Array<string>;
}

const AdvancedQuestionOptions = ({ item, parentArray }: AdvancedQuestionOptionsProps): JSX.Element => {
    const { state, dispatch } = useContext(TreeContext);
    const [isDuplicateLinkId, setDuplicateLinkId] = useState(false);
    const [hierarchy, setHierarchy] = useState<FlattOrder[]>([]);
    const [linkId, setLinkId] = useState(item.linkId);
    const { qItems, qOrder } = state;
    const [linkIdMoveTo, setLinkIdMoveTo] = useState('');
    const [moveError, setMoveError] = useState('');

    const isRepeatsAndReadOnlyApplicable = item.type !== IQuestionnaireItemType.display;

    const isInitialApplicable =
        item.type !== IQuestionnaireItemType.display && item.type !== IQuestionnaireItemType.group;

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

    const dispatchInlineHelp = () => {
        const inlineHelp = itemInlineHelperItem();
        if (inlineHelp.exist && inlineHelp.linkId) {
            dispatch(deleteItemAction(inlineHelp.linkId, [...parentArray, item.linkId]));
        } else {
            dispatch(newItemHelpIconAction([...parentArray, item.linkId]));
        }
    };

    const getHighlight = () => {
        const hasItemControl = item?.extension?.find((x) => x.url === IExtentionType.itemControl);
        return hasItemControl?.valueCodeableConcept?.coding?.find((x) => x.code === 'highlight');
    };

    const dispatchHighLight = () => {
        if (!!getHighlight()) {
            dispatch(removeItemAttributeAction(item.linkId, IItemProperty.extension));
        } else {
            const extension = [
                {
                    url: IExtentionType.itemControl,
                    valueCodeableConcept: {
                        coding: [
                            {
                                system: IExtentionType.itemControlValueSet,
                                code: 'highlight',
                            },
                        ],
                    },
                },
            ];
            dispatch(updateItemAction(item.linkId, IItemProperty.extension, extension));
        }
    };

    function dispatchUpdateLinkId(event: FocusEvent<HTMLInputElement>) {
        // Verify no duplicates
        if (isDuplicateLinkId || event.target.value === item.linkId) {
            return;
        }
        dispatch(updateLinkIdAction(item.linkId, event.target.value, parentArray));
    }

    function validateLinkId(linkId: string) {
        if (qItems[linkId] === undefined || linkId === item.linkId) {
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

    const handleInlineHelpText = (markdown: string) => {
        const children = search(item.linkId)?.items;
        children?.forEach((x) => {
            if (qItems[x.linkId].extension?.find((y) => y.url === IExtentionType.itemControl)) {
                dispatchUpdateItemHelpText(qItems[x.linkId].linkId, markdown);
            }
        });
    };

    const itemInlineHelperItem = () => {
        const children = search(item.linkId)?.items;
        let _text = '';
        let exist = false;
        let linkId = '';
        children?.forEach((x) => {
            if (qItems[x.linkId].extension?.find((y) => y.url === IExtentionType.itemControl)) {
                _text =
                    qItems[x.linkId]._text?.extension?.find((ex) => ex.url === IExtentionType.markdown)
                        ?.valueMarkdown ?? '';
                exist = true;
                linkId = x.linkId;
            }
        });

        return { exist, linkId, _text };
    };

    const handleFhirpath = (fhirpath: string) => {
        const extension = {
            url: IExtentionType.fhirPath,
            valueString: fhirpath,
        };
        handleExtension(extension);
        dispatchUpdateItem(IItemProperty.readOnly, true);
    };

    const handleExtension = (extension: Extension) => {
        if (item?.extension && item?.extension?.length > 0) {
            const newExtension = [...item.extension.filter((x) => x.url !== extension.url), extension];
            dispatch(updateItemAction(item.linkId, IItemProperty.extension, newExtension));
        } else {
            dispatch(updateItemAction(item.linkId, IItemProperty.extension, [extension]));
        }
    };

    const getFhirpath = item?.extension?.find((x) => x.url === IExtentionType.fhirPath)?.valueString ?? '';
    const getPlaceholder = item?.extension?.find((x) => x.url === IExtentionType.entryFormat)?.valueString ?? '';

    useEffect(() => {
        flattenOrder();
    }, [qOrder]);

    const handleChild = (items: OrderItem[], parent: number[], tempHierarchy: FlattOrder[], linkId: string[]) => {
        items
            .filter((x) => !isIgnorableItem(qItems[x.linkId]))
            .forEach((child, childIndex) => {
                const childTitle = childIndex + 1;
                tempHierarchy.push({
                    display: `${'\xA0'.repeat(parent.length * 2)}${parent.join('.')}.${childTitle} ${
                        qItems[child.linkId].text
                    }`,
                    code: child.linkId,
                    parent: linkId,
                });
                if (child.items) {
                    handleChild(child.items, [...parent, childTitle], tempHierarchy, [...linkId, child.linkId]);
                }
            });
    };

    const flattenOrder = () => {
        const temp = [] as FlattOrder[];
        temp.push({ display: 'Toppnivå', code: 'top-level', parent: [] });
        qOrder
            .filter((x) => !isIgnorableItem(qItems[x.linkId]))
            .forEach((x, index) => {
                const hirarkiTitle = index + 1;
                temp.push({ display: `${hirarkiTitle}. ${qItems[x.linkId].text}`, code: x.linkId, parent: [] });
                if (x.items) {
                    handleChild(x.items, [hirarkiTitle], temp, [x.linkId]);
                }
            });
        setHierarchy([...temp]);
    };

    const moveIsInvalid = (moveToPath: string[]) => {
        if (qItems[linkIdMoveTo]?.type === IQuestionnaireItemType.display) {
            setMoveError(`Det er ikke mulig å flytte til element av type: ${IQuestionnaireItemType.display}`);
            return true;
        }
        if (linkIdMoveTo === item.linkId) {
            setMoveError('Det er ikke mulig å flytte elementet til seg selv');
            return true;
        }
        if (moveToPath.includes(item.linkId)) {
            setMoveError('Det er ikke mulig å flytte mor-node til barn-node');
            return true;
        }
        if (parentArray.length === 0 && moveToPath.length === 1 && moveToPath.find((x) => x === 'top-level')) {
            setMoveError('Det er ikke mulig å flytte element fra topp-node til topp-node');
            return true;
        }
        return false;
    };

    const handleMove = () => {
        setMoveError('');
        const toParent = hierarchy.find((x) => x.code === linkIdMoveTo)?.parent || [];
        const moveToPath = [...toParent, linkIdMoveTo];

        if (moveIsInvalid(moveToPath)) {
            return;
        }

        if (linkIdMoveTo === 'top-level') {
            dispatch(moveItemAction(item.linkId, [], parentArray));
        } else {
            dispatch(moveItemAction(item.linkId, moveToPath, parentArray));
        }
    };

    return (
        <>
            {isRepeatsAndReadOnlyApplicable && (
                <div className="horizontal equal">
                    <div className="form-field">
                        <SwitchBtn
                            onChange={() => dispatchUpdateItem(IItemProperty.repeats, !item.repeats)}
                            value={item.repeats || false}
                            label="Kan gjentas"
                            initial
                        />
                    </div>
                    <div className="form-field">
                        <SwitchBtn
                            onChange={() => dispatchUpdateItem(IItemProperty.readOnly, !item.readOnly)}
                            value={item.readOnly || false}
                            label="Skrivebeskyttet"
                            initial
                        />
                    </div>
                </div>
            )}
            {item.type === IQuestionnaireItemType.string && (
                <FormField label="Beriking">
                    <Select
                        value={getFhirpath}
                        options={EnrichmentSet}
                        placeholder="Legg til en formel.."
                        onChange={(event) => {
                            handleFhirpath(event.target.value);
                        }}
                    />
                </FormField>
            )}
            {(item.type === IQuestionnaireItemType.string || item.type === IQuestionnaireItemType.text) && (
                <FormField label="Placeholder">
                    <input
                        defaultValue={getPlaceholder}
                        onBlur={(e) =>
                            handleExtension({
                                url: IExtentionType.entryFormat,
                                valueString: e.target.value,
                            })
                        }
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
                    <label>LinkId</label>
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
                        <div className="msg-error">
                            LinkId er allerede i bruk{' '}
                            <button onClick={resetLinkId}>
                                <img src={UndoIcon} height={16} /> Sett tilbake til opprinnelig verdi
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <div>
                <FormField>
                    <SwitchBtn
                        onChange={() => dispatchInlineHelp()}
                        value={itemInlineHelperItem().exist}
                        label="Skru på hjelpeikon"
                        initial
                    />
                </FormField>
                {itemInlineHelperItem().exist && (
                    <FormField label="Skriv en hjelpende tekst">
                        <MarkdownEditor data={itemInlineHelperItem()._text} onBlur={handleInlineHelpText} />
                    </FormField>
                )}
            </div>
            {item.type === IQuestionnaireItemType.text && (
                <div>
                    <SwitchBtn onChange={dispatchHighLight} value={!!getHighlight()} label="Highlight" initial />
                </div>
            )}
            <div>
                <FormField label="Flytt til element">
                    <Select
                        placeholder="Hvor skal elementet flyttes til?"
                        options={hierarchy}
                        value={linkIdMoveTo}
                        onChange={(event) => setLinkIdMoveTo(event.target.value)}
                    />
                    {moveError && <div className="msg-error">{moveError}</div>}
                    <Btn onClick={() => handleMove()} title="Flytt" type="button" variant="primary" size="small" />
                </FormField>
            </div>
        </>
    );
};

export default AdvancedQuestionOptions;
