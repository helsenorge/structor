import React, { useContext } from 'react';
import Breadcrumb from 'antd/lib/breadcrumb';
import { Link } from 'react-router-dom';
import './Breadcrumbs.style.scss';
import { GlobalContext } from 'context/GlobalContext';

const Breadcrumbs = () => {
    const { name, schemaNumber, setPatientId, comparableSchemaNumbers } = useContext(GlobalContext);
    return (
        <>
            <div className="breadcrumbs-container">
                <Breadcrumb separator=">">
                    <Breadcrumb.Item>
                        <Link to="/" onClick={() => setPatientId('')}>
                            <span id="breadcrumb-home" className="breadcrumbs-item">
                                Hjem
                            </span>
                        </Link>
                    </Breadcrumb.Item>
                    {name !== '' && (
                        <Breadcrumb.Item>
                            <Link to="/pasient">
                                <span id="breadcrumb-name" className="breadcrumbs-item">
                                    {name}
                                </span>
                            </Link>
                        </Breadcrumb.Item>
                    )}
                    {schemaNumber !== '' && (
                        <Breadcrumb.Item>
                            <span id="breadcrumb-schema" className="breadcrumbs-item">
                                Skjema {schemaNumber}
                            </span>
                        </Breadcrumb.Item>
                    )}
                    {comparableSchemaNumbers.length !== 0 && (
                        <Breadcrumb.Item>
                            <span className="breadcrumbs-schema">
                                Sammenligner skjemaene: {comparableSchemaNumbers[0]} og {comparableSchemaNumbers[1]}
                            </span>
                        </Breadcrumb.Item>
                    )}
                </Breadcrumb>
            </div>
        </>
    );
};

export default Breadcrumbs;
