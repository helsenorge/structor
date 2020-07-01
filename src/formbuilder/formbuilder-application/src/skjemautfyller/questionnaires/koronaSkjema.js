export const koronaSkjema = {
    resourceType: 'Questionnaire',
    id: '302',
    meta: {
        versionId: '6',
        lastUpdated: '2020-06-03T07:11:01.907+00:00',
        profile: [
            'http://ehelse.no/fhir/StructureDefinition/sdf-Questionnaire',
        ],
        tag: [
            {
                system: 'urn:ietf:bcp:47',
                code: 'nb-NO',
                display: 'Norsk bokmål',
            },
        ],
    },
    language: 'nb-NO',
    contained: [
        {
            resourceType: 'ValueSet',
            id: '1101',
            version: '1.0',
            name: 'urn:oid:1101',
            title: 'Ja / Nei',
            status: 'draft',
            publisher: 'Direktoratet for e-helse',
            compose: {
                include: [
                    {
                        system: 'urn:oid:2.16.578.1.12.4.1.1101',
                        concept: [
                            {
                                code: '1',
                                display: 'Ja',
                            },
                            {
                                code: '2',
                                display: 'Nei',
                            },
                        ],
                    },
                ],
            },
        },
        {
            resourceType: 'ValueSet',
            id: '1102',
            version: '1.0',
            name: 'urn:oid:1102',
            title: 'ja, nei, vet ikke',
            status: 'draft',
            publisher: 'Direktoratet for e-helse',
            compose: {
                include: [
                    {
                        system: 'urn:oid:2.16.578.1.12.4.1.1102',
                        concept: [
                            {
                                code: '1',
                                display: 'Ja',
                            },
                            {
                                code: '2',
                                display: 'Nei',
                            },
                            {
                                code: '3',
                                display: 'Vet ikke',
                            },
                        ],
                    },
                ],
            },
        },
        {
            resourceType: 'ValueSet',
            id: '8459',
            version: '1.0',
            name: 'urn:oid:8459',
            title: 'ja, nei, vet ikke',
            status: 'draft',
            publisher: 'Direktoratet for e-helse',
            compose: {
                include: [
                    {
                        system: 'urn:oid:2.16.578.1.12.4.1.8459',
                        concept: [
                            {
                                code: '1',
                                display: 'Mann',
                            },
                            {
                                code: '2',
                                display: 'Kvinne',
                            },
                        ],
                    },
                ],
            },
        },
        {
            resourceType: 'ValueSet',
            id: 'Svar',
            version: '1.0',
            name: 'Svar',
            title: 'Svar',
            status: 'draft',
            publisher: 'Direktoratet for e-helse',
            compose: {
                include: [
                    {
                        system: 'http://ehelse.no/Svar',
                        concept: [
                            {
                                code: '1',
                                display: 'Påvist koronavirus',
                            },
                            {
                                code: '2',
                                display: 'Ikke påvist koronavirus',
                            },
                            {
                                code: '3',
                                display: 'Venter på svar',
                            },
                        ],
                    },
                ],
            },
        },
        {
            resourceType: 'ValueSet',
            id: 'Almentilstand',
            version: '1.0',
            name: 'Almentilstand',
            title: 'Almentilstand',
            status: 'draft',
            publisher: 'Direktoratet for e-helse',
            compose: {
                include: [
                    {
                        system: 'http://ehelse.no/Almentilstand',
                        concept: [
                            {
                                code: '0',
                                display: 'Som vanlig',
                            },
                            {
                                code: '1',
                                display:
                                    'Er mer sliten enn vanlig, men er for det meste oppe',
                            },
                            {
                                code: '2',
                                display:
                                    'Trenger mye hvile, men er oppe innimellom',
                            },
                            {
                                code: '3',
                                display:
                                    'Er sengeliggende og trenger noe hjelp',
                            },
                            {
                                code: '4',
                                display:
                                    'Er sengeliggende og trenger hjelp til det meste',
                            },
                        ],
                    },
                ],
            },
        },
        {
            resourceType: 'ValueSet',
            id: 'Sykdom',
            version: '1.0',
            name: 'Sykdom',
            title: 'Sykdom',
            status: 'draft',
            publisher: 'Direktoratet for e-helse',
            compose: {
                include: [
                    {
                        system: 'http://ehelse.no/Sykdom',
                        concept: [
                            {
                                code: '1',
                                display: 'Høyt blodtrykk',
                            },
                            {
                                code: '2',
                                display: 'Hjerte-kar-sykdom',
                            },
                            {
                                code: '3',
                                display:
                                    'Lungesykdom (gjelder ikke mild eller velbehandlet astma)',
                            },
                            {
                                code: '4',
                                display: 'Kreft',
                            },
                            {
                                code: '5',
                                display: 'Diabetes',
                            },
                        ],
                    },
                ],
            },
        },
        {
            resourceType: 'ValueSet',
            id: 'Status',
            version: '1.0',
            name: 'Status',
            title: 'Status',
            status: 'draft',
            publisher: 'Direktoratet for e-helse',
            compose: {
                include: [
                    {
                        system: 'http://ehelse.no/Status',
                        concept: [
                            {
                                code: '1',
                                display: 'Isolert på grunn av sykdom',
                            },
                            {
                                code: '2',
                                display: 'I karantene',
                            },
                            {
                                code: '3',
                                display:
                                    'Hjemme grunnet stengt barnehage/skole',
                            },
                            {
                                code: '4',
                                display: 'Hjemme grunnet manglende jobb',
                            },
                            {
                                code: '99',
                                display:
                                    'Ingen av disse utsagnene passer for meg',
                            },
                        ],
                    },
                ],
            },
        },
        {
            resourceType: 'ValueSet',
            id: 'Symptomer',
            version: '1.0',
            name: 'Symptomer',
            title: 'Symptomer',
            status: 'draft',
            publisher: 'Direktoratet for e-helse',
            compose: {
                include: [
                    {
                        system: 'http://ehelse.no/Symptomer',
                        concept: [
                            {
                                code: '1',
                                display: 'Hoste',
                            },
                            {
                                code: '2',
                                display: 'Feber',
                            },
                            {
                                code: '3',
                                display: 'Sår hals',
                            },
                            {
                                code: '4',
                                display: 'Hodepine',
                            },
                            {
                                code: '5',
                                display: 'Tett eller rennende nese',
                            },
                            {
                                code: '6',
                                display: 'Muskelsmerter',
                            },
                            {
                                code: '7',
                                display: 'Tungpust',
                            },
                            {
                                code: '8',
                                display: 'Magesmerter/kvalme/diaré',
                            },
                            {
                                code: '9',
                                display: 'Tap av smaks- eller luktesans',
                            },
                            {
                                code: '99',
                                display: 'Andre',
                            },
                        ],
                    },
                ],
            },
        },
        {
            resourceType: 'ValueSet',
            id: 'Kontakt',
            version: '1.0',
            name: 'Kontakt',
            title: 'Kontakt',
            status: 'draft',
            publisher: 'Direktoratet for e-helse',
            compose: {
                include: [
                    {
                        system: 'http://ehelse.no/Kontakt',
                        concept: [
                            {
                                code: '1',
                                display: 'Ja',
                            },
                            {
                                code: '2',
                                display: 'Nei, ikke som jeg kjenner til',
                            },
                        ],
                    },
                ],
            },
        },
    ],
    extension: [
        {
            url: 'http://ehelse.no/fhir/StructureDefinition/sdf-endpoint',
            valueReference: {
                reference:
                    'https://skjemakatalog-test-fhir-apimgmt.azure-api.net/api/v1/Endpoint/32',
            },
        },
        {
            url:
                'http://ehelse.no/fhir/StructureDefinition/sdf-authenticationrequirement',
            valueCoding: {
                system:
                    'http://ehelse.no/fhir/ValueSet/AuthenticationRequirement',
                code: '3',
            },
        },
        {
            url:
                'http://ehelse.no/fhir/StructureDefinition/sdf-accessibilitytoresponse',
            valueCoding: {
                system:
                    'http://ehelse.no/fhir/ValueSet/AccessibilityToResponse',
                code: '1',
            },
        },
        {
            url:
                'http://ehelse.no/fhir/StructureDefinition/sdf-canbeperformedby',
            valueCoding: {
                system: 'http://ehelse.no/fhir/ValueSet/CanBePerformedBy',
                code: '1',
            },
        },
        {
            url: 'http://ehelse.no/fhir/StructureDefinition/sdf-discretion',
            valueCoding: {
                system: 'http://ehelse.no/fhir/ValueSet/Discretion',
                code: '0',
            },
        },
        {
            url: 'http://ehelse.no/fhir/StructureDefinition/sdf-generatepdf',
            valueBoolean: false,
        },
        {
            url:
                'http://ehelse.no/fhir/StructureDefinition/sdf-generatenarrative',
            valueBoolean: false,
        },
        {
            url:
                'http://helsenorge.no/fhir/StructureDefinition/sdf-presentationbuttons',
            valueCoding: {
                system:
                    'http://helsenorge.no/fhir/ValueSet/presentationbuttons',
                code: 'sticky',
            },
        },
    ],
    url:
        'https://skjemakatalog-prod-fhir-apimgmt.azure-api.net/api/v1/Questionnaire/302',
    version: '0.6',
    name: 'hdir-CoronaReport',
    title: 'Ved mistanke om koronavirus',
    status: 'draft',
    date: '2020-03-23',
    publisher: 'NHN',
    description:
        'Dette skjemaet skal kun benyttes for selvapportering til myndighetene, slik at de får bedre oversikt over mennesker i befolkningen som kan ha, eller har vært utsatt for Koronasmitte.',
    useContext: [
        {
            code: {
                system: 'http://hl7.org/fhir/ValueSet/usage-context-type',
                code: 'focus',
                display: 'Clinical Focus',
            },
            valueCodeableConcept: {
                coding: [
                    {
                        system: 'urn:oid:2.16.578.1.12.4.1.1.7615',
                        code: '29',
                        display:
                            'Innrapportering av symptomer på korona til FHI',
                    },
                ],
            },
        },
    ],
    contact: [
        {
            name: 'https://fhi.no/',
        },
    ],
    subjectType: ['Patient'],
    item: [
        {
            linkId: '1',
            text: 'Hvem skal fylle ut skjemaet?',
            type: 'group',
            repeats: false,
            item: [
                {
                    linkId: '1.100',
                    text:
                        'Dette skjemaet er for deg som i løpet av de siste syv dagene har fått symptomer som kan skyldes koronavirus. Her kan du melde til Folkehelseinstituttet slik at helsemyndighetene får bedre oversikt over utbredelsen av smitte.',
                    _text: {
                        extension: [
                            {
                                url:
                                    'http://hl7.org/fhir/StructureDefinition/rendering-markdown',
                                valueMarkdown:
                                    'Dette skjemaet er for deg som i løpet av de siste syv dagene har fått symptomer som kan skyldes koronavirus.\r\n\r\nHer kan du melde til Folkehelseinstituttet slik at helsemyndighetene får bedre oversikt over utbredelsen av smitte.',
                            },
                        ],
                    },
                    type: 'display',
                },
            ],
        },
        {
            linkId: '2',
            text: 'Om deg som har symptomer',
            type: 'group',
            repeats: false,
            item: [
                {
                    extension: [
                        {
                            url:
                                'http://ehelse.no/fhir/StructureDefinition/sdf-fhirpath',
                            valueString:
                                "Patient.identifier.where(use = 'official' and system = 'urn:oid:2.16.578.1.12.4.1.4.1').value",
                        },
                    ],
                    linkId: '2.100',
                    text: 'Fødselsnummer',
                    type: 'string',
                    required: true,
                    repeats: false,
                    readOnly: true,
                },
                {
                    extension: [
                        {
                            url:
                                'http://ehelse.no/fhir/StructureDefinition/sdf-fhirpath',
                            valueString:
                                "Patient.address.where(use = 'home').postalCode",
                        },
                    ],
                    linkId: '2.300',
                    text: 'Postnummer bostedsadresse',
                    type: 'string',
                    required: true,
                    repeats: false,
                    readOnly: true,
                },
            ],
        },
        {
            linkId: '5',
            text: 'Symptomer',
            type: 'group',
            repeats: false,
            item: [
                {
                    extension: [
                        {
                            url:
                                'http://ehelse.no/fhir/StructureDefinition/validationtext',
                            valueString: 'Du må gjøre et valg her',
                        },
                    ],
                    linkId: '5.100',
                    text:
                        'Har du i løpet av de siste syv dagene fått symptomer som kan skyldes koronavirus?',
                    type: 'choice',
                    required: true,
                    repeats: false,
                    readOnly: false,
                    options: {
                        reference: '#1101',
                    },
                    initialCoding: {
                        system: 'urn:oid:2.16.578.1.12.4.1.1101',
                        code: '1',
                    },
                },
                {
                    extension: [
                        {
                            url:
                                'http://ehelse.no/fhir/StructureDefinition/validationtext',
                            valueString: 'Du må gjøre minst et valg her',
                        },
                        {
                            url:
                                'http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl',
                            valueCodeableConcept: {
                                coding: [
                                    {
                                        system:
                                            'http://hl7.org/fhir/ValueSet/questionnaire-item-control',
                                        code: 'check-box',
                                    },
                                ],
                            },
                        },
                    ],
                    linkId: '5.200',
                    text: 'Hvilke symptomer har du hatt?',
                    _text: {
                        extension: [
                            {
                                url:
                                    'http://hl7.org/fhir/StructureDefinition/rendering-markdown',
                                valueMarkdown:
                                    '#### Hvilke symptomer har du hatt?\r\nDu kan velge én eller flere',
                            },
                        ],
                    },
                    type: 'choice',
                    enableWhen: [
                        {
                            question: '5.100',
                            answerCoding: {
                                system: 'urn:oid:2.16.578.1.12.4.1.1101',
                                code: '1',
                            },
                        },
                    ],
                    required: true,
                    repeats: false,
                    readOnly: false,
                    options: {
                        reference: '#Symptomer',
                    },
                },
                {
                    extension: [
                        {
                            url:
                                'http://ehelse.no/fhir/StructureDefinition/validationtext',
                            valueString:
                                'Du kan velge en dato fra i dag og 7 dager tilbake i tid. Dato skal ha format dd.mm.åååå.',
                        },
                        {
                            url:
                                'http://ehelse.no/fhir/StructureDefinition/sdf-fhirpathvalidation',
                            valueString:
                                'this.value <= today()  and this.value >=today() - 7 days',
                        },
                        {
                            url:
                                'http://ehelse.no/fhir/StructureDefinition/sdf-maxvalue',
                            valueString: 'today()',
                        },
                        {
                            url:
                                'http://ehelse.no/fhir/StructureDefinition/sdf-minvalue',
                            valueString: 'today() - 7 days',
                        },
                    ],
                    linkId: '5.201',
                    text: 'Hvilken dag fikk du symptomer?',
                    _text: {
                        extension: [
                            {
                                url:
                                    'http://hl7.org/fhir/StructureDefinition/rendering-markdown',
                                valueMarkdown:
                                    '#### Hvilken dag fikk du symptomer?\r\nDato skal ha format dd.mm.åååå',
                            },
                        ],
                    },
                    type: 'date',
                    enableWhen: [
                        {
                            question: '5.100',
                            answerCoding: {
                                system: 'urn:oid:2.16.578.1.12.4.1.1101',
                                code: '1',
                            },
                        },
                    ],
                    required: true,
                    repeats: false,
                    readOnly: false,
                },
                {
                    extension: [
                        {
                            url:
                                'http://ehelse.no/fhir/StructureDefinition/validationtext',
                            valueString: 'Du må gjøre et valg her',
                        },
                    ],
                    linkId: '5.300',
                    text: 'Hvordan er formen din i dag?',
                    type: 'choice',
                    enableWhen: [
                        {
                            question: '5.100',
                            answerCoding: {
                                system: 'urn:oid:2.16.578.1.12.4.1.1101',
                                code: '1',
                            },
                        },
                    ],
                    required: true,
                    repeats: false,
                    readOnly: false,
                    options: {
                        reference: '#Almentilstand',
                    },
                },
                {
                    extension: [
                        {
                            url:
                                'http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl',
                            valueCodeableConcept: {
                                coding: [
                                    {
                                        system:
                                            'http://hl7.org/fhir/ValueSet/questionnaire-item-control',
                                        code: 'check-box',
                                    },
                                ],
                            },
                        },
                    ],
                    linkId: '5.401',
                    text:
                        'Hak av om du får behandling for noen av disse sykdommene',
                    _text: {
                        extension: [
                            {
                                url:
                                    'http://hl7.org/fhir/StructureDefinition/rendering-markdown',
                                valueMarkdown:
                                    '#### Hak av om du får behandling for noen av disse sykdommene\r\nDu kan velge flere, én eller ingen',
                            },
                        ],
                    },
                    type: 'choice',
                    enableWhen: [
                        {
                            question: '5.100',
                            answerCoding: {
                                system: 'urn:oid:2.16.578.1.12.4.1.1101',
                                code: '1',
                            },
                        },
                    ],
                    required: false,
                    repeats: false,
                    readOnly: false,
                    options: {
                        reference: '#Sykdom',
                    },
                },
                {
                    extension: [
                        {
                            url:
                                'http://ehelse.no/fhir/StructureDefinition/validationtext',
                            valueString: 'Du må gjøre et valg her',
                        },
                    ],
                    linkId: '5.500',
                    text:
                        'Har du vært i kontakt med lege eller legevakt på grunn av symptomene dine?',
                    type: 'choice',
                    enableWhen: [
                        {
                            question: '5.100',
                            answerCoding: {
                                system: 'urn:oid:2.16.578.1.12.4.1.1101',
                                code: '1',
                            },
                        },
                    ],
                    required: true,
                    repeats: false,
                    readOnly: false,
                    options: {
                        reference: '#1101',
                    },
                },
                {
                    extension: [
                        {
                            url:
                                'http://ehelse.no/fhir/StructureDefinition/validationtext',
                            valueString: 'Du må gjøre et valg her',
                        },
                    ],
                    linkId: '5.600',
                    text:
                        'Har du blitt testet for koronavirus i løpet av denne sykdomsperioden?',
                    type: 'choice',
                    enableWhen: [
                        {
                            question: '5.100',
                            answerCoding: {
                                system: 'urn:oid:2.16.578.1.12.4.1.1101',
                                code: '1',
                            },
                        },
                    ],
                    required: true,
                    repeats: false,
                    readOnly: false,
                    options: {
                        reference: '#1101',
                    },
                    item: [
                        {
                            extension: [
                                {
                                    url:
                                        'http://ehelse.no/fhir/StructureDefinition/validationtext',
                                    valueString: 'Du må gjøre et valg her',
                                },
                            ],
                            linkId: '5.600.1',
                            text: 'Hva var svaret på prøven?',
                            type: 'choice',
                            enableWhen: [
                                {
                                    question: '5.600',
                                    answerCoding: {
                                        system:
                                            'urn:oid:2.16.578.1.12.4.1.1101',
                                        code: '1',
                                    },
                                },
                            ],
                            required: true,
                            repeats: false,
                            readOnly: false,
                            options: {
                                reference: '#Svar',
                            },
                        },
                    ],
                },
            ],
        },
        {
            linkId: '10',
            text: 'Hva skjer med opplysningene?',
            type: 'group',
            enableWhen: [
                {
                    question: '5.100',
                    answerCoding: {
                        system: 'urn:oid:2.16.578.1.12.4.1.1101',
                        code: '1',
                    },
                },
            ],
            repeats: false,
            item: [
                {
                    linkId: '10.100',
                    text:
                        'Takk for at du hjelper Folkehelseinstituttet med å kartlegge utbredelsen av smitte!  Du kan også fylle ut skjemaet vegne av dine barn, eller noen du har fullmakt for. For å gjøre dette, klikker du igjen på lenken til skjemaet på Helsenorge.no, og deretter velger du aktuell person i personvelgeren øverst til høyre etter innlogging.',
                    _text: {
                        extension: [
                            {
                                url:
                                    'http://hl7.org/fhir/StructureDefinition/rendering-markdown',
                                valueMarkdown:
                                    '**Takk for at du hjelper Folkehelseinstituttet med å kartlegge utbredelsen av smitte!** \r\n\r\nØnsker du å melde fra om symptomer for en annen? Da sender du inn dette skjemaet først. Deretter, hvis du kan representere andre på Helsenorge, velger du personen øverst til høyre på skjermen. Så leter du fram lenken som tok deg til dette skjemaet.',
                            },
                        ],
                    },
                    type: 'display',
                },
                {
                    linkId: '10.200',
                    text:
                        'Opplysningene du gir vil brukes til overvåking og forskning i forbindelse med utbruddet av koronavirus. Det kan bli aktuelt å sammenstille denne informasjonen med opplysninger i offentlige helseregistre for eksempel Norsk pasientregister og Meldingssystem for smittsomme sykdommer, samt Statistisk Sentralbyrå sine registre. Dette er for å få best mulige analyser og kvalitetskontroll.Opplysningene oppbevares og behandles i henhold til gjeldende regler om personvern.Folkehelseinstituttet vil være dataansvarlig for håndtering av personopplysningene. Opplysningene oppbevares på ubestemt tid. Du har rett til innsyn i hvilke opplysninger som er lagret om deg, og hva opplysningene er blitt brukt til. Det er frivillig å delta, og du kan trekke samtykket ditt når som helst og be om at opplysningene blir slettet. Dette kan du gjøre ved å sende en henvendelse på e-post til personvernombud(at)fhi.no. \r\nDet vil ikke være mulig å gjenkjenne enkeltpersoner i publisert statistikk eller forskning. Resultater vil kun bli publisert på grupper og aldri på individnivå.',
                    _text: {
                        extension: [
                            {
                                url:
                                    'http://hl7.org/fhir/StructureDefinition/rendering-markdown',
                                valueMarkdown:
                                    'Opplysningene du gir vil brukes til overvåking og forskning i forbindelse med utbruddet av koronavirus. \r\n\r\nDet kan bli aktuelt å sammenstille denne informasjonen med opplysninger i offentlige helseregistre for eksempel Norsk pasientregister og Meldingssystem for smittsomme sykdommer, samt Statistisk Sentralbyrå sine registre. Dette er for å få best mulige analyser og kvalitetskontroll.\r\n\r\nOpplysningene oppbevares og behandles i henhold til gjeldende regler om personvern.\r\n\r\nFolkehelseinstituttet vil være dataansvarlig for håndtering av personopplysningene. Opplysningene oppbevares på ubestemt tid. Du har rett til innsyn i hvilke opplysninger som er lagret om deg, og hva opplysningene er blitt brukt til. Det er frivillig å delta, og du kan trekke samtykket ditt når som helst og be om at opplysningene blir slettet. Dette kan du gjøre ved å sende en henvendelse på e-post til personvernombud(at)fhi.no. \r\n\r\nDet vil ikke være mulig å gjenkjenne enkeltpersoner i publisert statistikk eller forskning. Resultater vil kun bli publisert på grupper og aldri på individnivå.',
                            },
                        ],
                    },
                    type: 'display',
                },
                {
                    extension: [
                        {
                            url:
                                'http://ehelse.no/fhir/StructureDefinition/validationtext',
                            valueString:
                                'Du må hake av her for å gi ditt samtykke og sende inn skjemaet, eller velge avbryt',
                        },
                    ],
                    linkId: '10.300',
                    text:
                        'Jeg samtykker til at opplysningene jeg har gitt, kan brukes i samsvar med ovennevnte.',
                    type: 'boolean',
                    required: true,
                    repeats: false,
                    readOnly: false,
                },
            ],
        },
        {
            linkId: '11',
            text: 'Takk, men du trenger ikke sende inn skjemaet',
            type: 'group',
            enableWhen: [
                {
                    question: '5.100',
                    answerCoding: {
                        system: 'urn:oid:2.16.578.1.12.4.1.1101',
                        code: '2',
                    },
                },
            ],
            repeats: false,
            item: [
                {
                    linkId: '11.100',
                    text:
                        'Du har oppgitt at du ikke har hatt symptomer i løpet av de siste syv dagene. Vennligst velg **Avbryt** og gå ut av skjemaet.Dersom du senere får symptomer som kan skyldes koronavirus, vil vi gjerne at du registrerer dine opplysninger her.Ønsker du å melde fra om symptomer for en annen? Hvis du kan representere andre på Helsenorge, velger du personen øverst til høyre på skjermen og fyller ut skjemaet.',
                    _text: {
                        extension: [
                            {
                                url:
                                    'http://hl7.org/fhir/StructureDefinition/rendering-markdown',
                                valueMarkdown:
                                    'Du har oppgitt at du ikke har hatt symptomer i løpet av de siste syv dagene. Vennligst velg **Avbryt** og gå ut av skjemaet.\r\n\r\nDersom du senere får symptomer som kan skyldes koronavirus, vil vi gjerne at du registrerer dine opplysninger her.\r\n\r\nØnsker du å melde fra om symptomer for en annen? Hvis du kan representere andre på Helsenorge, velger du personen øverst til høyre på skjermen og fyller ut skjemaet.',
                            },
                        ],
                    },
                    type: 'display',
                },
            ],
        },
    ],
};
