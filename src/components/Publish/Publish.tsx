import React, { useContext, useState } from 'react';
import { generateQuestionnaire } from '../../helpers/generateQuestionnaire';
import { updateQuestionnaireMetadataAction } from '../../store/treeStore/treeActions';
import { TreeContext } from '../../store/treeStore/treeStore';
import { IQuestionnaireMetadataType } from '../../types/IQuestionnaireMetadataType';
import Btn from '../Btn/Btn';
import FormField from '../FormField/FormField';
import IconBtn from '../IconBtn/IconBtn';
import './Publish.css';

type Props = {
    close: () => void;
};

const Publish = ({ close }: Props): JSX.Element => {
    const { state, dispatch } = useContext(TreeContext);

    const updateMeta = (propName: IQuestionnaireMetadataType, value: string) => {
        dispatch(updateQuestionnaireMetadataAction(propName, value));
    };

    const [upload, setUpload] = useState<'loading' | 'success' | 'error' | ''>('');

    const pushToServer = () => {
        setUpload('loading');

        setTimeout(() => {
            fetch('https://spark.incendi.no/fhir/questionnaire/' + state.qMetadata.id, {
                method: 'PUT',
                body: generateQuestionnaire(state),
                headers: {
                    'Content-Type': 'application/json',
                },
            }).then((res) => {
                if (res.status >= 200 && res.status < 300) {
                    setUpload('success');
                } else {
                    setUpload('error');
                }
            });
            // .then((res) => {

            //     console.log(res);
            // });
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
                        <input placeholder="Skriv inn en url.." />
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
                    <div className={`loader ${upload}`}>
                        <svg
                            className="spinner"
                            width="43px"
                            height="43px"
                            viewBox="0 0 44 44"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <circle
                                className="path"
                                fill="none"
                                strokeWidth="4"
                                strokeLinecap="round"
                                cx="22"
                                cy="22"
                                r="20"
                            ></circle>
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Publish;
