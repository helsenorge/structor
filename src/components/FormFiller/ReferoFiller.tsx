import React from 'react';
import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { TreeContext } from '../../store/treeStore/treeStore';
import { generateQuestionnaireForPreview } from '../../helpers/generateQuestionnaire';
import { getLanguagesInUse, INITIAL_LANGUAGE } from '../../helpers/LanguageHelper';
import { ReferoContainer } from '@helsenorge/refero/components';

type Props = {
    showFormFiller: () => void;
    language?: string;
};

const ReferoFiller = ({ showFormFiller, language }: Props): JSX.Element => {
    const { t } = useTranslation();
    const { state } = useContext(TreeContext);
    const [selectedLanguage, setSelectedLanguage] = useState<string | undefined>(
        language || state.qMetadata.language || INITIAL_LANGUAGE.code,
    );
    const [selectedGender, setSelectedGender] = useState<string>('');
    const [selectedAge, setSelectedAge] = useState<string>('');
    const [selectedReceiverEndpoint, setSelectedReceiverEndpoint] = useState<string>('');
    const languages = getLanguagesInUse(state);

    return (
        <ReferoContainer
            questionnaire={generateQuestionnaireForPreview(state, selectedLanguage, selectedGender, selectedAge)}
            onCancel={showFormFiller}
            onSave={console.log('save')}
            onSubmit={console.log('submit')}
            loginButton={<button>{'hei'}</button>}
            authorized={false}
        />
    );
};

export default ReferoFiller;
