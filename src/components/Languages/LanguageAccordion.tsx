import React, { useState } from 'react';
import { supportedLanguages, getLanguageFromCode } from '../../helpers/LanguageHelper';
import Accordion from '../Accordion/Accordion';
import Btn from '../Btn/Btn';
import FormField from '../FormField/FormField';
import Modal from '../Modal/Modal';
import Select from '../Select/Select';

const LanguageAccordion = (): JSX.Element => {
    const [showModal, setModal] = useState(false);
    const [selectedLang, setSelectedLang] = useState('');
    const [translateLang, setTranslateLang] = useState('');
    const [addedLang, setAddedLang] = useState<string[]>([]);

    const removeLang = (lang: string) => {
        const prevLang = [...addedLang];
        const newLang = prevLang.filter((x) => x !== lang);
        setAddedLang(newLang);
    };

    return (
        <>
            {showModal && (
                <Modal title="Oversett skjema" close={() => setModal(false)} size="large">
                    <div className="horizontal equal" style={{ height: 40, minHeight: 0 }}>
                        <div>
                            <p>Bokmål</p>
                        </div>
                        <div className="pull-right">
                            <p>{getLanguageFromCode(translateLang)?.display}</p>
                        </div>
                    </div>
                    <hr />
                </Modal>
            )}
            <Accordion title="Språk">
                <div className="horizontal equal">
                    <div style={{ marginBottom: 10, width: '100%' }}>
                        <FormField label="Legg til nytt språk">
                            <Select
                                placeholder="Velg et språk.."
                                options={supportedLanguages.map((x) => {
                                    return { code: x.code, display: x.display };
                                })}
                                value={selectedLang}
                                onChange={(event) => setSelectedLang(event.target.value)}
                            />
                        </FormField>
                    </div>
                    <div style={{ marginBottom: 10 }}>
                        <Btn
                            title="+ Legg til nytt språk"
                            type="button"
                            size="small"
                            variant="primary"
                            onClick={() => setAddedLang([...addedLang, selectedLang])}
                        />
                    </div>
                </div>
                <div>
                    {addedLang.map((language, index) => (
                        <div key={index} className="enablewhen-box align-everything">
                            <div>{getLanguageFromCode(language)?.display} </div>
                            <div className="pull-right btn-group">
                                <Btn
                                    title="Slett"
                                    type="button"
                                    size="small"
                                    variant="secondary"
                                    onClick={() => removeLang(language)}
                                />
                                <Btn
                                    title="Rediger"
                                    type="button"
                                    size="small"
                                    variant="primary"
                                    onClick={() => {
                                        setModal(true);
                                        setTranslateLang(language);
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </Accordion>
        </>
    );
};

export default LanguageAccordion;
