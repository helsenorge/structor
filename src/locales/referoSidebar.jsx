import React from 'react';
import { getSidebarSections } from '@helsenorge/refero/util/extension';

export const getReceiverComponentTestData = (selectedReceiverEndpoint) => {
    return [
        {
            OrgenhetId: 1,
            Navn: 'Helse Sør-Øst',
            EnhetType: 1,
            EndepunktId: null,
            UnderOrgenheter: [
                {
                    OrgenhetId: 11,
                    Navn: 'Ahus',
                    EnhetType: 2,
                    EndepunktId: 'TEST-AHUS',
                    UnderOrgenheter: null,
                },
            ],
        },
        {
            OrgenhetId: 2,
            Navn: 'Helse vest',
            EnhetType: 1,
            EndepunktId: null,
            UnderOrgenheter: [
                {
                    OrgenhetId: 22,
                    Navn: 'Haukeland sykehus',
                    EnhetType: 2,
                    EndepunktId: 'TEST-HAUKELAND',
                    UnderOrgenheter: null,
                },
            ],
        },
        ...(selectedReceiverEndpoint && [
            {
                OrgenhetId: 999,
                Navn: `Test receiver with endpoint = Endpoint/${selectedReceiverEndpoint}`,
                EnhetType: 5,
                EndepunktId: selectedReceiverEndpoint,
                UnderOrgenheter: null,
            },
        ]),
    ];
};

export const generateSectionContent = (header, content) => {
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

export const getSidebarElements = (questionnaire) => {
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
