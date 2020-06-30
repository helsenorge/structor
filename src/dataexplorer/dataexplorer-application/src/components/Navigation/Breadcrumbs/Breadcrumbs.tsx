import React from 'react';
import Breadcrumb from 'antd/lib/breadcrumb';
import { IBread } from 'types/IBread';
import { Link } from 'react-router-dom';
import {
    HomeOutlined,
    UserOutlined,
    FileTextOutlined,
} from '@ant-design/icons';
import './Breadcrumbs.style.scss';

const Breadcrumbs = ({ name, schemaNumber }: IBread) => {
    return (
        <>
            <div className="breadcrumbs-container">
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <Link to="/">
                            <HomeOutlined />
                            <span className="breadcrumbs-item">Hjem</span>
                        </Link>
                    </Breadcrumb.Item>
                    {name !== '' && (
                        <Breadcrumb.Item>
                            <Link to="/Pasient">
                                <UserOutlined />
                                <span className="breadcrumbs-item">
                                    <b>{name}</b>
                                </span>
                            </Link>
                        </Breadcrumb.Item>
                    )}
                    {schemaNumber !== '' && (
                        <Breadcrumb.Item>
                            <FileTextOutlined />
                            <span className="breadcrumbs-item">
                                Skjema - {schemaNumber}
                            </span>
                        </Breadcrumb.Item>
                    )}
                </Breadcrumb>
            </div>
        </>
    );
};

export default Breadcrumbs;
