import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { BundleEntry, ValueSet } from '../../types/fhir';
import Btn from '../Btn/Btn';
import FormField from '../FormField/FormField';
import Modal from '../Modal/Modal';
import './ImportValueSet.css';
import AlertIcon from '../../images/icons/alert-circle-outline.svg';
import { TreeContext } from '../../store/treeStore/treeStore';
import { importValueSetAction } from '../../store/treeStore/treeActions';
import createUUID from '../../helpers/CreateUUID';
import { addIDToValueSet } from '../../helpers/valueSetHelper';

type Props = {
    close: () => void;
};

const ImportValueSet = ({ close }: Props): JSX.Element => {
    const { t } = useTranslation();
    const { dispatch } = useContext(TreeContext);

    const [url, setUrl] = useState('');
    const [error, setError] = useState<string | null>();
    const [loading, setLoading] = useState(false);
    const [valueSets, setValueSets] = useState<ValueSet[] | null>();
    const [valueSetToAdd, setValueSetToAdd] = useState<string[]>([]);

    async function fetchValueSets() {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok || !response.json) {
            const message = `${t('There was en error with status:')} ${response.status}`;
            return { error: message };
        }

        const bundle = await response.json();

        if (bundle.resourceType !== 'Bundle' || bundle.entry.length == 0) {
            return { error: t('This resource does not support the FHIR protocol') };
        }

        const valueSetFHIR = bundle.entry.map((x: BundleEntry) => x.resource) as ValueSet[];

        const valueSet = valueSetFHIR
            .map((x) => {
                return {
                    resourceType: x.resourceType,
                    id: x.id ? `pre-${x.id}` : `pre-${createUUID()}`,
                    version: x.version || '1.0',
                    name: x.name,
                    title: x.title || x.name,
                    status: x.status,
                    publisher: x.publisher,
                    compose: x.compose ? addIDToValueSet(x.compose) : x.compose,
                };
            })
            .filter((x) => x.compose?.include[0].concept && x.compose?.include[0].concept?.length > 0);

        setValueSetToAdd(valueSet.map((x) => x.id));

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
                if (response.valueSet?.length === 0) {
                    setError(t('Found no ValueSet at the endpoint'));
                    return;
                }
                setValueSets(response.valueSet);
            }, 1200);
        } catch {
            setError(t('This resource does not support the FHIR protocol'));
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
        const valueSetsToImport = valueSets?.filter((x) => x.id && valueSetToAdd.includes(x.id));

        if (valueSetsToImport && valueSetsToImport?.length > 0) {
            dispatch(importValueSetAction(valueSetsToImport));
        }
        close();
    };

    const handleCheck = (checked: boolean, id?: string) => {
        const itemToRemove = [...valueSetToAdd].findIndex((x) => x === id);
        if (checked && id) {
            setValueSetToAdd([...valueSetToAdd, id]);
        } else {
            const temList = [...valueSetToAdd];
            temList.splice(itemToRemove, 1);
            setValueSetToAdd(temList);
        }
    };

    return (
        <Modal close={close} title={t('Import ValueSet')}>
            <div>
                <FormField label={t('Enter a url which finds the resource')}>
                    <form className="input-btn" onSubmit={(e) => handleSubmit(e)}>
                        <input
                            placeholder="https://.."
                            title={t('Only url')}
                            onChange={(e) => handleChangeUrl(e.target.value)}
                            pattern="[Hh][Tt][Tt][Pp][Ss]?:\/\/(?:(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)(?:\.(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)*(?:\.(?:[a-zA-Z\u00a1-\uffff]{2,}))(?::\d{2,5})?(?:\/[^\s]*)?"
                            type="url"
                            value={url}
                            required
                            autoFocus
                        />
                        <Btn title={t('search')} variant="primary" type="submit" />
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
                                        <input
                                            type="checkbox"
                                            aria-label="Add or remove value-set"
                                            defaultChecked
                                            onChange={(event) => handleCheck(event.target.checked, x?.id)}
                                        />{' '}
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
                            <p>
                                {t('Add ({0} ValueSet) in predefined valuesets').replace(
                                    '{0}',
                                    valueSetToAdd.length.toString(),
                                )}
                            </p>
                            <Btn
                                title={t('Import')}
                                variant="primary"
                                type="button"
                                size="small"
                                onClick={handleAddNewValueSet}
                            />
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default ImportValueSet;
