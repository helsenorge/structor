import Converter from '../components/Converter';
import SectionList from '../types/SectionList';
import QuestionList from '../types/QuestionList';
import JSONQuestion from '../types/JSONQuestion';
import JSONAnswer from '../types/JSONAnswer';
// import { Questionnaire } from '../types/fhir';
import { Questionnaire, uri, code, Coding, Meta, ValueSet } from '../types/fhir';

function convertQuestions(
    sectionOrder: Array<string>,
    sections: SectionList,
    questions: QuestionList,
): Array<JSONQuestion> {
    const aux = [];
    for (const i in sectionOrder) {
        const sectionKey = sectionOrder[i];
        for (const j in sections[sectionKey].questionOrder) {
            const questionKey = sections[sectionKey].questionOrder[j];
            // Will be within 'item' and if in section another 'item' of type group
            aux.push({
                linkId: questions[questionKey].sectionId, // sectionId.newId
                text: questions[questionKey].questionText, // question text
                type: questions[questionKey].answer.type, // TODO: display | boolean | decimal | integer | date | dateTime
                required: true, // true | false TODO
                repeats: false, // TODO
                readOnly: false, // TODO
                options: {
                    reference: '', // with a hashtag in front. TODO: Add valuesetID
                },
                // TODO: 'initialCoding' and 'extension'
            });
        }
    }
    return aux;
}
function convertAnswers(
    sectionOrder: Array<string>,
    sections: SectionList,
    questions: QuestionList,
): Array<JSONAnswer> {
    const aux = [];
    for (const i in sectionOrder) {
        const sectionKey = sectionOrder[i];
        for (const j in sections[sectionKey].questionOrder) {
            const questionKey = sections[sectionKey].questionOrder[j];
            const choices = questions[questionKey].answer.choices;
            for (const k in choices) {
                if (choices !== undefined && k !== undefined) {
                    aux.push({
                        code: parseInt(k) + 1,
                        display: choices[parseInt(k)],
                    });
                }
            }
        }
    }
    return aux;
}

function convertToJSON(
    sectionOrder: Array<string>,
    sections: SectionList,
    questions: QuestionList,
): Questionnaire {
    const valueSets = convertAnswers(sectionOrder, sections, questions);
    const convertedQuestions = convertQuestions(
        sectionOrder,
        sections,
        questions,
    );
    const questionnaire: Questionnaire = {
        resourceType: 'Questionnaire',
        meta: ({
            profile: ([
                'http://ehelse.no/fhir/StructureDefinition/sdf-Questionnaire',
            ] as unknown) as Array<uri>,
            tag: [
                ({
                    system: ('urn:ietf:bcp:47' as unknown) as uri,
                    code: 'nb-NO',
                    display: 'Norsk bokmål',
                } as unknown) as Coding,
            ],
        } as unknown) as Meta,
        language: ('nb-NO' as unknown) as code,
        contained: [

            },
        ],
    };
    return questionnaire;
}

export default convertToJSON;
