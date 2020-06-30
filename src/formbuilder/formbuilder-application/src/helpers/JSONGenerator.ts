import SectionList from '../types/SectionList';
import QuestionList from '../types/QuestionList';

function convertQuestions(
    sectionOrder: Array<string>,
    sections: SectionList,
    questions: QuestionList,
): Array<fhir.QuestionnaireItem> {
    const items = [];
    for (let i = 0; i < sectionOrder.length; i++) {
        const sectionKey = sectionOrder[i];
        const section = sections[sectionKey];
        const item: fhir.QuestionnaireItem = {
            linkId: String(i + 1),
            text: section.sectionTitle,
            type: 'group',
            repeats: false,
            item: new Array<fhir.QuestionnaireItem>(),
        };
        // TODO: Add section desctiption
        for (let j = 0; j < sections[sectionKey].questionOrder.length; j++) {
            const questionKey = sections[sectionKey].questionOrder[j];
            const question = questions[questionKey];
            // Will be within 'item' and if in section another 'item' of type group
            const subItem: fhir.QuestionnaireItem = {
                linkId: i + 1 + '.' + (j + 1) + '00',
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
            item.item?.push(subItem);
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
        const sectionId = sectionOrder[i];
        for (const j in sections[sectionId].questionOrder) {
            const questionId = sections[sectionId].questionOrder[j];
            const answerId = questions[questionId].answer.id;
            const choices = questions[questionId].answer.choices;
            const containPart: fhir.Resource = {
                resourceType: 'ValueSet',
                id: answerId,
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
            for (const k in choices) {
                if (choices !== undefined && k !== undefined) {
                    containPart.compose?.include[0].concept?.push({
                        code: String(parseInt(k) + 1),
                        display: choices[parseInt(k)],
                    });
                }
            }
            valueSets.push(containPart);
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
