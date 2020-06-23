import { Questionnaire } from './fhir';

export default interface IQuestion {
    id: number;
    sectionId: number;
    questionnaire?: Questionnaire;
    questionText: string;
}
