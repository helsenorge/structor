import React, { useContext, useState } from 'react';
import Modal from '../../Modal/Modal';
import { OrderItem, TreeContext } from '../../../store/treeStore/treeStore';
import { addQuestionnaireLanguageAction, updateItemTranslationAction } from '../../../store/treeStore/treeActions';
import Select from '../../Select/Select';
import './TranslationModal.css';
import TranslateItemRow from './TranslateItemRow';
import { getItemPropertyTranslation, getLanguageFromCode, supportedLanguages } from '../../../helpers/LanguageHelper';
import { IQuestionnaireItemType } from '../../../types/IQuestionnareItemType';
import { QuestionnaireItem } from '../../../types/fhir';
import TranslateMetaData from './TranslateMetaData';
import TranslateContainedValueSets from './TranslateContainedValueSets';
import { getHelpText, isItemControlHelp, isItemControlSidebar } from '../../../helpers/itemControl';
import TranslateSidebar from './TranslateSidebar';
import FormField from '../../FormField/FormField';
import MarkdownEditor from '../../MarkdownEditor/MarkdownEditor';
import { TranslatableItemProperty } from '../../../types/LanguageTypes';

type TranslationModalProps = {
    close: () => void;
    targetLanguage?: string;
};

const TranslationModal = (props: TranslationModalProps): JSX.Element => {
    const { state, dispatch } = useContext(TreeContext);
    const { qItems, qAdditionalLanguages, qMetadata, qContained } = state;
    const [targetLanguage, setTargetLanguage] = useState(props.targetLanguage);
    const availableLanguages = [
        { code: '', display: 'Velg språk' },
        ...supportedLanguages.filter((lang) => lang.code.toLowerCase() !== qMetadata.language?.toLowerCase()),
    ];

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

    const dispatchAddLanguage = (selectedLanguage: string) => {
        if (!qAdditionalLanguages || !qAdditionalLanguages[selectedLanguage]) {
            dispatch(addQuestionnaireLanguageAction(selectedLanguage));
        }
    };

    const getHeader = (): JSX.Element => (
        <div className="sticky-header">
            {qMetadata.language && (
                <div className="horizontal equal">
                    <div>
                        <label>{getLanguageFromCode(qMetadata.language)?.display}</label>
                    </div>
                    <div>
                        <Select
                            value={targetLanguage}
                            options={availableLanguages}
                            onChange={(e) => {
                                setTargetLanguage(e.target.value);
                                dispatchAddLanguage(e.target.value);
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );

    const renderHelpText = (orderItems: OrderItem[]): JSX.Element | null => {
        const helpTextItemId = orderItems.find((orderItem) => isItemControlHelp(qItems[orderItem.linkId]));
        if (!helpTextItemId || !targetLanguage || !qAdditionalLanguages) {
            return null;
        }
        const helpText = getHelpText(qItems[helpTextItemId.linkId]);
        const translatedHelpText = getItemPropertyTranslation(
            targetLanguage,
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
                                        targetLanguage,
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
        if (translatableItems && qAdditionalLanguages && targetLanguage) {
            return orderItems.map((orderItem, index) => {
                const item = translatableItems.find((i) => i.linkId === orderItem.linkId);

                if (item && !isItemControlHelp(item)) {
                    const itemNumber = parentNumber === '' ? `${index + 1}` : `${parentNumber}.${index + 1}`;
                    return (
                        <div key={`${targetLanguage}-${item.linkId}`}>
                            <div className="translation-item">
                                <TranslateItemRow item={item} targetLanguage={targetLanguage} itemNumber={itemNumber} />
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
                    {qAdditionalLanguages && targetLanguage && (
                        <>
                            <TranslateMetaData
                                qMetadata={qMetadata}
                                targetLanguage={targetLanguage}
                                translations={qAdditionalLanguages}
                                dispatch={dispatch}
                            />
                            <TranslateSidebar
                                targetLanguage={targetLanguage}
                                translations={qAdditionalLanguages}
                                items={qItems}
                                dispatch={dispatch}
                            />
                            <TranslateContainedValueSets
                                qContained={qContained}
                                targetLanguage={targetLanguage}
                                translations={qAdditionalLanguages}
                                dispatch={dispatch}
                            />
                            <div>
                                <div className="translation-section-header">Elementer</div>
                                {renderItems(state.qOrder)}
                            </div>
                        </>
                    )}
                </>
            </Modal>
        </div>
    );
};

export default TranslationModal;
