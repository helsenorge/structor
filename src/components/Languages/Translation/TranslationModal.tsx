import React, { useContext, useEffect, useState } from 'react';
import Modal from '../../Modal/Modal';
import { OrderItem, TreeContext } from '../../../store/treeStore/treeStore';
import { updateItemTranslationAction } from '../../../store/treeStore/treeActions';
import './TranslationModal.css';
import TranslateItemRow from './TranslateItemRow';
import { getItemPropertyTranslation, getLanguageFromCode } from '../../../helpers/LanguageHelper';
import { QuestionnaireItem } from '../../../types/fhir';
import TranslateMetaData from './TranslateMetaData';
import TranslateContainedValueSets from './TranslateContainedValueSets';
import { getHelpText, isIgnorableItem, isItemControlHelp, isItemControlSidebar } from '../../../helpers/itemControl';
import TranslateSidebar from './TranslateSidebar';
import FormField from '../../FormField/FormField';
import MarkdownEditor from '../../MarkdownEditor/MarkdownEditor';
import { TranslatableItemProperty } from '../../../types/LanguageTypes';
import Btn from '../../Btn/Btn';
import { IExtentionType } from '../../../types/IQuestionnareItemType';

type TranslationModalProps = {
    close: () => void;
    targetLanguage: string;
};

interface FlattOrderTranslation {
    linkId: string;
    path: string;
}

const TranslationModal = (props: TranslationModalProps): JSX.Element => {
    const { state, dispatch } = useContext(TreeContext);
    const { qItems, qOrder, qAdditionalLanguages, qMetadata, qContained } = state;
    const [flattOrder, setFlattOrder] = useState<FlattOrderTranslation[]>([]);

    useEffect(() => {
        flattenOrder();
    }, []);

    const handleChild = (items: OrderItem[], path: string, tempHierarchy: FlattOrderTranslation[]) => {
        items
            .filter((x) => !isIgnorableItem(qItems[x.linkId]))
            .forEach((child, childIndex) => {
                const childPath = `${path}${childIndex + 1}`;
                tempHierarchy.push({ linkId: child.linkId, path: childPath });
                if (child.items) {
                    handleChild(child.items, childPath, tempHierarchy);
                }
            });
    };

    const flattenOrder = () => {
        const temp = [] as FlattOrderTranslation[];
        qOrder
            .filter((x) => !isIgnorableItem(qItems[x.linkId]))
            .forEach((x, index) => {
                const itemPath = `${index + 1}.`;
                temp.push({ linkId: x.linkId, path: itemPath });
                if (x.items) {
                    handleChild(x.items, itemPath, temp);
                }
            });
        setFlattOrder([...temp]);
    };

    const isTranslatableItem = (item: QuestionnaireItem): boolean =>
        // Hidden items
        !item.extension?.some((ext) => ext.url === IExtentionType.hidden && ext.valueBoolean) &&
        !isItemControlSidebar(item);

    const translatableItems = Object.values(qItems).filter((question) => {
        return isTranslatableItem(question);
    });

    const getHeader = (): JSX.Element => (
        <div className="sticky-header">
            {qMetadata.language && (
                <div className="horizontal equal">
                    <div>
                        <label>{getLanguageFromCode(qMetadata.language)?.display}</label>
                    </div>
                    <div>
                        <label>{getLanguageFromCode(props.targetLanguage)?.display}</label>
                    </div>
                </div>
            )}
        </div>
    );

    const renderHelpText = (orderItems: OrderItem[]): JSX.Element | null => {
        const helpTextItemId = orderItems.find((orderItem) => isItemControlHelp(qItems[orderItem.linkId]));
        if (!helpTextItemId || !qAdditionalLanguages) {
            return null;
        }
        const helpText = getHelpText(qItems[helpTextItemId.linkId]);
        const translatedHelpText = getItemPropertyTranslation(
            props.targetLanguage,
            qAdditionalLanguages,
            helpTextItemId.linkId,
            TranslatableItemProperty.text,
        );
        return (
            <>
                <div className="translation-group-header">Hjelpetekst</div>
                <div className="translation-row">
                    <FormField>
                        <MarkdownEditor data={helpText} disabled={true} />
                    </FormField>
                    <FormField>
                        <MarkdownEditor
                            data={translatedHelpText}
                            onBlur={(value) =>
                                dispatch(
                                    updateItemTranslationAction(
                                        props.targetLanguage,
                                        helpTextItemId.linkId,
                                        TranslatableItemProperty.text,
                                        value,
                                    ),
                                )
                            }
                        />
                    </FormField>
                </div>
            </>
        );
    };

    useEffect(() => {
        const options = {
            root: document.getElementById('translation-modal'),
            rootMargin: '63px 0px 0px 0px',
            threshold: [0.5],
        };

        const observed = (elements: IntersectionObserverEntry[]) => {
            if (elements[0].intersectionRatio === 1) {
                console.log('Fire!');
            }
        };

        const myObserver = new IntersectionObserver(observed, options);

        const myEl = document.getElementById('bottom-translation-modal');

        if (myEl) {
            myObserver.observe(myEl);
        }
    }, []);

    const renderItems = (orderItems: OrderItem[], parentNumber = ''): Array<JSX.Element | null> => {
        if (translatableItems && qAdditionalLanguages) {
            return orderItems.map((orderItem, index) => {
                const item = translatableItems.find((i) => i.linkId === orderItem.linkId);

                if (item && !isItemControlHelp(item)) {
                    const itemNumber = parentNumber === '' ? `${index + 1}` : `${parentNumber}.${index + 1}`;
                    return (
                        <div key={`${props.targetLanguage}-${item.linkId}`}>
                            <div className="translation-item">
                                <TranslateItemRow
                                    item={item}
                                    targetLanguage={props.targetLanguage}
                                    itemNumber={itemNumber}
                                />
                                {renderHelpText(orderItem.items)}
                            </div>
                            {renderItems(orderItem.items, itemNumber)}
                        </div>
                    );
                }
                return null;
            });
        }
        return [];
    };

    const removeUnsupportedChildren = (items: OrderItem[]) => {
        return items.filter((x) => !isIgnorableItem(state.qItems[x.linkId]));
    };

    return (
        <div className="translation-modal">
            <Modal close={props.close} title="Oversett skjema" id="translation-modal">
                {getHeader()}
                <div style={{ position: 'relative' }}>
                    <>
                        {qAdditionalLanguages && (
                            <>
                                <TranslateMetaData
                                    state={state}
                                    targetLanguage={props.targetLanguage}
                                    dispatch={dispatch}
                                />
                                <TranslateSidebar
                                    targetLanguage={props.targetLanguage}
                                    translations={qAdditionalLanguages}
                                    items={qItems}
                                    dispatch={dispatch}
                                />
                                {!!qContained && qContained?.length > 0 && (
                                    <TranslateContainedValueSets
                                        qContained={qContained}
                                        targetLanguage={props.targetLanguage}
                                        translations={qAdditionalLanguages}
                                        dispatch={dispatch}
                                    />
                                )}
                                <div>
                                    <div className="translation-section-header">Elementer</div>
                                    {renderItems(removeUnsupportedChildren(state.qOrder))}
                                </div>
                                <div>{flattOrder.length}</div>
                                <div id="bottom-translation-modal" style={{ height: 1 }} />
                                <div className="center-text">
                                    <Btn
                                        title="Lagre og lukk"
                                        size="small"
                                        type="button"
                                        variant="secondary"
                                        onClick={props.close}
                                    />
                                </div>
                            </>
                        )}
                    </>
                </div>
            </Modal>
        </div>
    );
};

export default TranslationModal;
