export const bestillingsSkjema = {
    resourceType: 'Questionnaire',
    id: '50',
    meta: {
        versionId: '8',
        lastUpdated: '2019-11-29T17:19:17.413+00:00',
        profile: ['http://ehelse.no/fhir/StructureDefinition/sdf-Questionnaire'],
        tag: [{ system: 'urn:ietf:bcp:47', code: 'nb-NO', display: 'Norsk bokmål' }],
    },
    language: 'nb-NO',
    contained: [
        {
            resourceType: 'ValueSet',
            id: '8459',
            version: '1.0',
            name: 'urn:oid:8459',
            title: 'Kjønn',
            status: 'draft',
            publisher: 'Direktoratet for e-helse',
            compose: {
                include: [
                    {
                        system: 'urn:oid:2.16.578.1.12.4.1.8459',
                        concept: [
                            { code: '1', display: 'Mann' },
                            { code: '2', display: 'Kvinne' },
                        ],
                    },
                ],
            },
        },
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
                            { code: '1', display: 'Ja' },
                            { code: '2', display: 'Nei' },
                        ],
                    },
                ],
            },
        },
        {
            resourceType: 'ValueSet',
            id: 'levering',
            version: '1.0',
            name: 'levering',
            title: 'levering',
            status: 'draft',
            publisher: 'Direktoratet for e-helse',
            compose: {
                include: [
                    {
                        system: 'http://ehelse.no/levering',
                        concept: [
                            { code: '1', display: 'Folkeregistrert adresse' },
                            { code: '2', display: 'Bostedsadresse / midlertidig adresse' },
                            { code: '3', display: 'Henter selv' },
                        ],
                    },
                ],
            },
        },
        {
            resourceType: 'ValueSet',
            id: 'apparat',
            version: '1.0',
            name: 'apparat',
            title: 'apparat',
            status: 'draft',
            publisher: 'Direktoratet for e-helse',
            compose: {
                include: [
                    {
                        system: 'http://ehelse.no/apparat',
                        concept: [
                            { code: '1', display: 'Coagucheck' },
                            { code: '2', display: 'iLine MicroINR' },
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
                reference: 'https://skjemakatalog-test-fhir-apimgmt.azure-api.net/api/v1/Endpoint/2',
            },
        },
        {
            url: 'http://ehelse.no/fhir/StructureDefinition/sdf-authenticationrequirement',
            valueCoding: {
                system: 'http://ehelse.no/fhir/ValueSet/AuthenticationRequirement',
                code: '3',
            },
        },
        {
            url: 'http://ehelse.no/fhir/StructureDefinition/sdf-accessibilitytoresponse',
            valueCoding: {
                system: 'http://ehelse.no/fhir/ValueSet/AccessibilityToResponse',
                code: '1',
            },
        },
        {
            url: 'http://ehelse.no/fhir/StructureDefinition/sdf-canbeperformedby',
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
    ],
    url: 'https://skjemakatalog-test-fhir-apimgmt.azure-api.net/api/v1/Questionnaire/50',
    version: '1',
    name: 'HV-BHM-INR-1',
    title: 'Bestillingsskjema for forbruksmateriell til egenkontroll av INR',
    status: 'draft',
    date: '2019-02-27',
    publisher: 'Helse Vest',
    description: 'Bestillingsskjema for forbruksmateriell til egenkontroll av INR',
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
                        system: 'urn:oid:2.16.578.1.12.4.1.1.8655',
                        code: 'S03',
                        display: 'Indremedisin',
                    },
                ],
            },
        },
    ],
    contact: [{ name: 'http://www.e-helse.no' }],
    copyright: 'Er utviklet av Direktoratet for e-helse for Helse Vest',
    subjectType: ['Person'],
    item: [
        {
            linkId: '1',
            text: 'Informasjon',
            type: 'group',
            repeats: false,
            item: [
                {
                    linkId: '1.1',
                    text: 'Om skjemaet og hvem som kan benytte det',
                    type: 'group',
                    repeats: false,
                    item: [
                        {
                            linkId: '1.1.1',
                            text:
                                'Skjema kan benyttes av pasienter som har fått tildelt utstyr for egenkontroll av INR fra spesialisthelsetjenesten i Helse Bergen.',
                            _text: {
                                extension: [
                                    {
                                        url: 'http://hl7.org/fhir/StructureDefinition/rendering-markdown',
                                        valueMarkdown:
                                            'Skjema kan benyttes av pasienter som har fått tildelt utstyr for egenkontroll av INR fra spesialisthelsetjenesten i Helse Bergen.',
                                    },
                                ],
                            },
                            type: 'display',
                        },
                        {
                            linkId: '1.1.2',
                            text: 'På vegne av andre',
                            type: 'group',
                            repeats: false,
                            item: [
                                {
                                    linkId: '1.1.2.1',
                                    text:
                                        'Du kan bestille på vegne av dine barn, eller noen du har fullmakt for. For å bestille på vegne av noen, klikker du på aktuell person i personvelgeren etter innlogging på helsenorge.no. Hvordan du representerer andre finner du informasjon om på Helsenorge https://helsenorge.no/om-min-helse/slik-representerer-du-andre-paa-helsenorge-no.',
                                    _text: {
                                        extension: [
                                            {
                                                url: 'http://hl7.org/fhir/StructureDefinition/rendering-markdown',
                                                valueMarkdown:
                                                    'Du kan bestille på vegne av dine barn, eller noen du har fullmakt for. For å bestille på vegne av noen, klikker du på aktuell person i personvelgeren etter innlogging på helsenorge.no. [Hvordan du representerer andre finner du informasjon om på Helsenorge](https://helsenorge.no/om-min-helse/slik-representerer-du-andre-paa-helsenorge-no).',
                                            },
                                        ],
                                    },
                                    type: 'display',
                                },
                            ],
                        },
                    ],
                },
                {
                    linkId: '1.2',
                    text: 'Om personvern og bruk av dine data',
                    type: 'group',
                    repeats: false,
                    item: [
                        {
                            linkId: '1.2.1',
                            text:
                                'Dette skjemaet blir sendt fra Helsenorge via sikker kanal til Helse Vest. Helsenorge lagrer en kopi av dette skjemaet, om du ønsker det. Skjemaet lagres der du normalt finner meldinger og  dokumenter på Helsenorge. Har du spørsmål til dette skjemaet, ta kontakt med aktuelt helseforetak.  Du kan selv slette denne kopien, og gjør du det fra "Meldinger", slettes også kopien i "Dokumenter". Du kan ikke omgjøre slettingen. Du sletter ikke mottakers skjema. For generelle bruksvilkår inkludert kontaktinformasjon til personvernombud, se bruksvilkårene for Helsenorge. Formålet for behandlingen av personopplysningene i skjemaet er å lagre og registrere bestillingen i din elektroniske pasientjournal. Du har rett til innsyn i egen journal i henhold til gjeldende lovverk. Data distribueres ikke til tredjepart. Kontaktinformasjon til dataansvarlig i Helse Vest finnes på Helse Vest Hjemmesider.',
                            _text: {
                                extension: [
                                    {
                                        url: 'http://hl7.org/fhir/StructureDefinition/rendering-markdown',
                                        valueMarkdown:
                                            'Dette skjemaet blir sendt fra Helsenorge via sikker kanal til Helse Vest.  Har du spørsmål til dette skjemaet, ta kontakt med aktuelt helseforetak. \r\n\r\nSkjemaet lagres der du normalt finner meldinger og  dokumenter på Helsenorge.  Du kan selv slette denne kopien, og gjør du det fra "Meldinger", slettes også kopien i "Dokumenter". Du kan ikke omgjøre slettingen. Du sletter ikke mottakers skjema.\r\n\r\nFor generelle bruksvilkår inkludert kontaktinformasjon til personvernombud, se bruksvilkårene for Helsenorge.\r\n\r\nFormålet for behandlingen av personopplysningene i skjemaet er å lagre og registrere bestillingen i din elektroniske pasientjournal. Du har rett til innsyn i egen journal i henhold til gjeldende lovverk. Data distribueres ikke til tredjepart. \r\n\r\nKontaktinformasjon til dataansvarlig i Helse Vest finnes på Helse Vest Hjemmesider.',
                                    },
                                ],
                            },
                            type: 'display',
                        },
                    ],
                },
            ],
        },
        {
            linkId: '2',
            text: 'Opplysninger om den bestillingen gjelder',
            type: 'group',
            repeats: false,
            item: [
                {
                    linkId: '2.1',
                    text: 'Personalia',
                    type: 'group',
                    repeats: false,
                    item: [
                        {
                            extension: [
                                {
                                    url: 'http://ehelse.no/fhir/StructureDefinition/sdf-fhirpath',
                                    valueString:
                                        "Patient.identifier.where(use = 'official' and system = 'urn:oid:2.16.578.1.12.4.1.4.1').value",
                                },
                            ],
                            linkId: '2.1.1',
                            text: 'Fødselsnummer',
                            type: 'string',
                            required: false,
                            repeats: false,
                            readOnly: true,
                            initialString: '07118600295',
                        },
                        {
                            extension: [
                                {
                                    url: 'http://ehelse.no/fhir/StructureDefinition/sdf-fhirpath',
                                    valueString:
                                        "Patient.name.where(use = 'official').select(iif(given.count() > 1, given.take(count()-1), given).join(' '))",
                                },
                            ],
                            linkId: '2.1.2',
                            text: 'Fornavn',
                            type: 'string',
                            required: false,
                            repeats: false,
                            readOnly: true,
                            initialString: 'Anna Fos',
                        },
                        {
                            extension: [
                                {
                                    url: 'http://ehelse.no/fhir/StructureDefinition/sdf-fhirpath',
                                    valueString: "Patient.name.where(use = 'official').family",
                                },
                            ],
                            linkId: '2.1.3',
                            text: 'Etternavn',
                            type: 'string',
                            required: false,
                            repeats: false,
                            readOnly: true,
                            initialString: 'Eieb',
                        },
                    ],
                },
                {
                    linkId: '2.2',
                    text: 'Kontaktinformasjon',
                    type: 'group',
                    repeats: false,
                    item: [
                        {
                            extension: [
                                {
                                    url: 'http://ehelse.no/fhir/StructureDefinition/sdf-fhirpath',
                                    valueString: "Patient.telecom.where(use = 'mobile' and system = 'phone').value",
                                },
                            ],
                            linkId: '2.2.1',
                            text: 'Mobilnummer som er registrert',
                            type: 'string',
                            required: false,
                            repeats: false,
                            readOnly: false,
                            initialString: '+4792491788',
                        },
                        {
                            extension: [
                                {
                                    url: 'http://ehelse.no/fhir/StructureDefinition/sdf-fhirpath',
                                    valueString: "Patient.telecom.where(use = 'home' and system = 'email').value",
                                },
                            ],
                            linkId: '2.2.2',
                            text: 'E-postadresse som er registrert',
                            type: 'string',
                            required: false,
                            repeats: false,
                            readOnly: false,
                            initialString: 'marte.bustgaard@nhh.no',
                        },
                    ],
                },
                {
                    linkId: '2.3',
                    text: 'Opplysninger om den som bestiller på vegne av en annen',
                    _text: {
                        extension: [
                            {
                                url: 'http://hl7.org/fhir/StructureDefinition/rendering-markdown',
                                valueMarkdown:
                                    '### Opplysninger om den som bestiller på vegne av en annen\r\n\r\n*Om du forespør på vegne av deg selv, vil ikke disse feltene være utfylt*',
                            },
                        ],
                    },
                    type: 'group',
                    repeats: false,
                    item: [
                        {
                            extension: [
                                {
                                    url: 'http://ehelse.no/fhir/StructureDefinition/sdf-fhirpath',
                                    valueString:
                                        "RelatedPerson.name.where(use = 'official').select(given.join(' ') & ' ' & family)",
                                },
                            ],
                            linkId: '2.3.1',
                            text: 'Navn',
                            type: 'string',
                            required: false,
                            repeats: false,
                            readOnly: true,
                        },
                        {
                            extension: [
                                {
                                    url: 'http://ehelse.no/fhir/StructureDefinition/sdf-fhirpath',
                                    valueString:
                                        "RelatedPerson.identifier.where(use = 'official' and system = 'urn:oid:2.16.578.1.12.4.1.4.1').value",
                                },
                            ],
                            linkId: '2.3.2',
                            text: 'Fødselsnummer (11 siffer)',
                            type: 'string',
                            required: false,
                            repeats: false,
                            readOnly: true,
                        },
                    ],
                },
            ],
        },
        {
            linkId: '4',
            text: 'Hvor skal bestillingen sendes',
            type: 'group',
            repeats: false,
            item: [
                {
                    extension: [
                        {
                            url: 'http://ehelse.no/fhir/StructureDefinition/validationtext',
                            valueString: 'Du må gjøre et valg her',
                        },
                    ],
                    linkId: '4.1',
                    text: 'Hvordan ønsker du varene levert?',
                    type: 'choice',
                    required: true,
                    repeats: false,
                    readOnly: false,
                    options: { reference: '#levering' },
                },
                {
                    linkId: '4.2',
                    text: 'Folkeregistrert adresse',
                    type: 'group',
                    enableWhen: [
                        {
                            question: '4.1',
                            answerCoding: { system: 'http://ehelse.no/levering', code: '1' },
                        },
                    ],
                    repeats: false,
                    item: [
                        {
                            extension: [
                                {
                                    url: 'http://ehelse.no/fhir/StructureDefinition/sdf-fhirpath',
                                    valueString: "Patient.address.where(use = 'home').line.first()",
                                },
                            ],
                            linkId: '4.2.1',
                            text: 'Adresse',
                            type: 'string',
                            required: false,
                            repeats: false,
                            readOnly: true,
                            initialString: 'Bjørkelia 6',
                        },
                        {
                            extension: [
                                {
                                    url: 'http://ehelse.no/fhir/StructureDefinition/sdf-fhirpath',
                                    valueString: "Patient.address.where(use = 'home').postalCode",
                                },
                            ],
                            linkId: '4.2.2',
                            text: 'Postnummer',
                            type: 'string',
                            required: false,
                            repeats: false,
                            readOnly: true,
                            initialString: '1860',
                        },
                        {
                            extension: [
                                {
                                    url: 'http://ehelse.no/fhir/StructureDefinition/sdf-fhirpath',
                                    valueString: "Patient.address.where(use = 'home').city",
                                },
                            ],
                            linkId: '4.2.3',
                            text: 'Poststed',
                            type: 'string',
                            required: false,
                            repeats: false,
                            readOnly: true,
                            initialString: 'TRØGSTAD',
                        },
                    ],
                },
                {
                    linkId: '4.3',
                    text: 'Bostedsadresse',
                    type: 'group',
                    enableWhen: [
                        {
                            question: '4.1',
                            answerCoding: { system: 'http://ehelse.no/levering', code: '2' },
                        },
                    ],
                    repeats: false,
                    item: [
                        {
                            extension: [
                                {
                                    url: 'http://ehelse.no/fhir/StructureDefinition/validationtext',
                                    valueString: 'Du må fylle ut dette feltet',
                                },
                            ],
                            linkId: '4.3.1',
                            text: 'Adresse',
                            type: 'string',
                            required: true,
                            repeats: false,
                            readOnly: false,
                        },
                        {
                            extension: [
                                {
                                    url: 'http://ehelse.no/fhir/StructureDefinition/validationtext',
                                    valueString: 'Du må fylle ut dette feltet. Kun 4 heltall er lovlig.',
                                },
                                {
                                    url: 'http://hl7.org/fhir/StructureDefinition/regex',
                                    valueString: '^([0-9]){4}$',
                                },
                            ],
                            linkId: '4.3.2',
                            text: 'Postnummer',
                            type: 'string',
                            required: true,
                            repeats: false,
                            readOnly: false,
                        },
                        {
                            extension: [
                                {
                                    url: 'http://ehelse.no/fhir/StructureDefinition/validationtext',
                                    valueString: 'Du må fylle ut dette feltet',
                                },
                            ],
                            linkId: '4.3.3',
                            text: 'Poststed',
                            type: 'string',
                            required: true,
                            repeats: false,
                            readOnly: false,
                        },
                    ],
                },
                {
                    linkId: '4.4',
                    text: 'Henter selv',
                    type: 'group',
                    enableWhen: [
                        {
                            question: '4.1',
                            answerCoding: { system: 'http://ehelse.no/levering', code: '3' },
                        },
                    ],
                    repeats: false,
                    item: [
                        {
                            linkId: '4.4.1',
                            text: 'Du kan hente i ekspedisjonen på følgende adresse:',
                            type: 'display',
                        },
                        {
                            linkId: '4.4.3',
                            text: 'Helse Bergen, Solheimsgaten 13A, (Motorhallen), 5058  Bergen',
                            _text: {
                                extension: [
                                    {
                                        url: 'http://hl7.org/fhir/StructureDefinition/rendering-markdown',
                                        valueMarkdown:
                                            'Helse Bergen  \r\nSolheimsgaten 13A  \r\n(Motorhallen)  \r\n5058  Bergen',
                                    },
                                ],
                            },
                            type: 'display',
                        },
                    ],
                },
            ],
        },
        {
            linkId: '5',
            text: 'Bestilling',
            type: 'group',
            repeats: false,
            item: [
                {
                    linkId: '5.1',
                    text: 'Forbruksmateriell til Coagucheck',
                    type: 'group',
                    repeats: false,
                    item: [
                        {
                            linkId: '5.1.1',
                            text: 'Lansetter (3mnd forbruk)',
                            type: 'boolean',
                            required: false,
                            repeats: false,
                            readOnly: false,
                        },
                        {
                            linkId: '5.1.2',
                            text: 'Teststrimler (3mnd forbruk)',
                            type: 'boolean',
                            required: false,
                            repeats: false,
                            readOnly: false,
                        },
                        {
                            linkId: '5.1.3',
                            text: 'Innskyter',
                            type: 'boolean',
                            required: false,
                            repeats: false,
                            readOnly: false,
                        },
                    ],
                },
                {
                    linkId: '5.2',
                    text: 'Forbruksmateriell til iLine MicroINR',
                    type: 'group',
                    repeats: false,
                    item: [
                        {
                            linkId: '5.2.1',
                            text: 'Lansetter (3mnd forbruk)',
                            type: 'boolean',
                            required: false,
                            repeats: false,
                            readOnly: false,
                        },
                        {
                            linkId: '5.2.2',
                            text: 'Chips (3mnd forbruk)',
                            type: 'boolean',
                            required: false,
                            repeats: false,
                            readOnly: false,
                        },
                    ],
                },
                {
                    linkId: '5.3',
                    text: 'Tilleggsinformasjon',
                    type: 'text',
                    required: false,
                    repeats: false,
                    readOnly: false,
                },
            ],
        },
        {
            linkId: '6',
            text: 'Innsending',
            type: 'group',
            repeats: false,
            item: [
                {
                    linkId: '6.1',
                    text:
                        'Skjemaet lagres der du normalt finner meldinger og dokumenter på Helsenorge. Har du spørsmål til dette skjemaet, ta kontakt med aktuelt helseforetak.',
                    type: 'display',
                },
            ],
        },
    ],
};
