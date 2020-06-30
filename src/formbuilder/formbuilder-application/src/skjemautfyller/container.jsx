import * as React from 'react';
import { SkjemautfyllerContainer } from '@helsenorge/skjemautfyller/components';
import { koronaSkjema } from './questionnaires/koronaSkjema';
import { bestillingsSkjema } from './questionnaires/bestillingsSkjema';
import JSONConverter from '../helpers/JSONGenerator';
import { FormContext } from '../store/FormStore';

const resources = {
    deleteButtonText: 'Slett',
    validationSummaryHeader: 'Sjekk at følgende er riktig utfylt:',
    validationFileMax: 'Filstørrelsen må være mindre enn 25MB',
    validationFileType: 'Filtypen må være jpeg, png, eller pdf',
    supportedFileFormats: 'Gyldige filformater er jpeg, png og pdf',
    selectDefaultPlaceholder: 'Velg...',
    resetTime: 'Nullstill tidspunkt',
    errorAfterMaxDate: 'Dato kan ikke være etter maksimum dato',
    errorBeforeMinDate: 'Dato kan ikke være før minimums dato',
    dateRequired: 'Oppgi en dato',
    oppgiTid: ' Oppgi tid',
    ugyldigTid: 'Ugyldig tid',
    oppgiDatoTid: 'oppgi dato og tid',
    ugyldigDatoTid: 'Ugyldig dato og tid',
    oppgiVerdi: 'Oppgi en verdi',
    oppgiGyldigVerdi: 'Oppgi en gyldig verdi',
    formCancel: 'Avbryt',
    formSend: 'Fullfør',
    formSave: 'Vis QuestionnaireResponse',
    formError: 'Sjekk at alt er riktig utfylt.',
    formOptional: '(valgfritt)',
    formRequired: '(må fylles ut)',
    repeatButtonText: 'Legg til',
    avsluttSkjema: 'Avslutt skjema',
    fortsett: 'Fortsett',
    confirmDeleteButtonText: 'Forkast endringer',
    confirmDeleteCancelButtonText: 'Avbryt',
    confirmDeleteHeading: 'Det finnes endringer',
    confirmDeleteDescription: 'Hvis du sletter, vil du miste endringene.',
    minutePlaceholder: 'mm',
    hourPlaceholder: 'tt',
    ikkeBesvart: 'Ikke besvart',
    uploadButtonText: 'Last opp fil',
    filterDateCalendarButton: 'Velg dato',
    filterDateNavigateBackward: 'Tilbake',
    filterDateNavigateForward: 'Fram',
    filterDateErrorDateFormat: 'Datoen er oppgitt på feil format',
    filterDateErrorBeforeMinDate: 'Fra-dato kan ikke være senere enn til-dato',
    filterDateErrorAfterMaxDate: 'Fra-dato kan ikke være senere enn til-dato',
    validationNotAllowed: 'er ikke tillatt',
};

const Container = () => {
    const [responseJson, setResponseJson] = React.useState('');
    const [questionnaire, setQuestionnaire] = React.useState('');
    const { state, dispatch } = React.useContext(FormContext);
    React.useEffect(() => {
        const questionnaire = JSONConverter(
            state.sectionOrder,
            state.sections,
            state.questions,
        );
        console.log(questionnaire);
        setQuestionnaire(questionnaire);
    }, []);

    return (
        <>
            {responseJson && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        bottom: 0,
                        right: 0,
                        left: 0,
                        overflow: 'auto',
                        backgroundColor: '#fff',
                        zIndex: 100,
                    }}
                >
                    <div>
                        QuestionnaireResponse basert på det som er krysset av:
                    </div>
                    <p>{JSON.stringify(responseJson)}</p>
                    <button
                        onClick={() => {
                            setResponseJson('');
                        }}
                    >
                        Tilbake til skjemautfyller
                    </button>
                </div>
            )}
            <SkjemautfyllerContainer
                authorized
                blockSubmit={false}
                onCancel={() => {
                    /* ikke implementert enda */
                }}
                onSave={(questionnaireResponse) => {
                    setResponseJson(questionnaireResponse);
                }}
                sticky={true}
                onSubmit={() => {
                    /* ikke implementert enda */
                }}
                resources={resources}
                loginButton={<button />}
                questionnaire={questionnaire}
            />
        </>
    );
};
export default Container;
