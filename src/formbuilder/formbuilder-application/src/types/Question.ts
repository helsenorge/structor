import IQuestion from './IQuestion';
import { Questionnaire } from './fhir';

export default class Question implements IQuestion {
    id: number;
    sectionId: number;
    questionnaire?: Questionnaire;
    questionText: string;

    constructor(id: number, sectionId: number, questionText: string) {
        this.id = id;
        this.sectionId = sectionId;
        this.questionText = questionText;
    }

    updateSectionId(id: number): void {
        this.sectionId = id;
    }

    // Not implemented
    convertToJson(): void {
        return JSON.parse('Not implemented');
    }
}
