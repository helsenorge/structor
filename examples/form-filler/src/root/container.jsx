import * as React from 'react';
import { Collapse } from 'react-collapse';
import classNames from 'classnames';
import { SkjemautfyllerContainer } from '@helsenorge/skjemautfyller/components';
import { getSidebarSections } from '@helsenorge/skjemautfyller/util/extension';

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

const generateSectionContent = (header, content) => {
    return content.length > 0 ? (
        <>
            <h2>{header}</h2>
            <div>
                {content.map((x, index) => (
                    <p
                        key={index}
                        dangerouslySetInnerHTML={{
                            __html: x,
                        }}
                    ></p>
                ))}
            </div>
        </>
    ) : null;
};

const getSidebarElements = (questionnaire) => {
    const sidebarData = getSidebarSections(questionnaire);

    const seksjonerFraSkjema = {
        'SOT-1': [],
        'SOT-2': [],
        'SOT-3': [],
    };

    sidebarData.forEach((x) => {
        if (x.item.code && x.item.code.length > 0 && x.item.code[0].code) {
            if (seksjonerFraSkjema[x.item.code[0].code]) {
                seksjonerFraSkjema[x.item.code[0].code].push(x.markdownText);
            }
        }
    });

    return seksjonerFraSkjema;
};

const Container = (props) => {
    const [responseJson, setResponseJson] = React.useState('');
    const [isSidebarViewEnabled, setIsSidebarViewEnabled] = React.useState(false);

    const questionnaire = JSON.parse(props.questionnaireString);
    const sidebarData = getSidebarElements(questionnaire);

    return (
        <div className="page_skjemautfyller">
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
                    <div>QuestionnaireResponse basert på det som er krysset av:</div>
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
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    bottom: 0,
                    right: 0,
                    padding: 8,
                    backgroundColor: '#fff',
                    zIndex: 90,
                    transition: 'transform .5s ease,-webkit-transform .5s ease',
                    width: '27.5rem',
                    borderLeft: '2px #AAA solid',
                    transform: isSidebarViewEnabled ? 'translateX(0)' : 'translateX(100%)',
                }}
            >
                <button
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: '-38px',
                        padding: '0 9px',
                        fontSize: '32px',
                        backgroundColor: '#fff',
                        border: '2px #AAA solid',
                        borderRightWidth: 0,
                        cursor: 'pointer',
                    }}
                    onClick={() => setIsSidebarViewEnabled(!isSidebarViewEnabled)}
                >
                    ?
                </button>
                {isSidebarViewEnabled && (
                    <div
                        style={{
                            overflow: 'auto',
                            height: '100%',
                        }}
                    >
                        {generateSectionContent('Alternativer for utfylling', sidebarData['SOT-1'])}
                        {generateSectionContent('Veiledning og ansvarlig', sidebarData['SOT-2'])}
                        {generateSectionContent('Behandling hos mottaker', sidebarData['SOT-3'])}
                    </div>
                )}
            </div>

            <h1>{questionnaire.title}</h1>
            <SkjemautfyllerContainer
                authorized
                blockSubmit={false}
                onCancel={() => {
                    /* ikke implementert enda */
                }}
                onSave={(questionnaireResponse) => {
                    setResponseJson(questionnaireResponse);
                }}
                sticky={false}
                onSubmit={() => {
                    /* ikke implementert enda */
                }}
                resources={resources}
                loginButton={<button />}
                onRequestHelpButton={(_item, _helpItem, _helpType, _helpText, opening) => {
                    return (
                        <button
                            type="button"
                            title={resources ? resources.helpButtonTooltip : undefined}
                            className="atom_inline-functionbutton"
                            aria-expanded={opening}
                        />
                    );
                }}
                onRequestHelpElement={(_item, _helpItem, _helpType, helpText, opening) => {
                    const collapseClasses = classNames({
                        page_skjemautfyller__helpComponent: true,
                        'page_skjemautfyller__helpComponent--open': opening,
                    });
                    return (
                        <Collapse isOpened={opening}>
                            <div className={collapseClasses} dangerouslySetInnerHTML={{ __html: helpText }} />
                        </Collapse>
                    );
                }}
                questionnaire={questionnaire}
            />
        </div>
    );
};

export default Container;
