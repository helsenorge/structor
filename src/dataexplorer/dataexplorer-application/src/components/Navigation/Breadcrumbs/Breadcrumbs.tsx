import React, { useContext } from 'react';
import Breadcrumb from 'antd/lib/breadcrumb';
import { Link } from 'react-router-dom';
import {
    HomeOutlined,
    UserOutlined,
    FileTextOutlined,
} from '@ant-design/icons';
import './Breadcrumbs.style.scss';
import { BreadcrumbContext } from './BreadcrumbContext';

const Breadcrumbs = () => {
    const { name, schemaNumber } = useContext(BreadcrumbContext);
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
                            <Link to="/pasient">
                                <UserOutlined />
                                <span className="breadcrumbs-item">{name}</span>
                            </Link>
                        </Breadcrumb.Item>
                    )}
                    {schemaNumber !== '' && (
                        <Breadcrumb.Item>
                            <FileTextOutlined className="bread-icon" />
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
