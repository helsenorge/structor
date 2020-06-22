import IQuestion from './IQuestion';
import { Questionnaire } from './fhir';

export default class Question implements IQuestion {
    id: number;
    sectionId: number;
    questionnaire?: Questionnaire;

    constructor(id: number, sectionId: number) {
        this.id = id;
        this.sectionId = sectionId;
    }

    updateSectionId(id: number): void {
        this.sectionId = id;
    }

    // Not implemented
    convertToJson(): void {
        return JSON.parse('Not implemented');
    }
}
