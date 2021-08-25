import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';

import IconBtn from '../IconBtn/IconBtn';
import { TreeContext } from '../../store/treeStore/treeStore';
import { generateQuestionnaireForPreview } from '../../helpers/generateQuestionnaire';
import Select from '../Select/Select';
import { getLanguagesInUse, INITIAL_LANGUAGE } from '../../helpers/LanguageHelper';

type Props = {
    showFormFiller: () => void;
    language?: string;
};

const FormFiller = ({ showFormFiller, language }: Props): JSX.Element => {
    const { t } = useTranslation();
    const { state } = useContext(TreeContext);
    const [selectedLanguage, setSelectedLanguage] = useState(
        language || state.qMetadata.language || INITIAL_LANGUAGE.code,
    );
    const languages = getLanguagesInUse(state);

    function iFrameLoaded() {
        const questionnaireString = generateQuestionnaireForPreview(state, selectedLanguage);
        const schemeDisplayer = document.getElementById('schemeFrame');
        if (schemeDisplayer) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            schemeDisplayer.contentWindow.postMessage(
                {
                    questionnaireString: questionnaireString,
                    showFooter: false,
                },
                '*',
            );
        }
    }

    function reloadIframe() {
        const schemeDisplayer = document.getElementById('schemeFrame') as HTMLIFrameElement;
        if (schemeDisplayer) {
            schemeDisplayer.src = '../../../iframe/index.html';
        }
    }

    return (
        <div className="overlay">
            <div className="iframe-div">
                <div className="title align-everything">
                    <IconBtn type="x" title={t('Close')} onClick={showFormFiller} />
                    <h1>{t('Preview')}</h1>
                    <div className="pull-right">
                        <Select
                            value={selectedLanguage}
                            options={languages}
                            onChange={(e) => {
                                setSelectedLanguage(e.target.value);
                                reloadIframe();
                            }}
                            compact={true}
                        />
                    </div>
                </div>
                <iframe
                    id="schemeFrame"
                    style={{
                        width: 'calc(100% - 40px)',
                        height: '70vh',
                        padding: '20px',
                    }}
                    onLoad={iFrameLoaded}
                    src="../../../iframe/index.html"
                ></iframe>
            </div>
        </div>
    );
};

export default FormFiller;
