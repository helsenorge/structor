import React, { useContext } from 'react';
import Breadcrumb from 'antd/lib/breadcrumb';
import { Link, useLocation } from 'react-router-dom';
import './Breadcrumbs.style.scss';
import { GlobalContext } from 'context/GlobalContext';

const Breadcrumbs = () => {
    const { name, schemaNumber, setPatientId, comparableSchemaNumbers } = useContext(GlobalContext);
    const location = useLocation();
    return (
        <>
            <div className="breadcrumbs-container">
                <Breadcrumb separator=">">
                    {name !== '' && (
                        <Breadcrumb.Item>
                            <Link to="/" onClick={() => setPatientId('')}>
                                <span id="breadcrumb-home" className="breadcrumbs-item">
                                    Hjem
                                </span>
                            </Link>
                        </Breadcrumb.Item>
                    )}
                    {name !== '' && (
                        <Breadcrumb.Item>
                            <Link to="/pasient">
                                {location.pathname === '/pasient' ? (
                                    <span id="breadcrumb-focus" className="breadcrumbs-item">
                                        {name}
                                    </span>
                                ) : (
                                    <span id="breadcrumb" className="breadcrumbs-item">
                                        {name}
                                    </span>
                                )}
                            </Link>
                        </Breadcrumb.Item>
                    )}
                    {schemaNumber !== '' && (
                        <Breadcrumb.Item>
                            {location.pathname === '/pasient/skjema' ? (
                                <span id="breadcrumb-focus" className="breadcrumbs-item">
                                    Skjema {schemaNumber}
                                </span>
                            ) : (
                                <span id="breadcrumb" className="breadcrumbs-item">
                                    Skjema {schemaNumber}
                                </span>
                            )}
                        </Breadcrumb.Item>
                    )}
                    {comparableSchemaNumbers.length !== undefined && comparableSchemaNumbers.length !== 0 && (
                        <Breadcrumb.Item>
                            <span id="breadcrumb-focus" className="breadcrumbs-item">
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
