import { QuestionnaireItem } from "../types/fhir";

export const valuesetJaNei = {
    url: "http://ehelse.no/fhir/ValueSet/Predefined",
    resourceType: "ValueSet",
    id: "1101",
    version: "1.0",
    nam: "urn:oid:1101",
    title: "Ja / Nei (structor)",
    status: "draft",
    publisher: "NHN",
    compose: {
        include: [
            {
                system: "urn:oid:2.16.578.1.12.4.1.1101",
                concept: [
                    {
                        code: "1",
                        display: "Ja"
                    },
                    {
                        code: "2",
                        display: "Nei"
                    }
                ]
            }
        ]
    }
};

export const valuesetJaNeiVetIkke = {
    url: "http://ehelse.no/fhir/ValueSet/Predefined",
    resourceType: "ValueSet",
    id: "1102",
    version: "1.0",
    name: "urn:oid:1102",
    title: "Ja / Nei / Vet ikke (structor)",
    status: "draft",
    publisher: "Direktoratet for e-helse",
    compose: {
        include: [
            {
                system: "urn:oid:2.16.578.1.12.4.1.1102",
                concept: [
                    {
                        code: "1",
                        display: "Ja"
                    },
                    {
                        code: "2",
                        display: "Nei"
                    },
                    {
                        code: "3",
                        display: "Vet ikke"
                    }
                ]
            }
        ]
    }
};

export const valuesetJaNeiUsikker = {
    url: "http://ehelse.no/fhir/ValueSet/Predefined",
    resourceType: "ValueSet",
    id: "9523",
    version: "1.0",
    name: "urn:oid:9523",
    title: "Ja / Nei / Usikker (structor)",
    status: "draft",
    publisher: "Direktoratet for e-helse",
    compose: {
        include: [
            {
                system: "urn:oid:2.16.578.1.12.4.1.9523",
                concept: [
                    {
                        code: "1",
                        display: "Ja"
                    },
                    {
                        code: "2",
                        display: "Nei"
                    },
                    {
                        code: "3",
                        display: "Usikker"
                    }
                ]
            }
        ]
    }
};

export const item_JaNei = {
    linkId: "item_JaNei",
    type: "choice",
    text: "Choice",
    extension: [],
    code: [],
    item: [],
    required: false,
    answerValueSet: "#1101"
} as QuestionnaireItem;

export const item_JaNeiVetIkke = {
    linkId: "item_JaNeiVetIkke",
    type: "choice",
    text: "Choice",
    extension: [],
    code: [],
    item: [],
    required: false,
    answerValueSet: "#1102"
} as QuestionnaireItem;

export const item_JaNeiUsikker = {
    linkId: "item_JaNeiUsikker",
    type: "choice",
    text: "Choice",
    extension: [],
    code: [],
    item: [],
    required: false,
    answerValueSet: "#9523"
} as QuestionnaireItem;
