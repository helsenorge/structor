import React from 'react';
import 'antd/dist/antd.css';
import { Table, Divider } from 'antd';

const dataSource = [
    {
        id: 1,
        schemaName: 'covid',
        submitted: '19.02.2020',
    },
    {
        id: 2,
        schemaName: 'covid',
        submitted: '24.02.2020',
    },
    {
        id: 3,
        schemaName: 'covid',
        submitted: '28.02.2020',
    },
    {
        id: 4,
        schemaName: 'covid',
        submitted: '01.03.2020',
    },
    {
        id: 5,
        schemaName: 'covid',
        submitted: '07.02.2020',
    },
    {
        id: 6,
        schemaName: 'covid',
        submitted: '14.03.2020',
    },
    {
        id: 7,
        schemaName: 'covid',
        submitted: '21.03.2020',
    },
    {
        id: 8,
        schemaName: 'covid',
        submitted: '19.02.2020',
    },
    {
        id: 9,
        schemaName: 'covid',
        submitted: '24.02.2020',
    },
    {
        id: 10,
        schemaName: 'covid',
        submitted: '28.02.2020',
    },
    {
        id: 11,
        schemaName: 'lykke',
        submitted: '01.03.2020',
    },
    {
        id: 12,
        schemaName: 'lykke',
        submitted: '07.02.2020',
    },
    {
        id: 13,
        schemaName: 'covid',
        submitted: '14.03.2020',
    },
    {
        id: 14,
        schemaName: 'lykke',
        submitted: '21.03.2020',
    },
    {
        id: 15,
        schemaName: 'covid',
        submitted: '19.02.2020',
    },
    {
        id: 16,
        schemaName: 'lykke',
        submitted: '24.02.2020',
    },
    {
        id: 17,
        schemaName: 'covid',
        submitted: '28.02.2020',
    },
    {
        id: 18,
        schemaName: 'lykke',
        submitted: '01.03.2020',
    },
    {
        id: 19,
        schemaName: 'kreft',
        submitted: '07.02.2020',
    },
    {
        id: 20,
        schemaName: 'covid',
        submitted: '14.03.2020',
    },
    {
        id: 21,
        schemaName: 'covid',
        submitted: '21.03.2020',
    },
];

const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: 'Skjemanavn',
        dataIndex: 'schemaName',
        key: 'skjemanavn',
    },
    {
        title: 'Innsendt',
        dataIndex: 'submitted',
        key: 'submitted',
    },
];

const ListView = (props: any) => {
    return (
        <div style={{ paddingTop: 2 }}>
            <Divider />
            <Table
                size="large"
                style={{ marginTop: 50 }}
                title={props.title}
                columns={columns}
                dataSource={dataSource}
            />
        </div>
    );
};

export default ListView;
