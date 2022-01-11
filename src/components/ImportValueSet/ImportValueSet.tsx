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
import { getValueSetValues } from '../../helpers/valueSetHelper';

type Props = {
    close: () => void;
};

const ImportValueSet = ({ close }: Props): JSX.Element => {
    const uploadRef = React.useRef<HTMLInputElement>(null);
    const { t } = useTranslation();
    const { dispatch, state } = useContext(TreeContext);

    const [url, setUrl] = useState('');
    const [error, setError] = useState<string | null>();
    const [loading, setLoading] = useState(false);
    const [valueSets, setValueSets] = useState<ValueSet[] | null>();
    const [valueSetToAdd, setValueSetToAdd] = useState<string[]>([]);
    const [fileUploadError, setFileUploadError] = useState<string>('');

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

        const valueSet = valueSetFHIR.map((x) => {
            return {
                resourceType: x.resourceType,
                id: !x.id ? `pre-${createUUID()}` : x.id,
                version: x.version || '1.0',
                name: x.name,
                title: x.title || x.name,
                status: x.status,
                publisher: x.publisher,
                compose: x.compose,
            };
        });

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

    const uploadValueSets = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const files = Array.from(event.target.files).map((file) => {
                const reader = new FileReader();
                return new Promise((resolve) => {
                    // Resolve the promise after reading file
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = () => {
                        setFileUploadError('Could not read uploaded file');
                    };

                    // Read the file as a text
                    reader.readAsText(file);
                });
            });
            const allFiles = await Promise.all(files);
            const toAdd: ValueSet[] = [];

            allFiles.forEach((fileObj) => {
                const resource = JSON.parse(fileObj as string);
                if (resource.resourceType === 'Bundle' && resource.entry) {
                    resource.entry.forEach((entry: BundleEntry) => {
                        const entryResource = entry.resource as ValueSet;
                        if (entryResource.resourceType === 'ValueSet') {
                            toAdd.push(entryResource);
                        }
                    });
                } else if (resource.resourceType === 'ValueSet') {
                    toAdd.push(resource);
                }
            });

            // do not add existing valueSets again
            const filteredToAdd = toAdd.filter((x) => state.qContained?.findIndex((y) => y.id === x.id) === -1);
            setValueSets([...(valueSets || []), ...filteredToAdd]);
            setValueSetToAdd([...valueSetToAdd, ...filteredToAdd.map((x) => x.id || '')]);

            // Reset file input
            if (uploadRef.current) {
                uploadRef.current.value = '';
            }
            setFileUploadError('');
        }
    };

    return (
        <Modal close={close} title={t('Import ValueSet')} size="large">
            <div>
                <FormField label={t('Enter a location to import the ValueSets from')}>
                    <form className="input-btn" onSubmit={(e) => handleSubmit(e)}>
                        <input
                            placeholder="https:// .. /ValueSet or https:// .. /ValueSet/[id]"
                            title={t('Make sure the URL ends with /ValueSet or /Valueset/[id]')}
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
                <input
                    type="file"
                    ref={uploadRef}
                    onChange={uploadValueSets}
                    accept="application/JSON"
                    style={{ display: 'none' }}
                    multiple
                />
                <div>
                    <div>
                        {t(
                            'Upload ValueSets as json files. Accepts a Bundle or ValueSet in a single file. It is possible to upload several files at once',
                        )}
                    </div>
                    <div>
                        <Btn
                            title={t('Upload ValueSet(s)')}
                            type="button"
                            variant="secondary"
                            onClick={() => {
                                uploadRef.current?.click();
                            }}
                        />
                    </div>
                    {fileUploadError && <div>{t(fileUploadError)}</div>}
                </div>
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
                                        {getValueSetValues(x).map((p) => (
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
                            <Btn title={t('Import')} variant="primary" type="button" onClick={handleAddNewValueSet} />
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default ImportValueSet;
