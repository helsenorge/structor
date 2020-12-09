import { IQuestionnaireItemType } from '../types/IQuestionnareItemType';

const itemType = [
    {
        display: 'Gruppe',
        code: IQuestionnaireItemType.group,
    },
    {
        display: 'Beskjed',
        code: IQuestionnaireItemType.display,
    },
    {
        display: 'Enkelt spørsmål',
        code: IQuestionnaireItemType.string,
    },
    {
        display: 'Langsvar',
        code: IQuestionnaireItemType.text,
    },
    {
        display: 'Dato',
        code: IQuestionnaireItemType.date,
    },
    {
        display: 'Tid',
        code: IQuestionnaireItemType.time,
    },
    {
        display: 'Tid og dato',
        code: IQuestionnaireItemType.dateTime,
    },
    {
        display: 'Bekreftelse',
        code: IQuestionnaireItemType.boolean,
    },
    {
        display: 'Enkel valg/radio',
        code: IQuestionnaireItemType.choice,
    },
];

export default itemType;
