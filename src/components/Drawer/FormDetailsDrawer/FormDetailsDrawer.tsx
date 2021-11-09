import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { TreeContext } from '../../../store/treeStore/treeStore';
import MetadataEditor from '../../Metadata/MetadataEditor';
import Sidebar from '../../Sidebar/Sidebar';
import LanguageAccordion from '../../Languages/LanguageAccordion';
import { IQuestionnaireMetadataType } from '../../../types/IQuestionnaireMetadataType';
import { updateQuestionnaireMetadataAction } from '../../../store/treeStore/treeActions';
import Drawer from '../Drawer';
import { useKeyPress } from '../../../hooks/useKeyPress';
import FormField from '../../FormField/FormField';

type FormDetailsDrawerProps = {
    setTranslateLang: (language: string) => void;
    closeDrawer: () => void;
    isOpen?: boolean;
};

const FormDetailsDrawer = ({ setTranslateLang, closeDrawer, isOpen = false }: FormDetailsDrawerProps): JSX.Element => {
    const { t } = useTranslation();
    const { state, dispatch } = useContext(TreeContext);

    useKeyPress('Escape', closeDrawer, !isOpen);

    const dispatchUpdateQuestionnaireMetadata = (propName: IQuestionnaireMetadataType, value: string) => {
        dispatch(updateQuestionnaireMetadataAction(propName, value));
    };

    return (
        <Drawer title={t('Questionnaire details')} position="left" visible={isOpen} hide={closeDrawer}>
            <div className="form-intro-field">
                <FormField label={`${t('Title')}:`}>
                    <input
                        placeholder={t('Title')}
                        value={state.qMetadata.title}
                        onChange={(event) => {
                            dispatchUpdateQuestionnaireMetadata(IQuestionnaireMetadataType.title, event.target.value);
                        }}
                    />
                </FormField>
            </div>
            <MetadataEditor />
            <Sidebar />
            <LanguageAccordion setTranslateLang={setTranslateLang} />
        </Drawer>
    );
};

export default FormDetailsDrawer;
