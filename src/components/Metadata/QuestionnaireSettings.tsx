import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import { authenticationRequirement, presentationButtons, saveCapability } from '../../helpers/MetadataHelper';
import Accordion from '../Accordion/Accordion';
import FormField from '../FormField/FormField';
import { ContactDetail, Extension, Meta, UsageContext } from '../../types/fhir';
import { TreeContext } from '../../store/treeStore/treeStore';
import { IExtentionType, IValueSetSystem } from '../../types/IQuestionnareItemType';
import SwitchBtn from '../SwitchBtn/SwitchBtn';
import { removeQuestionnaireExtension, setQuestionnaireExtension } from '../../helpers/extensionHelper';
import {
    isVisibilityHideSidebar,
    isVisibilityHideHelp,
    isVisibilityHideSublabel,
    setItemControlExtension,
    VisibilityType,
    isVisibilityHideProgress,
} from '../../helpers/globalVisibilityHelper';
import RadioBtn from '../RadioBtn/RadioBtn';
import InputField from '../InputField/inputField';
import { translatableSettings } from '../../helpers/LanguageHelper';
import { IQuestionnaireMetadataType } from '../../types/IQuestionnaireMetadataType';
import { updateQuestionnaireMetadataAction } from '../../store/treeStore/treeActions';
import MetaSecurityEditor from './MetaSecurityEditor';
import CheckboxBtn from '../CheckboxBtn/CheckboxBtn';

const QuestionnaireSettings = (): JSX.Element => {
    const { t } = useTranslation();
    const { state, dispatch } = useContext(TreeContext);
    const { qMetadata } = state;

    const updateMetaExtension = (extension: Extension) => {
        setQuestionnaireExtension(qMetadata, extension, dispatch);
    };

    const updateMeta = (
        propName: IQuestionnaireMetadataType,
        value: string | Meta | Extension[] | ContactDetail[] | UsageContext,
    ) => {
        dispatch(updateQuestionnaireMetadataAction(propName, value));
    };

    const hasUseContextWorkflowRequest = () => {
        const existing = (qMetadata.useContext || []).filter((x: UsageContext) => {
            return x.valueCodeableConcept?.coding?.find((obj) => {
                return (
                    obj.system === IValueSetSystem.workflow && obj.code === 'request' && obj.display === 'Henvendelse'
                );
            });
        });
        if (existing === undefined || existing.length === 0) {
            return false;
        } else {
            return true;
        }
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
            <FormField label={t('Connect to print version (binary)')}>
                <InputField
                    placeholder={t('For example Binary/35')}
                    defaultValue={
                        qMetadata?.extension?.find((ex) => ex.url === IExtentionType.printVersion)?.valueReference
                            ?.reference ?? ''
                    }
                    onBlur={(e) => {
                        if (!e.target.value) {
                            removeMetaExtension(IExtentionType.printVersion);
                        } else {
                            const extensionSettings = translatableSettings[IExtentionType.printVersion];
                            if (extensionSettings) {
                                updateMetaExtension(extensionSettings.generate(e.target.value));
                            }
                        }
                    }}
                />
            </FormField>
            <MetaSecurityEditor />
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
            <FormField
                label={t('PDF')}
                sublabel={t(
                    'Here you choose whether you want to generate a PDF and whether you want to hide some texts when the PDF is generated',
                )}
            >
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
                <CheckboxBtn
                    onChange={() => setItemControlExtension(qMetadata, VisibilityType.hideHelp, dispatch)}
                    checked={isVisibilityHideHelp(qMetadata)}
                    value={VisibilityType.hideHelp}
                    label={t('Hide help texts in PDF')}
                />
                <CheckboxBtn
                    onChange={() => setItemControlExtension(qMetadata, VisibilityType.hideSublabel, dispatch)}
                    checked={isVisibilityHideSublabel(qMetadata)}
                    value={VisibilityType.hideSublabel}
                    label={t('Hide sublabels in PDF')}
                />
                <CheckboxBtn
                    onChange={() => setItemControlExtension(qMetadata, VisibilityType.hideSidebar, dispatch)}
                    checked={isVisibilityHideSidebar(qMetadata)}
                    value={VisibilityType.hideSidebar}
                    label={t('Hide sidebar texts in PDF')}
                />
            </FormField>
            <FormField
                label={t('Progress indicator')}
                sublabel={t(
                    'Choose whether you want to hide the progress indicator. The progress indicator is only available if the form is using a step-view',
                )}
            >
                <SwitchBtn
                    onChange={() => setItemControlExtension(qMetadata, VisibilityType.hideProgress, dispatch)}
                    value={isVisibilityHideProgress(qMetadata)}
                    label={t('Hide progress indicator')}
                />
            </FormField>
            <FormField label={t('Navigation')} sublabel={t('Choose whether to use the navigator')}>
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
                    label={t('Navigator')}
                />
            </FormField>
            <FormField
                label={t('Workflow')}
                sublabel={t(
                    'Should the form be included in a workflow at Helsenorge? This field is only used by Norsk helsenett.',
                )}
            >
                <SwitchBtn
                    onChange={() => {
                        const updateValue = {
                            code: {
                                system: 'http://hl7.org/fhir/ValueSet/usage-context-type',
                                code: 'workflow',
                                display: 'Workflow Setting',
                            },
                            valueCodeableConcept: {
                                coding: [
                                    {
                                        system: IValueSetSystem.workflow,
                                        code: 'request',
                                        display: 'Henvendelse',
                                    },
                                ],
                            },
                        };

                        if (hasUseContextWorkflowRequest()) {
                            // Removes extension by creating a new array without the spesific value and overwrite meta
                            const extensionsToSet = (qMetadata.useContext || []).filter((x: UsageContext) => {
                                return x.valueCodeableConcept?.coding?.find((obj) => {
                                    return (
                                        obj.system !== IValueSetSystem.workflow &&
                                        obj.code !== 'request' &&
                                        obj.display !== 'Henvendelse'
                                    );
                                });
                            });
                            updateMeta(IQuestionnaireMetadataType.useContext, extensionsToSet);
                        } else {
                            // Adds extension by pushing value on the existing ones
                            const existingExtensions = (qMetadata.useContext || []).filter((x: UsageContext) => {
                                return x.valueCodeableConcept?.coding?.find((obj) => {
                                    return (
                                        obj.system !== IValueSetSystem.workflow &&
                                        obj.code !== 'request' &&
                                        obj.display !== 'Henvendelse'
                                    );
                                });
                            });
                            existingExtensions.push(updateValue);
                            updateMeta(IQuestionnaireMetadataType.useContext, existingExtensions);
                        }
                    }}
                    value={hasUseContextWorkflowRequest() || false}
                    label={t('Request')}
                />
            </FormField>
        </Accordion>
    );
};

export default QuestionnaireSettings;
