import React from 'react';
import Breadcrumb from 'antd/lib/breadcrumb';
import { Link } from 'react-router-dom';
import './Breadcrumbs.style.scss';

interface IBreadCrumbsProps {
    setName: (name: string) => void;
    setSchemaNumber: (id: string) => void;
    name: string;
    schemaNumber: string;
}

const Breadcrumbs = ({
    setName,
    setSchemaNumber,
    name,
    schemaNumber,
}: IBreadCrumbsProps) => {
    function fromSchemeToHome() {
        setSchemaNumber('');
        setName('');
    }
    function fromSchemeToPatient() {
        setSchemaNumber('');
    }
    return (
        <>
            <div className="breadcrumbs-container">
                <Breadcrumb separator=">">
                    <Breadcrumb.Item>
                        <Link to="/" onClick={() => fromSchemeToHome()}>
                            {/* <HomeOutlined className="bread-icon" /> */}
                            <span className="breadcrumbs-item">Hjem</span>
                        </Link>
                    </Breadcrumb.Item>
                    {name !== '' && (
                        <Breadcrumb.Item onClick={() => fromSchemeToPatient()}>
                            <Link to="/Pasient">
                                {/* <UserOutlined className="bread-icon" /> */}
                                <span className="breadcrumbs-item">
                                    <b>{name}</b>
                                </span>
                            </Link>
                        </Breadcrumb.Item>
                    )}
                    {schemaNumber !== '' && (
                        <Breadcrumb.Item>
                            {/* <FileTextOutlined className="bread-icon" /> */}
                            <span className="breadcrumbs-item">
                                <b>Skjema {schemaNumber}</b>
                            </span>
                        </Breadcrumb.Item>
                    )}
                </Breadcrumb>
            </div>
        </>
    );
};

export default Breadcrumbs;
