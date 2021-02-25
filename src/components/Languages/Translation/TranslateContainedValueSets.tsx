import React from 'react';
import { ValueSet } from '../../../types/fhir';
import { ActionType, Languages } from '../../../store/treeStore/treeStore';
import FormField from '../../FormField/FormField';
import { updateContainedValueSetTranslationAction } from '../../../store/treeStore/treeActions';

type TranslateContainedValueSetsProps = {
    qContained?: ValueSet[];
    targetLanguage: string;
    translations: Languages;
    dispatch: React.Dispatch<ActionType>;
};

const TranslateContainedValueSets = ({
    qContained,
    targetLanguage,
    translations,
    dispatch,
}: TranslateContainedValueSetsProps): JSX.Element | null => {
    const containedTranslations = translations[targetLanguage].contained;

    const renderValueSetOptions = (valueSet: ValueSet): JSX.Element => {
        const concepts = valueSet.compose?.include[0].concept;
        const { id } = valueSet;
        if (!concepts || !id) {
            console.error(`ValueSet ${valueSet.title} doesn't contain concepts`);
            return <></>;
        }
        return (
            <div>
                {concepts.map((concept) => {
                    const { code, display } = concept;
                    if (!code) {
                        return <></>;
                    }
                    const translatedText = containedTranslations[id]?.concepts[code];
                    return (
                        <div key={code} className="translation-row">
                            <FormField>
                                <input defaultValue={display} disabled={true} />
                            </FormField>
                            <FormField>
                                <input
                                    defaultValue={translatedText}
                                    onBlur={(event) => {
                                        dispatch(
                                            updateContainedValueSetTranslationAction(
                                                targetLanguage,
                                                id,
                                                code,
                                                event.target.value,
                                            ),
                                        );
                                    }}
                                />
                            </FormField>
                        </div>
                    );
                })}
            </div>
        );
    };

    if (!qContained) {
        return null;
    }
    return (
        <div>
            <div className="translation-section-header">ValueSet</div>
            {qContained.map((valueSet: ValueSet) => {
                return (
                    <div key={valueSet.id} className="translation-group">
                        <div className="translation-group-header">{valueSet.title}</div>
                        {renderValueSetOptions(valueSet)}
                    </div>
                );
            })}
        </div>
    );
};

export default TranslateContainedValueSets;
