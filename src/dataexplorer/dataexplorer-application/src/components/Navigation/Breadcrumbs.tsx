import React from 'react';
import Breadcrumb from 'antd/lib/breadcrumb';
import { HomeOutlined, UserOutlined } from '@ant-design/icons';

const Breadcrumbs = (props: any) => {
    return (
        <>
            <div className="Breadcrumbcontainer" style={props.style}>
                <Breadcrumb>
                    <Breadcrumb.Item href="/">
                        <HomeOutlined />
                        <span style={{ color: 'black' }}>Søk</span>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item href="Pasient">
                        <UserOutlined />
                        <span style={{ color: 'black' }}>
                            Pasient - Erling van de Weijer
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
