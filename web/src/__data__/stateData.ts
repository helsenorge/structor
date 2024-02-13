import { TreeState } from "../store/treeStore/treeStore";
import { QuestionnaireItem } from "fhir/r4";
import { IExtensionType } from "../types/IQuestionnareItemType";
import { valuesetJaNei, valuesetJaNeiVetIkke, valuesetJaNeiUsikker } from "./valuesets";

export const defaultState = {
    qContained: [
        valuesetJaNei,
        valuesetJaNeiVetIkke,
        valuesetJaNeiUsikker,
    ]
} as TreeState;

export const item_markdown = {
    linkId: "item_markdown",
    type: "display",
    text: "This is information Step 1 is … Step 2 is …",
    extension: [],
    code: [],
    item: [],
    required: false,
    _text: {
        extension: [
            {
                url: IExtensionType.markdown,
                valueMarkdown: "**This is information**\n\n*   Step 1 is …\n*   Step 2 is …"
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
