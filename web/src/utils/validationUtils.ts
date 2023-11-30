import { getUsedValueSet } from "../helpers/generateQuestionnaire";
import { TreeState } from "../store/treeStore/treeStore";
import { QuestionnaireItem, ValueSet } from "../types/fhir";
import { IExtentionType } from "../types/IQuestionnareItemType";

export interface ValidationErrors {
    linkId: string;
    index?: number;
    errorProperty: string;
    errorReadableText: string;
    languagecode?: string;
}

export const getTextExtensionMarkdown = (item: QuestionnaireItem | undefined): string | undefined =>{
    return item?._text?.extension?.find((x) => x.url === IExtentionType.markdown)?.valueMarkdown
};

export const getValueSetToTranslate = (state: TreeState): ValueSet[] | undefined => {
    const usedValueSet = getUsedValueSet(state);
    return state.qContained?.filter((x) => x.id && usedValueSet?.includes(x.id) && x);
}

export const isHiddenItem = (item: QuestionnaireItem): boolean => {;
    return !!item.extension?.some((ext) => ext.url === IExtentionType.hidden && ext.valueBoolean);
}
