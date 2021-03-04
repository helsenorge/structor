import React, { useContext } from 'react';
import Modal from '../../Modal/Modal';
import { OrderItem, TreeContext } from '../../../store/treeStore/treeStore';
import { updateItemTranslationAction } from '../../../store/treeStore/treeActions';
import './TranslationModal.css';
import TranslateItemRow from './TranslateItemRow';
import { getItemPropertyTranslation, getLanguageFromCode } from '../../../helpers/LanguageHelper';
import { IQuestionnaireItemType } from '../../../types/IQuestionnareItemType';
import { QuestionnaireItem } from '../../../types/fhir';
import TranslateMetaData from './TranslateMetaData';
import TranslateContainedValueSets from './TranslateContainedValueSets';
import { getHelpText, isItemControlHelp, isItemControlSidebar } from '../../../helpers/itemControl';
import TranslateSidebar from './TranslateSidebar';
import FormField from '../../FormField/FormField';
import MarkdownEditor from '../../MarkdownEditor/MarkdownEditor';
import { TranslatableItemProperty } from '../../../types/LanguageTypes';
import Btn from '../../Btn/Btn';

type TranslationModalProps = {
    close: () => void;
    targetLanguage: string;
};

const TranslationModal = (props: TranslationModalProps): JSX.Element => {
    const { state, dispatch } = useContext(TreeContext);
    const { qItems, qAdditionalLanguages, qMetadata, qContained } = state;

    const isTranslatableItem = (item: QuestionnaireItem): boolean =>
        // Groups without text
        !(item.type === IQuestionnaireItemType.group && !item.text) &&
        // Hidden items
        !item.extension?.some(
            (ext) => ext.url === 'http://hl7.org/fhir/StructureDefinition/questionnaire-hidden' && ext.valueBoolean,
        ) &&
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
                            onChange={(value) =>
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

    return (
        <div className="translation-modal">
            <Modal close={props.close} title="Oversett skjema">
                {getHeader()}
                <>
                    {qAdditionalLanguages && (
                        <>
                            <TranslateMetaData
                                qMetadata={qMetadata}
                                targetLanguage={props.targetLanguage}
                                translations={qAdditionalLanguages}
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
                                {renderItems(state.qOrder)}
                            </div>
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
            </Modal>
        </div>
    );
};

export default TranslationModal;
