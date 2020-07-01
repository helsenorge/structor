import React from 'react';
import Breadcrumb from 'antd/lib/breadcrumb';
import { Link } from 'react-router-dom';
import {
    HomeOutlined,
    UserOutlined,
    FileTextOutlined,
} from '@ant-design/icons';

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
            <div
                className="Breadcrumbcontainer"
                style={{ flexGrow: 2, marginLeft: 25 }}
            >
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <Link to="/" onClick={() => fromSchemeToHome()}>
                            <HomeOutlined />

                            <span style={{ color: 'black', paddingLeft: 5 }}>
                                Hjem
                            </span>
                        </Link>
                    </Breadcrumb.Item>

                    {name !== '' && (
                        <Breadcrumb.Item onClick={() => fromSchemeToPatient()}>
                            <Link to="/Pasient">
                                <UserOutlined />
                                <>
                                    <span
                                        style={{
                                            color: 'black',
                                            paddingLeft: 5,
                                        }}
                                    >
                                        <b>{name}</b>
                                    </span>
                                </>
                            </Link>
                        </Breadcrumb.Item>
                    )}
                    {schemaNumber !== '' && (
                        <Breadcrumb.Item>
                            <FileTextOutlined />
                            <span>Skjema - {schemaNumber}</span>
                        </Breadcrumb.Item>
                    )}
                </Breadcrumb>
            </div>
        </>
    );
};

export default Breadcrumbs;
