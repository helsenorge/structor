import React from 'react';
import { useTranslation } from 'react-i18next';
import { ValueSet } from '../../../types/fhir';
import { ActionType, Languages } from '../../../store/treeStore/treeStore';
import FormField from '../../FormField/FormField';
import { updateContainedValueSetTranslationAction } from '../../../store/treeStore/treeActions';
import { getValueSetValues } from '../../../helpers/valueSetHelper';

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
    const { t } = useTranslation();
    const containedTranslations = translations[targetLanguage].contained;

    const renderValueSetOptions = (valueSet: ValueSet): JSX.Element => {
        const codings = getValueSetValues(valueSet);
        const { id } = valueSet;
        if (!codings || !id) {
            console.error(`ValueSet ${valueSet.title} doesn't contain concepts`);
            return <></>;
        }
        return (
            <div>
                {codings.map((coding) => {
                    const { code, display } = coding;
                    if (!code) {
                        return <></>;
                    }
                    const translatedText = containedTranslations[id]?.concepts[code];
                    return (
                        <div key={`${targetLanguage}-${code}`} className="translation-row">
                            <FormField>
                                <textarea defaultValue={display} disabled={true} />
                            </FormField>
                            <FormField>
                                <textarea
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
            <div className="translation-section-header">{t('Predefined valuesets')}</div>
            {qContained.map((valueSet: ValueSet) => {
                return (
                    <div key={`${targetLanguage}-${valueSet.id}`} className="translation-group">
                        <div className="translation-group-header">{valueSet.title}</div>
                        {renderValueSetOptions(valueSet)}
                    </div>
                );
            })}
        </div>
    );
};

export default TranslateContainedValueSets;
