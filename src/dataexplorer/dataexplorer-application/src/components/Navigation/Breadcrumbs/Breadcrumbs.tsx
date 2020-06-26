import React from 'react';
import Breadcrumb from 'antd/lib/breadcrumb';
import {
    HomeOutlined,
    UserOutlined,
    FileTextOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

const Breadcrumbs = ({ name, schemaNumber }: any) => {
    return (
        <>
            <div
                className="Breadcrumbcontainer"
                style={{ flexGrow: 2, marginLeft: 25 }}
            >
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <Link to="/">
                            <HomeOutlined />

                            <span style={{ color: 'black', paddingLeft: 5 }}>
                                Hjem
                            </span>
                        </Link>
                    </Breadcrumb.Item>

                    {name !== '' && (
                        <Breadcrumb.Item>
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
