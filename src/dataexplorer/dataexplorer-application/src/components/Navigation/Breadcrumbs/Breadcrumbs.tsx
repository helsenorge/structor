import React, { useContext } from 'react';
import Breadcrumb from 'antd/lib/breadcrumb';
import { Link } from 'react-router-dom';
import './Breadcrumbs.style.scss';
import { BreadcrumbContext } from './BreadcrumbContext';

const Breadcrumbs = () => {
    const { name, schemaNumber, setPatientId } = useContext(BreadcrumbContext);
    return (
        <>
            <div className="breadcrumbs-container">
                <Breadcrumb separator=">">
                    <Breadcrumb.Item>
                        <Link to="/" onClick={() => setPatientId('')}>
                            <span className="breadcrumbs-item">Hjem</span>
                        </Link>
                    </Breadcrumb.Item>
                    {name !== '' && (
                        <Breadcrumb.Item>
                            <Link to="/pasient">
                                <span className="breadcrumbs-item">{name}</span>
                            </Link>
                        </Breadcrumb.Item>
                    )}
                    {schemaNumber !== '' && (
                        <Breadcrumb.Item>
                            <span className="breadcrumbs-schema">Skjema {schemaNumber}</span>
                        </Breadcrumb.Item>
                    )}
                </Breadcrumb>
            </div>
        </>
    );
};

export default Breadcrumbs;
