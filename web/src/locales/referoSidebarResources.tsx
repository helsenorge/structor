import React from "react";

import { Questionnaire } from "fhir/r4";

import { getSidebarSections } from "@helsenorge/refero";

export const generateSectionContent = (
  header: string,
  content: string[]
): React.JSX.Element | null => {
  return content.length > 0 ? (
    <>
      <h2>{header}</h2>
      <div>
        {content.map((x, index) => (
          <p
            key={index}
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
              __html: x,
            }}
          ></p>
        ))}
      </div>
    </>
  ) : null;
};

export const getSidebarElements = (
  questionnaire: Questionnaire
): { [id: string]: string[] } => {
  const sidebarData = getSidebarSections(questionnaire);

  const seksjonerFraSkjema: { [id: string]: string[] } = {
    "SOT-1": [],
    "SOT-2": [],
    "SOT-3": [],
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sidebarData.forEach((x: any) => {
    if (x.item.code && x.item.code.length > 0 && x.item.code[0].code) {
      if (seksjonerFraSkjema[x.item.code[0].code]) {
        seksjonerFraSkjema[x.item.code[0].code].push(x.markdownText);
      }
    }
  });

  return seksjonerFraSkjema;
};
