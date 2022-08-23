import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';

import IconBtn from '../IconBtn/IconBtn';
import { TreeContext } from '../../store/treeStore/treeStore';
import { generateQuestionnaireForPreview } from '../../helpers/generateQuestionnaire';
import Select from '../Select/Select';
import { getLanguagesInUse, INITIAL_LANGUAGE } from '../../helpers/LanguageHelper';
import { emptyPropertyReplacer } from '../../helpers/emptyPropertyReplacer';
import { isItemControlReceiverComponent } from '../../helpers/itemControl';

type Props = {
    showFormFiller: () => void;
    language?: string;
};

const FormFiller = ({ showFormFiller, language }: Props): JSX.Element => {
    const { t } = useTranslation();
    const { state } = useContext(TreeContext);
    const [selectedLanguage, setSelectedLanguage] = useState<string | undefined>(
        language || state.qMetadata.language || INITIAL_LANGUAGE.code,
    );
    const [selectedGender, setSelectedGender] = useState<string>('');
    const [selectedAge, setSelectedAge] = useState<string>('');
    const [selectedReceiverEndpoint, setSelectedReceiverEndpoint] = useState<string>('');
    const languages = getLanguagesInUse(state);

    function iFrameLoaded() {
        const questionnaireString = JSON.stringify(
            generateQuestionnaireForPreview(state, selectedLanguage, selectedGender, selectedAge),
            emptyPropertyReplacer,
        );
        const schemeDisplayer = document.getElementById('schemeFrame');
        if (schemeDisplayer) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            schemeDisplayer.contentWindow.postMessage(
                {
                    questionnaireString: questionnaireString,
                    language: selectedLanguage,
                    selectedReceiverEndpoint: selectedReceiverEndpoint,
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

    function hasReceiverComponent(): boolean {
        return (
            Object.keys(state.qItems).filter((linkId) => isItemControlReceiverComponent(state.qItems[linkId])).length >
            0
        );
    }

    return (
        <div className="overlay">
            <div className="iframe-div">
                <div className="title align-everything">
                    <IconBtn type="x" title={t('Close')} onClick={showFormFiller} />
                    <h1>{t('Preview')}</h1>
                    <div className="pull-right">
                        {hasReceiverComponent() && (
                            <input
                                style={{ padding: '0 10px', border: 0, width: 250 }}
                                placeholder={t('Recipient component EndpointId')}
                                onBlur={(event: React.ChangeEvent<HTMLInputElement>) => {
                                    setSelectedReceiverEndpoint(event.target.value);
                                    if (selectedReceiverEndpoint !== event.target.value) {
                                        reloadIframe();
                                    }
                                }}
                            />
                        )}
                        <Select
                            value={selectedGender}
                            options={[
                                {
                                    code: '',
                                    display: t('Gender'),
                                },
                                {
                                    code: 'Kvinne',
                                    display: t('Female'),
                                },
                                {
                                    code: 'Mann',
                                    display: t('Male'),
                                },
                                {
                                    code: 'Ukjent',
                                    display: t('Unknown'),
                                },
                            ]}
                            onChange={(e) => {
                                setSelectedGender(e.target.value);
                                reloadIframe();
                            }}
                            compact={true}
                        />
                        <Select
                            value={selectedAge}
                            options={[
                                {
                                    code: '',
                                    display: t('Age'),
                                },
                                ...Array.from(Array(120), (_x, index) => {
                                    return {
                                        code: index.toString(),
                                        display: index.toString(),
                                    };
                                }),
                            ]}
                            onChange={(e) => {
                                setSelectedAge(e.target.value);
                                reloadIframe();
                            }}
                            compact={true}
                        />
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
