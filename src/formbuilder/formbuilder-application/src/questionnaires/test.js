export const test = {
    resourceType: 'Questionnaire',
    language: 'nb-NO',
    name: 'hdir-NAVN',
    title: 'Dette er en tittel',
    status: 'draft',
    publisher: 'NHN',
    description: 'Beskrivelsen av tittel',
    meta: {
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
    contained: [],
    useContext: [
        {
            code: { system: 'uri', code: 'focus', display: 'Clinical focus' },
            valueCodeableConcept: {
                coding: [
                    {
                        system: 'uri',
                        code: '29',
                        display: 'Dette er en tittel',
                    },
                ],
            },
        },
    ],
    contact: [{ name: 'https://fhi.no/' }],
    subjectType: ['Patient'],
    item: [
        {
            linkId: '1',
            text: 'Dette er seksjon 1',
            type: 'group',
            repeats: false,
            item: [
                {
                    linkId: '1.100',
                    text: 'Beskrivelse av seksjon 1',
                    _text: {
                        extension: [
                            {
                                url:
                                    'http://hl7.org/fhir/StructureDefinition/rendering-markdown',
                                valueMarkdown: 'Beskrivelse av seksjon 1',
                            },
                        ],
                    },
                    type: 'display',
                },
                {
                    linkId: '1.200',
                    type: 'text',
                    text: 'Hva heter du?',
                    required: true,
                    repeats: false,
                    readOnly: false,
                },
                {
                    linkId: '1.300',
                    type: 'decimal',
                    text: 'Hvor gammel er du?',
                    required: true,
                    repeats: false,
                    readOnly: false,
                    extension: [
                        {
                            url:
                                'http://ehelse.no/fhir/StructureDefinition/validationtext',
                            valueString:
                                'Fyll ut feltet med et tall mellom 0 og 100',
                        },
                        {
                            url:
                                'http://hl7.org/fhir/StructureDefinition/maxValue',
                            valueInteger: 100,
                        },
                        {
                            url:
                                'http://hl7.org/fhir/StructureDefinition/minValue',
                            valueInteger: 0,
                        },
                    ],
                    initialDecimal: 30,
                },
            ],
        },
        {
            linkId: '2',
            text: 'Seksjon 2',
            type: 'group',
            repeats: false,
            item: [
                {
                    linkId: '2.100',
                    text: 'Beskrivelse av seksjon 2',
                    _text: {
                        extension: [
                            {
                                url:
                                    'http://hl7.org/fhir/StructureDefinition/rendering-markdown',
                                valueMarkdown: 'Beskrivelse av seksjon 2',
                            },
                        ],
                    },
                    type: 'display',
                },
                {
                    linkId: '2.200',
                    text: '',
                    type: 'group',
                    repeats: false,
                    item: [
                        {
                            linkId: '2.200.100',
                            text:
                                'Dette er forklaring på spørsmålet "hva jobber du med?". Dette kan ødelegge litt for dere hehe.',
                            type: 'display',
                            _text: {
                                extension: [
                                    {
                                        url:
                                            'http://hl7.org/fhir/StructureDefinition/rendering-markdown',
                                        valueMarkdown:
                                            '### Hva jobber du med? (Spørsmål med tekst)\r\nDette er forklaring på spørsmålet "hva jobber du med?". Dette kan ødelegge litt for dere hehe.',
                                    },
                                ],
                            },
                        },
                        {
                            linkId: '2.200.200',
                            type: 'text',
                            text: 'Hva jobber du med? (Spørsmål med tekst)',
                            required: true,
                            repeats: false,
                            readOnly: false,
                            maxLength: 300,
                        },
                    ],
                },
            ],
        },
    ],
};
