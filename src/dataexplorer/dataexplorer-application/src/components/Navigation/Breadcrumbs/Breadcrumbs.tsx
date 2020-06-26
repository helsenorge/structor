import React from 'react';
import Breadcrumb from 'antd/lib/breadcrumb';
import { HomeOutlined, UserOutlined } from '@ant-design/icons';

const Breadcrumbs = ({name}:any) => {

    return (

        <>
            <div className="Breadcrumbcontainer" >
                <Breadcrumb>
                    <Breadcrumb.Item href="/">
                        <HomeOutlined />
                        <span style={{ color: 'black' }}>Hjem</span>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <UserOutlined />
                        <b>{name}</b>
                        <span style={{ color: 'black' }}>
                        </span>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <span>Skjema 1 - 17.04.20</span>
                    </Breadcrumb.Item>
                </Breadcrumb>
            </div>
        </>
    );
};

export default Breadcrumbs;
