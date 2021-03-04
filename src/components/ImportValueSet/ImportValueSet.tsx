import React, { useContext, useState } from 'react';

import { BundleEntry, ValueSet } from '../../types/fhir';
import Btn from '../Btn/Btn';
import FormField from '../FormField/FormField';
import Modal from '../Modal/Modal';
import './ImportValueSet.css';
import AlertIcon from '../../images/icons/alert-circle-outline.svg';
import { ValueSetContext } from '../../store/valueSetStore/ValueSetStore';
import { appendValueSetAction } from '../../store/valueSetStore/ValueSetAction';

type Props = {
    close: () => void;
};

const ImportValueSet = ({ close }: Props): JSX.Element => {
    const { dispatch } = useContext(ValueSetContext);

    const [url, setUrl] = useState('');
    const [error, setError] = useState<string | null>();
    const [loading, setLoading] = useState(false);
    const [valueSets, setValueSets] = useState<ValueSet[] | null>();

    async function fetchValueSets() {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok || !response.json) {
            const message = `Det skjedde en feil med status: ${response.status}`;
            return { error: message };
        }

        const bundle = await response.json();

        if (bundle.resourceType !== 'Bundle' || bundle.entry.length == 0) {
            return { error: 'Ressursen støtter ikke FHIR protokollen.' };
        }

        const valueSetFHIR = bundle.entry.map((x: BundleEntry) => x.resource) as ValueSet[];

        const valueSet = valueSetFHIR
            .map((x) => {
                return {
                    resourceType: x.resourceType,
                    id: `pre-${x.id}`,
                    version: x.version || '1.0',
                    name: x.name,
                    title: x.title || x.name,
                    status: x.status,
                    publisher: x.publisher,
                    compose: x.compose,
                };
            })
            .filter((x) => x.compose?.include[0].concept && x.compose?.include[0].concept?.length > 0);

        return { valueSet };
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setValueSets(null);
        setError(null);
        setLoading(true);

        try {
            const response = await fetchValueSets();
            setTimeout(() => {
                setLoading(false);
                if (response.error) {
                    setError(response.error);
                    return;
                }
                setValueSets(response.valueSet);
            }, 1200);
        } catch {
            setError('Ressursen støtter ikke FHIR protokollen.');
            setLoading(false);
        }
    };

    const handleChangeUrl = (value: string) => {
        setUrl(value);

        if (value === '') {
            setError(null);
            setValueSets(null);
        }
    };

    const handleAddNewValueSet = () => {
        if (valueSets) {
            dispatch(appendValueSetAction(valueSets));
        }
        close();
    };

    return (
        <Modal close={close} title="Importer Value Set">
            <div>
                <FormField label="Skriv inn en url som finner ressursen">
                    <form className="input-btn" onSubmit={(e) => handleSubmit(e)}>
                        <input
                            placeholder="https://.."
                            title="Kun url"
                            onChange={(e) => handleChangeUrl(e.target.value)}
                            pattern="[Hh][Tt][Tt][Pp][Ss]?:\/\/(?:(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)(?:\.(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)*(?:\.(?:[a-zA-Z\u00a1-\uffff]{2,}))(?::\d{2,5})?(?:\/[^\s]*)?"
                            type="url"
                            value={url}
                            required
                        />
                        <Btn title="søk" variant="primary" type="submit" />
                    </form>
                </FormField>
                {loading && (
                    <div className="spinning">
                        <i className="ion-load-c" />
                    </div>
                )}
                {error && (
                    <p className="align-everything">
                        <img height={25} alt="error" src={AlertIcon} /> {error}
                    </p>
                )}
                {valueSets && (
                    <div>
                        {valueSets.map((x) => {
                            return (
                                <div key={x.id}>
                                    <p>
                                        <strong>{x.title}</strong>
                                    </p>
                                    <ul>
                                        {x.compose?.include[0].concept &&
                                            x.compose?.include[0]?.concept.map((p) => (
                                                <li key={p.code}>
                                                    {p.display} ({p.code})
                                                </li>
                                            ))}
                                    </ul>
                                </div>
                            );
                        })}
                    </div>
                )}
                {valueSets && (
                    <div className="button-btn">
                        <div>
                            <p>Legg til ({valueSets?.length} ValueSet) i predefinerte valg</p>
                            <Btn title="Importer" variant="primary" onClick={handleAddNewValueSet} />
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default ImportValueSet;
