import React, { useEffect, useContext, useState } from 'react';
import { FormContext } from '../store/FormStore';

function Converter(): void {
    const { state, dispatch } = useContext(FormContext);
    const questionnaire = {};
    const [valueSetObj, setValueSetObj] = useState([{}]);
    const [questionObj, setQuestionObj] = useState([{}]);

    useEffect(() => {
        convertQuestions();
    });

    function convertQuestions() {
        for (const key in state.sectionOrder) {

            console.log(
                'Converter: ',
                key,
                ' spørmålet ',
                state.questions[key].questionText,
            );
            // Will be within 'item' and if in section another 'item' of type group

            setQuestionObj((questions) => [
                ...questionObj,
                {
                    linkId: state.questions[key].sectionId, // sectionId.newId
                    text: state.questions[key].questionText, // question text
                    type: state.questions[key].answer.type, // display | boolean | decimal | integer | date | dateTime
                    required: true, // true | false TODO
                    repeats: false, // TODO
                    readOnly: false, // TODO
                    options: {
                        reference: '', // with a hashtag in front. TODO: Add valuesetID
                    },
                    // TODO: 'initialCoding' and 'extension'
                },
            ]);
        }
        console.log('Json-start: ', questionObj);
    }
}

export default Converter;
