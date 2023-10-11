import { ValueSet } from '../types/fhir';

export const predefinedValueSetUri = 'http://ehelse.no/fhir/ValueSet/Predefined';

export const initPredefinedValueSet = [
    {
        url: predefinedValueSetUri,
        resourceType: 'ValueSet',
        id: '1101',
        version: '1.0',
        name: 'urn:oid:1101',
        title: 'Ja / Nei (structor)',
        status: 'draft',
        publisher: 'NHN',
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
        url: predefinedValueSetUri,
        resourceType: 'ValueSet',
        id: '1102',
        version: '1.0',
        name: 'urn:oid:1102',
        title: 'Ja / Nei / Vet ikke (structor)',
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
        url: predefinedValueSetUri,
        resourceType: 'ValueSet',
        id: '9523',
        version: '1.0',
        name: 'urn:oid:9523',
        title: 'Ja / Nei / Usikker (structor)',
        status: 'draft',
        publisher: 'Direktoratet for e-helse',
        compose: {
            include: [
                {
                    system: 'urn:oid:2.16.578.1.12.4.1.9523',
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
] as ValueSet[];
