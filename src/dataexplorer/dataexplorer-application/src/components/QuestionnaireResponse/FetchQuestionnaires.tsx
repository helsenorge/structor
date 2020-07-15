import React, { useEffect, useContext } from 'react';
import useFetch from 'utils/hooks/useFetch';
import { IQuestionnaire } from 'types/IQuestionnaire';
import { Row, Spin } from 'antd';
import { GlobalContext } from 'context/GlobalContext';

const FetchQuestionnaires = ({ questionnaireId }: any) => {
    const { response: questionnaire } = useFetch<IQuestionnaire>('fhir/Questionnaire?_id=' + questionnaireId);
    const { setQuestionnaire } = useContext(GlobalContext);

    useEffect(() => {
        questionnaire && setQuestionnaire(questionnaire);
    }, [questionnaire, setQuestionnaire]);

    return (
        <>
            <Row justify="center">
                <Spin className="spin-container" size="large" />
            </Row>
        </>
    );
};

export default FetchQuestionnaires;
