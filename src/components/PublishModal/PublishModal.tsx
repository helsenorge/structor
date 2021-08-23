import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { generateQuestionnaire } from '../../helpers/generateQuestionnaire';
import { updateQuestionnaireMetadataAction } from '../../store/treeStore/treeActions';
import { TreeContext } from '../../store/treeStore/treeStore';
import { IQuestionnaireMetadataType } from '../../types/IQuestionnaireMetadataType';
import Btn from '../Btn/Btn';
import FormField from '../FormField/FormField';
import Modal from '../Modal/Modal';
import Spinner from '../Spinner/Spinner';
import './PublishModal.css';

type Props = {
    close: () => void;
};

const PublishModal = ({ close }: Props): JSX.Element => {
    const { t } = useTranslation();
    const { state, dispatch } = useContext(TreeContext);

    const updateMeta = (propName: IQuestionnaireMetadataType, value: string) => {
        dispatch(updateQuestionnaireMetadataAction(propName, value));
    };

    const [upload, setUpload] = useState<'loading' | 'success' | 'error' | ''>('');
    const [formState, setFormState] = useState<string>('');
    const [error, setError] = useState<{ diagnostics: string; severity: string }[]>([]);

    const pushToServer = () => {
        setUpload('loading');
        setError([]);
        setFormState('');

        setTimeout(() => {
            //https://spark.incendi.no/fhir/questionnaire
            fetch(`${state.qMetadata.url}/${state.qMetadata.id}`, {
                method: 'PUT',
                body: generateQuestionnaire(state),
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then((res) => {
                    if (res.status >= 200 && res.status < 300) {
                        setUpload('success');
                        setFormState(t('Skjema er lastet opp'));
                    } else {
                        setUpload('error');
                        setFormState(t('Skjema har en eller flere feil'));
                    }

                    if (res.status === 404) {
                        return { issue: [] };
                    }

                    return res.json();
                })
                .then((data) => {
                    if (data.issue) {
                        setError(data.issue);
                    }
                });
        }, 2000);
    };

    return (
        <Modal close={close} title={t('Publiser')}>
            <p>{t('Er du klar for å publisere?')}</p>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    pushToServer();
                }}
            >
                <FormField label={t('Url til server:')}>
                    <input
                        value={state.qMetadata.url || ''}
                        placeholder={t('Skriv inn en url..')}
                        title={t('Kun url')}
                        onChange={(e) => updateMeta(IQuestionnaireMetadataType.url, e.target.value || '')}
                        pattern="[Hh][Tt][Tt][Pp][Ss]?:\/\/(?:(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)(?:\.(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)*(?:\.(?:[a-zA-Z\u00a1-\uffff]{2,}))(?::\d{2,5})?(?:\/[^\s]*)?"
                        type="url"
                        required
                    />
                </FormField>

                <FormField label={t('Skriv inn id: ')}>
                    <input
                        pattern="[A-Z0-9_]{1,63}"
                        title={t('Kun store bokstaver og tall')}
                        value={state.qMetadata.id || ''}
                        maxLength={64}
                        onChange={(e) => updateMeta(IQuestionnaireMetadataType.id, e.target.value || '')}
                        required
                    />
                </FormField>

                <Btn title={t('Publiser skjema')} type="submit" />
            </form>
            <div className="feedback">
                <Spinner state={upload} />
                <p>{formState}</p>
            </div>
            <div>
                {error.map((x, index) => {
                    return <p key={index}>{x.diagnostics}</p>;
                })}
            </div>
        </Modal>
    );
};

export default PublishModal;
