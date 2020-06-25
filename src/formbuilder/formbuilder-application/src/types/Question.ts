import { Questionnaire } from './fhir';

export default interface Question {
    readonly id: number;
    readonly sectionId: number;
    readonly questionText: string;
}
