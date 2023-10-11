import React from 'react';
import { useTranslation } from 'react-i18next';
import MetadataEditor from '../../Metadata/MetadataEditor';
import Sidebar from '../../Sidebar/Sidebar';
import LanguageAccordion from '../../Languages/LanguageAccordion';
import Drawer from '../Drawer';
import { useKeyPress } from '../../../hooks/useKeyPress';
import QuestionnaireSettings from '../../Metadata/QuestionnaireSettings';

type FormDetailsDrawerProps = {
    setTranslateLang: (language: string) => void;
    closeDrawer: () => void;
    isOpen?: boolean;
};

const FormDetailsDrawer = ({ setTranslateLang, closeDrawer, isOpen = false }: FormDetailsDrawerProps): JSX.Element => {
    const { t } = useTranslation();

    useKeyPress('Escape', closeDrawer, !isOpen);

    return (
        <Drawer title={t('Questionnaire details')} position="left" visible={isOpen} hide={closeDrawer}>
            <MetadataEditor />
            <QuestionnaireSettings />
            <Sidebar />
            <LanguageAccordion setTranslateLang={setTranslateLang} />
        </Drawer>
    );
};

export default FormDetailsDrawer;
