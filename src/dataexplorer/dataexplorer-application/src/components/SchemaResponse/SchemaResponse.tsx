import React from 'react';
import { Row } from 'antd';
import 'dayjs/locale/nb';
import Title from 'antd/lib/typography/Title';
import useFetch from 'utils/hooks/useFetch';
import { QuestionnaireResponse } from 'types/fhirTypes/fhir';
import dayjs from 'dayjs';

const SchemaResponse = () => {
    const { response } = useFetch<QuestionnaireResponse>(
        'fhir/QuestionnaireResponse/f201',
    );
    console.log(response);
    dayjs.locale('nb');
    const filledInDate = dayjs(response?.authored).format('DD/MM/YYYY HH:mm');

    const itemQuestion = response?.item
        ?.filter((i) => i.linkId === '3')
        .flatMap((it) => it.item?.map((itt) => itt.text));
    console.log(
        itemQuestion && itemQuestion?.length > 1 ? itemQuestion[0] : 'error',
    );

    const itemAnswer = response?.item
        ?.filter((i) => i.linkId === '3')
        .flatMap((it) =>
            it.item?.map((itt) =>
                itt.answer?.map((a) => a.valueString?.toString()),
            ),
        );
    console.log(itemAnswer && itemAnswer?.length > 1 ? itemAnswer[0] : 'error');
    return (
        <>
            {response ? (
                <>
                    <Row gutter={40} justify={'center'}>
                        <Title level={3}>Skjema id: {response?.id}</Title>
                    </Row>
                    <Row justify={'center'}>
                        Skjemaet ble fyllt ut: {filledInDate}
                    </Row>
                </>
            ) : (
                <Title level={4}>Venter...</Title>
            )}
        </>
    );
};

export default SchemaResponse;
