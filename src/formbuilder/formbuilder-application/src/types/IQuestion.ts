import { Questionnaire } from './fhir';

export default interface IQuestion {
    readonly id: number;
    readonly sectionId: number;
    readonly questionText: string;
}
