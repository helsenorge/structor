import React, { useContext, useEffect, useState, ReactText } from 'react';
import Search from 'antd/lib/input/Search';
import { Row, Col, message } from 'antd';
import PatientPreview from './PatientPreview/PatientPreview';
import FloatLabel from './FloatLabel/FloatLabel';
import './Dashboard.style.scss';
import './FloatLabel/FloatLabel.scss';
import { IPatientIdentifier } from 'types/IPatient';
import { IQuestionnaireResponse } from 'types/IQuestionnaireResponse';
import { IQuestionnaire } from 'types/IQuestionnaire';
import { GlobalContext } from 'context/GlobalContext';

const Dashboard = () => {
    const [searchValue, setSearchValue] = useState<number>();
    const handleChange = (e: number) => {
        isNaN(e) ? message.warning('Du har tastet en bokstav. Vennligst benytt siffer.') : setSearchValue(e);
    };
    const {
        patientId,
        setPatientId,
        setName,
        setSchemanumber,
        setPatient,
        setQuestionnaireResponse,
        setQuestionnaire,
        setComparableSchemaNumbers,
    } = useContext(GlobalContext);

    message.config({ maxCount: 1 });
    const handleSearch = (value: string) => {
        value.length === 11
            ? setPatientId(value)
            : message.warning(`Personnummeret du har skrevet er ugyldig, og mangler ${11 - value.length} siffer.`, 3.5);
    };

    useEffect(() => {
        setName('');
        setPatientId('');
        setSchemanumber('');
        setPatient({} as IPatientIdentifier);
        setQuestionnaire({} as IQuestionnaire);
        setQuestionnaireResponse({} as IQuestionnaireResponse);
        setComparableSchemaNumbers({} as ReactText[]);
    }, [
        setName,
        setPatientId,
        setSchemanumber,
        setPatient,
        setQuestionnaire,
        setQuestionnaireResponse,
        setComparableSchemaNumbers,
    ]);

    return (
        <>
            <div className="search-container"></div>
            <Row gutter={[60, 40]} justify={'center'}>
                <Col span={1000}>
                    <FloatLabel label="Personnummer" name="searchfield" value={searchValue}>
                        <Search
                            maxLength={11}
                            onChange={(e) => handleChange((e.target.value as unknown) as number)}
                            onSearch={(value) => handleSearch(value)}
                            value={searchValue}
                        />
                    </FloatLabel>
                    {patientId !== '' && <PatientPreview />}
                </Col>
            </Row>
        </>
    );
};
export default Dashboard;
