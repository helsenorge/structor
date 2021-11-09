import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import {
    authenticationRequirement,
    canBePerformedBy,
    presentationButtons,
    saveCapability,
} from '../../helpers/MetadataHelper';
import Accordion from '../Accordion/Accordion';
import FormField from '../FormField/FormField';
import { Extension } from '../../types/fhir';
import { TreeContext } from '../../store/treeStore/treeStore';
import { IExtentionType, IValueSetSystem } from '../../types/IQuestionnareItemType';
import SwitchBtn from '../SwitchBtn/SwitchBtn';
import { removeQuestionnaireExtension, setQuestionnaireExtension } from '../../helpers/extensionHelper';
import RadioBtn from '../RadioBtn/RadioBtn';
import InputField from '../InputField/inputField';

const QuestionnaireSettings = (): JSX.Element => {
    const { t } = useTranslation();
    const { state, dispatch } = useContext(TreeContext);
    const { qMetadata } = state;

    const updateMetaExtension = (extension: Extension) => {
        setQuestionnaireExtension(qMetadata, extension, dispatch);
    };

    const removeMetaExtension = (extensionUrl: string) => {
        removeQuestionnaireExtension(qMetadata, extensionUrl, dispatch);
    };

    const getGeneratePdfValue = (): boolean => {
        const extension = qMetadata?.extension?.find((ex) => ex.url === IExtentionType.generatePDF);
        return extension ? extension.valueBoolean || false : true;
    };

    return (
        <Accordion title={t('Questionnaire settings')}>
            <FormField label={t('Helsenorge endpoint')}>
                <InputField
                    placeholder={t('For example Endpoint/35')}
                    defaultValue={
                        qMetadata?.extension?.find((ex) => ex.url === IExtentionType.endpoint)?.valueReference
                            ?.reference ?? ''
                    }
                    onBlur={(e) => {
                        if (!e.target.value) {
                            removeMetaExtension(IExtentionType.endpoint);
                        } else {
                            updateMetaExtension({
                                url: IExtentionType.endpoint,
                                valueReference: {
                                    reference: e.target.value,
                                },
                            });
                        }
                    }}
                />
            </FormField>
            <FormField label={t('Button bar display')}>
                <RadioBtn
                    onChange={(newValue: string) => {
                        if (newValue) {
                            updateMetaExtension({
                                url: IExtentionType.presentationbuttons,
                                valueCoding: {
                                    system: IValueSetSystem.presentationbuttonsValueSet,
                                    code: newValue,
                                },
                            });
                        } else {
                            removeMetaExtension(IExtentionType.presentationbuttons);
                        }
                    }}
                    checked={
                        qMetadata?.extension?.find((ex) => ex.url === IExtentionType.presentationbuttons)?.valueCoding
                            ?.code ?? 'sticky'
                    }
                    options={presentationButtons}
                    name={'presentationbuttons-radio'}
                />
            </FormField>
            <FormField label={t('Describes if user must be logged in to answer questionnaire')}>
                <RadioBtn
                    onChange={(newValue: string) => {
                        if (newValue) {
                            updateMetaExtension({
                                url: IExtentionType.authenticationRequirement,
                                valueCoding: {
                                    system: IValueSetSystem.authenticationRequirementValueSet,
                                    code: newValue,
                                },
                            });
                        } else {
                            removeMetaExtension(IExtentionType.authenticationRequirement);
                        }
                    }}
                    checked={
                        qMetadata?.extension?.find((ex) => ex.url === IExtentionType.authenticationRequirement)
                            ?.valueCoding?.code ?? '3'
                    }
                    options={authenticationRequirement}
                    name={'authenticationRequirement-radio'}
                />
            </FormField>
            <FormField label={t('Describes if representative can answer questionnaire')}>
                <RadioBtn
                    onChange={(newValue: string) => {
                        if (newValue) {
                            updateMetaExtension({
                                url: IExtentionType.canBePerformedBy,
                                valueCoding: {
                                    system: IValueSetSystem.canBePerformedByValueSet,
                                    code: newValue,
                                },
                            });
                        } else {
                            removeMetaExtension(IExtentionType.canBePerformedBy);
                        }
                    }}
                    checked={
                        qMetadata?.extension?.find((ex) => ex.url === IExtentionType.canBePerformedBy)?.valueCoding
                            ?.code ?? '1'
                    }
                    options={canBePerformedBy}
                    name={'canBePerformedBy-radio'}
                />
            </FormField>
            <FormField label={t('Save capabilities')}>
                <RadioBtn
                    onChange={(newValue: string) => {
                        if (newValue) {
                            updateMetaExtension({
                                url: IExtentionType.saveCapability,
                                valueCoding: {
                                    system: IValueSetSystem.saveCapabilityValueSet,
                                    code: newValue,
                                },
                            });
                        } else {
                            removeMetaExtension(IExtentionType.saveCapability);
                        }
                    }}
                    checked={
                        qMetadata?.extension?.find((ex) => ex.url === IExtentionType.saveCapability)?.valueCoding
                            ?.code ?? '1'
                    }
                    options={saveCapability}
                    name={'saveCapability-radio'}
                />
            </FormField>
            <FormField>
                <SwitchBtn
                    onChange={() =>
                        updateMetaExtension({
                            url: IExtentionType.generatePDF,
                            valueBoolean: !getGeneratePdfValue(),
                        })
                    }
                    value={getGeneratePdfValue()}
                    label={t('Generate PDF on submit')}
                />
            </FormField>
            <FormField>
                <SwitchBtn
                    onChange={() => {
                        const hasNavigatorExtension = !!qMetadata?.extension?.find(
                            (ex) => ex.url === IExtentionType.navigator,
                        );
                        if (hasNavigatorExtension) {
                            // remove extension
                            removeMetaExtension(IExtentionType.navigator);
                        } else {
                            // set extension
                            updateMetaExtension({
                                url: IExtentionType.navigator,
                                valueCodeableConcept: {
                                    coding: [
                                        {
                                            system: IExtentionType.navigatorCodeSystem,
                                            code: 'navigator',
                                        },
                                    ],
                                },
                            });
                        }
                    }}
                    value={!!qMetadata?.extension?.find((ex) => ex.url === IExtentionType.navigator) || false}
                    label={t('Use navigator')}
                />
            </FormField>
        </Accordion>
    );
};

export default QuestionnaireSettings;
