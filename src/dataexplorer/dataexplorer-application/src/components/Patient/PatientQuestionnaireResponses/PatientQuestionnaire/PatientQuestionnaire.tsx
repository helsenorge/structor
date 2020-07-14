import React, { useState, useEffect } from 'react';
import useFetch from 'utils/hooks/useFetch';
import { IPatientIdentifier } from 'types/IPatient';
import { IQuestionnaireResponse } from 'types/IQuestionnaireResponse';
import PatientView from './PatientView/PatientView';
import { Row, Spin } from 'antd';
import dayjs from 'dayjs';
import { IQuestionnaire } from 'types/IQuestionnaire';

interface IPatientQuestionnaireProps {
    patientData: IPatientIdentifier;
    questionnaireResponses: IQuestionnaireResponse;
    questionnaireId: string;
}

const PatientQuestionnaire = ({ patientData, questionnaireResponses, questionnaireId }: IPatientQuestionnaireProps) => {
    const [dataSource, setDataSource] = useState<fhir.ResourceBase[]>([]);

    const { response: questionnaire } = useFetch<IQuestionnaire>('fhir/Questionnaire?_id=' + questionnaireId);

    useEffect(() => {
        const qdict = new Map();
        questionnaire?.entry.forEach((j) => {
            qdict.set(j.resource?.id, j.resource?.title);
        });
        setDataSource([]);
        questionnaireResponses.entry.forEach((item) => {
            setDataSource((dataSource) => [
                ...dataSource,
                {
                    id: item.resource.id,
                    schemaName: qdict.get(
                        item.resource.questionnaire?.reference
                            ?.substr(item.resource.questionnaire?.reference?.indexOf('Questionnaire/'))
                            .split('/')[1],
                    ),
                    submitted: dayjs(item.resource.meta?.lastUpdated).format('DD.MM.YYYY - HH:mm').toString(),
                },
            ]);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [questionnaire]);

    return (
        <>
            {questionnaire && dataSource && (
                <PatientView
                    patient={patientData.entry[0].resource}
                    dataSource={dataSource}
                    hasQuestionnaireResponses={true}
                />
            )}
            {!questionnaire && (
                <Row justify="center">
                    <Spin className="spin-container" size="large" />
                </Row>
            )}
        </>
    );
};

export default PatientQuestionnaire;
