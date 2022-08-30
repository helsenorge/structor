import React from 'react';
import { getSidebarSections } from '@helsenorge/refero/util/extension';

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
