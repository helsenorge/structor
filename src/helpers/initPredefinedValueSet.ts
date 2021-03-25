import { ValueSet } from '../types/fhir';

export const predefinedValueSetUri = 'http://ehelse.no/fhir/ValueSet/Predefined';

export const initPredefinedValueSet = [
    {
        url: predefinedValueSetUri,
        resourceType: 'ValueSet',
        id: '1101',
        version: '1.0',
        name: 'structor-yes-no-1101',
        title: 'Ja / Nei',
        status: 'draft',
        publisher: 'NHN',
        compose: {
            include: [
                {
                    system: 'system-structor-1.0:1101',
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
        url: predefinedValueSetUri,
        resourceType: 'ValueSet',
        id: '1102',
        version: '1.0',
        name: 'structor-yes-no-maybe-1102',
        title: 'Ja / Nei / Usikker',
        status: 'draft',
        publisher: 'Direktoratet for e-helse',
        compose: {
            include: [
                {
                    system: 'system-structor-1.0:1102',
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
                            display: 'Usikker',
                        },
                    ],
                },
            ],
        },
    },
    {
        url: predefinedValueSetUri,
        resourceType: 'ValueSet',
        id: '1103',
        version: '1.0',
        name: 'structor-sex-1103',
        title: 'Kjønn',
        status: 'draft',
        publisher: 'Direktoratet for e-helse',
        compose: {
            include: [
                {
                    system: 'system-structor-1.0:1103',
                    concept: [
                        {
                            code: 'LA2-8',
                            display: 'Mann',
                        },
                        {
                            code: 'LA3-6',
                            display: 'Kvinne',
                        },
                    ],
                },
            ],
        },
    },
] as ValueSet[];
