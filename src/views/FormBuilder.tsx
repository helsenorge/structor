import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { TreeContext } from '../store/treeStore/treeStore';
import AnchorMenu from '../components/AnchorMenu/AnchorMenu';
import FormDetailsDrawer from '../components/Drawer/FormDetailsDrawer/FormDetailsDrawer';
import IconBtn from '../components/IconBtn/IconBtn';
import Navbar from '../components/Navbar/Navbar';
import QuestionDrawer from '../components/QuestionDrawer/QuestionDrawer';

import './FormBuilder.css';
import { ValidationErrors } from '../helpers/orphanValidation';
import TranslationModal from '../components/Languages/Translation/TranslationModal';
import ReferoPreview from '../components/Refero/ReferoPreview';

const FormBuilder = (): JSX.Element => {
    const { t } = useTranslation();
    const { state, dispatch } = useContext(TreeContext);
    const [showFormDetails, setShowFormDetails] = useState(false);

    const [showPreview, setShowPreview] = useState(false);
    const [validationErrors, setValidationErrors] = useState<Array<ValidationErrors>>([]);
    const [translationErrors, setTranslationErrors] = useState<Array<ValidationErrors>>([]);
    const [translateLang, setTranslateLang] = useState('');
    const [referoKey, setReferoKey] = useState('123');

    const toggleFormDetails = useCallback(() => {
        setShowFormDetails(!showFormDetails);
    }, [showFormDetails]);

    useEffect(() => {
        setReferoKey(Math.random().toString());
    }, [showPreview]);

    return (
        <>
            <Navbar
                showFormFiller={() => setShowPreview(!showPreview)}
                validationErrors={validationErrors}
                setValidationErrors={setValidationErrors}
                translationErrors={translationErrors}
                setTranslationErrors={setTranslationErrors}
            />

            <div className="editor">
                <AnchorMenu
                    dispatch={dispatch}
                    qOrder={state.qOrder}
                    qItems={state.qItems}
                    qCurrentItem={state.qCurrentItem}
                    validationErrors={validationErrors}
                />
                {showPreview && (
                    <ReferoPreview
                        key={referoKey}
                        showFormFiller={() => setShowPreview(!showPreview)}
                        language={state.qMetadata.language}
                        state={state}
                        changeReferoKey={() => setReferoKey(Math.random().toString())}
                    />
                )}
                {translateLang && (
                    <TranslationModal close={() => setTranslateLang('')} targetLanguage={translateLang} />
                )}
            </div>
            <div className="page-wrapper">
                <div className="details-button">
                    <IconBtn
                        type="info"
                        title={t('Questionnaire details')}
                        color="black"
                        onClick={toggleFormDetails}
                        size="large"
                    />
                </div>
                <FormDetailsDrawer
                    setTranslateLang={(language: string) => {
                        setTranslateLang(language);
                        toggleFormDetails();
                    }}
                    closeDrawer={toggleFormDetails}
                    isOpen={showFormDetails}
                />
                <QuestionDrawer validationErrors={validationErrors} />
            </div>
        </>
    );
};

export default FormBuilder;
