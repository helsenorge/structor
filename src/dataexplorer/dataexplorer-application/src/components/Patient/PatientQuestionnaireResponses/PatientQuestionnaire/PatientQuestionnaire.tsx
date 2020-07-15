import React, { useState, useEffect, useContext } from 'react';
import PatientView from './PatientView/PatientView';
import { Row, Spin } from 'antd';
import dayjs from 'dayjs';
import { GlobalContext } from 'context/GlobalContext';

const PatientQuestionnaire = () => {
    const [dataSource, setDataSource] = useState<fhir.ResourceBase[]>([]);

    const { questionnaire, questionnaireResponse: questionnaireResponses } = useContext(GlobalContext);

    useEffect(() => {
        const qdict = new Map();
        questionnaire.entry.forEach((j) => {
            qdict.set(j.resource?.id, j.resource?.title);
        });
        setDataSource([]);
        questionnaireResponses.entry.forEach((item) => {
            const name = qdict.get(
                item.resource.questionnaire?.reference
                    ?.substr(item.resource.questionnaire?.reference?.indexOf('Questionnaire/'))
                    .split('/')[1],
            );
            setDataSource((dataSource) => [
                ...dataSource,
                {
                    id: item.resource.id,
                    schemaName: name ? name : 'Udefinert',
                    submitted: dayjs(item.resource.meta?.lastUpdated).format('DD.MM.YYYY HH:mm'),
                },
            ]);
        });
    }, [questionnaire, questionnaireResponses]);

    return (
        <>
            {questionnaire && dataSource && <PatientView dataSource={dataSource} hasQuestionnaireResponses={true} />}
            {!questionnaire && (
                <Row justify="center">
                    <Spin className="spin-container" size="large" />
                </Row>
            )}
        </>
    );
};

export default PatientQuestionnaire;
