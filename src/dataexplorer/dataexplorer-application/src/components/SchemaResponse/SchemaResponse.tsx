import React from 'react';
import { Row } from 'antd';
import 'dayjs/locale/nb';
import Title from 'antd/lib/typography/Title';
import useFetch from 'utils/hooks/useFetch';
import dayjs from 'dayjs';
import { QuestionnaireResponse, Questionnaire } from 'types/fhirTypes/fhir';

const SchemaResponse = async () => {
    const schemaResponse = await useFetch<QuestionnaireResponse>(
        'fhir/QuestionnaireResponse/5',
    );
    const questionnairId = schemaResponse?.questionnaire?.reference?.slice(-2);
    const { response: questionnaire } = useFetch<Questionnaire>(
        'fhir/Questionnaire/' + questionnairId,
    );
    console.log(questionnairId);

    console.log(schemaResponse);
    console.log(questionnaire);
    dayjs.locale('nb');
    const filledInDate = dayjs(schemaResponse?.authored).format(
        'DD/MM/YYYY HH:mm',
    );
    const firstText = schemaResponse
        ? schemaResponse.item?.map((i) => i.text)
        : ['empty'];

    const secondText = schemaResponse
        ? schemaResponse.item?.map((i) =>
              i.item?.map((i) => i.text?.toString()),
          )
        : ['empty secondText'];
    console.log(secondText);

    /*     const itemQuestion = schemaResponse?.item?.filter((i) => i.linkId === '3');
    console.log(
        itemQuestion && itemQuestion?.length > 0 ? itemQuestion[0] : 'error',
    );

    const itemAnswer = schemaResponse?.item
        ?.filter((i) => i.linkId === '3')
        .flatMap((it) =>
            it.item?.map((itt) =>
                itt.answer?.map((a) => a.valueString?.toString()),
            ),
        );
    console.log(itemAnswer && itemAnswer?.length > 0 ? itemAnswer[0] : 'error'); */
    return (
        <>
            {schemaResponse && questionnaire ? (
                <>
                    <Row gutter={40} justify={'center'}>
                        <Title level={3}>Skjema id:{schemaResponse.id}</Title>
                    </Row>
                    <Row justify={'center'}>
                        Skjemaet ble fyllt ut: {filledInDate}
                    </Row>
                    {firstText &&
                        firstText.map((title, i) => (
                            <Row justify={'center'} key={i}>
                                <Title level={4} key={i}>
                                    {title}
                                </Title>
                            </Row>
                        ))}
                    {/*                     {secondText &&
                        secondText.map((question, i) => (
                            <Row justify={'center'} key={i}>
                                <Col key={i}>{question}</Col>
                            </Row>
                        ))} */}
                </>
            ) : (
                <Title level={4}>Venter...</Title>
            )}
        </>
    );
};

export default SchemaResponse;
