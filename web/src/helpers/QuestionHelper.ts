import { Coding, Extension, QuestionnaireItem, ValueSetComposeIncludeConcept } from '../types/fhir';
import { ICodeSystem, IExtensionType, IOperator, IQuestionnaireItemType } from '../types/IQuestionnareItemType';
import { CodingSystemType } from './uriHelper';
import { ScoringFormulaCodes, ScoringFormulaNames } from '../types/scoringFormulas';

export const ATTACHMENT_DEFAULT_MAX_SIZE = 5.0;

export const QUANTITY_UNIT_TYPE_NOT_SELECTED = 'QUANTITY_UNIT_TYPE_NOT_SELECTED';
export const QUANTITY_UNIT_TYPE_CUSTOM = 'QUANTITY_UNIT_TYPE_CUSTOM';
export const quantityUnitTypes = [
    {
        system: '',
        code: QUANTITY_UNIT_TYPE_NOT_SELECTED,
        display: 'No unit',
    },
    {
        system: 'http://unitsofmeasure.org',
        code: 'cm',
        display: 'centimeter',
    },
    {
        system: 'http://unitsofmeasure.org',
        code: 'kg',
        display: 'kilo',
    },
    {
        system: 'http://unitsofmeasure.org',
        code: 'a',
        display: 'year',
    },
    {
        system: 'http://unitsofmeasure.org',
        code: 'mo',
        display: 'month',
    },
    {
        system: 'http://unitsofmeasure.org',
        code: 'd',
        display: 'day',
    },
    {
        system: '',
        code: QUANTITY_UNIT_TYPE_CUSTOM,
        display: 'Custom',
    },
];

export const enableWhenOperatorBoolean: ValueSetComposeIncludeConcept[] = [
    {
        code: IOperator.exists,
        display: 'is answered',
    },
    {
        code: IOperator.notExists,
        display: 'is not answered',
    },
    {
        code: IOperator.equal,
        display: 'is equal to',
    },
    {
        code: IOperator.notEqual,
        display: 'is not equal',
    },
];

export const enableWhenOperatorChoice: ValueSetComposeIncludeConcept[] = [
    {
        code: IOperator.exists,
        display: 'is answered',
    },
    {
        code: IOperator.notExists,
        display: 'is not answered',
    },
    {
        code: IOperator.equal,
        display: 'is equal to',
    },
    {
        code: IOperator.notEqual,
        display: 'is not equal',
    },
];

export const enableWhenOperatorDate: ValueSetComposeIncludeConcept[] = [
    {
        code: IOperator.exists,
        display: 'is answered',
    },
    {
        code: IOperator.notExists,
        display: 'is not answered',
    },
    {
        code: IOperator.equal,
        display: 'is equal to',
    },
    {
        code: IOperator.notEqual,
        display: 'is not equal',
    },
    {
        code: IOperator.greaterThan,
        display: 'is later than',
    },
    {
        code: IOperator.lessThan,
        display: 'is earlier than',
    },
    {
        code: IOperator.greaterThanOrEqual,
        display: 'is later than or equal',
    },
    {
        code: IOperator.lessThanOrEqual,
        display: 'is earlier than or equal',
    },
];

export const enableWhenOperator: ValueSetComposeIncludeConcept[] = [
    {
        code: IOperator.exists,
        display: 'is answered',
    },
    {
        code: IOperator.notExists,
        display: 'is not answered',
    },
    {
        code: IOperator.equal,
        display: 'is equal to',
    },
    {
        code: IOperator.notEqual,
        display: 'is not equal',
    },
    {
        code: IOperator.greaterThan,
        display: 'is greater than',
    },
    {
        code: IOperator.lessThan,
        display: 'is less than',
    },
    {
        code: IOperator.greaterThanOrEqual,
        display: 'is greater than or equal',
    },
    {
        code: IOperator.lessThanOrEqual,
        display: 'is less than or equal',
    },
];

export const getInitialText = (item?: QuestionnaireItem): string => {
    if (
        (item?.type === IQuestionnaireItemType.text || item?.type === IQuestionnaireItemType.string) &&
        item?.initial &&
        item.initial[0]
    ) {
        return item.initial[0].valueString || '';
    }
    return '';
};

export const getPrefix = (item?: QuestionnaireItem): string => {
    return item?.prefix || '';
};

export const getSublabel = (item?: QuestionnaireItem): string => {
    return item?.extension?.find((extension) => extension.url === IExtensionType.sublabel)?.valueMarkdown || '';
};

export const getRepeatsText = (item?: QuestionnaireItem): string => {
    return item?.extension?.find((extension) => extension.url === IExtensionType.repeatstext)?.valueString || '';
};

export const getValidationMessage = (item?: QuestionnaireItem): string => {
    return item?.extension?.find((extension) => extension.url === IExtensionType.validationtext)?.valueString || '';
};

export const getPlaceHolderText = (item?: QuestionnaireItem): string => {
    return item?.extension?.find((extension) => extension.url === IExtensionType.entryFormat)?.valueString || '';
};

export const getMarkdownText = (extensions?: Extension[]): string => {
    return extensions?.find((extension) => extension.url === IExtensionType.markdown)?.valueMarkdown || '';
};

export const getTextExtensionMarkdown = (item: QuestionnaireItem | undefined): string | undefined => {
    return item?._text?.extension?.find((x) => x.url === IExtensionType.markdown)?.valueMarkdown;
};

export const isHiddenItem = (item: QuestionnaireItem): boolean => {
    return !!item.extension?.some((ext) => ext.url === IExtensionType.hidden && ext.valueBoolean);
};

export const getGuidanceAction = (item?: QuestionnaireItem): string => {
    return item?.extension?.find((extension) => extension.url === IExtensionType.guidanceAction)?.valueString || '';
};

export const getGuidanceParameterName = (item?: QuestionnaireItem): string => {
    return item?.extension?.find((extension) => extension.url === IExtensionType.guidanceParam)?.valueString || '';
};

export const isValidGuidanceParameterName = (name: string): boolean => {
    const regExp = /^[A-Za-z0-9_]{1,254}$/;
    return regExp.test(name);
};

export const elementSaveCapability = [
    { code: '0', display: 'Not set' },
    { code: '1', display: 'Save submitted questionnaire and intermediate save (standard setting)' },
    { code: '2', display: 'Only submitted questionnaire is saved' },
    { code: '3', display: 'No saving' },
];

export const scoreSumOptions = [
    { code: '0', display: 'Not set' },
    { code: 'SS', display: 'Section score' },
    { code: 'TS', display: 'Total score' },
];

export const valueSetTqqcCoding: Coding = {
    system: CodingSystemType.valueSetTqqc,
    code: '1',
    display: 'Technical endpoint for receiving QuestionnaireResponse',
};

export const QSCoding: Coding = {
    system: ICodeSystem.scoringFormulas,
    code: ScoringFormulaCodes.questionScore,
    display: ScoringFormulaNames.questionScore,
};
