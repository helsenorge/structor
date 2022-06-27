import React from 'react';
import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { TreeContext } from '../../store/treeStore/treeStore';
import { generateQuestionnaireForPreview } from '../../helpers/generateQuestionnaire';
import { getLanguagesInUse, INITIAL_LANGUAGE } from '../../helpers/LanguageHelper';
import { ReferoContainer } from '@helsenorge/refero/components';
import { Store, createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import rootReducer from '@helsenorge/refero/reducers';

type Props = {
    showFormFiller: () => void;
    language?: string;
};

// eslint-disable-next-line @typescript-eslint/ban-types
const store: Store<{}> = createStore(rootReducer, applyMiddleware(thunk));

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
        <Provider store={store}>
            <ReferoContainer
                store={store}
                questionnaire={generateQuestionnaireForPreview(state, selectedLanguage, selectedGender, selectedAge)}
                onCancel={showFormFiller}
                onSave={console.log('save')}
                onSubmit={console.log('submit')}
                loginButton={<button>{'hei'}</button>}
                authorized={false}
            />
        </Provider>
    );
};

export default ReferoFiller;
