import Converter from '../components/Converter';
import SectionList from '../types/SectionList';
import QuestionList from '../types/QuestionList';
import JSONQuestion from '../types/JSONQuestion';
import JSONAnswer from '../types/JSONAnswer';
import { title } from 'process';
// import { Questionnaire } from '../types/fhir';
// import { Questionnaire, uri, code, Coding, Meta, ValueSet } from '../types/fhir';

function convertQuestions(
    sectionOrder: Array<string>,
    sections: SectionList,
    questions: QuestionList,
): Array<fhir.QuestionnaireItem> {
    const items = [];
    for (const i in sectionOrder) {
        const sectionKey = sectionOrder[i];
        const section = sections[sectionKey];
        const item: fhir.QuestionnaireItem = {
            linkId: i,
            text: section.sectionTitle,
            type: 'group',
            repeats: false,
            item: new Array<fhir.QuestionnaireItem>(),
        };
        // TODO: Add section desctiption
        for (const j in sections[sectionKey].questionOrder) {
            const questionKey = sections[sectionKey].questionOrder[j];
            const question = questions[questionKey];
            // Will be within 'item' and if in section another 'item' of type group
            const item: fhir.QuestionnaireItem = {
                linkId: i + '.' + j + '00',
                text: question.questionText,
                type: question.answer.type.toString(),
                required: true, // TODO: true | false
                repeats: false, // TODO
                readOnly: false, // TODO
                options: {
                    reference: '#' + question.answer.id,
                },
            };
            // TODO: if (question.description) add _text with extension.
        }
        items.push(item);
    }
    return items;
}
function convertAnswers(
    sectionOrder: Array<string>,
    sections: SectionList,
    questions: QuestionList,
): Array<fhir.Resource> {
    const valueSets = [];
    for (const i in sectionOrder) {
        const sectionKey = sectionOrder[i];
        for (const j in sections[sectionKey].questionOrder) {
            const questionKey = sections[sectionKey].questionOrder[j];
            const choices = questions[questionKey].answer.choices;
            const containPart: fhir.Resource = {
                resourceType: 'ValueSet',
                id: questionKey,
                name: 'NAME' + i, // TODO: CHECK THIS
                title: 'TITLE' + i, // TODO: CHECK THIS
                status: 'draft',
                publisher: 'NHN',
                compose: {
                    include: [
                        {
                            system: '', // TODO: FIX ME
                            concept: new Array<
                                fhir.ValueSetComposeIncludeConcept
                            >(),
                        },
                    ],
                },
            };
            const compose = {};
            for (const k in choices) {
                if (choices !== undefined && k !== undefined) {
                    containPart.compose?.include[0].concept?.push({
                        code: String(parseInt(k) + 1),
                        display: choices[parseInt(k)],
                    });
                }
            }
            valueSets.push(compose);
        }
    }
    return valueSets;
}

function convertToJSON(
    sectionOrder: Array<string>,
    sections: SectionList,
    questions: QuestionList,
): fhir.Questionnaire {
    const valueSets = convertAnswers(sectionOrder, sections, questions);
    const convertedQuestions = convertQuestions(
        sectionOrder,
        sections,
        questions,
    );
    const questionnaire: fhir.Questionnaire = {
        resourceType: 'Questionnaire',
        language: 'nb-NO',
        name: 'hdir-NAVN', // TODO: FIX ME
        title: 'TITLE', // TODO: FIX ME
        status: 'draft',
        publisher: 'NHN',
        description: 'Description', // TODO: FIX ME
        meta: {
            profile: [
                'http://ehelse.no/fhir/StructureDefinition/sdf-Questionnaire',
            ],
            tag: [
                {
                    system: 'urn:ietf:bcp:47',
                    code: 'nb-NO',
                    display: 'Norsk bokmål',
                },
            ],
        },
        contained: valueSets,
        useContext: [
            // TODO: FIX USECONTEXT
            {
                code: {
                    system: 'uri', // TODO: FIX ME
                    code: 'focus',
                    display: 'Clinical focus',
                },
                valueCodeableConcept: {
                    coding: [
                        {
                            system: 'uri',
                            code: '29',
                            display: 'TITLE', // TODO: FIX ME
                        },
                    ],
                },
            },
        ],
        contact: [
            {
                name: 'https://fhi.no/', // TODO: FIX ME
            },
        ],
        subjectType: ['Patient'],
        item: convertedQuestions,
    };
    return questionnaire;
}

export default convertToJSON;
