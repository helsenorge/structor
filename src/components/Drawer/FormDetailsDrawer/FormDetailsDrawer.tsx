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
        <Drawer title="Skjemadetaljer" position="left" visible={isOpen} hide={closeDrawer}>
            <div className="form-intro-field">
                <label htmlFor="questionnaire-title">{t('Title')}:</label>
                <input
                    placeholder={t('Title')}
                    value={state.qMetadata.title}
                    id="questionnaire-title"
                    onChange={(event) => {
                        dispatchUpdateQuestionnaireMetadata(IQuestionnaireMetadataType.title, event.target.value);
                    }}
                />
            </div>

            <MetadataEditor />
            <Sidebar />
            <LanguageAccordion setTranslateLang={setTranslateLang} />
        </Drawer>
    );
};

export default FormDetailsDrawer;
