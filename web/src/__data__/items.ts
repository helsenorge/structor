import { RenderingOptionsEnum } from "../helpers/codeHelper";
import { QuestionnaireItem } from "../types/fhir";

export const hiddenItem = {
    linkId: "hidden_item",
    type: "string",
    text: "Answer here is hidden",
    code: [],
    item: [],
    required: false,
    extension: [
        {
            url: "http://hl7.org/fhir/StructureDefinition/questionnaire-hidden",
            valueBoolean: true
        }
    ]
};

export const itemWithRenderOption = (renderOptions: RenderingOptionsEnum): QuestionnaireItem => {
    return {
        linkId: "1ed6433c-c15f-4cc1-86b9-1ee29dd1d2df",
        type: "string",
        text: "Answer here is shown",
        code: [
            {
                code: renderOptions,
                display: "KunPdf",
                system: "http://helsenorge.no/fhir/CodeSystem/RenderOptions",
                id: "06d7fc02-c17d-486d-d5f2-cb2b1dff1ee4"
            }
        ],
        item: [],
        required: false,
    } as QuestionnaireItem;
};
