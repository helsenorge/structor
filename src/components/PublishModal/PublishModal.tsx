import React, { useContext, useState } from 'react';
import { generateQuestionnaire } from '../../helpers/generateQuestionnaire';
import { updateQuestionnaireMetadataAction } from '../../store/treeStore/treeActions';
import { TreeContext } from '../../store/treeStore/treeStore';
import { IQuestionnaireMetadataType } from '../../types/IQuestionnaireMetadataType';
import Btn from '../Btn/Btn';
import FormField from '../FormField/FormField';
import IconBtn from '../IconBtn/IconBtn';
import Spinner from '../Spinner/Spinner';
import './PublishModal.css';

type Props = {
    close: () => void;
};

const PublishModal = ({ close }: Props): JSX.Element => {
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
            fetch(`https://spark.incendi.no/fhir/questionnaire/${state.qMetadata.id}`, {
                method: 'PUT',
                body: generateQuestionnaire(state),
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then((res) => {
                    if (res.status >= 200 && res.status < 300) {
                        setUpload('success');
                        setFormState('Skjema er lastet opp');
                    } else {
                        setUpload('error');
                        setFormState('Skjema har følgende feil:');
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
        <div className="overlay">
            <div className="modal">
                <div className="title">
                    <IconBtn type="x" title="Lukk" onClick={close} />
                    <h1>Publiser</h1>
                </div>
                <div className="content">
                    <p>Er du klar for å publisere?</p>
                    <FormField label="Url til publiseringen:">
                        <input value={state.qMetadata.url || ''} placeholder="Skriv inn en url.." />
                    </FormField>

                    <FormField label="Skriv inn id: ">
                        <input
                            value={state.qMetadata.id || ''}
                            maxLength={64}
                            onChange={(e) => updateMeta(IQuestionnaireMetadataType.id, e.target.value || '')}
                        />
                    </FormField>

                    <Btn
                        title="Publiser skjema"
                        onClick={() => {
                            pushToServer();
                        }}
                    />
                    <div className="feedback">
                        <Spinner state={upload} />
                        <p>{formState}</p>
                    </div>
                    {error.map((x, index) => {
                        return <p key={index}>{x.diagnostics}</p>;
                    })}
                </div>
            </div>
        </div>
    );
};

export default PublishModal;
